import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

export interface WebhookEvent {
    object_type: 'activity' | 'athlete';
    object_id: number;
    aspect_type: 'create' | 'update' | 'delete';
    owner_id: number;
    subscription_id: number;
    event_time: number;
    updates?: Record<string, unknown>;
}

export interface StravaWebhookJob {
    event: WebhookEvent;
    receivedAt: string;
}

/**
 * Service for managing the Strava webhook processing queue.
 * Uses BullMQ with rate limiting to respect Strava API limits.
 */
@Injectable()
export class StravaQueueService {
    private readonly logger = new Logger(StravaQueueService.name);

    constructor(
        @InjectQueue('strava-queue') private stravaQueue: Queue,
    ) { }

    /**
     * Add a webhook event to the processing queue.
     * Returns immediately - processing happens asynchronously.
     */
    async addWebhookJob(event: WebhookEvent): Promise<string> {
        const job = await this.stravaQueue.add(
            'process-webhook',
            {
                event,
                receivedAt: new Date().toISOString(),
            } as StravaWebhookJob,
            {
                // Job-specific options
                jobId: `webhook-${event.object_type}-${event.object_id}-${event.event_time}`,
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 30000, // Start with 30s, then 60s, then 120s
                },
            },
        );

        this.logger.log(`Queued webhook job ${job.id} for ${event.object_type}/${event.object_id}`);
        return job.id!;
    }

    /**
     * Get queue statistics for monitoring
     */
    async getQueueStats() {
        const [waiting, active, completed, failed] = await Promise.all([
            this.stravaQueue.getWaitingCount(),
            this.stravaQueue.getActiveCount(),
            this.stravaQueue.getCompletedCount(),
            this.stravaQueue.getFailedCount(),
        ]);

        return { waiting, active, completed, failed };
    }

    /**
     * Pause queue processing (e.g., during maintenance)
     */
    async pause(): Promise<void> {
        await this.stravaQueue.pause();
        this.logger.warn('Strava queue PAUSED');
    }

    /**
     * Resume queue processing
     */
    async resume(): Promise<void> {
        await this.stravaQueue.resume();
        this.logger.log('Strava queue RESUMED');
    }
}
