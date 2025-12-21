import { Injectable, Logger } from '@nestjs/common';

export interface StravaLoadData {
    acuteLoad: number;      // 7-day load
    chronicLoad: number;    // 28-day load
    acwr: number;           // Acute:Chronic Workload Ratio
    lastActivityDate: string;
    relativeEffort: number;
    loadStatus: 'Low' | 'Optimal' | 'High' | 'Critical';
}

@Injectable()
export class MockStravaService {
    private readonly logger = new Logger(MockStravaService.name);

    /**
     * Generate realistic mock Strava load data for development
     * ACWR ranges: 0.8-1.3 (optimal), <0.8 (undertrained), >1.5 (injury risk)
     */
    async getLoadData(userId: string): Promise<StravaLoadData> {
        this.logger.log(`Generating mock Strava data for user: ${userId}`);

        // Generate realistic random values
        const chronicLoad = this.randomInRange(200, 600); // TSS-like units
        const acuteLoad = chronicLoad * this.randomInRange(0.7, 1.6); // ACWR range
        const acwr = acuteLoad / chronicLoad;

        // Determine load status based on ACWR
        let loadStatus: StravaLoadData['loadStatus'];
        if (acwr < 0.8) {
            loadStatus = 'Low';
        } else if (acwr <= 1.3) {
            loadStatus = 'Optimal';
        } else if (acwr <= 1.5) {
            loadStatus = 'High';
        } else {
            loadStatus = 'Critical';
        }

        // Generate last activity date (1-3 days ago)
        const daysAgo = Math.floor(Math.random() * 3) + 1;
        const lastActivityDate = new Date();
        lastActivityDate.setDate(lastActivityDate.getDate() - daysAgo);

        const result: StravaLoadData = {
            acuteLoad: Math.round(acuteLoad),
            chronicLoad: Math.round(chronicLoad),
            acwr: Math.round(acwr * 100) / 100,
            lastActivityDate: lastActivityDate.toISOString().split('T')[0],
            relativeEffort: Math.floor(this.randomInRange(30, 80)),
            loadStatus,
        };

        this.logger.log(`Mock Strava data: ACWR=${result.acwr}, Status=${result.loadStatus}`);
        return result;
    }

    /**
     * Get a text description of the load for AI prompt
     */
    getLoadDescription(data: StravaLoadData): string {
        const statusDescriptions = {
            Low: 'Carga BAIXA - atleta pode estar subtreinado ou em recuperação prolongada',
            Optimal: 'Carga ÓTIMA - equilíbrio saudável entre treino e recuperação',
            High: 'Carga ELEVADA - risco moderado de fadiga acumulada',
            Critical: 'Carga CRÍTICA - alto risco de lesão por overtraining',
        };

        return `
ACWR (Acute:Chronic Workload Ratio): ${data.acwr}
Status: ${statusDescriptions[data.loadStatus]}
Carga Aguda (7 dias): ${data.acuteLoad}
Carga Crônica (28 dias): ${data.chronicLoad}
Esforço Relativo Médio: ${data.relativeEffort}
Última Atividade: ${data.lastActivityDate}
        `.trim();
    }

    private randomInRange(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }
}
