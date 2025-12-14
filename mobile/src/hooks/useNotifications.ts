import { useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { useNavigation } from '@react-navigation/native';
import {
    registerForPushNotificationsAsync,
    NotificationTypes,
} from '../services/notifications';

interface NotificationData {
    type: string;
    feedbackId?: string;
    workoutId?: string;
    [key: string]: unknown;
}

export function useNotifications() {
    const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
    const [notification, setNotification] = useState<Notifications.Notification | null>(null);
    const notificationListener = useRef<Notifications.EventSubscription | null>(null);
    const responseListener = useRef<Notifications.EventSubscription | null>(null);
    const navigation = useNavigation<any>();

    useEffect(() => {
        // Register for push notifications
        registerForPushNotificationsAsync().then((token) => {
            setExpoPushToken(token);
        });

        // Listen for incoming notifications (when app is in foreground)
        notificationListener.current = Notifications.addNotificationReceivedListener(
            (notification) => {
                setNotification(notification);
                console.log('Notification received:', notification);
            }
        );

        // Listen for notification responses (when user taps notification)
        responseListener.current = Notifications.addNotificationResponseReceivedListener(
            (response) => {
                const data = response.notification.request.content.data as NotificationData;
                handleNotificationNavigation(data);
            }
        );

        return () => {
            if (notificationListener.current) {
                notificationListener.current.remove();
            }
            if (responseListener.current) {
                responseListener.current.remove();
            }
        };
    }, []);

    const handleNotificationNavigation = (data: NotificationData) => {
        if (!data?.type) return;

        switch (data.type) {
            case NotificationTypes.FEEDBACK_READY:
                if (data.feedbackId) {
                    navigation.navigate('Feedback', { feedbackId: data.feedbackId });
                }
                break;

            case NotificationTypes.WORKOUT_REMINDER:
                if (data.workoutId) {
                    navigation.navigate('WorkoutDetail', { workoutId: data.workoutId });
                }
                break;

            case NotificationTypes.BADGE_EARNED:
                navigation.navigate('Badges');
                break;

            case NotificationTypes.LEVEL_UP:
                navigation.navigate('Home');
                break;

            default:
                navigation.navigate('Home');
        }
    };

    return {
        expoPushToken,
        notification,
    };
}
