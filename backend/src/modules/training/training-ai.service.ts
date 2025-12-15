import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';

export interface TrainingPlanRequest {
    goal: string;
    level: string;
    daysPerWeek: number;
    currentPace5k: number | null;
    targetWeeks: number;
    limitations: string | null;
    preferredDays: number[];
}

// New interfaces for PlanPreview screen
export interface PlanHeader {
    objectiveShort: string;
    durationWeeks: string;
    frequencyWeekly: string;
}

export interface NextWorkout {
    title: string;
    duration: string;
    paceEstimate: string;
    type: string;
}

export interface WeekWorkout {
    day: number;
    type: string;
    title: string;
    distance_km: number;
    duration: string;
    pace: string;
}

export interface ScheduleWeek {
    week: number;
    focus: string;
    workouts: WeekWorkout[];
}

export interface GeneratedPlanPreview {
    planHeader: PlanHeader;
    planHeadline: string;
    welcomeBadge: string;
    nextWorkout: NextWorkout;
    fullSchedulePreview: ScheduleWeek[];
}

// Old interfaces for database storage (kept for compatibility)
export interface GeneratedWorkout {
    day_of_week: number;
    type: 'easy_run' | 'long_run' | 'intervals' | 'tempo' | 'recovery';
    distance_km: number;
    segments: Array<{
        type: 'warmup' | 'main' | 'cooldown';
        distance_km: number;
        pace_min: number;
        pace_max: number;
    }>;
    objective: string;
    tips: string[];
}

export interface GeneratedWeek {
    week_number: number;
    phase: 'base' | 'build' | 'peak' | 'taper';
    workouts: GeneratedWorkout[];
}

export interface GeneratedPlan {
    duration_weeks: number;
    frequency_per_week: number;
    weeks: GeneratedWeek[];
    // New fields for PlanPreview (returned directly from AI)
    planHeader?: PlanHeader;
    planHeadline?: string;
    welcomeBadge?: string;
    nextWorkout?: NextWorkout;
    fullSchedulePreview?: ScheduleWeek[];
}

@Injectable()
export class TrainingAIService {
    private readonly logger = new Logger(TrainingAIService.name);
    private anthropic: Anthropic;

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('ANTHROPIC_API_KEY');
        if (!apiKey) {
            throw new Error('ANTHROPIC_API_KEY is not configured');
        }
        this.anthropic = new Anthropic({ apiKey });
    }

    /**
     * Generate a personalized training plan using Claude AI
     */
    async generateTrainingPlan(request: TrainingPlanRequest): Promise<GeneratedPlan> {
        const systemPrompt = `Você é um treinador de corrida de elite da RunEasy. Sua tarefa é analisar o perfil do atleta baseado nas respostas do quiz e gerar um plano de treino estruturado.

REGRA CRÍTICA: Sua resposta deve ser APENAS um objeto JSON válido, sem nenhum texto antes ou depois, markdown ou explicações.

O JSON deve seguir estritamente este schema para renderizar a tela do aplicativo:

{
  "planHeader": {
    "objectiveShort": "String (ex: 10km)",
    "durationWeeks": "String (ex: 12 Sem)",
    "frequencyWeekly": "String (ex: 4x/Sem)"
  },
  "planHeadline": "String (ex: Personalizado para sua meta de 10km Sub-50' com base na sua performance.)",
  "welcomeBadge": "String (ex: Corredor Iniciante)",
  "nextWorkout": {
    "title": "String (ex: Rodagem Leve - 5 km)",
    "duration": "String (ex: 35 min)",
    "paceEstimate": "String (ex: Pace 5:30)",
    "type": "run"
  },
  "fullSchedulePreview": [
    {
      "week": 1,
      "focus": "Adaptação",
      "workouts": [
        {
          "day": 1,
          "type": "easy_run",
          "title": "Rodagem Leve",
          "distance_km": 5,
          "duration": "35 min",
          "pace": "7:00 min/km"
        }
      ]
    }
  ],
  "duration_weeks": 12,
  "frequency_per_week": 4,
  "weeks": [
    {
      "week_number": 1,
      "phase": "base",
      "workouts": [
        {
          "day_of_week": 1,
          "type": "easy_run",
          "distance_km": 5,
          "segments": [
            {"type": "warmup", "distance_km": 1, "pace_min": 7.0, "pace_max": 7.5},
            {"type": "main", "distance_km": 3, "pace_min": 6.5, "pace_max": 7.0},
            {"type": "cooldown", "distance_km": 1, "pace_min": 7.0, "pace_max": 7.5}
          ],
          "objective": "Desenvolver base aeróbica na Zona 2",
          "tips": ["Mantenha cadência entre 170-180 passos/min", "Respire naturalmente"]
        }
      ]
    }
  ]
}

REGRAS IMPORTANTES:
1. O campo "weeks" é usado para salvar no banco de dados
2. O campo "fullSchedulePreview" é uma versão simplificada para exibição na tela
3. Ambos devem ter o mesmo conteúdo, apenas em formatos diferentes
4. Tipos de treino válidos: easy_run, long_run, intervals, tempo, recovery
5. Fases válidas: base, build, peak, taper`;

        const goalDescriptions: Record<string, string> = {
            '5k': 'Completar/melhorar tempo em prova de 5km',
            '10k': 'Completar/melhorar tempo em prova de 10km',
            'half_marathon': 'Completar/melhorar tempo em meia maratona (21.1km)',
            'marathon': 'Completar/melhorar tempo em maratona (42.2km)',
            'general_fitness': 'Melhorar condicionamento físico geral para corrida',
        };

        const levelDescriptions: Record<string, string> = {
            'beginner': 'Iniciante (0-6 meses de experiência)',
            'intermediate': 'Intermediário (6-24 meses de experiência)',
            'advanced': 'Avançado (2+ anos de experiência)',
        };

        const goalLabels: Record<string, string> = {
            '5k': '5km',
            '10k': '10km',
            'half_marathon': 'Meia Maratona',
            'marathon': 'Maratona',
            'general_fitness': 'Fitness',
        };

        const levelLabels: Record<string, string> = {
            'beginner': 'Corredor Iniciante',
            'intermediate': 'Corredor Intermediário',
            'advanced': 'Corredor Avançado',
        };

        const userPrompt = `Crie um plano de treino personalizado com os seguintes parâmetros:

PERFIL DO CORREDOR (Quiz Responses):
P1. Objetivo: ${goalDescriptions[request.goal] || request.goal}
P2. Nível: ${levelDescriptions[request.level] || request.level}
P3. Frequência disponível: ${request.daysPerWeek} dias/semana
P4. Pace atual 5K: ${request.currentPace5k ? `${request.currentPace5k.toFixed(2)} min/km` : 'Não sei (iniciante)'}
P5. Prazo para objetivo: ${request.targetWeeks} semanas
P6. Limitações/Lesões: ${request.limitations || 'Nenhuma'}

VALORES PARA O JSON:
- objectiveShort: "${goalLabels[request.goal] || request.goal}"
- durationWeeks: "${request.targetWeeks} Sem"
- frequencyWeekly: "${request.daysPerWeek}x/Sem"
- welcomeBadge: "${levelLabels[request.level] || 'Corredor'}"

REGRAS PARA O PLANO:
1. Crie um plano de ${request.targetWeeks} semanas
2. ${request.daysPerWeek} treinos por semana
3. Inclua variedade: rodagem leve (60%), long run (20%), intervalados/tempo (20%)
4. Pace de recuperação: pace_5k + 1.5 min/km
5. Pace de rodagem leve: pace_5k + 0.5 a 1.0 min/km
6. Pace de long run: pace_5k + 0.5 min/km
7. Pace de intervalado: pace_5k - 0.5 min/km
8. Se iniciante sem pace, use 7:00 min/km como base
9. Divida em fases: base (40%), build (30%), peak (20%), taper (10%)
${request.limitations ? `10. IMPORTANTE: Adapte o plano considerando a limitação: ${request.limitations}` : ''}

Responda APENAS com o JSON, sem explicações adicionais.`;

        try {
            this.logger.log('Generating training plan with Claude AI...');
            this.logger.log(`Request params: goal=${request.goal}, level=${request.level}, weeks=${request.targetWeeks}, daysPerWeek=${request.daysPerWeek}`);

            const message = await this.anthropic.messages.create({
                model: 'claude-sonnet-4-5-20250929',
                max_tokens: 20000,
                temperature: 1,
                system: systemPrompt,
                messages: [{ role: 'user', content: userPrompt }],
            });

            // Extract text content from response
            const textContent = message.content.find((block) => block.type === 'text');
            if (!textContent || textContent.type !== 'text') {
                throw new Error('No text content in AI response');
            }

            this.logger.log('Received AI response, parsing JSON...');

            // Parse JSON from response
            const plan = this.extractJSON(textContent.text);

            this.logger.log(`Generated plan with ${plan.weeks?.length || 0} weeks`);
            return plan;
        } catch (error) {
            this.logger.error('Failed to generate training plan', error);
            throw error;
        }
    }

    /**
     * Extract JSON from text that might contain markdown code blocks
     */
    private extractJSON(text: string): GeneratedPlan {
        // Remove markdown code blocks if present
        let cleaned = text.trim();
        if (cleaned.startsWith('```json')) {
            cleaned = cleaned.slice(7);
        } else if (cleaned.startsWith('```')) {
            cleaned = cleaned.slice(3);
        }
        if (cleaned.endsWith('```')) {
            cleaned = cleaned.slice(0, -3);
        }
        cleaned = cleaned.trim();

        try {
            return JSON.parse(cleaned);
        } catch (parseError) {
            this.logger.error('Failed to parse JSON from AI response:', cleaned.substring(0, 500));
            throw new Error(`Invalid JSON in AI response: ${parseError}`);
        }
    }
}
