import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    Platform,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme';

// Questions bank for readiness quiz
const READINESS_QUESTIONS = [
    {
        id: 'sleep',
        question: 'Sua bateria carregou bem durante a noite',
        options: [
            { value: 5, label: '100% Full' },
            { value: 4, label: '75%' },
            { value: 3, label: '50%' },
            { value: 2, label: '25%' },
            { value: 1, label: '0%' },
        ],
    },
    {
        id: 'pain',
        question: 'Algum sinal de alerta nos músculos?',
        options: [
            { value: 5, label: 'Nenhuma dor' },
            { value: 4, label: 'Desconforto leve' },
            { value: 3, label: 'Dor moderada' },
            { value: 2, label: 'Dor significativa' },
            { value: 1, label: 'Muita dor' },
        ],
    },
    {
        id: 'energy',
        question: 'Quão leve você sente o corpo agora?',
        options: [
            { value: 5, label: 'Flutuando' },
            { value: 4, label: 'Leve' },
            { value: 3, label: 'Normal' },
            { value: 2, label: 'Pesado' },
            { value: 1, label: 'Muito pesado' },
        ],
    },
    {
        id: 'stress',
        question: 'Como está o peso das preocupações hoje?',
        options: [
            { value: 5, label: 'Muito leve' },
            { value: 4, label: 'Leve' },
            { value: 3, label: 'Moderado' },
            { value: 2, label: 'Pesado' },
            { value: 1, label: 'Esmagador' },
        ],
    },
    {
        id: 'motivation',
        question: 'Qual sua pressa para iniciar o treino?',
        options: [
            { value: 5, label: 'Máxima' },
            { value: 4, label: 'Alta' },
            { value: 3, label: 'Moderada' },
            { value: 2, label: 'Baixa' },
            { value: 1, label: 'Nenhuma' },
        ],
    },
];

interface ReadinessQuizScreenProps {
    navigation: any;
}

export function ReadinessQuizScreen({ navigation }: ReadinessQuizScreenProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});

    const currentQuestion = READINESS_QUESTIONS[currentStep];
    const totalSteps = READINESS_QUESTIONS.length;
    const progress = (currentStep + 1) / totalSteps;
    const selectedValue = answers[currentQuestion.id];

    const handleSelectOption = (value: number) => {
        setAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: value,
        }));
    };

    const handleContinue = () => {
        if (currentStep < totalSteps - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            // Navigate to analysis screen with answers
            navigation.navigate('ReadinessAnalysis', { answers });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0A0A14" />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Prontidão diária</Text>
                <Text style={styles.stepIndicator}>{currentStep + 1}/{totalSteps}</Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
                </View>
            </View>

            {/* Question Card */}
            <View style={styles.content}>
                <View style={styles.questionCard}>
                    <Text style={styles.question}>{currentQuestion.question}</Text>

                    {/* Options */}
                    <View style={styles.optionsContainer}>
                        {currentQuestion.options.map((option) => {
                            const isSelected = selectedValue === option.value;
                            return (
                                <TouchableOpacity
                                    key={option.value}
                                    style={[
                                        styles.optionCard,
                                        isSelected && styles.optionCardSelected,
                                    ]}
                                    onPress={() => handleSelectOption(option.value)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={[
                                        styles.optionLabel,
                                        isSelected && styles.optionLabelSelected,
                                    ]}>
                                        {option.label}
                                    </Text>
                                    <View style={[
                                        styles.radioOuter,
                                        isSelected && styles.radioOuterSelected,
                                    ]}>
                                        {isSelected && <View style={styles.radioInner} />}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            </View>

            {/* Continue Button */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[
                        styles.continueButton,
                        !selectedValue && styles.continueButtonDisabled,
                    ]}
                    onPress={handleContinue}
                    disabled={!selectedValue}
                >
                    <Text style={styles.continueButtonText}>Continuar</Text>
                    <View style={styles.arrowContainer}>
                        <Text style={styles.arrowText}>→</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0A14',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: spacing.sm,
    },
    headerTitle: {
        fontSize: typography.fontSizes.sm,
        color: 'rgba(255, 255, 255, 0.6)',
        fontWeight: '500',
    },
    stepIndicator: {
        fontSize: typography.fontSizes.sm,
        color: colors.primary,
        fontWeight: '600',
    },
    progressBarContainer: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.xl,
    },
    progressBar: {
        height: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 2,
        ...Platform.select({
            web: {
                backgroundImage: 'linear-gradient(90deg, #00D4FF, #00FFFF)',
            },
            default: {
                backgroundColor: colors.primary,
            },
        }),
    },
    content: {
        flex: 1,
        paddingHorizontal: spacing.lg,
    },
    questionCard: {
        backgroundColor: '#12121F',
        borderRadius: 24,
        padding: spacing.xl,
        paddingTop: spacing['2xl'],
    },
    question: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.white,
        textAlign: 'center',
        marginBottom: spacing['2xl'],
        lineHeight: 32,
    },
    optionsContainer: {
        gap: 34,
    },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#15152A',
        paddingVertical: 20,
        paddingHorizontal: spacing.lg,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    optionCardSelected: {
        borderColor: colors.primary,
        backgroundColor: 'rgba(0, 212, 255, 0.08)',
    },
    optionLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: 'rgba(255, 255, 255, 0.8)',
    },
    optionLabelSelected: {
        color: colors.primary,
    },
    radioOuter: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioOuterSelected: {
        borderColor: colors.primary,
        backgroundColor: colors.primary,
    },
    radioInner: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#0A0A14',
    },
    footer: {
        padding: spacing.lg,
        paddingBottom: Platform.OS === 'ios' ? spacing.xl : spacing.lg,
    },
    continueButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        paddingVertical: 18,
        borderRadius: 32,
        gap: spacing.sm,
    },
    continueButtonDisabled: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    continueButtonText: {
        fontSize: typography.fontSizes.md,
        fontWeight: '600',
        color: '#0A0A14',
    },
    arrowContainer: {
        marginLeft: spacing.xs,
    },
    arrowText: {
        fontSize: 18,
        color: '#0A0A14',
        fontWeight: '600',
    },
});

export default ReadinessQuizScreen;
