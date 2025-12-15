import {
    Controller,
    Get,
    Post,
    Put,
    Body,
    Param,
    Query,
    Headers,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { TrainingService } from './training.service';
import { SupabaseService } from '../../database';

interface CreatePlanDto {
    goal: string;
    level: string;
    days_per_week: number;
    current_pace_5k: number | null;
    target_weeks: number;
    limitations: string | null;
    preferred_days: number[];
}

interface SkipWorkoutDto {
    reason: string;
}

@Controller('training')
export class TrainingController {
    private readonly logger = new Logger(TrainingController.name);

    constructor(
        private readonly trainingService: TrainingService,
        private readonly supabaseService: SupabaseService,
    ) { }

    /**
     * Save onboarding data and create training plan
     */
    @Post('onboarding')
    async completeOnboarding(
        @Headers('x-user-id') userId: string,
        @Body() dto: CreatePlanDto,
    ) {
        if (!userId) {
            throw new HttpException('User ID required', HttpStatus.UNAUTHORIZED);
        }

        try {
            // Save onboarding data
            await this.supabaseService.from('user_onboarding').upsert({
                user_id: userId,
                goal: dto.goal,
                level: dto.level,
                days_per_week: dto.days_per_week,
                current_pace_5k: dto.current_pace_5k,
                target_weeks: dto.target_weeks,
                has_limitations: !!dto.limitations,
                limitations: dto.limitations,
                preferred_days: dto.preferred_days,
                completed_at: new Date().toISOString(),
                responses_json: dto,
            });

            // Create training plan
            const result = await this.trainingService.createTrainingPlan(userId, {
                goal: dto.goal,
                level: dto.level,
                daysPerWeek: dto.days_per_week,
                currentPace5k: dto.current_pace_5k,
                targetWeeks: dto.target_weeks,
                limitations: dto.limitations,
                preferredDays: dto.preferred_days,
            });

            // Return plan preview data for frontend
            return {
                success: true,
                plan_id: result.plan.id,
                workouts_count: result.workoutsCount,
                // Include plan preview data for PlanPreview screen
                planHeader: result.planPreview?.planHeader,
                planHeadline: result.planPreview?.planHeadline,
                welcomeBadge: result.planPreview?.welcomeBadge,
                nextWorkout: result.planPreview?.nextWorkout,
                fullSchedulePreview: result.planPreview?.fullSchedulePreview,
            };
        } catch (error) {
            this.logger.error('Onboarding failed', error);
            throw new HttpException(
                error.message || 'Failed to create plan',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    /**
     * Get active training plan
     */
    @Get('plan')
    async getActivePlan(@Headers('x-user-id') userId: string) {
        if (!userId) {
            throw new HttpException('User ID required', HttpStatus.UNAUTHORIZED);
        }

        const plan = await this.trainingService.getActivePlan(userId);
        return { plan };
    }

    /**
     * Get workouts for calendar view
     */
    @Get('workouts')
    async getWorkouts(
        @Headers('x-user-id') userId: string,
        @Query('start_date') startDate: string,
        @Query('end_date') endDate: string,
    ) {
        if (!userId) {
            throw new HttpException('User ID required', HttpStatus.UNAUTHORIZED);
        }

        const workouts = await this.trainingService.getWorkouts(userId, startDate, endDate);
        return { workouts };
    }

    /**
     * Get upcoming workouts
     */
    @Get('workouts/upcoming')
    async getUpcomingWorkouts(
        @Headers('x-user-id') userId: string,
        @Query('limit') limit?: string,
    ) {
        if (!userId) {
            throw new HttpException('User ID required', HttpStatus.UNAUTHORIZED);
        }

        const workouts = await this.trainingService.getUpcomingWorkouts(
            userId,
            limit ? parseInt(limit, 10) : 7,
        );
        return { workouts };
    }

    /**
     * Get workout details
     */
    @Get('workouts/:id')
    async getWorkout(
        @Headers('x-user-id') userId: string,
        @Param('id') workoutId: string,
    ) {
        if (!userId) {
            throw new HttpException('User ID required', HttpStatus.UNAUTHORIZED);
        }

        const workout = await this.trainingService.getWorkout(userId, workoutId);
        return { workout };
    }

    /**
     * Mark workout as skipped
     */
    @Put('workouts/:id/skip')
    async skipWorkout(
        @Headers('x-user-id') userId: string,
        @Param('id') workoutId: string,
        @Body() dto: SkipWorkoutDto,
    ) {
        if (!userId) {
            throw new HttpException('User ID required', HttpStatus.UNAUTHORIZED);
        }

        const workout = await this.trainingService.skipWorkout(userId, workoutId, dto.reason);
        return { workout };
    }
}
