import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackAIService } from './feedback-ai.service';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../../database';
import { NotificationService } from '../notifications/notification.service';

describe('FeedbackAIService', () => {
    let service: FeedbackAIService;
    let mockSupabaseService: Partial<SupabaseService>;
    let mockConfigService: Partial<ConfigService>;
    let mockNotificationService: Partial<NotificationService>;

    beforeEach(async () => {
        mockSupabaseService = {
            from: jest.fn().mockReturnValue({
                select: jest.fn().mockReturnThis(),
                insert: jest.fn().mockReturnThis(),
                update: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                not: jest.fn().mockReturnThis(),
                order: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue({ data: [], error: null }),
                single: jest.fn().mockResolvedValue({
                    data: { id: 'workout-1', type: 'easy_run', distance_km: 5 },
                    error: null
                }),
            }),
        };

        mockConfigService = {
            get: jest.fn().mockReturnValue('test-api-key'),
        };

        mockNotificationService = {
            sendFeedbackReadyNotification: jest.fn().mockResolvedValue(true),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FeedbackAIService,
                { provide: SupabaseService, useValue: mockSupabaseService },
                { provide: ConfigService, useValue: mockConfigService },
                { provide: NotificationService, useValue: mockNotificationService },
            ],
        }).compile();

        service = module.get<FeedbackAIService>(FeedbackAIService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getFeedbackHistory', () => {
        it('should return array of feedbacks', async () => {
            const mockFeedbacks = [
                { id: 'fb-1', hero_message: 'Great job!' },
                { id: 'fb-2', hero_message: 'Keep it up!' },
            ];

            (mockSupabaseService.from as jest.Mock).mockReturnValue({
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                order: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue({ data: mockFeedbacks, error: null }),
            });

            const result = await service.getFeedbackHistory('user-123', 10);
            expect(result).toEqual(mockFeedbacks);
        });
    });

    describe('getFeedback', () => {
        it('should return single feedback', async () => {
            const mockFeedback = { id: 'fb-1', hero_message: 'Great job!' };

            (mockSupabaseService.from as jest.Mock).mockReturnValue({
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({ data: mockFeedback, error: null }),
            });

            const result = await service.getFeedback('user-123', 'fb-1');
            expect(result).toEqual(mockFeedback);
        });
    });

    describe('rateFeedback', () => {
        it('should update feedback rating', async () => {
            const mockFeedback = { id: 'fb-1', feedback_rating: 5 };

            (mockSupabaseService.from as jest.Mock).mockReturnValue({
                update: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({ data: mockFeedback, error: null }),
            });

            const result = await service.rateFeedback('user-123', 'fb-1', 5);
            expect(result.feedback_rating).toBe(5);
        });
    });
});
