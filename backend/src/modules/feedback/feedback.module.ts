import { Module, forwardRef } from '@nestjs/common';
import { FeedbackAIService } from './feedback-ai.service';
import { FeedbackController } from './feedback.controller';
import { NotificationModule } from '../notifications';

@Module({
    imports: [forwardRef(() => NotificationModule)],
    controllers: [FeedbackController],
    providers: [FeedbackAIService],
    exports: [FeedbackAIService],
})
export class FeedbackModule { }
