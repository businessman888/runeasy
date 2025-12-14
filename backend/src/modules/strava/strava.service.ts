import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface StravaTokens {
    access_token: string;
    refresh_token: string;
    expires_at: number;
    athlete: StravaAthlete;
}

export interface StravaAthlete {
    id: number;
    firstname: string;
    lastname: string;
    profile: string;
    profile_medium: string;
    city: string;
    state: string;
    country: string;
}

export interface StravaActivity {
    id: number;
    name: string;
    type: string;
    sport_type: string;
    start_date: string;
    start_date_local: string;
    distance: number;
    moving_time: number;
    elapsed_time: number;
    total_elevation_gain: number;
    average_speed: number;
    max_speed: number;
    average_heartrate?: number;
    max_heartrate?: number;
    calories?: number;
    splits_metric?: Array<{
        distance: number;
        elapsed_time: number;
        elevation_difference: number;
        moving_time: number;
        split: number;
        average_speed: number;
        average_heartrate?: number;
        pace_zone: number;
    }>;
    map?: {
        summary_polyline: string;
    };
    start_latlng?: [number, number];
}

@Injectable()
export class StravaService {
    private readonly logger = new Logger(StravaService.name);
    private readonly baseUrl = 'https://www.strava.com/api/v3';
    private readonly oauthUrl = 'https://www.strava.com/oauth';

    constructor(private configService: ConfigService) { }

    /**
     * Get the Strava OAuth authorization URL
     */
    getAuthorizationUrl(): string {
        const clientId = this.configService.get<string>('STRAVA_CLIENT_ID') || '';
        const redirectUri = this.configService.get<string>('STRAVA_REDIRECT_URI') || '';

        const scopes = 'read,activity:read_all,profile:read_all';

        return `${this.oauthUrl}/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scopes}`;
    }

    /**
     * Exchange authorization code for access tokens
     */
    async exchangeCode(code: string): Promise<StravaTokens> {
        const clientId = this.configService.get<string>('STRAVA_CLIENT_ID');
        const clientSecret = this.configService.get<string>('STRAVA_CLIENT_SECRET');

        try {
            const response = await axios.post(`${this.oauthUrl}/token`, {
                client_id: clientId,
                client_secret: clientSecret,
                code,
                grant_type: 'authorization_code',
            });

            return response.data;
        } catch (error) {
            this.logger.error('Failed to exchange Strava code', error);
            throw error;
        }
    }

    /**
     * Refresh access token using refresh token
     */
    async refreshToken(refreshToken: string): Promise<StravaTokens> {
        const clientId = this.configService.get<string>('STRAVA_CLIENT_ID');
        const clientSecret = this.configService.get<string>('STRAVA_CLIENT_SECRET');

        try {
            const response = await axios.post(`${this.oauthUrl}/token`, {
                client_id: clientId,
                client_secret: clientSecret,
                refresh_token: refreshToken,
                grant_type: 'refresh_token',
            });

            return response.data;
        } catch (error) {
            this.logger.error('Failed to refresh Strava token', error);
            throw error;
        }
    }

    /**
     * Get athlete profile
     */
    async getAthlete(accessToken: string): Promise<StravaAthlete> {
        try {
            const response = await axios.get(`${this.baseUrl}/athlete`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            return response.data;
        } catch (error) {
            this.logger.error('Failed to get Strava athlete', error);
            throw error;
        }
    }

    /**
     * Get a specific activity by ID
     */
    async getActivity(activityId: number, accessToken: string): Promise<StravaActivity> {
        try {
            const response = await axios.get(
                `${this.baseUrl}/activities/${activityId}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                },
            );

            return response.data;
        } catch (error) {
            this.logger.error(`Failed to get Strava activity ${activityId}`, error);
            throw error;
        }
    }

    /**
     * Get athlete's recent activities
     */
    async getActivities(
        accessToken: string,
        page = 1,
        perPage = 30,
    ): Promise<StravaActivity[]> {
        try {
            const response = await axios.get(`${this.baseUrl}/athlete/activities`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                params: {
                    page,
                    per_page: perPage,
                },
            });

            return response.data;
        } catch (error) {
            this.logger.error('Failed to get Strava activities', error);
            throw error;
        }
    }

    /**
     * Verify webhook subscription challenge
     */
    verifyWebhook(mode: string, token: string, challenge: string): string | null {
        const verifyToken = this.configService.get<string>('STRAVA_VERIFY_TOKEN');

        if (mode === 'subscribe' && token === verifyToken) {
            return challenge;
        }

        return null;
    }
}
