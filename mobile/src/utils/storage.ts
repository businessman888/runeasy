import { Platform } from 'react-native';

/**
 * Cross-platform secure storage utility
 * Uses SecureStore on native and localStorage on web
 */

let SecureStore: any = null;

// Only import SecureStore on native platforms
if (Platform.OS !== 'web') {
    SecureStore = require('expo-secure-store');
}

export async function getItemAsync(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
        try {
            return localStorage.getItem(key);
        } catch {
            return null;
        }
    }
    return SecureStore?.getItemAsync(key) ?? null;
}

export async function setItemAsync(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
        try {
            localStorage.setItem(key, value);
        } catch {
            console.warn('Failed to save to localStorage');
        }
        return;
    }
    await SecureStore?.setItemAsync(key, value);
}

export async function deleteItemAsync(key: string): Promise<void> {
    if (Platform.OS === 'web') {
        try {
            localStorage.removeItem(key);
        } catch {
            console.warn('Failed to remove from localStorage');
        }
        return;
    }
    await SecureStore?.deleteItemAsync(key);
}

// Default export for compatibility
export default {
    getItemAsync,
    setItemAsync,
    deleteItemAsync,
};
