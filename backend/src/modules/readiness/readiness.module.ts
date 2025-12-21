import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ReadinessController } from './readiness.controller';
import { ReadinessService } from './readiness.service';
import { MockStravaService } from './mock-strava.service';
import { ReadinessAIService } from './readiness-ai.service';
import { DatabaseModule } from '../../database';

@Module({
    imports: [ConfigModule, DatabaseModule],
    controllers: [ReadinessController],
    providers: [ReadinessService, MockStravaService, ReadinessAIService],
    exports: [ReadinessService],
})
export class ReadinessModule { }
