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
        const systemPrompt = `Você é um treinador de corrida certificado com 15+ anos de experiência em periodização, fisiologia do exercício e prevenção de lesões.

Você cria planos de treino personalizados baseados em ciência esportiva, seguindo princípios de:
- Progressão gradual (máximo 10% aumento volume/semana)
- Recuperação adequada entre treinos intensos
- Periodização em fases (base → build → peak → taper)
- Prevenção de overtraining

IMPORTANTE: Você deve responder APENAS com um JSON válido, sem texto adicional antes ou depois.`;

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

        const userPrompt = `Crie um plano de treino personalizado com os seguintes parâmetros:

PERFIL DO CORREDOR:
- Objetivo: ${goalDescriptions[request.goal] || request.goal}
- Nível: ${levelDescriptions[request.level] || request.level}
- Frequência disponível: ${request.daysPerWeek} dias/semana
- Pace atual 5K: ${request.currentPace5k ? `${request.currentPace5k} min/km` : 'Não informado (iniciante)'}
- Prazo para objetivo: ${request.targetWeeks} semanas
- Dias preferidos: ${request.preferredDays.length > 0 ? request.preferredDays.map(d => ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][d]).join(', ') : 'Flexível'}
- Limitações/Lesões: ${request.limitations || 'Nenhuma'}

REGRAS PARA O PLANO:
1. Crie um plano de ${request.targetWeeks} semanas
2. ${request.daysPerWeek} treinos por semana
3. Inclua variedade: rodagem leve (60%), long run (20%), intervalados/tempo (20%)
4. Pace de recuperação: pace_5k + 1.5 min/km
5. Pace de rodagem leve: pace_5k + 0.5 a 1.0 min/km
6. Pace de long run: pace_5k + 0.5 min/km
7. Pace de intervalado: pace_5k - 0.5 min/km
8. Se iniciante sem pace, use 7:00 min/km como base

FORMATO DE RESPOSTA (JSON):
{
  "duration_weeks": ${request.targetWeeks},
  "frequency_per_week": ${request.daysPerWeek},
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

Responda APENAS com o JSON, sem explicações adicionais.`;

        try {
            this.logger.log('Generating training plan with Claude AI...');

            const message = await this.anthropic.messages.create({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 8000,
                system: systemPrompt,
                messages: [{ role: 'user', content: userPrompt }],
            });

            // Extract text content from response
            const textContent = message.content.find((block) => block.type === 'text');
            if (!textContent || textContent.type !== 'text') {
                throw new Error('No text content in AI response');
            }

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

        return JSON.parse(cleaned);
    }
}
