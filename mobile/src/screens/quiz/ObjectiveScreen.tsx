import React from 'react';
import { QuizLayout, OptionCard } from '../../components/QuizLayout';
import { useOnboardingStore } from '../../stores/onboardingStore';

const GOAL_OPTIONS = [
    { value: '5k', label: 'Correr 5K', description: 'Perfeito para iniciantes', icon: '🏃' },
    { value: '10k', label: 'Correr 10K', description: 'Desafio intermediário', icon: '🏃‍♂️' },
    { value: 'half_marathon', label: 'Meia Maratona', description: '21.1km - Grande conquista', icon: '🥇' },
    { value: 'marathon', label: 'Maratona', description: '42.2km - O desafio máximo', icon: '🏆' },
    { value: 'general_fitness', label: 'Condicionamento Geral', description: 'Melhorar saúde e fitness', icon: '💪' },
];

export function ObjectiveScreen({ navigation }: any) {
    const { data, updateData } = useOnboardingStore();

    const handleNext = () => {
        navigation.navigate('Quiz_Level');
    };

    return (
        <QuizLayout
            currentStep={1}
            totalSteps={6}
            title="Qual é o seu objetivo?"
            subtitle="Isso nos ajuda a criar o plano perfeito para você"
            onNext={handleNext}
            nextDisabled={!data.goal}
        >
            {GOAL_OPTIONS.map((option) => (
                <OptionCard
                    key={option.value}
                    icon={option.icon}
                    label={option.label}
                    description={option.description}
                    isSelected={data.goal === option.value}
                    onPress={() => updateData({ goal: option.value })}
                />
            ))}
        </QuizLayout>
    );
}
