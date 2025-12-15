import React from 'react';
import { QuizLayout, NumberSelector } from '../../components/QuizLayout';
import { useOnboardingStore } from '../../stores/onboardingStore';

export function FrequencyScreen({ navigation, route }: any) {
    const { userId } = route.params || {};
    const { data, updateData } = useOnboardingStore();

    const handleNext = () => {
        navigation.navigate('Quiz_Pace', { userId });
    };

    const handleBack = () => {
        navigation.goBack();
    };

    return (
        <QuizLayout
            currentStep={3}
            totalSteps={6}
            title="Quantos dias por semana?"
            subtitle="Quanto tempo você pode dedicar aos treinos"
            onNext={handleNext}
            onBack={handleBack}
        >
            <NumberSelector
                min={2}
                max={6}
                value={data.daysPerWeek || 3}
                onChange={(value) => updateData({ daysPerWeek: value })}
                unit="dias"
            />
        </QuizLayout>
    );
}
