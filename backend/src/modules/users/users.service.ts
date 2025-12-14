import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../../database';

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);

    constructor(private readonly supabaseService: SupabaseService) { }

    /**
     * Get user by ID
     */
    async getUser(userId: string) {
        const { data, error } = await this.supabaseService
            .from('users')
            .select('id, email, strava_athlete_id, profile, subscription_status, created_at')
            .eq('id', userId)
            .single();

        if (error) {
            this.logger.error(`Failed to get user ${userId}`, error);
            throw error;
        }

        return data;
    }

    /**
     * Update user profile
     */
    async updateProfile(userId: string, profile: Record<string, any>) {
        const { data, error } = await this.supabaseService
            .from('users')
            .update({ profile, updated_at: new Date().toISOString() })
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    /**
     * Delete user (LGPD compliance)
     */
    async deleteUser(userId: string) {
        // Delete related data first
        await this.supabaseService.from('ai_feedbacks').delete().eq('user_id', userId);
        await this.supabaseService.from('strava_activities').delete().eq('user_id', userId);
        await this.supabaseService.from('workouts').delete().eq('user_id', userId);
        await this.supabaseService.from('training_plans').delete().eq('user_id', userId);
        await this.supabaseService.from('points_history').delete().eq('user_id', userId);
        await this.supabaseService.from('user_badges').delete().eq('user_id', userId);
        await this.supabaseService.from('user_levels').delete().eq('user_id', userId);
        await this.supabaseService.from('user_onboarding').delete().eq('user_id', userId);

        // Finally delete the user
        const { error } = await this.supabaseService
            .from('users')
            .delete()
            .eq('id', userId);

        if (error) throw error;
        return { success: true };
    }
}
