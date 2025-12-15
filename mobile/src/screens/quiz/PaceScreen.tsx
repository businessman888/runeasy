import React from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { QuizLayout } from '../../components/QuizLayout';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { colors, typography, spacing, borderRadius } from '../../theme';

export function PaceScreen({ navigation, route }: any) {
    const { userId } = route.params || {};
    const { data, updateData } = useOnboardingStore();
    const [minutes, setMinutes] = React.useState(
        data.currentPace5k ? Math.floor(data.currentPace5k) : 6
    );
    const [seconds, setSeconds] = React.useState(
        data.currentPace5k ? Math.round((data.currentPace5k % 1) * 60) : 0
    );
    const [dontKnow, setDontKnow] = React.useState(data.currentPace5k === null);

    React.useEffect(() => {
        if (!dontKnow && minutes !== undefined && seconds !== undefined) {
            updateData({ currentPace5k: minutes + seconds / 60 });
        }
    }, [minutes, seconds, dontKnow]);

    const handleNext = () => {
        navigation.navigate('Quiz_Timeframe', { userId });
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const handleDontKnow = () => {
        setDontKnow(true);
        updateData({ currentPace5k: null });
    };

    return (
        <QuizLayout
            currentStep={4}
            totalSteps={6}
            title="Qual seu pace atual em 5K?"
            subtitle="Seu ritmo médio por quilômetro"
            onNext={handleNext}
            onBack={handleBack}
        >
            <View style={styles.paceContainer}>
                <View style={styles.paceInputRow}>
                    <View style={styles.paceInputGroup}>
                        <TextInput
                            style={[styles.paceInput, dontKnow && styles.paceInputDisabled]}
                            keyboardType="number-pad"
                            maxLength={2}
                            value={dontKnow ? '--' : String(minutes)}
                            onChangeText={(text) => {
                                setDontKnow(false);
                                setMinutes(parseInt(text) || 0);
                            }}
                            editable={!dontKnow}
                        />
                        <Text style={styles.paceLabel}>min</Text>
                    </View>

                    <Text style={styles.paceSeparator}>:</Text>

                    <View style={styles.paceInputGroup}>
                        <TextInput
                            style={[styles.paceInput, dontKnow && styles.paceInputDisabled]}
                            keyboardType="number-pad"
                            maxLength={2}
                            value={dontKnow ? '--' : String(seconds).padStart(2, '0')}
                            onChangeText={(text) => {
                                setDontKnow(false);
                                setSeconds(Math.min(59, parseInt(text) || 0));
                            }}
                            editable={!dontKnow}
                        />
                        <Text style={styles.paceLabel}>seg</Text>
                    </View>

                    <Text style={styles.paceUnit}>/km</Text>
                </View>

                <TouchableOpacity
                    style={[styles.dontKnowButton, dontKnow && styles.dontKnowButtonActive]}
                    onPress={handleDontKnow}
                >
                    <Text style={[styles.dontKnowText, dontKnow && styles.dontKnowTextActive]}>
                        Não sei meu pace
                    </Text>
                </TouchableOpacity>
            </View>
        </QuizLayout>
    );
}

const styles = StyleSheet.create({
    paceContainer: {
        alignItems: 'center',
        paddingVertical: spacing['2xl'],
    },
    paceInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    paceInputGroup: {
        alignItems: 'center',
    },
    paceInput: {
        width: 80,
        height: 80,
        fontSize: 36,
        fontWeight: '700' as const,
        textAlign: 'center' as const,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: borderRadius.xl,
        color: colors.white,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    paceInputDisabled: {
        opacity: 0.5,
    },
    paceLabel: {
        fontSize: typography.fontSizes.sm,
        color: 'rgba(255, 255, 255, 0.5)',
        marginTop: spacing.xs,
    },
    paceSeparator: {
        fontSize: 48,
        fontWeight: '700' as const,
        color: colors.white,
        marginBottom: spacing.lg,
    },
    paceUnit: {
        fontSize: typography.fontSizes.xl,
        color: 'rgba(255, 255, 255, 0.5)',
        marginBottom: spacing.lg,
        marginLeft: spacing.sm,
    },
    dontKnowButton: {
        marginTop: spacing['2xl'],
        paddingVertical: spacing.md,
        paddingHorizontal: spacing['2xl'],
        borderRadius: borderRadius.xl,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    dontKnowButtonActive: {
        borderColor: colors.primary,
        backgroundColor: 'rgba(0, 212, 255, 0.1)',
    },
    dontKnowText: {
        fontSize: typography.fontSizes.md,
        color: 'rgba(255, 255, 255, 0.6)',
    },
    dontKnowTextActive: {
        color: colors.primary,
    },
});
