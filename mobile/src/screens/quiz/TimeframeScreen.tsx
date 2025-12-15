import React from 'react';
import { QuizLayout, OptionCard } from '../../components/QuizLayout';
import { useOnboardingStore } from '../../stores/onboardingStore';

const TIMEFRAME_OPTIONS = [
    { value: 4, label: '4 semanas', description: 'Intensivo e focado', icon: '⚡' },
    { value: 8, label: '8 semanas', description: 'Progressão equilibrada', icon: '📈' },
    { value: 12, label: '12 semanas', description: 'Ideal para objetivos maiores', icon: '🎯' },
    { value: 16, label: '16+ semanas', description: 'Preparação completa', icon: '🏅' },
];

export function TimeframeScreen({ navigation, route }: any) {
    const { userId } = route.params || {};
    const { data, updateData } = useOnboardingStore();

    const handleNext = () => {
        navigation.navigate('Quiz_Limitations', { userId });
    };

    const handleBack = () => {
        navigation.goBack();
    };

    return (
        <QuizLayout
            currentStep={5}
            totalSteps={6}
            title="Em quantas semanas?"
            subtitle="Prazo para atingir seu objetivo"
            onNext={handleNext}
            onBack={handleBack}
            nextDisabled={!data.targetWeeks}
        >
            {TIMEFRAME_OPTIONS.map((option) => (
                <OptionCard
                    key={option.value}
                    icon={option.icon}
                    label={option.label}
                    description={option.description}
                    isSelected={data.targetWeeks === option.value}
                    onPress={() => updateData({ targetWeeks: option.value })}
                />
            ))}
        </QuizLayout>
    );
}
