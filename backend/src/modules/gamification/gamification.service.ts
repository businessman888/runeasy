import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../../database';

export interface UserLevel {
    id: string;
    user_id: string;
    current_level: number;
    total_points: number;
    performance_score: number;
    consistency_score: number;
    adherence_score: number;
    best_5k_pace: number | null;
    best_10k_pace: number | null;
    current_streak: number;
    best_streak: number;
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    type: string;
    tier: number;
    criteria: Record<string, unknown>;
}

export interface UserBadge {
    id: string;
    user_id: string;
    badge_id: string;
    earned_at: string;
    badge?: Badge;
}

@Injectable()
export class GamificationService {
    private readonly logger = new Logger(GamificationService.name);

    // Level thresholds (points required for each level)
    private readonly levelThresholds = [
        0,       // Level 1: 0 pts
        100,     // Level 2: 100 pts
        300,     // Level 3: 300 pts
        600,     // Level 4: 600 pts
        1000,    // Level 5: 1000 pts
        1500,    // Level 6: 1500 pts
        2200,    // Level 7: 2200 pts
        3000,    // Level 8: 3000 pts
        4000,    // Level 9: 4000 pts
        5200,    // Level 10: 5200 pts
        6600,    // Level 11: 6600 pts
        8200,    // Level 12: 8200 pts
        10000,   // Level 13: 10000 pts
        12000,   // Level 14: 12000 pts
        15000,   // Level 15: 15000 pts
    ];

    constructor(private readonly supabaseService: SupabaseService) { }

    /**
     * Get user's gamification stats
     */
    async getUserStats(userId: string): Promise<UserLevel | null> {
        const { data, error } = await this.supabaseService
            .from('user_levels')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    }

    /**
     * Get all badges with user's earned status
     */
    async getBadges(userId: string): Promise<(Badge & { earned: boolean; earned_at?: string })[]> {
        // Get all badges
        const { data: allBadges, error: badgesError } = await this.supabaseService
            .from('badges')
            .select('*')
            .order('tier', { ascending: true });

        if (badgesError) throw badgesError;

        // Get user's earned badges
        const { data: userBadges } = await this.supabaseService
            .from('user_badges')
            .select('badge_id, earned_at')
            .eq('user_id', userId);

        const earnedMap = new Map(
            (userBadges || []).map((ub) => [ub.badge_id, ub.earned_at])
        );

        return (allBadges || []).map((badge) => ({
            ...badge,
            earned: earnedMap.has(badge.id),
            earned_at: earnedMap.get(badge.id),
        }));
    }

    /**
     * Add points to user and recalculate level
     */
    async addPoints(
        userId: string,
        points: number,
        reason: string,
        referenceType?: string,
        referenceId?: string,
    ): Promise<{ newTotal: number; levelUp: boolean; newLevel: number }> {
        // Get current stats
        const currentStats = await this.getUserStats(userId);
        const currentPoints = currentStats?.total_points || 0;
        const currentLevel = currentStats?.current_level || 1;
        const newTotal = currentPoints + points;

        // Calculate new level
        const newLevel = this.calculateLevel(newTotal);
        const levelUp = newLevel > currentLevel;

        // Update user_levels
        await this.supabaseService
            .from('user_levels')
            .upsert({
                user_id: userId,
                total_points: newTotal,
                current_level: newLevel,
                updated_at: new Date().toISOString(),
            });

        // Record points history
        await this.supabaseService.from('points_history').insert({
            user_id: userId,
            points,
            reason,
            reference_type: referenceType,
            reference_id: referenceId,
        });

        if (levelUp) {
            this.logger.log(`User ${userId} leveled up to ${newLevel}!`);
        }

        return { newTotal, levelUp, newLevel };
    }

    /**
     * Calculate level based on total points
     */
    calculateLevel(totalPoints: number): number {
        for (let i = this.levelThresholds.length - 1; i >= 0; i--) {
            if (totalPoints >= this.levelThresholds[i]) {
                return i + 1;
            }
        }
        return 1;
    }

    /**
     * Get points needed for next level
     */
    getPointsForNextLevel(currentLevel: number): number {
        if (currentLevel >= this.levelThresholds.length) {
            return 0; // Max level reached
        }
        return this.levelThresholds[currentLevel];
    }

    /**
     * Check and award badges after an activity
     */
    async checkBadges(userId: string, activityData?: any): Promise<Badge[]> {
        const earnedBadges: Badge[] = [];

        // Get user's current badges
        const { data: userBadges } = await this.supabaseService
            .from('user_badges')
            .select('badge_id')
            .eq('user_id', userId);

        const earnedBadgeIds = new Set((userBadges || []).map((ub) => ub.badge_id));

        // Get all badges
        const { data: allBadges } = await this.supabaseService
            .from('badges')
            .select('*');

        if (!allBadges) return earnedBadges;

        // Get user stats for checking criteria
        const userStats = await this.getUserStats(userId);

        // Get user's activity count
        const { count: activityCount } = await this.supabaseService
            .from('strava_activities')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId);

        // Get completed workouts count
        const { count: completedWorkouts } = await this.supabaseService
            .from('workouts')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('status', 'completed');

        for (const badge of allBadges) {
            if (earnedBadgeIds.has(badge.id)) continue;

            const criteria = badge.criteria as Record<string, unknown>;
            let earned = false;

            switch (criteria.type) {
                case 'first_workout':
                    earned = (activityCount || 0) >= 1;
                    break;

                case 'workouts_30_days': {
                    // Check workouts in last 30 days
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

                    const { count: recentWorkouts } = await this.supabaseService
                        .from('strava_activities')
                        .select('*', { count: 'exact', head: true })
                        .eq('user_id', userId)
                        .gte('start_date', thirtyDaysAgo.toISOString());

                    earned = (recentWorkouts || 0) >= (criteria.count as number);
                    break;
                }

                case 'streak':
                    earned = (userStats?.current_streak || 0) >= (criteria.days as number);
                    break;

                case 'distance':
                    if (activityData?.distance) {
                        earned = activityData.distance / 1000 >= (criteria.km as number);
                    }
                    break;

                case 'pace_5k':
                    if (activityData?.average_pace && activityData?.distance >= 5000) {
                        earned = activityData.average_pace <= (criteria.pace as number);
                    }
                    break;
            }

            if (earned) {
                // Award badge
                await this.supabaseService.from('user_badges').insert({
                    user_id: userId,
                    badge_id: badge.id,
                });

                // Add points for badge
                await this.addPoints(userId, 100, `Badge conquistado: ${badge.name}`, 'badge', badge.id);

                earnedBadges.push(badge);
                this.logger.log(`User ${userId} earned badge: ${badge.name}`);
            }
        }

        return earnedBadges;
    }

    /**
     * Get user's points history
     */
    async getPointsHistory(userId: string, limit = 50) {
        const { data, error } = await this.supabaseService
            .from('points_history')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data;
    }
}
