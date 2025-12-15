import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { StravaService } from '../strava.service';
import { StravaCacheService } from '../strava-cache.service';
import { SupabaseService } from '../../../database';
import { FeedbackAIService } from '../../feedback/feedback-ai.service';
import { StravaWebhookJob } from './strava-queue.service';

/**
 * BullMQ Worker processor for Strava webhook events.
 * Rate limited to 6 jobs/minute (~90 per 15 min, under Strava's 100 limit).
 */
@Processor('strava-queue', {
    limiter: {
        max: 6,           // 6 jobs
        duration: 60000,  // per minute = ~90/15min (under 100 limit)
    },
    concurrency: 1,       // Process one at a time for fine control
})
export class StravaQueueProcessor extends WorkerHost {
    private readonly logger = new Logger(StravaQueueProcessor.name);

    constructor(
        private readonly stravaService: StravaService,
        private readonly cacheService: StravaCacheService,
        private readonly supabaseService: SupabaseService,
        private readonly feedbackAIService: FeedbackAIService,
    ) {
        super();
    }

    /**
     * Main job processor - handles webhook events from queue
     */
    async process(job: Job<StravaWebhookJob>): Promise<any> {
        const { event, receivedAt } = job.data;
        this.logger.log(`Processing job ${job.id}: ${event.object_type}/${event.aspect_type} (queued at ${receivedAt})`);

        // Only process activity create events
        if (event.object_type !== 'activity' || event.aspect_type !== 'create') {
            return { status: 'ignored', reason: 'Not an activity create event' };
        }

        try {
            // Find user by Strava athlete ID
            const { data: user, error: userError } = await this.supabaseService
                .from('users')
                .select('id, strava_access_token, strava_refresh_token, strava_token_expires_at')
                .eq('strava_athlete_id', event.owner_id)
                .single();

            if (userError || !user) {
                this.logger.warn(`User not found for athlete_id: ${event.owner_id}`);
                return { status: 'ignored', reason: 'User not found' };
            }

            // Get valid access token (refresh if needed)
            const accessToken = await this.getValidAccessToken(user);

            // Fetch activity from Strava (with caching)
            const activity = await this.stravaService.getActivityCached(event.object_id, accessToken);

            // Only process running activities
            if (!['Run', 'TrailRun', 'VirtualRun'].includes(activity.type)) {
                return { status: 'ignored', reason: 'Not a running activity' };
            }

            // Calculate pace (min/km)
            const averagePace = activity.moving_time > 0 && activity.distance > 0
                ? (activity.moving_time / 60) / (activity.distance / 1000)
                : null;

            const maxPace = activity.max_speed > 0
                ? 1000 / activity.max_speed / 60
                : null;

            // Save activity to database
            const { data: savedActivity, error: saveError } = await this.supabaseService
                .from('strava_activities')
                .insert({
                    id: activity.id,
                    user_id: user.id,
                    name: activity.name,
                    type: activity.type,
                    start_date: activity.start_date,
                    distance: activity.distance,
                    moving_time: activity.moving_time,
                    elapsed_time: activity.elapsed_time,
                    average_pace: averagePace,
                    max_pace: maxPace,
                    elevation_gain: activity.total_elevation_gain,
                    average_heartrate: activity.average_heartrate,
                    max_heartrate: activity.max_heartrate,
                    calories: activity.calories,
                    splits_metric: activity.splits_metric,
                    map_polyline: activity.map?.summary_polyline,
                    start_latlng: activity.start_latlng,
                    raw_data: activity,
                })
                .select()
                .single();

            if (saveError) {
                this.logger.error('Failed to save activity', saveError);
                throw saveError;
            }

            // Try to link with scheduled workout
            await this.linkWithWorkout(user.id, activity, savedActivity.id);

            // Update user streak
            await this.updateUserStreak(user.id);

            // Add points
            await this.addActivityPoints(user.id, savedActivity.id);

            this.logger.log(`Successfully processed activity ${activity.id}`);
            return { status: 'processed', activity_id: activity.id };

        } catch (error) {
            this.logger.error(`Failed to process job ${job.id}`, error);
            throw error; // Let BullMQ handle retry
        }
    }

    /**
     * Get valid access token, refreshing if expired
     */
    private async getValidAccessToken(user: any): Promise<string> {
        let accessToken = user.strava_access_token;

        if (new Date(user.strava_token_expires_at) < new Date()) {
            this.logger.log('Refreshing Strava token...');
            const newTokens = await this.stravaService.refreshToken(user.strava_refresh_token);
            accessToken = newTokens.access_token;

            // Update tokens in database
            await this.supabaseService
                .from('users')
                .update({
                    strava_access_token: newTokens.access_token,
                    strava_refresh_token: newTokens.refresh_token,
                    strava_token_expires_at: new Date(newTokens.expires_at * 1000).toISOString(),
                })
                .eq('id', user.id);
        }

        return accessToken;
    }

    /**
     * Link activity with scheduled workout and generate AI feedback
     */
    private async linkWithWorkout(userId: string, activity: any, savedActivityId: string): Promise<void> {
        const activityDate = new Date(activity.start_date).toISOString().split('T')[0];
        const { data: workout } = await this.supabaseService
            .from('workouts')
            .select('id')
            .eq('user_id', userId)
            .eq('scheduled_date', activityDate)
            .eq('status', 'pending')
            .single();

        if (workout) {
            await this.supabaseService
                .from('workouts')
                .update({
                    strava_activity_id: activity.id,
                    status: 'completed',
                })
                .eq('id', workout.id);

            this.logger.log(`Linked activity ${activity.id} to workout ${workout.id}`);

            // Generate AI feedback (fire and forget)
            this.generateFeedbackAsync(userId, workout.id, savedActivityId);
        }
    }

    /**
     * Update user streak and last activity date
     */
    private async updateUserStreak(userId: string): Promise<void> {
        const today = new Date().toISOString().split('T')[0];
        const { data: userLevel } = await this.supabaseService
            .from('user_levels')
            .select('current_streak, last_activity_date, best_streak')
            .eq('user_id', userId)
            .single();

        if (userLevel) {
            let newStreak = 1;
            const lastDate = userLevel.last_activity_date;

            if (lastDate) {
                const daysDiff = Math.floor(
                    (new Date(today).getTime() - new Date(lastDate).getTime()) / (1000 * 60 * 60 * 24)
                );
                if (daysDiff === 1) {
                    newStreak = userLevel.current_streak + 1;
                } else if (daysDiff === 0) {
                    newStreak = userLevel.current_streak;
                }
            }

            await this.supabaseService
                .from('user_levels')
                .update({
                    current_streak: newStreak,
                    best_streak: Math.max(newStreak, userLevel.best_streak || 0),
                    last_activity_date: today,
                    updated_at: new Date().toISOString(),
                })
                .eq('user_id', userId);
        }
    }

    /**
     * Add points for completing an activity
     */
    private async addActivityPoints(userId: string, activityId: string): Promise<void> {
        // Check if linked to workout for bonus points
        const { data: workout } = await this.supabaseService
            .from('workouts')
            .select('id')
            .eq('strava_activity_id', activityId)
            .single();

        const points = workout ? 75 : 50; // 75 if planned, 50 if unplanned

        await this.supabaseService.from('points_history').insert({
            user_id: userId,
            points,
            reason: workout ? 'Treino planejado completado' : 'Corrida completada',
            reference_type: 'activity',
            reference_id: activityId,
        });

        // Update total points
        const { data: pointsData } = await this.supabaseService
            .from('points_history')
            .select('points')
            .eq('user_id', userId);

        const totalPoints = (pointsData || []).reduce((sum, p) => sum + (p.points || 0), 0);

        await this.supabaseService
            .from('user_levels')
            .update({ total_points: totalPoints })
            .eq('user_id', userId);
    }

    /**
     * Generate AI feedback asynchronously (fire and forget)
     */
    private async generateFeedbackAsync(
        userId: string,
        workoutId: string,
        activityId: string,
    ): Promise<void> {
        try {
            await this.feedbackAIService.generateFeedback(userId, workoutId, activityId);
            this.logger.log(`AI feedback generated for workout ${workoutId}`);
        } catch (error) {
            this.logger.error(`Failed to generate feedback for workout ${workoutId}`, error);
        }
    }

    // Worker lifecycle events
    @OnWorkerEvent('completed')
    onCompleted(job: Job) {
        this.logger.debug(`Job ${job.id} completed`);
    }

    @OnWorkerEvent('failed')
    onFailed(job: Job, error: Error) {
        this.logger.error(`Job ${job.id} failed: ${error.message}`);
    }
}
