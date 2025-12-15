import { Injectable, Logger } from '@nestjs/common';

interface CacheEntry<T> {
    data: T;
    expiresAt: number;
}

/**
 * In-memory cache for Strava API responses to reduce redundant requests.
 * TTL-based eviction to ensure fresh data.
 */
@Injectable()
export class StravaCacheService {
    private readonly logger = new Logger(StravaCacheService.name);
    private cache = new Map<string, CacheEntry<any>>();

    private readonly TTL = {
        ACTIVITY: 15 * 60 * 1000,   // 15 min (activity data doesn't change)
        ATHLETE: 60 * 60 * 1000,    // 1 hour (profile changes rarely)
    };

    /**
     * Get cached value or null if expired/not found
     */
    get<T>(key: string): T | null {
        const entry = this.cache.get(key);
        if (!entry) return null;

        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            this.logger.debug(`Cache EXPIRED: ${key}`);
            return null;
        }

        this.logger.debug(`Cache HIT: ${key}`);
        return entry.data as T;
    }

    /**
     * Set cache value with TTL based on type
     */
    set<T>(key: string, data: T, type: 'ACTIVITY' | 'ATHLETE'): void {
        this.cache.set(key, {
            data,
            expiresAt: Date.now() + this.TTL[type],
        });
        this.logger.debug(`Cache SET: ${key} (TTL: ${this.TTL[type] / 1000}s)`);
    }

    /**
     * Check if key exists and is not expired
     */
    has(key: string): boolean {
        const entry = this.cache.get(key);
        if (!entry) return false;
        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            return false;
        }
        return true;
    }

    /**
     * Delete a specific cache entry
     */
    delete(key: string): boolean {
        return this.cache.delete(key);
    }

    /**
     * Clear all cache entries
     */
    clear(): void {
        this.cache.clear();
        this.logger.log('Cache cleared');
    }

    /**
     * Get cache statistics
     */
    getStats(): { size: number; keys: string[] } {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys()),
        };
    }

    // Key generators
    activityKey(id: number): string {
        return `activity:${id}`;
    }

    athleteKey(id: number): string {
        return `athlete:${id}`;
    }
}
