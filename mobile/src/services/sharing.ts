import * as Sharing from 'expo-sharing';
import { Share, Platform } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import { RefObject } from 'react';
import { View } from 'react-native';

/**
 * Check if sharing is available on the device
 */
export async function isSharingAvailable(): Promise<boolean> {
    return await Sharing.isAvailableAsync();
}

/**
 * Share an image to Instagram Stories
 */
export async function shareToInstagramStories(
    imageUri: string,
): Promise<boolean> {
    try {
        // On iOS, we can use the native share sheet
        if (Platform.OS === 'ios') {
            await Share.share({
                url: imageUri,
            });
            return true;
        }

        // Android - use the general share
        const available = await Sharing.isAvailableAsync();
        if (available) {
            await Sharing.shareAsync(imageUri, {
                mimeType: 'image/png',
                dialogTitle: 'Compartilhar Treino',
            });
            return true;
        }

        return false;
    } catch (error) {
        console.error('Error sharing to Instagram:', error);
        return false;
    }
}

/**
 * Capture a view and share it
 */
export async function captureAndShare(
    viewRef: RefObject<View>,
    options?: {
        title?: string;
        message?: string;
    },
): Promise<boolean> {
    try {
        // Capture the view
        const uri = await captureRef(viewRef, {
            format: 'png',
            quality: 1,
        });

        // Check if sharing is available
        const available = await Sharing.isAvailableAsync();

        if (available) {
            await Sharing.shareAsync(uri, {
                mimeType: 'image/png',
                dialogTitle: options?.title || 'Compartilhar',
            });
            return true;
        } else {
            // Fallback to native share
            await Share.share({
                title: options?.title,
                message: options?.message,
                url: uri,
            });
            return true;
        }
    } catch (error) {
        console.error('Error capturing and sharing:', error);
        return false;
    }
}

/**
 * Share feedback to social media
 */
export async function shareFeedbackCard(
    viewRef: RefObject<View>,
    feedbackMessage: string,
): Promise<boolean> {
    try {
        // Capture the feedback card
        const uri = await captureRef(viewRef, {
            format: 'png',
            quality: 1,
        });

        const available = await Sharing.isAvailableAsync();

        if (available) {
            await Sharing.shareAsync(uri, {
                mimeType: 'image/png',
                dialogTitle: 'Compartilhar Feedback',
            });
            return true;
        } else {
            // Fallback for devices without sharing
            await Share.share({
                message: `🏃 Acabei meu treino! ${feedbackMessage}\n\n#RunEasy #Running #Corrida`,
                url: uri,
            });
            return true;
        }
    } catch (error) {
        console.error('Error sharing feedback:', error);
        return false;
    }
}

/**
 * Share text-only content (for when image capture fails)
 */
export async function shareText(
    message: string,
    title?: string,
): Promise<boolean> {
    try {
        await Share.share({
            message,
            title,
        });
        return true;
    } catch (error) {
        console.error('Error sharing text:', error);
        return false;
    }
}

/**
 * Generate sharing message for feedback
 */
export function generateFeedbackShareMessage(
    heroMessage: string,
    workoutType: string,
    distance: number,
): string {
    const workoutTypeName = getWorkoutTypeName(workoutType);

    return `🏃 ${heroMessage}\n\n` +
        `📊 ${workoutTypeName} - ${distance.toFixed(1)}km\n\n` +
        `#RunEasy #Running #Corrida #${workoutTypeName.replace(/\s/g, '')}`;
}

function getWorkoutTypeName(type: string): string {
    const types: Record<string, string> = {
        'easy_run': 'Corrida Leve',
        'long_run': 'Long Run',
        'intervals': 'Intervalado',
        'tempo': 'Tempo Run',
        'recovery': 'Recuperação',
    };
    return types[type] || 'Corrida';
}
