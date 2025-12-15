import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { StravaQueueService } from './strava-queue.service';
import { StravaQueueProcessor } from './strava-queue.processor';
import { StravaService } from '../strava.service';
import { StravaCacheService } from '../strava-cache.service';
import { DatabaseModule } from '../../../database';
import { FeedbackModule } from '../../feedback';

/**
 * Module for Strava webhook queue processing.
 * Configures BullMQ queue with rate limiting.
 */
@Module({
    imports: [
        BullModule.registerQueue({
            name: 'strava-queue',
            defaultJobOptions: {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 30000, // 30s initial, then 60s, then 120s
                },
                removeOnComplete: 100,
                removeOnFail: 1000,
            },
        }),
        DatabaseModule,
        FeedbackModule,
    ],
    providers: [
        StravaQueueService,
        StravaQueueProcessor,
        StravaService,
        StravaCacheService,
    ],
    exports: [StravaQueueService],
})
export class StravaQueueModule { }
