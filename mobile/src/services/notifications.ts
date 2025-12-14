import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import * as Storage from '../utils/storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

// Configure notification handler
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

/**
 * Register for push notifications and get the Expo push token
 */
export async function registerForPushNotificationsAsync(): Promise<string | null> {
    let token: string | null = null;

    // Only works on physical devices
    if (!Device.isDevice) {
        console.log('Push notifications require a physical device');
        return null;
    }

    // Check existing permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Request permission if not already granted
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        console.log('Push notification permission not granted');
        return null;
    }

    try {
        // Get Expo push token
        const projectId = Constants.expoConfig?.extra?.eas?.projectId;
        const pushToken = await Notifications.getExpoPushTokenAsync({
            projectId,
        });
        token = pushToken.data;
        console.log('Push token:', token);

        // Save token locally
        await Storage.setItemAsync('push_token', token);

        // Send token to backend
        await savePushTokenToBackend(token);
    } catch (error) {
        console.error('Error getting push token:', error);
    }

    // Android specific channel configuration
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF6B35',
        });

        await Notifications.setNotificationChannelAsync('feedback', {
            name: 'Feedback de Treino',
            importance: Notifications.AndroidImportance.HIGH,
            description: 'Notificações de feedback pós-treino',
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF6B35',
        });

        await Notifications.setNotificationChannelAsync('training', {
            name: 'Lembretes de Treino',
            importance: Notifications.AndroidImportance.DEFAULT,
            description: 'Lembretes para treinos agendados',
        });
    }

    return token;
}

/**
 * Save push token to backend for server-side notifications
 */
async function savePushTokenToBackend(token: string): Promise<void> {
    try {
        const userId = await Storage.getItemAsync('user_id');

        if (!userId) {
            console.log('No user ID found, skipping token save');
            return;
        }

        await fetch(`${API_URL}/users/push-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-user-id': userId,
            },
            body: JSON.stringify({ push_token: token }),
        });

        console.log('Push token saved to backend');
    } catch (error) {
        console.error('Failed to save push token to backend:', error);
    }
}

/**
 * Schedule a local notification immediately
 */
export async function sendLocalNotification(
    title: string,
    body: string,
    data?: Record<string, unknown>,
): Promise<string> {
    const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
            data,
            sound: true,
        },
        trigger: null, // Immediate notification
    });

    return notificationId;
}

/**
 * Cancel a scheduled notification
 */
export async function cancelNotification(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Set badge count
 */
export async function setBadgeCount(count: number): Promise<void> {
    await Notifications.setBadgeCountAsync(count);
}

/**
 * Get pending notifications
 */
export async function getPendingNotifications() {
    return await Notifications.getAllScheduledNotificationsAsync();
}

/**
 * Notification types for RunEasy
 */
export const NotificationTypes = {
    FEEDBACK_READY: 'feedback_ready',
    WORKOUT_REMINDER: 'workout_reminder',
    STREAK_WARNING: 'streak_warning',
    BADGE_EARNED: 'badge_earned',
    LEVEL_UP: 'level_up',
} as const;

/**
 * Helper to create feedback ready notification data
 */
export function createFeedbackNotificationData(feedbackId: string, workoutType: string) {
    return {
        type: NotificationTypes.FEEDBACK_READY,
        feedbackId,
        workoutType,
    };
}

/**
 * Helper to create workout reminder notification data
 */
export function createWorkoutReminderData(workoutId: string, workoutType: string) {
    return {
        type: NotificationTypes.WORKOUT_REMINDER,
        workoutId,
        workoutType,
    };
}
