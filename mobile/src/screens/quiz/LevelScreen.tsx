import React from 'react';
import { QuizLayout, OptionCard } from '../../components/QuizLayout';
import { useOnboardingStore } from '../../stores/onboardingStore';

const LEVEL_OPTIONS = [
    {
        value: 'beginner',
        label: 'Iniciante',
        description: '0-6 meses de experiência',
        icon: '🌱'
    },
    {
        value: 'intermediate',
        label: 'Intermediário',
        description: '6-24 meses de experiência',
        icon: '🌿'
    },
    {
        value: 'advanced',
        label: 'Avançado',
        description: '2+ anos de experiência',
        icon: '🌳'
    },
];

export function LevelScreen({ navigation }: any) {
    const { data, updateData } = useOnboardingStore();

    const handleNext = () => {
        navigation.navigate('Quiz_Frequency');
    };

    const handleBack = () => {
        navigation.goBack();
    };

    return (
        <QuizLayout
            currentStep={2}
            totalSteps={6}
            title="Qual é o seu nível atual?"
            subtitle="Seja honesto para evitar lesões e maximizar resultados"
            onNext={handleNext}
            onBack={handleBack}
            nextDisabled={!data.level}
        >
            {LEVEL_OPTIONS.map((option) => (
                <OptionCard
                    key={option.value}
                    icon={option.icon}
                    label={option.label}
                    description={option.description}
                    isSelected={data.level === option.value}
                    onPress={() => updateData({ level: option.value })}
                />
            ))}
        </QuizLayout>
    );
}
