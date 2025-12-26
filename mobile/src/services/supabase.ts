import { createClient } from '@supabase/supabase-js';
import * as Storage from '../utils/storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
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
});

/**
 * Get the current authenticated user ID from Supabase session
 * @returns The user ID or null if not authenticated
 */
export async function getAuthenticatedUserId(): Promise<string | null> {
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
