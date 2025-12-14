import { Module, forwardRef } from '@nestjs/common';
import { StravaService } from './strava.service';
import { StravaAuthController } from './strava-auth.controller';
import { StravaWebhookController } from './strava-webhook.controller';
import { FeedbackModule } from '../feedback';

@Module({
    imports: [forwardRef(() => FeedbackModule)],
    controllers: [StravaAuthController, StravaWebhookController],
    providers: [StravaService],
    exports: [StravaService],
})
export class StravaModule { }
