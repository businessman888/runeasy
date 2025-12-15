import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../../database';
import { TrainingAIService, TrainingPlanRequest, GeneratedPlan } from './training-ai.service';

@Injectable()
export class TrainingService {
    private readonly logger = new Logger(TrainingService.name);

    constructor(
        private readonly supabaseService: SupabaseService,
        private readonly trainingAIService: TrainingAIService,
    ) { }

    /**
     * Create a new training plan for a user
     */
    async createTrainingPlan(userId: string, onboardingData: TrainingPlanRequest): Promise<any> {
        try {
            // Generate plan using AI
            const generatedPlan = await this.trainingAIService.generateTrainingPlan(onboardingData);

            // Save training plan to database
            const { data: plan, error: planError } = await this.supabaseService
                .from('training_plans')
                .insert({
                    user_id: userId,
                    goal: onboardingData.goal,
                    duration_weeks: generatedPlan.duration_weeks,
                    frequency_per_week: generatedPlan.frequency_per_week,
                    plan_json: generatedPlan,
                    status: 'active',
                })
                .select()
                .single();

            if (planError) throw planError;

            // Create individual workouts
            const workoutsToInsert = [];
            const today = new Date();

            for (const week of generatedPlan.weeks) {
                for (const workout of week.workouts) {
                    // Calculate workout date based on week number and day of week
                    const weekStart = new Date(today);
                    weekStart.setDate(today.getDate() + (week.week_number - 1) * 7);

                    const workoutDate = new Date(weekStart);
                    const currentDay = workoutDate.getDay();
                    const targetDay = workout.day_of_week;
                    const daysToAdd = (targetDay - currentDay + 7) % 7;
                    workoutDate.setDate(workoutDate.getDate() + daysToAdd);

                    workoutsToInsert.push({
                        plan_id: plan.id,
                        user_id: userId,
                        week_number: week.week_number,
                        scheduled_date: workoutDate.toISOString().split('T')[0],
                        type: workout.type,
                        distance_km: workout.distance_km,
                        instructions_json: workout.segments,
                        objective: workout.objective,
                        tips: workout.tips,
                        status: 'pending',
                    });
                }
            }

            // Insert all workouts
            const { error: workoutsError } = await this.supabaseService
                .from('workouts')
                .insert(workoutsToInsert);

            if (workoutsError) throw workoutsError;

            this.logger.log(`Created training plan ${plan.id} with ${workoutsToInsert.length} workouts`);

            // Return plan data including preview for frontend
            return {
                plan,
                workoutsCount: workoutsToInsert.length,
                // Include plan preview data from AI response
                planPreview: {
                    planHeader: generatedPlan.planHeader,
                    planHeadline: generatedPlan.planHeadline,
                    welcomeBadge: generatedPlan.welcomeBadge,
                    nextWorkout: generatedPlan.nextWorkout,
                    fullSchedulePreview: generatedPlan.fullSchedulePreview,
                },
            };
        } catch (error) {
            this.logger.error('Failed to create training plan', error);
            throw error;
        }
    }

    /**
     * Get user's active training plan
     */
    async getActivePlan(userId: string) {
        const { data, error } = await this.supabaseService
            .from('training_plans')
            .select('*')
            .eq('user_id', userId)
            .eq('status', 'active')
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    }

    /**
     * Get workouts for a specific month
     */
    async getWorkouts(userId: string, startDate: string, endDate: string) {
        const { data, error } = await this.supabaseService
            .from('workouts')
            .select('*')
            .eq('user_id', userId)
            .gte('scheduled_date', startDate)
            .lte('scheduled_date', endDate)
            .order('scheduled_date', { ascending: true });

        if (error) throw error;
        return data;
    }

    /**
     * Get upcoming workouts
     */
    async getUpcomingWorkouts(userId: string, limit = 7) {
        const today = new Date().toISOString().split('T')[0];

        const { data, error } = await this.supabaseService
            .from('workouts')
            .select('*')
            .eq('user_id', userId)
            .gte('scheduled_date', today)
            .eq('status', 'pending')
            .order('scheduled_date', { ascending: true })
            .limit(limit);

        if (error) throw error;
        return data;
    }

    /**
     * Mark a workout as skipped
     */
    async skipWorkout(userId: string, workoutId: string, reason: string) {
        const { data, error } = await this.supabaseService
            .from('workouts')
            .update({
                status: 'skipped',
                skip_reason: reason,
            })
            .eq('id', workoutId)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    /**
     * Get a single workout by ID
     */
    async getWorkout(userId: string, workoutId: string) {
        const { data, error } = await this.supabaseService
            .from('workouts')
            .select('*, training_plans(*)')
            .eq('id', workoutId)
            .eq('user_id', userId)
            .single();

        if (error) throw error;
        return data;
    }
}
