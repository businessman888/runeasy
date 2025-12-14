# RunEasy - Planejamento de Desenvolvimento do Aplicativo

**Data:** Dezembro 2025  
**Versão:** 1.0  
**Metodologias:** Lean Inception + Scrum + Lean Development  
**Status:** Para Validação

---

## 1. SUMÁRIO EXECUTIVO

### 1.1 Visão Geral do Projeto

**Produto:** RunEasy - Ecossistema completo para corredores com treinador IA personalizado  
**MVP Timeline:** 16 semanas (4 meses) - 8 sprints de 2 semanas  
**Equipe Recomendada:** 1 Full-Stack Developer + 1 Product Owner (você)  
**Budget Estimado MVP:** USD 15.000 - 25.000 (desenvolvimento + infraestrutura inicial)

### 1.2 Arquitetura Técnica Consolidada

**Frontend:**
- React Native 0.73+ (cross-platform iOS + Android)
- TypeScript
- React Navigation 6+
- Zustand (state management - mais leve que Redux)
- React Native Maps (visualização de rotas)

**Backend:**
- NestJS 10+ (TypeScript, modular, escalável)
- Supabase (PostgreSQL + Auth + Storage + Realtime)
- Anthropic Claude API (Sonnet 4.5 para MVP)

**Integrações Principais:**
- Strava API (OAuth + Webhooks para atividades)
- GCP Vertex AI (Fase 2 - análise de vídeo)

**Infraestrutura:**
- Supabase Cloud (managed PostgreSQL + Auth)
- Vercel/Railway (deploy NestJS backend)
- Expo EAS Build (build e distribuição mobile)

---

## 2. ARQUITETURA TÉCNICA DETALHADA

### 2.1 Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                     MOBILE APP (React Native)                │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐   │
│  │   Home/     │  │  Onboarding │  │  Strava OAuth    │   │
│  │  Calendar   │  │   Flow      │  │  Integration     │   │
│  └─────────────┘  └─────────────┘  └──────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          Zustand State Management                     │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS/REST
                       ▼
┌─────────────────────────────────────────────────────────────┐
│               BACKEND API (NestJS)                           │
│  ┌──────────────┐  ┌───────────────┐  ┌────────────────┐  │
│  │   Auth       │  │   Strava      │  │   Training     │  │
│  │   Module     │  │   Webhook     │  │   AI Module    │  │
│  └──────────────┘  └───────────────┘  └────────────────┘  │
│  ┌──────────────┐  ┌───────────────┐  ┌────────────────┐  │
│  │ Gamification │  │   Analytics   │  │   Notifications│  │
│  │   Module     │  │   Module      │  │   Module       │  │
│  └──────────────┘  └───────────────┘  └────────────────┘  │
└──────────────┬──────────────┬───────────────────────────────┘
               │              │
               ▼              ▼
    ┌──────────────────┐  ┌─────────────────┐
    │   Supabase       │  │  Anthropic      │
    │  - PostgreSQL    │  │  Claude API     │
    │  - Auth          │  │  (Sonnet 4.5)   │
    │  - Storage       │  │                 │
    │  - Realtime      │  └─────────────────┘
    └──────────────────┘
               │
               ▼
    ┌──────────────────┐
    │   Strava API     │
    │  - OAuth 2.0     │
    │  - Webhooks      │
    │  - Activities    │
    └──────────────────┘
```

### 2.2 Stack Técnica Justificada

#### **Frontend: React Native**

**Decisão:** React Native CLI (não Expo Managed Workflow)

**Justificativa:**
- Cross-platform (iOS + Android) com único codebase
- Necessário acesso a módulos nativos (GPS, notificações push, background tasks)
- Expo Managed Workflow limitado para background location tracking
- Performance adequada para app de fitness
- Ecossistema maduro: @react-native-community/geolocation, react-native-maps

**Bibliotecas Principais:**
```
react-native: 0.73+
typescript: 5.3+
@react-navigation/native: 6+ (navegação)
zustand: 4+ (state management - 3kb vs Redux 15kb)
@react-native-community/geolocation: GPS tracking
react-native-maps: visualização de mapas
axios: HTTP client
react-native-push-notification: push notifications
@react-native-async-storage/async-storage: cache local
```

**Por que Zustand sobre Redux:**
- 85% menor (3kb vs 15kb gzipped)
- Zero boilerplate
- TypeScript nativo
- Performance superior (sem re-renders desnecessários)
- Suficiente para MVP (Redux se necessário em escala)

---

#### **Backend: NestJS**

**Justificativa:**
- TypeScript end-to-end (mesmo language stack frontend/backend)
- Arquitetura modular (modules, controllers, services)
- Dependency injection nativo
- Swagger/OpenAPI out-of-the-box
- Suporte robusto a Supabase, webhooks, cron jobs
- Escalável (microservices se necessário futuro)

**Estrutura de Módulos MVP:**
```
src/
├── auth/                 # Autenticação Supabase
├── strava/              # Integração Strava (OAuth + Webhooks)
├── training/            # Lógica de treinos e IA
├── gamification/        # Sistema de níveis, pontos, badges
├── analytics/           # Métricas e relatórios
├── notifications/       # Push notifications
├── database/            # Supabase client setup
└── common/              # Guards, decorators, utils
```

---

#### **Database: Supabase**

**Decisão:** Supabase Cloud (managed service)

**Justificativa:**
- PostgreSQL robusto (melhor que Firebase Realtime DB para queries complexas)
- Row Level Security (RLS) nativo
- Auth integrado (OAuth, JWT, email/password)
- Storage para vídeos (Fase 2)
- Realtime subscriptions (útil para notificações)
- Edge Functions (serverless functions se necessário)
- Webhooks nativos
- Custo inicial baixo (Free tier: 500MB database, 1GB storage, 2GB bandwidth)

**Schema Principal (MVP):**
```sql
-- Users (gerenciado por Supabase Auth)
users (
  id uuid PRIMARY KEY,
  email text UNIQUE,
  created_at timestamptz,
  strava_athlete_id bigint UNIQUE,
  strava_access_token text,
  strava_refresh_token text,
  strava_token_expires_at timestamptz
)

-- Training Plans
training_plans (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users(id),
  created_at timestamptz,
  goal text, -- "5K", "10K", "Meia", "Maratona"
  weeks int,
  plan_json jsonb, -- estrutura do plano
  status text -- "active", "completed", "paused"
)

-- Workouts (treinos planejados)
workouts (
  id uuid PRIMARY KEY,
  plan_id uuid REFERENCES training_plans(id),
  user_id uuid REFERENCES users(id),
  scheduled_date date,
  type text, -- "easy_run", "intervals", "long_run", "recovery"
  instructions jsonb, -- {distance: 10, pace_min: "5:30", pace_max: "6:00"}
  status text, -- "pending", "completed", "skipped"
  strava_activity_id bigint UNIQUE
)

-- Strava Activities (dados importados)
strava_activities (
  id bigint PRIMARY KEY, -- strava activity ID
  user_id uuid REFERENCES users(id),
  workout_id uuid REFERENCES workouts(id) NULLABLE,
  name text,
  type text,
  start_date timestamptz,
  distance float, -- metros
  moving_time int, -- segundos
  elapsed_time int,
  average_pace float, -- min/km
  max_pace float,
  elevation_gain float,
  calories float,
  raw_data jsonb, -- dados completos do Strava
  created_at timestamptz
)

-- AI Feedback (análise pós-treino)
ai_feedbacks (
  id uuid PRIMARY KEY,
  workout_id uuid REFERENCES workouts(id),
  strava_activity_id bigint REFERENCES strava_activities(id),
  user_id uuid REFERENCES users(id),
  feedback_text text, -- análise completa da IA
  strengths jsonb, -- ["Pace consistente", "Disciplina na distância"]
  improvements jsonb, -- ["Considerar aquecimento mais longo"]
  metrics_comparison jsonb, -- planejado vs executado
  generated_at timestamptz
)

-- Gamification: User Levels
user_levels (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users(id) UNIQUE,
  current_level int DEFAULT 1,
  total_points int DEFAULT 0,
  performance_score float, -- 0-100
  consistency_score float, -- 0-100
  adherence_score float, -- 0-100 (aderência ao plano)
  best_5k_pace float NULLABLE,
  best_10k_pace float NULLABLE,
  updated_at timestamptz
)

-- Badges
badges (
  id uuid PRIMARY KEY,
  name text UNIQUE,
  description text,
  icon_url text,
  type text, -- "achievement", "streak", "milestone"
  criteria jsonb -- condições para conquistar
)

-- User Badges
user_badges (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users(id),
  badge_id uuid REFERENCES badges(id),
  earned_at timestamptz,
  UNIQUE(user_id, badge_id)
)

-- Points History
points_history (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users(id),
  points int,
  reason text, -- "Treino completado", "Badge conquistado"
  reference_id uuid, -- workout_id ou badge_id
  created_at timestamptz
)
```

**Row Level Security (RLS) Policies:**
```sql
-- Exemplo: Users só veem seus próprios dados
ALTER TABLE training_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own training plans"
ON training_plans FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own training plans"
ON training_plans FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Replicar para todas as tabelas user-scoped
```

---

#### **IA: Anthropic Claude API**

**Modelo Escolhido:** Claude Sonnet 4.5

**Justificativa:**
- **Custo:** USD 3/MTok input, USD 15/MTok output (vs Opus 4.5: USD 5/25)
- **Performance:** Suficiente para análise de treinos e coaching conversacional
- **Context Window:** 200K tokens (1M disponível para >200K, mas não necessário MVP)
- **Multimodal:** Suporte a imagens (útil Fase 2 para análise de vídeo/screenshots)

**Estimativa de Custo MVP:**
```
Caso de Uso: Feedback Pós-Treino
- Input: ~2K tokens (dados da atividade + histórico + plano)
- Output: ~500 tokens (feedback detalhado)
- Total por feedback: ~2.5K tokens
- Custo por feedback: USD 0.01

3.200 usuários pagantes × 12 treinos/mês = 38.400 feedbacks/mês
Custo mensal IA: USD 384/mês (0,3% da receita projetada)

Caso de Uso: Criação de Plano de Treino
- Input: ~3K tokens (perfil usuário + objetivos)
- Output: ~1.5K tokens (plano estruturado 8-12 semanas)
- Custo por plano: USD 0.03

3.200 usuários × 1 plano/mês = 3.200 planos
Custo mensal criação planos: USD 96/mês

TOTAL CUSTO IA MVP: ~USD 480/mês (Year 1)
```

**Prompt Engineering Strategy:**
- Prompt caching (5-min cache: 1.25x write, 0.1x read)
- System prompts reutilizáveis (perfil do treinador, tom, estrutura)
- Batch similar requests quando possível

---

#### **Integrações**

**Strava API:**
- **OAuth 2.0:** Autenticação de usuários
- **Webhooks:** Notificação em tempo real de novas atividades
- **Rate Limits:** 200 req/15min, 2.000 req/dia
- **Custo:** Gratuito

**Estratégia de Webhooks:**
```typescript
// NestJS Strava Webhook Controller
@Controller('webhooks/strava')
export class StravaWebhookController {
  
  // Verificação inicial do webhook (GET)
  @Get()
  verifyWebhook(@Query() query: any) {
    const mode = query['hub.mode'];
    const token = query['hub.verify_token'];
    const challenge = query['hub.challenge'];
    
    if (mode === 'subscribe' && token === process.env.STRAVA_VERIFY_TOKEN) {
      return { 'hub.challenge': challenge };
    }
    throw new ForbiddenException();
  }

  // Receber eventos (POST)
  @Post()
  async handleWebhookEvent(@Body() event: StravaWebhookEvent) {
    // Event types: "create", "update", "delete"
    // Object types: "activity", "athlete"
    
    if (event.object_type === 'activity' && event.aspect_type === 'create') {
      // Enfileirar job assíncrono para processar atividade
      await this.trainingQueue.add('process-activity', {
        athleteId: event.owner_id,
        activityId: event.object_id,
      });
    }
    
    return { status: 'ok' };
  }
}
```

---

### 2.3 Segurança e Compliance

#### **Autenticação e Autorização**

**Supabase Auth:**
- JWT tokens (access + refresh)
- Row Level Security (RLS) no PostgreSQL
- OAuth social login (Strava)

**NestJS Guards:**
```typescript
// Supabase Auth Guard
@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split('Bearer ')[1];
    
    if (!token) return false;
    
    const { data: user, error } = await supabaseClient.auth.getUser(token);
    if (error || !user) return false;
    
    request.user = user;
    return true;
  }
}

// Uso
@UseGuards(SupabaseAuthGuard)
@Get('profile')
getProfile(@Request() req) {
  return req.user;
}
```

#### **Proteção de Dados Sensíveis**

**Variáveis de Ambiente (.env):**
```
# Supabase
SUPABASE_URL=https://xyz.supabase.co
SUPABASE_ANON_KEY=eyJ... (public)
SUPABASE_SERVICE_ROLE_KEY=eyJ... (secret - backend only)

# Strava
STRAVA_CLIENT_ID=12345
STRAVA_CLIENT_SECRET=abc...
STRAVA_VERIFY_TOKEN=RANDOM_STRING

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# App
JWT_SECRET=random_32_char_string
NODE_ENV=production
PORT=3000
```

**Encrypted at Rest:**
- Supabase encrypts database automaticamente (AES-256)
- Strava tokens encrypted antes de salvar no DB

**HTTPS Obrigatório:**
- Toda comunicação via TLS 1.2+
- Vercel/Railway enforce HTTPS por padrão

#### **LGPD/GDPR Compliance**

**Dados Coletados:**
- Email, nome (do Strava OAuth)
- Dados de atividades (distância, pace, tempo)
- Localização (apenas durante treino, não em background contínuo)

**Direitos do Usuário:**
```typescript
// Endpoint: Exportar dados
@Get('user/export')
async exportUserData(@User() user) {
  const data = await this.userService.exportAllData(user.id);
  return { 
    format: 'json',
    data: data,
    generated_at: new Date()
  };
}

// Endpoint: Deletar conta
@Delete('user/account')
async deleteAccount(@User() user) {
  // Soft delete (manter 30 dias para rollback)
  await this.userService.softDelete(user.id);
  await this.stravaService.revokeAccess(user.strava_athlete_id);
  return { message: 'Conta agendada para exclusão em 30 dias' };
}
```

**Termos de Uso e Privacidade:**
- Link obrigatório no onboarding
- Opt-in explícito para coleta de dados

---

## 3. LEAN INCEPTION - PRODUCT VISION

### 3.1 Product Vision Canvas

**Para:** Corredores iniciantes e intermediários (20-35 anos) no Brasil  
**Cujo:** Precisam de orientação estruturada e feedback inteligente nos treinos  
**O RunEasy é:** Um aplicativo mobile de corrida com treinador IA  
**Que:** Cria planos personalizados, analisa cada treino e gamifica a evolução  
**Diferente de:** Strava (só tracking), Nike Run Club (coaching genérico), Runna (caro)  
**Nosso produto:** Une inteligência artificial conversacional + gamificação robusta + integração Strava

### 3.2 É / Não É / Faz / Não Faz

**É:**
- Treinador pessoal de corrida acessível
- Plataforma de feedback pós-treino inteligente
- Sistema de gamificação motivacional
- Integrador do Strava (não substituto)

**Não É:**
- GPS tracker nativo (MVP depende do Strava)
- Rede social de corrida (Fase 2)
- App para corredores elite/profissionais
- Personal trainer presencial

**Faz:**
- Cria planos de treino personalizados com IA
- Analisa treinos completados vs planejados
- Calcula nível do corredor (gamificação)
- Recompensa com badges e pontos
- Envia notificações de motivação

**Não Faz:**
- Tracking GPS próprio (usa Strava)
- Análise biomecânica de vídeo (Fase 2)
- Conectar corredores (rede social - Fase 2)
- Recomendar eventos específicos (Fase 2)

### 3.3 Personas e Jornadas

**Persona 1: Carlos, 28 anos, Millennial**
- Profissional de TI, renda BRL 8k/mês
- Corre 3x/semana há 6 meses
- Usa Strava, mas não sabe se está evoluindo bem
- Quer completar primeira meia maratona em 6 meses
- Frustração: planos genéricos da internet não funcionam
- Motivação: dados, progresso visível, conquistas

**Jornada Carlos:**
1. Descobre RunEasy via anúncio Instagram
2. Baixa app, conecta Strava
3. Responde questionário onboarding (nível, objetivo)
4. IA cria plano personalizado 8 semanas → meia maratona
5. Vê calendário visual com treinos da semana
6. Completa treino no Strava → RunEasy notifica "Análise pronta!"
7. Recebe feedback detalhado: "Pace 4% acima do planejado, excelente consistência"
8. Ganha 50 pontos, sobe para Nível 3
9. Compartilha badge "Primeira Semana Completa" no Instagram
10. Renova subscription após trial

---

**Persona 2: Júlia, 23 anos, Gen Z**
- Estudante universitária, renda limitada
- Sedentária tentando criar hábito de corrida
- Acha corrida "chata", precisa de gamificação
- Usa TikTok, Instagram 4h/dia
- Motivação: estética, redes sociais, achievements

**Jornada Júlia:**
1. Vê TikTok de influencer usando RunEasy
2. Baixa app (freemium), conecta Strava
3. IA cria plano iniciante (3x semana, 20min cada)
4. Completa primeiro treino → ganha badge "Primeiro Passo"
5. Vê nível subir (progress bar visual)
6. Compartilha achievement no Instagram Stories
7. Usa app free por 2 meses, converte para premium por FOMO de badges exclusivos

---

### 3.4 Funcionalidades (Priorização MoSCoW)

#### **MUST HAVE (MVP):**
1. Autenticação via Strava OAuth
2. Onboarding + Questionário Inicial (IA)
3. Criação de Plano de Treino Personalizado (IA)
4. Calendário Visual de Treinos
5. Integração Strava Webhooks (atividades)
6. Análise Pós-Treino com IA (feedback detalhado)
7. Sistema de Níveis e Pontos
8. Badges Básicos (5-10 badges MVP)
9. Home Screen (nível, próximo treino, última atividade)
10. Notificações Push (análise pronta, motivação)

#### **SHOULD HAVE (Fase 1.5 - pós-MVP):**
11. Histórico de Treinos e Progresso
12. Gráficos de Evolução (pace, distância, consistência)
13. Ajuste de Plano pela IA (baseado em performance)
14. Mais Badges (20+ badges)
15. Sistema de Streaks (dias consecutivos)

#### **COULD HAVE (Fase 2):**
16. Análise de Movimentos (vídeo + GCP Vertex AI)
17. Recomendação de Eventos (matching inteligente)
18. Conexão com Corredores (perfis, seguir)
19. Grupos de Corrida (descoberta)
20. Tracking GPS Nativo (reduzir dependência Strava)

#### **WON'T HAVE (Fora de Escopo):**
- Marketplace de produtos de corrida
- Nutrição e dietas
- Treinos de outras modalidades (ciclismo, natação)
- Coach humano ao vivo

---

## 4. ROADMAP DE DESENVOLVIMENTO (16 SEMANAS)

### 4.1 Overview Sprints

**Metodologia:** Scrum com sprints de 2 semanas  
**Total:** 8 Sprints = 16 semanas = 4 meses  
**Equipe:** 1 Full-Stack Developer + 1 PO (você)  
**Velocity:** 40 story points/sprint (assumindo dev experiente)

```
Sprint 1-2: Foundation (Auth + Infraestrutura)
Sprint 3-4: Core AI (Treinador + Strava Integration)
Sprint 5-6: Gamification + Feedback Loop
Sprint 7: Polish + Testing
Sprint 8: Beta Launch + Ajustes
```

---

### 4.2 Sprint 1 (Semanas 1-2): Foundation

**Objetivo:** Configurar infraestrutura completa e autenticação

**User Stories:**

**US1.1 - Setup Inicial (8 pts)**
- Como desenvolvedor, quero configurar repositório Git, CI/CD e ambientes
- **Tasks:**
  - Setup monorepo (backend NestJS + mobile React Native)
  - Configure GitHub Actions (lint, test, build)
  - Setup Supabase project (dev + prod)
  - Configure variáveis de ambiente
  - **Acceptance:** Pipeline CI/CD funcional, deploys automáticos

**US1.2 - Autenticação Supabase (13 pts)**
- Como usuário, quero criar conta via email ou Strava para acessar o app
- **Tasks:**
  - Implement Supabase Auth no backend (NestJS guards)
  - Implement Strava OAuth flow completo (authorize → callback → tokens)
  - Store Strava tokens encrypted no Supabase
  - Implement token refresh automático
  - Telas mobile: Splash, Login, OAuth callback
  - **Acceptance:** Usuário consegue autenticar via Strava, tokens salvos, auto-refresh funcional

**US1.3 - Database Schema MVP (8 pts)**
- Como desenvolvedor, quero schema completo para desenvolvimento ágil
- **Tasks:**
  - Create todas as tabelas (users, training_plans, workouts, etc.)
  - Implement Row Level Security policies
  - Seed initial data (badges, níveis)
  - Create migrations Supabase
  - **Acceptance:** Schema deployado, RLS testado, seeds executados

**US1.4 - Navigation Básica (5 pts)**
- Como usuário, quero navegar entre telas principais
- **Tasks:**
  - Setup React Navigation (stack + tab)
  - Telas placeholder: Home, Calendar, Profile
  - Bottom tab navigator
  - **Acceptance:** Navegação funcional entre telas

**US1.5 - UI Foundation (6 pts)**
- Como desenvolvedor, quero design system reutilizável
- **Tasks:**
  - Create componentes base (Button, Input, Card, Typography)
  - Define paleta de cores (dark theme, futurista, clean)
  - Setup fonts (Inter, Poppins)
  - **Acceptance:** Componentes funcionais, design consistente

**Total Sprint 1: 40 story points**

**Entrega Sprint 1:**
- Autenticação funcional (Strava OAuth)
- Database schema completo
- Navegação básica
- CI/CD configurado

---

### 4.3 Sprint 2 (Semanas 3-4): Onboarding + IA Setup

**Objetivo:** Fluxo de onboarding completo e primeira integração com Claude

**US2.1 - Onboarding Flow (13 pts)**
- Como novo usuário, quero responder questionário para IA me conhecer
- **Tasks:**
  - Tela Welcome (intro RunEasy)
  - Tela Questionário (multi-step form):
    - Experiência (iniciante, intermediário)
    - Objetivo (5K, 10K, meia, maratona, fitness geral)
    - Disponibilidade (dias/semana)
    - Ritmo atual (se aplicável)
    - Lesões/limitações (optional)
  - Validação e salvar respostas
  - **Acceptance:** Usuário completa onboarding, dados salvos no DB

**US2.2 - Integração Claude API (8 pts)**
- Como desenvolvedor, quero serviço robusto de comunicação com Claude
- **Tasks:**
  - Create ClaudeService no NestJS
  - Implement retry logic (exponential backoff)
  - Implement prompt caching strategy
  - Error handling e logging
  - **Acceptance:** Serviço funcional, rate limits respeitados, caching ativo

**US2.3 - Criação de Plano de Treino (IA) (13 pts)**
- Como usuário, quero que IA crie meu plano personalizado após onboarding
- **Tasks:**
  - Design prompt sistema (treinador especialista)
  - Implement função generateTrainingPlan()
  - Parse resposta IA → structured JSON
  - Salvar plano no DB (training_plans + workouts)
  - Loading state elegante (3-5 segundos)
  - **Acceptance:** IA gera plano 8-12 semanas, salvo no DB, estruturado corretamente

**US2.4 - Visualização de Plano (6 pts)**
- Como usuário, quero ver overview do meu plano criado
- **Tasks:**
  - Tela "Seu Plano" (summary: objetivo, semanas, treinos/semana)
  - Lista de semanas (collapsible)
  - Detalhes de treino (tipo, distância, pace sugerido)
  - **Acceptance:** Usuário visualiza plano completo

**Total Sprint 2: 40 story points**

**Entrega Sprint 2:**
- Onboarding completo funcional
- IA cria plano personalizado
- Plano visualizado no app

---

### 4.4 Sprint 3 (Semanas 5-6): Strava Webhooks + Home

**Objetivo:** Integração Strava completa e Home Screen funcional

**US3.1 - Strava Webhook Setup (13 pts)**
- Como sistema, quero receber notificações de novas atividades em tempo real
- **Tasks:**
  - Create webhook endpoint NestJS (GET + POST)
  - Subscribe webhook Strava (via curl/script)
  - Implement verification challenge
  - Implement event handling (create, update, delete)
  - Queue system (BullMQ ou similar) para processar async
  - **Acceptance:** Webhook verificado, eventos recebidos, processamento async

**US3.2 - Importar Atividade do Strava (13 pts)**
- Como sistema, quero buscar dados completos da atividade após webhook
- **Tasks:**
  - Implement getActivity() Strava API
  - Parse dados (distance, time, pace, elevation, etc.)
  - Salvar em strava_activities table
  - Link com workout planejado (se existir)
  - Handle rate limits (exponential backoff)
  - **Acceptance:** Atividade importada com todos os dados, linked ao workout

**US3.3 - Home Screen (8 pts)**
- Como usuário, quero ver resumo do meu status atual ao abrir o app
- **Tasks:**
  - Header: Nome + Nível atual (visual badge)
  - Card: Próximo treino agendado (data, tipo, distância)
  - Card: Última atividade (resumo + link para feedback)
  - Card: "Dica do Dia" (placeholder ou IA)
  - Pull-to-refresh
  - **Acceptance:** Home exibe dados em tempo real, design clean

**US3.4 - Calendar Screen (6 pts)**
- Como usuário, quero ver meus treinos em calendário visual
- **Tasks:**
  - Implement React Native Calendar component
  - Mark treinos agendados (dots coloridos por tipo)
  - Mark treinos completados (check green)
  - Tap treino → ver detalhes
  - **Acceptance:** Calendário interativo, treinos marcados

**Total Sprint 3: 40 story points**

**Entrega Sprint 3:**
- Strava webhooks funcionais
- Atividades importadas automaticamente
- Home screen completa
- Calendário visual

---

### 4.5 Sprint 4 (Semanas 7-8): Feedback IA Pós-Treino

**Objetivo:** Core value proposition - análise inteligente pós-treino

**US4.1 - Análise Pós-Treino (IA) (13 pts)**
- Como usuário, quero receber feedback detalhado após cada treino
- **Tasks:**
  - Design prompt IA (comparar planejado vs executado)
  - Implement generateFeedback() function
  - Input: workout plan + strava activity data
  - Output: structured feedback (strengths, improvements, metrics)
  - Salvar em ai_feedbacks table
  - Trigger análise após webhook (async job)
  - **Acceptance:** IA gera feedback preciso, salvo no DB, latência <30s

**US4.2 - Tela de Feedback (8 pts)**
- Como usuário, quero ver análise da IA em tela dedicada
- **Tasks:**
  - Tela Feedback (hero section: "Parabéns!" ou "Atenção")
  - Seção: Métricas (planejado vs executado - cards comparativos)
  - Seção: Pontos Fortes (lista com ícones)
  - Seção: O que melhorar (lista com ícones)
  - Botão: Compartilhar no Instagram (screenshot)
  - **Acceptance:** Feedback exibido de forma visual e motivacional

**US4.3 - Notificação Push (8 pts)**
- Como usuário, quero ser notificado quando análise estiver pronta
- **Tasks:**
  - Setup React Native Push Notifications
  - Backend: send notification após gerar feedback
  - Notification: "Sua análise está pronta! 🎉"
  - Deep link para tela de feedback
  - Handle permissions iOS/Android
  - **Acceptance:** Notificação recebida, deep link funciona

**US4.4 - Compartilhamento Social (5 pts)**
- Como usuário, quero compartilhar meu feedback no Instagram
- **Tasks:**
  - Generate screenshot da tela feedback (react-native-view-shot)
  - Implement share via React Native Share API
  - Design template visual (branded RunEasy)
  - **Acceptance:** Usuário consegue compartilhar feedback como imagem

**US4.5 - Histórico de Feedbacks (6 pts)**
- Como usuário, quero acessar feedbacks anteriores
- **Tasks:**
  - Tela "Histórico" (lista de atividades)
  - Cada item: data, tipo treino, resumo feedback
  - Tap → ver feedback completo
  - **Acceptance:** Histórico funcional, acesso a qualquer feedback passado

**Total Sprint 4: 40 story points**

**Entrega Sprint 4:**
- Feedback IA pós-treino funcional
- Notificações push implementadas
- Compartilhamento social
- Histórico acessível

---

### 4.6 Sprint 5 (Semanas 9-10): Gamificação Core

**Objetivo:** Sistema de níveis, pontos e badges funcionando

**US5.1 - Cálculo de Nível do Corredor (13 pts)**
- Como sistema, quero calcular nível baseado em performance, consistência e aderência
- **Tasks:**
  - Implement calculateLevel() algorithm
  - Componentes:
    - Performance: best pace 5K/10K (últimas 8 semanas)
    - Consistência: treinos/mês, decay factor
    - Aderência: % treinos completados vs planejados
  - Fórmula ponderada: level = f(performance, consistency, adherence)
  - Trigger recalculation após cada atividade
  - **Acceptance:** Nível calculado corretamente, atualizado em tempo real

**US5.2 - Sistema de Pontos (8 pts)**
- Como usuário, quero ganhar pontos por ações de valor
- **Tasks:**
  - Define point values:
    - Treino completado: 50 pts
    - Treino completado conforme planejado: +25 pts bonus
    - Badge conquistado: 100 pts
    - Vídeo enviado (Fase 2): 30 pts
  - Implement addPoints() function
  - Salvar em points_history
  - **Acceptance:** Pontos atribuídos corretamente, histórico salvo

**US5.3 - Badges Sistema (13 pts)**
- Como usuário, quero conquistar badges por achievements
- **Tasks:**
  - Seed 10 badges MVP:
    - "Primeiro Passo" (primeiro treino)
    - "Semana Completa" (7 dias consecutivos)
    - "Velocista" (pace < 5min/km em 5K)
    - "Maratonista" (completar >21km)
    - "Consistente" (12 treinos em 30 dias)
    - "Fiel ao Plano" (80% aderência em 4 semanas)
    - "Superação" (melhorar pace 5% em 30 dias)
    - "Explorador" (10 rotas diferentes)
    - "Invernal" (treinar em dia frio/chuva)
    - "Compartilhador" (5 shares Instagram)
  - Implement checkBadges() function (run após cada atividade)
  - Award badge + notification
  - **Acceptance:** Badges atribuídos automaticamente quando critérios atingidos

**US5.4 - Visualização de Gamificação (6 pts)**
- Como usuário, quero ver meu nível, pontos e badges
- **Tasks:**
  - Tela "Perfil" ou seção na Home
  - Display: Nível atual (badge visual + progress bar)
  - Display: Total de pontos
  - Grid de badges (earned + locked)
  - Animação ao ganhar badge
  - **Acceptance:** Gamificação visível e motivacional

**Total Sprint 5: 40 story points**

**Entrega Sprint 5:**
- Sistema de níveis funcional
- Pontos atribuídos automaticamente
- 10 badges MVP implementados
- Visualização gamificada

---

### 4.7 Sprint 6 (Semanas 11-12): Polish + Features Adicionais

**Objetivo:** Refinar UX e adicionar features de retenção

**US6.1 - Ajuste de Plano pela IA (13 pts)**
- Como usuário, quero que IA sugira ajustes no plano baseado em meu desempenho
- **Tasks:**
  - Implement analyzePlanAdherence() (a cada 2 semanas)
  - IA analisa: % completado, pace trends, fadiga aparente
  - Gera sugestões: "Aumentar descanso", "Pronto para mais volume", etc.
  - Notification + tela de sugestão
  - Usuário aceita/rejeita ajuste
  - **Acceptance:** IA sugere ajustes inteligentes, usuário pode aceitar

**US6.2 - Gráficos de Evolução (8 pts)**
- Como usuário, quero ver minha evolução em gráficos
- **Tasks:**
  - Biblioteca: react-native-chart-kit ou Victory Native
  - Gráficos:
    - Pace médio ao longo do tempo (line chart)
    - Distância mensal (bar chart)
    - Consistência (heatmap calendar)
  - Filtros: 30 dias, 90 dias, 6 meses
  - **Acceptance:** Gráficos renderizam corretamente, dados precisos

**US6.3 - Streaks Sistema (5 pts)**
- Como usuário, quero ver minha sequência de dias correndo
- **Tasks:**
  - Calculate streak (dias consecutivos com treino)
  - Display na Home (🔥 ícone + número)
  - Reset se passar >48h sem treino
  - Badge "Chama Eterna" (30 dias streak)
  - **Acceptance:** Streak calculado corretamente, visível na Home

**US6.4 - Settings e Preferências (8 pts)**
- Como usuário, quero configurar notificações e preferências
- **Tasks:**
  - Tela Settings
  - Toggle: Notificações push (on/off)
  - Toggle: Unidade de medida (km vs mi)
  - Botão: Desconectar Strava
  - Botão: Exportar dados (LGPD)
  - Botão: Deletar conta
  - **Acceptance:** Settings funcionais, alterações persistidas

**US6.5 - Error Handling e Loading States (6 pts)**
- Como usuário, quero feedback claro quando algo der errado
- **Tasks:**
  - Implement error boundaries React Native
  - Loading skeletons (todas as telas principais)
  - Error messages humanizadas
  - Retry mechanisms
  - Offline handling básico
  - **Acceptance:** App não crasha, erros tratados gracefully

**Total Sprint 6: 40 story points**

**Entrega Sprint 6:**
- IA ajusta planos dinamicamente
- Gráficos de evolução
- Sistema de streaks
- Settings completo
- UX polida

---

### 4.8 Sprint 7 (Semanas 13-14): Testing + Bug Fixing

**Objetivo:** Garantir qualidade e estabilidade pré-launch

**US7.1 - Testes Automatizados Backend (13 pts)**
- Como desenvolvedor, quero cobertura de testes >70%
- **Tasks:**
  - Unit tests (services, utilities)
  - Integration tests (API endpoints)
  - E2E tests (fluxos críticos: onboarding, webhook processing)
  - Mock Strava API e Claude API
  - **Acceptance:** Cobertura >70%, CI passa

**US7.2 - Testes Mobile (8 pts)**
- Como desenvolvedor, quero testar componentes críticos
- **Tasks:**
  - Unit tests (React components)
  - Integration tests (navigation, state management)
  - Screenshot tests (design consistency)
  - **Acceptance:** Testes passam, componentes estáveis

**US7.3 - Testing Manual + QA (13 pts)**
- Como QA, quero validar todos os fluxos de usuário
- **Tasks:**
  - Create test plan (checklist)
  - Testar em iOS (simulator + device)
  - Testar em Android (emulator + device)
  - Testar edge cases (no internet, Strava down, etc.)
  - Bug fixing (high/critical priority)
  - **Acceptance:** Zero bugs críticos, fluxos principais funcionais

**US7.4 - Performance Optimization (6 pts)**
- Como usuário, quero app rápido e responsivo
- **Tasks:**
  - Profile performance (React Native DevTools)
  - Optimize re-renders (React.memo, useMemo)
  - Optimize images (compression, lazy loading)
  - Reduce bundle size (code splitting)
  - Test em dispositivos low-end
  - **Acceptance:** App load time <3s, scrolling 60fps

**Total Sprint 7: 40 story points**

**Entrega Sprint 7:**
- Cobertura de testes >70%
- Zero bugs críticos
- Performance otimizada
- App estável para beta

---

### 4.9 Sprint 8 (Semanas 15-16): Beta Launch

**Objetivo:** Lançar beta privado e coletar feedback

**US8.1 - Setup Beta Distribution (5 pts)**
- Como desenvolvedor, quero distribuir app para beta testers
- **Tasks:**
  - Setup TestFlight (iOS)
  - Setup Google Play Internal Testing (Android)
  - Create lista de 100 beta testers
  - Enviar convites
  - **Acceptance:** App disponível em beta stores

**US8.2 - Analytics e Monitoring (8 pts)**
- Como PO, quero tracking de eventos e erros
- **Tasks:**
  - Setup PostHog ou Mixpanel (analytics)
  - Track key events:
    - Signup, onboarding_complete, plan_created
    - workout_completed, feedback_viewed, badge_earned
    - share_instagram
  - Setup Sentry (error tracking)
  - Setup backend logging (Winston)
  - **Acceptance:** Eventos trackados, dashboard funcional

**US8.3 - Onboarding de Beta Testers (5 pts)**
- Como beta tester, quero entender como usar o app
- **Tasks:**
  - Escrever guia Beta (Google Docs)
  - Video tutorial (3min - Loom)
  - FAQ básico
  - Canal de suporte (Discord ou WhatsApp group)
  - **Acceptance:** Testers conseguem usar app sem confusão

**US8.4 - Feedback Collection (8 pts)**
- Como PO, quero coletar feedback estruturado
- **Tasks:**
  - In-app feedback form (Typeform ou similar)
  - NPS survey (após 7 dias de uso)
  - 1:1 interviews agendadas (10 usuários)
  - Análise de analytics (D1, D7 retention)
  - **Acceptance:** Feedback coletado de 70%+ testers

**US8.5 - Iteração Rápida (14 pts)**
- Como PO, quero fix bugs reportados rapidamente
- **Tasks:**
  - Daily standup com testers (async Discord)
  - Priorizar bugs/features (impacto vs esforço)
  - Ship hotfixes (2-3 durante beta)
  - Preparar roadmap pós-beta
  - **Acceptance:** Bugs críticos fixados em <48h

**Total Sprint 8: 40 story points**

**Entrega Sprint 8:**
- Beta lançado (100 testers)
- Analytics e monitoring ativos
- Feedback coletado e analisado
- Iterações baseadas em dados
- Roadmap public launch definido

---

## 5. INFRAESTRUTURA E DEVOPS

### 5.1 Ambientes

**Desenvolvimento (Dev):**
- Supabase Project Dev
- Backend: localhost:3000
- Mobile: Expo Go / emulators

**Staging:**
- Supabase Project Staging
- Backend: Railway/Vercel (staging subdomain)
- Mobile: TestFlight Internal / Play Internal Testing

**Produção:**
- Supabase Project Production
- Backend: Railway/Vercel (production domain)
- Mobile: App Store / Google Play

### 5.2 CI/CD Pipeline

**GitHub Actions Workflow:**

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  backend-lint-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: cd backend && npm ci
      - run: cd backend && npm run lint
      - run: cd backend && npm run test
      - run: cd backend && npm run test:e2e

  mobile-lint-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: cd mobile && npm ci
      - run: cd mobile && npm run lint
      - run: cd mobile && npm run test

  deploy-backend-staging:
    needs: [backend-lint-test]
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway Staging
        run: |
          # Railway CLI deploy
          
  deploy-backend-production:
    needs: [backend-lint-test]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway Production
        run: |
          # Railway CLI deploy --prod
```

**Mobile Builds (EAS):**
```json
// eas.json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "channel": "preview"
    },
    "production": {
      "channel": "production"
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your@email.com",
        "ascAppId": "1234567890"
      },
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json"
      }
    }
  }
}
```

### 5.3 Monitoring e Alertas

**Backend Monitoring:**
- **Sentry:** Error tracking + performance monitoring
- **Uptime Robot:** Health check endpoint (5min interval)
- **Railway Metrics:** CPU, memory, request latency

**Alertas:**
- Error rate >5%: Slack notification
- API latency >2s (p95): Slack notification
- Supabase DB >80% capacity: Email alert

**Mobile Monitoring:**
- **Sentry React Native:** Crash reports
- **PostHog:** Session replays (sample 10%)

---

## 6. CUSTOS OPERACIONAIS ESTIMADOS

### 6.1 Custos Fixos Mensais (MVP - 0-100 usuários)

**Infraestrutura:**
- Supabase Free Tier: USD 0 (500MB DB, 1GB storage, 2GB bandwidth)
- Railway Hobby: USD 5/mês (backend deploy)
- Vercel Hobby: USD 0 (alternativa Railway)
- Expo EAS Build: USD 0 (até 30 builds/mês free tier)

**APIs e Serviços:**
- Anthropic Claude: USD 0 (pay-as-you-go, ~USD 50/mês com 100 usuários)
- Strava API: USD 0 (free)
- Sentry Free: USD 0 (5k events/mês)
- PostHog Free: USD 0 (1M events/mês)

**Total MVP (0-100 usuários): USD 5-55/mês**

---

### 6.2 Custos Escalados (Year 1 - 3.200 usuários pagantes)

**Infraestrutura:**
- Supabase Pro: USD 25/mês (8GB DB, 100GB storage, 250GB bandwidth)
- Railway Pro: USD 20/mês (backend + workers)
- Expo EAS: USD 0 (builds sob demanda)

**APIs:**
- Anthropic Claude: USD 480/mês (estimado anteriormente)
- Push Notifications (OneSignal): USD 9/mês (10k subscribers)

**Monitoring:**
- Sentry Team: USD 26/mês
- PostHog Scale: USD 0-50/mês (depende de volume)

**Total Year 1 (3.200 usuários): USD 560-610/mês**

**Receita Year 1:** BRL 95.968/mês (~USD 19.193 @ USD 1 = BRL 5)  
**Custos:** USD 610/mês  
**Margin:** 96,8% (excelente para SaaS)

---

### 6.3 Custos Desenvolvimento (One-Time)

**Desenvolvimento MVP (16 semanas):**
- Full-Stack Developer: USD 8.000/mês × 4 meses = USD 32.000
- Alternativa Freelancer Brasil: BRL 12.000/mês × 4 = BRL 48.000 (USD 9.600)

**Design UI/UX:**
- Figma designs: USD 2.000 - 5.000 (freelancer)
- Alternativa: usar Tailwind templates + adaptar (USD 0-500)

**Legal:**
- Termos de Uso + Privacidade: USD 500 - 1.500 (advogado)

**Marketing Beta:**
- Influencers micro (5-10): USD 500 - 2.000
- Performance Ads beta: USD 1.000

**Total Desenvolvimento MVP: USD 15.000 - 42.000**

---

## 7. RISCOS E MITIGAÇÕES

### 7.1 Riscos Técnicos

**Risco 1: Dependência Strava (ALTO)**
- **Impacto:** Se Strava mudar política API ou pricing, app pode quebrar
- **Probabilidade:** Baixa-Média
- **Mitigação:**
  - Fase 2: Desenvolver tracking GPS nativo
  - Monitoring constante de Strava API health
  - Backup plan: suportar outras fontes (Garmin Connect, Apple Health)

**Risco 2: Latência Análise IA (MÉDIO)**
- **Impacto:** Feedback lento frustra usuário
- **Probabilidade:** Média
- **Mitigação:**
  - Processamento assíncrono (webhooks → queue → IA)
  - Notification push quando pronto
  - Expectativa clara: "Análise em 30 segundos"
  - Prompt caching Claude (90% redução latência)

**Risco 3: Custos IA Escalarem (MÉDIO)**
- **Impacto:** Custo > receita se usage explodir
- **Probabilidade:** Baixa (controlado por pricing e limits)
- **Mitigação:**
  - Rate limiting por usuário (max 5 análises/dia free tier)
  - Premium ilimitado
  - Monitoring de custos (alertas >USD 1.000/mês)

---

### 7.2 Riscos de Produto

**Risco 4: Churn Alto (ALTO - CRÍTICO)**
- **Impacto:** Usuários abandonam em 3 dias (77% indústria)
- **Probabilidade:** Alta
- **Mitigação:**
  - Onboarding impecável (<3 min)
  - Quick win primeiro treino (badge garantido)
  - Push notifications dia 2 e 7
  - Gamificação desde day 1
  - A/B testing onboarding

**Risco 5: Feedback IA Ruim (ALTO)**
- **Impacto:** Valor percebido zero, usuários não convertem
- **Probabilidade:** Média
- **Mitigação:**
  - Extensive prompt testing (100+ exemplos)
  - Human review dos primeiros 100 feedbacks
  - User feedback loop (thumbs up/down no feedback)
  - Iteração constante dos prompts

**Risco 6: Falta de Diferenciação (MÉDIO)**
- **Impacto:** Usuários não veem valor vs Strava/Nike
- **Probabilidade:** Média
- **Mitigação:**
  - Messaging clara: "Treinador IA personalizado"
  - Demos no onboarding (mostrar análise exemplo)
  - Social proof (depoimentos beta testers)
  - Content marketing (comparações honestas)

---

### 7.3 Riscos de Mercado

**Risco 7: Strava Lançar IA (MÉDIO)**
- **Impacto:** Competidor direto com recursos infinitos
- **Probabilidade:** Média-Alta (Strava adquiriu Runna em 2025)
- **Mitigação:**
  - First-mover advantage Brasil
  - Nicho específico (20-35 anos, feedback detalhado)
  - Execução rápida (MVP em 4 meses vs 12-18 meses big tech)
  - Community local (clubes de corrida parcerias)

---

## 8. MÉTRICAS DE SUCESSO (KPIs)

### 8.1 Métricas MVP (Beta - 100 usuários)

**North Star Metric:** D30 Retention Rate  
**Target:** >25% (top quartile fitness apps)

**KPIs Primários:**
- D1 Retention: >40%
- D7 Retention: >25%
- D30 Retention: >25%
- NPS: >50
- Feedback IA Rating: >4.5/5

**KPIs Secundários:**
- Onboarding completion: >80%
- First workout completed: >60%
- Feedback viewed after workout: >70%
- Badge earned (first week): >80%
- Share to Instagram: >15%

---

### 8.2 Métricas Year 1 (3.200 pagantes)

**Revenue:**
- MRR: BRL 95.968
- ARR: BRL 1.151.616
- ARPU: BRL 29,99

**Growth:**
- Free signups: 106.666 (Year 1)
- Free → Premium conversion: 3%
- CAC: <BRL 100
- LTV: BRL 2.999,88 (12 meses avg retention)
- LTV/CAC: >30:1

**Engagement:**
- DAU/MAU ratio: >30%
- Avg workouts/user/month: >8
- Feedback views/generated: >80%
- Badges earned/user: >5

**Retention:**
- D30: >30%
- Month 2: >50%
- Month 6: >35%
- Churn mensal: <10%

---

## 9. PRÓXIMOS PASSOS (Pós-MVP)

### 9.1 Public Launch (Mês 5)

**Pré-requisitos:**
- D30 retention beta >25%
- NPS >50
- Zero bugs críticos
- 50+ reviews positivos (beta testers)

**Ações:**
- App Store e Google Play submission
- Landing page profissional
- Performance Ads (BRL 20k/mês)
- PR: TechCrunch Brasil, Canaltech, Exame
- Influencers (10-15 runners 50k+ followers)

---

### 9.2 Fase 2 (Mês 6-12)

**Features:**
1. Análise de Movimentos (vídeo)
2. Recomendação de Eventos (matching inteligente)
3. Tracking GPS Nativo (reduzir dependência Strava)
4. Rede Social Interna (conexões, grupos)

**Priorização:** Baseada em feedback Year 1 e métricas de demanda

---

## 10. CONCLUSÃO

O **Planejamento de Desenvolvimento do RunEasy** está estruturado para entregar um MVP robusto em **16 semanas (4 meses)** com metodologia ágil (Scrum + Lean Inception).

**Arquitetura técnica:**
- React Native + NestJS + Supabase + Claude API
- Escalável, moderna, custo-eficiente
- Stack validada por indústria

**Roadmap:**
- 8 sprints bem definidos
- User stories com acceptance criteria
- 40 story points/sprint (velocity sustentável)

**Custos:**
- MVP development: USD 15k-42k (one-time)
- Operating costs Year 1: USD 560-610/mês
- Margin: 96,8% (excelente)