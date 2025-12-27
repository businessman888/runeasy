import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as Storage from '../utils/storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Check if Supabase is configured
const isSupabaseConfigured = supabaseUrl.length > 0 && supabaseAnonKey.length > 0;

if (!isSupabaseConfigured) {
    console.warn('[Supabase] Warning: Supabase is not configured. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in your .env file.');
}

// Create client only if configured, otherwise use a mock/null client
export const supabase: SupabaseClient | null = isSupabaseConfigured
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            storage: {
                getItem: async (key) => {
                    return await Storage.getItemAsync(key);
                },
                setItem: async (key, value) => {
                    await Storage.setItemAsync(key, value);
                },
                removeItem: async (key) => {
                    await Storage.deleteItemAsync(key);
                },
            },
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false,
        },
    })
    : null;

/**
 * Get the current authenticated user ID from Supabase session
 * @returns The user ID or null if not authenticated
 */
export async function getAuthenticatedUserId(): Promise<string | null> {
    if (!supabase) {
        console.warn('[Supabase] Cannot get user: Supabase not configured');
        return null;
    }
    try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            return null;
        }

        return user.id;
    } catch (error) {
        console.error('Error getting authenticated user:', error);
        return null;
    }
}

/**
 * Check if the user is currently authenticated
 * @returns true if authenticated, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
    const userId = await getAuthenticatedUserId();
    return userId !== null;
}

/**
 * Get the current session access token
 * @returns The access token or null if not authenticated
 */
export async function getSessionToken(): Promise<string | null> {
    if (!supabase) {
        console.warn('[Supabase] Cannot get session: Supabase not configured');
        return null;
    }
    try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session) {
            return null;
        }

        return session.access_token;
    } catch (error) {
        console.error('Error getting session token:', error);
        return null;
    }
}

