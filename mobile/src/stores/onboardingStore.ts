import { create } from 'zustand';

interface OnboardingData {
    goal: string;
    level: string;
    daysPerWeek: number;
    currentPace5k: number | null;
    targetWeeks: number;
    limitations: string | null;
    preferredDays: number[];
}

interface OnboardingState {
    currentStep: number;
    data: Partial<OnboardingData>;
    isComplete: boolean;

    // Actions
    setStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;
    updateData: (data: Partial<OnboardingData>) => void;
    reset: () => void;
    complete: () => void;
}

const initialData: Partial<OnboardingData> = {
    goal: '',
    level: '',
    daysPerWeek: 3,
    currentPace5k: null,
    targetWeeks: 8,
    limitations: null,
    preferredDays: [],
};

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
    currentStep: 0,
    data: initialData,
    isComplete: false,

    setStep: (step) => set({ currentStep: step }),

    nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),

    prevStep: () => set((state) => ({
        currentStep: Math.max(0, state.currentStep - 1)
    })),

    updateData: (newData) => set((state) => ({
        data: { ...state.data, ...newData }
    })),

    reset: () => set({ currentStep: 0, data: initialData, isComplete: false }),

    complete: () => set({ isComplete: true }),
}));

// Onboarding questions config
export const onboardingQuestions = [
    {
        id: 'goal',
        title: 'Qual é o seu objetivo?',
        subtitle: 'Isso nos ajuda a personalizar seu plano',
        type: 'select' as const,
        options: [
            { value: '5k', label: 'Correr 5K', icon: '🏃' },
            { value: '10k', label: 'Correr 10K', icon: '🏃‍♂️' },
            { value: 'half_marathon', label: 'Meia Maratona', icon: '🏅' },
            { value: 'marathon', label: 'Maratona', icon: '🏆' },
            { value: 'general_fitness', label: 'Condicionamento Geral', icon: '💪' },
        ],
    },
    {
        id: 'level',
        title: 'Qual é o seu nível atual?',
        subtitle: 'Seja honesto para evitar lesões',
        type: 'select' as const,
        options: [
            { value: 'beginner', label: 'Iniciante', description: '0-6 meses de experiência', icon: '🌱' },
            { value: 'intermediate', label: 'Intermediário', description: '6-24 meses de experiência', icon: '🌿' },
            { value: 'advanced', label: 'Avançado', description: '2+ anos de experiência', icon: '🌳' },
        ],
    },
    {
        id: 'daysPerWeek',
        title: 'Quantos dias por semana?',
        subtitle: 'Quanto tempo você pode dedicar',
        type: 'slider' as const,
        min: 2,
        max: 6,
        unit: 'dias',
    },
    {
        id: 'currentPace5k',
        title: 'Qual seu pace atual em 5K?',
        subtitle: 'Deixe vazio se não sabe',
        type: 'pace' as const,
        optional: true,
    },
    {
        id: 'targetWeeks',
        title: 'Em quantas semanas?',
        subtitle: 'Prazo para atingir seu objetivo',
        type: 'select' as const,
        options: [
            { value: 4, label: '4 semanas' },
            { value: 8, label: '8 semanas' },
            { value: 12, label: '12 semanas' },
            { value: 16, label: '16 semanas' },
        ],
    },
    {
        id: 'limitations',
        title: 'Alguma limitação física?',
        subtitle: 'Lesões anteriores, problemas de saúde, etc.',
        type: 'text' as const,
        optional: true,
        placeholder: 'Ex: dor no joelho direito...',
    },
];
