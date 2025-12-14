import { Module } from '@nestjs/common';
import { TrainingService } from './training.service';
import { TrainingAIService } from './training-ai.service';
import { TrainingController } from './training.controller';

@Module({
    controllers: [TrainingController],
    providers: [TrainingService, TrainingAIService],
    exports: [TrainingService, TrainingAIService],
})
export class TrainingModule { }
