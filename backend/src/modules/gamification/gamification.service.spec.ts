import { Test, TestingModule } from '@nestjs/testing';
import { GamificationService } from './gamification.service';
import { SupabaseService } from '../../database';

describe('GamificationService', () => {
    let service: GamificationService;
    let mockSupabaseService: Partial<SupabaseService>;

    const mockUser = {
        id: 'user-123',
        current_level: 3,
        current_xp: 150,
        total_points: 500,
        current_streak: 5,
        best_streak: 10,
    };

    beforeEach(async () => {
        mockSupabaseService = {
            from: jest.fn().mockReturnValue({
                select: jest.fn().mockReturnThis(),
                insert: jest.fn().mockReturnThis(),
                update: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
                order: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue({ data: [], error: null }),
            }),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GamificationService,
                { provide: SupabaseService, useValue: mockSupabaseService },
            ],
        }).compile();

        service = module.get<GamificationService>(GamificationService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('calculateLevel', () => {
        it('should return level 1 for 0 XP', () => {
            const level = service.calculateLevel(0);
            expect(level).toBe(1);
        });

        it('should return level 2 for 100 XP', () => {
            const level = service.calculateLevel(100);
            expect(level).toBe(2);
        });

        it('should return level 5 for 1000 XP', () => {
            const level = service.calculateLevel(1000);
            expect(level).toBe(5);
        });

        it('should return level 10 for 10000 XP', () => {
            const level = service.calculateLevel(10000);
            expect(level).toBe(10);
        });
    });

    describe('calculateXPForLevel', () => {
        it('should return 0 for level 1', () => {
            const xp = service.calculateXPForLevel(1);
            expect(xp).toBe(0);
        });

        it('should return correct XP for level 5', () => {
            const xp = service.calculateXPForLevel(5);
            expect(xp).toBeGreaterThan(0);
        });
    });

    describe('getLevelName', () => {
        it('should return Iniciante for level 1', () => {
            const name = service.getLevelName(1);
            expect(name).toBe('Iniciante');
        });

        it('should return Corredor Regular for level 4', () => {
            const name = service.getLevelName(4);
            expect(name).toBe('Corredor Regular');
        });

        it('should return Ultra Runner for level 10', () => {
            const name = service.getLevelName(10);
            expect(name).toBe('Ultra Runner');
        });
    });

    describe('calculateWorkoutPoints', () => {
        it('should calculate base points for easy run', () => {
            const points = service.calculateWorkoutPoints('easy_run', 5, 30);
            expect(points).toBeGreaterThan(0);
        });

        it('should give more points for longer distances', () => {
            const shortRun = service.calculateWorkoutPoints('easy_run', 3, 20);
            const longRun = service.calculateWorkoutPoints('long_run', 15, 90);
            expect(longRun).toBeGreaterThan(shortRun);
        });

        it('should give bonus for intervals', () => {
            const easyRun = service.calculateWorkoutPoints('easy_run', 5, 30);
            const intervals = service.calculateWorkoutPoints('intervals', 5, 30);
            expect(intervals).toBeGreaterThan(easyRun);
        });
    });
});
