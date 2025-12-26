import { create } from 'zustand';
import { getAuthenticatedUserId, getSessionToken } from '../services/supabase';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

interface OnboardingData {
    goal: string;
    level: string;
    daysPerWeek: number;
    currentPace5k: number | null;
    targetWeeks: number;
    limitations: string | null;
    preferredDays: number[];
}

// Generated plan result from AI
export interface GeneratedPlanResult {
    plan_id: string;
    workouts_count: number;
    planHeader: {
        objectiveShort: string;
        durationWeeks: string;
        frequencyWeekly: string;
    };
    planHeadline: string;
    welcomeBadge: string;
    nextWorkout: {
        title: string;
        duration: string;
        paceEstimate: string;
        type: string;
    };
    fullSchedulePreview: Array<{
        week: number;
        focus: string;
        workouts: Array<{
            day: number;
            type: string;
            title: string;
            distance_km: number;
            duration: string;
            pace: string;
        }>;
    }>;
}

// Error codes for handling in UI
export const ONBOARDING_ERRORS = {
    AUTH_REQUIRED: 'AUTH_REQUIRED',
    API_ERROR: 'API_ERROR',
    NETWORK_ERROR: 'NETWORK_ERROR',
} as const;

interface OnboardingState {
    currentStep: number;
    data: Partial<OnboardingData>;
    isComplete: boolean;
    isGenerating: boolean;
    generatedPlan: GeneratedPlanResult | null;
    error: string | null;
    errorCode: string | null;

    // Actions
    setStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;
    updateData: (data: Partial<OnboardingData>) => void;
    reset: () => void;
    complete: () => void;
    submitOnboarding: () => Promise<GeneratedPlanResult | null>;
    clearError: () => void;
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
    isGenerating: false,
    generatedPlan: null,
    error: null,
    errorCode: null,

    setStep: (step) => set({ currentStep: step }),

    nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),

    prevStep: () => set((state) => ({
        currentStep: Math.max(0, state.currentStep - 1)
    })),

    updateData: (newData) => set((state) => ({
        data: { ...state.data, ...newData }
    })),

    reset: () => set({
        currentStep: 0,
        data: initialData,
        isComplete: false,
        isGenerating: false,
        generatedPlan: null,
        error: null,
        errorCode: null,
    }),

    complete: () => set({ isComplete: true }),

    clearError: () => set({ error: null, errorCode: null }),

    submitOnboarding: async () => {
        const { data } = get();

        set({ isGenerating: true, error: null, errorCode: null });

        try {
            // Get the authenticated user ID and session token
            const userId = await getAuthenticatedUserId();
            const token = await getSessionToken();

            // If user is not authenticated, stop and require login
            if (!userId || !token) {
                set({
                    error: 'Você precisa fazer login para gerar seu plano de treino.',
                    errorCode: ONBOARDING_ERRORS.AUTH_REQUIRED,
                    isGenerating: false
                });
                return null;
            }

            const response = await fetch(`${API_URL}/training/onboarding`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': userId,
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    goal: data.goal || '10k',
                    level: data.level || 'beginner',
                    days_per_week: data.daysPerWeek || 3,
                    current_pace_5k: data.currentPace5k,
                    target_weeks: data.targetWeeks || 8,
                    limitations: data.limitations,
                    preferred_days: data.preferredDays || [],
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to generate training plan');
            }

            const result: GeneratedPlanResult = await response.json();

            set({
                generatedPlan: result,
                isComplete: true,
                isGenerating: false,
            });

            return result;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            set({ error: errorMessage, isGenerating: false });
            console.error('Onboarding submission error:', error);
            return null;
        }
    },
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
