import React from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
} from 'react-native';
import { QuizLayout } from '../../components/QuizLayout';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { colors, typography, spacing, borderRadius } from '../../theme';
import * as Storage from '../../utils/storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

export function LimitationsScreen({ navigation, route }: any) {
    const { userId } = route.params || {};
    const { data, updateData, reset } = useOnboardingStore();
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleGeneratePlan = async () => {
        try {
            setIsSubmitting(true);

            const response = await fetch(`${API_URL}/training/onboarding`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': userId,
                },
                body: JSON.stringify({
                    goal: data.goal,
                    level: data.level,
                    days_per_week: data.daysPerWeek || 3,
                    current_pace_5k: data.currentPace5k,
                    target_weeks: data.targetWeeks || 8,
                    limitations: data.limitations,
                    preferred_days: data.preferredDays || [],
                }),
            });

            if (response.ok) {
                const result = await response.json();

                // Store userId
                await Storage.setItemAsync('user_id', userId);

                // Navigate to Plan Preview
                navigation.replace('PlanPreview', {
                    planId: result.plan_id,
                    workoutsCount: result.workouts_count,
                    goal: data.goal,
                    targetWeeks: data.targetWeeks,
                    daysPerWeek: data.daysPerWeek,
                    level: data.level,
                });
            } else {
                console.error('Onboarding failed');
            }
        } catch (error) {
            console.error('Submit error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBack = () => {
        navigation.goBack();
    };

    return (
        <QuizLayout
            currentStep={6}
            totalSteps={6}
            title="Alguma limitação física?"
            subtitle="Lesões anteriores, problemas de saúde, etc. (opcional)"
            onNext={handleGeneratePlan}
            onBack={handleBack}
            nextLabel="Gerar Plano"
            isLoading={isSubmitting}
        >
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Ex: dor no joelho direito, tendinite no tornozelo..."
                    placeholderTextColor="rgba(255, 255, 255, 0.3)"
                    value={data.limitations || ''}
                    onChangeText={(text) => updateData({ limitations: text || null })}
                    multiline
                    numberOfLines={4}
                />
                <Text style={styles.helperText}>
                    💡 Esta informação ajuda a IA a criar um plano mais seguro para você
                </Text>
            </View>
        </QuizLayout>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        paddingVertical: spacing.lg,
    },
    textInput: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        fontSize: typography.fontSizes.md,
        color: colors.white,
        minHeight: 120,
        textAlignVertical: 'top',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    helperText: {
        marginTop: spacing.md,
        fontSize: typography.fontSizes.sm,
        color: 'rgba(255, 255, 255, 0.5)',
        textAlign: 'center',
    },
});
