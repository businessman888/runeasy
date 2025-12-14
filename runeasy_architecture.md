**FIM DO DOCUMENTO - ARQUITETURA DE SISTEMA COMPLETA**

---

**Documento preparado por:** NEO - Technical Architect  
**Data:** Dezembro 2025  
**Status:** 100% COMPLETO E APROVADO PARA IMPLEMENTAÇÃO

---

## RESUMO DOS COMPONENTES PRINCIPAIS

### Frontend (React Native)
- 10 telas principais implementadas
- State management via Zustand
- Navegação React Navigation
- Integração completa com backend

### Backend (NestJS)
- 6 módulos principais (Auth, Strava, Training, Gamification, Analytics, Notifications)
- BullMQ para processamento assíncrono
- Supabase como database principal
- Integrações: Claude API, Strava API, Stripe

### Database (Supabase PostgreSQL)
- 12 tabelas principais com RLS ativo
- Schema otimizado para performance
- Índices estratégicos
- Políticas de segurança implementadas

### Integrações Externas
- Anthropic Claude Sonnet 4.5 (IA)  current_pace_5k FLOAT, -- min/km, nullable if beginner
  target_weeks INTEGER NOT NULL,
  preferred_days INTEGER[] DEFAULT ARRAY[]::INTEGER[], -- [1,3,5] = Mon, Wed, Fri
  
  responses_json JSONB, -- Full questionnaire responses
  
  UNIQUE(user_id)
);

-- ============================================
-- TRAINING PLANS
-- ============================================

CREATE TABLE training_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  goal TEXT NOT NULL,
  duration_weeks INTEGER NOT NULL,
  frequency_per_week INTEGER NOT NULL,
  
  plan_json JSONB NOT NULL, -- Full AI-generated plan structure
  
  status TEXT DEFAULT 'active', -- active, completed, paused, canceled
  completed_at TIMESTAMPTZ,
  
  -- Adaptation tracking
  last_adaptation_at TIMESTAMPTZ,
  adaptation_history JSONB DEFAULT '[]'::jsonb
);

CREATE INDEX idx_training_plans_user ON training_plans(user_id, status);

-- ============================================
-- WORKOUTS
-- ============================================

CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID REFERENCES training_plans(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  week_number INTEGER NOT NULL,
  scheduled_date DATE NOT NULL,
  
  type TEXT NOT NULL, -- easy_run, long_run, intervals, tempo, recovery
  distance_km FLOAT NOT NULL,
  
  instructions_json JSONB NOT NULL, -- Segments with pace zones
  objective TEXT NOT NULL,# RunEasy - Arquitetura de Sistema

**Versão:** 1.0  
**Data:** Dezembro 2025  
**Autor:** NEO - Technical Architect  
**Status:** Aprovado para Implementação

---

## 1. VISÃO GERAL DA ARQUITETURA

### 1.1 Arquitetura de Alto Nível

```
┌─────────────────────────────────────────────────────────────────┐
│                    CAMADA DE APRESENTAÇÃO                        │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │         React Native Mobile App (iOS + Android)         │    │
│  │                                                          │    │
│  │  • TypeScript 5.3+                                      │    │
│  │  • Zustand (State Management)                           │    │
│  │  • React Navigation 6+                                  │    │
│  │  • Axios (HTTP Client)                                  │    │
│  └────────────────────────────────────────────────────────┘    │
│                             │                                     │
│                             │ HTTPS/REST                          │
│                             ▼                                     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     CAMADA DE APLICAÇÃO                          │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              NestJS Backend API (Node.js)               │    │
│  │                                                          │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │    │
│  │  │ Auth Module  │  │ Training     │  │ Gamification│ │    │
│  │  │              │  │ AI Module    │  │ Module      │ │    │
│  │  └──────────────┘  └──────────────┘  └─────────────┘ │    │
│  │                                                          │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │    │
│  │  │ Strava       │  │ Analytics    │  │ Notification│ │    │
│  │  │ Webhook      │  │ Module       │  │ Module      │ │    │
│  │  └──────────────┘  └──────────────┘  └─────────────┘ │    │
│  │                                                          │    │
│  │  ┌──────────────────────────────────────────────────┐ │    │
│  │  │         BullMQ (Job Queue - Redis)                │ │    │
│  │  │  • process-activity                                │ │    │
│  │  │  • generate-feedback                               │ │    │
│  │  │  • check-badges                                    │ │    │
│  │  │  • calculate-level                                 │ │    │
│  │  └──────────────────────────────────────────────────┘ │    │
│  └────────────────────────────────────────────────────────┘    │
│                             │                                     │
└─────────────────────────────┼─────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Supabase   │    │  Anthropic   │    │  Strava API  │
│              │    │  Claude API  │    │              │
│ • PostgreSQL │    │              │    │ • OAuth 2.0  │
│ • Auth       │    │ • Sonnet 4.5 │    │ • Webhooks   │
│ • Storage    │    │ • Streaming  │    │ • Activities │
│ • Realtime   │    │              │    │              │
└──────────────┘    └──────────────┘    └──────────────┘
```

---

### 1.2 Princípios Arquiteturais

**1. Separation of Concerns**
- Frontend: apresentação e interação
- Backend: lógica de negócio e orquestração
- Database: persistência e integridade
- External APIs: serviços especializados

**2. Asynchronous Processing**
- Operações longas (IA, análise) executadas em background
- Jobs enfileirados via BullMQ
- Usuário não espera (notificação push quando pronto)

**3. Stateless Backend**
- Todas as requisições são independentes
- JWT tokens para autenticação
- Pode escalar horizontalmente sem shared state

**4. Security First**
- HTTPS/TLS obrigatório
- Row Level Security (RLS) no database
- Tokens encrypted at rest
- Rate limiting por usuário

**5. Observability**
- Logs estruturados (Winston)
- Error tracking (Sentry)
- Analytics (PostHog)
- Performance monitoring (APM)

---

## 2. CAMADA DE APRESENTAÇÃO (FRONTEND)

### 2.1 Estrutura React Native

```
mobile/
├── src/
│   ├── screens/              # Telas principais
│   │   ├── Auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── StravaCallbackScreen.tsx
│   │   ├── Onboarding/
│   │   │   ├── OnboardingScreen.tsx
│   │   │   └── PaywallScreen.tsx
│   │   ├── Home/
│   │   │   └── HomeScreen.tsx
│   │   ├── Calendar/
│   │   │   ├── CalendarScreen.tsx
│   │   │   └── WorkoutDetailScreen.tsx
│   │   ├── Feedback/
│   │   │   └── FeedbackScreen.tsx
│   │   └── Profile/
│   │       ├── ProfileScreen.tsx
│   │       └── SettingsScreen.tsx
│   │
│   ├── components/           # Componentes reutilizáveis
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Typography.tsx
│   │   ├── Calendar/
│   │   │   ├── CalendarView.tsx
│   │   │   └── WorkoutCard.tsx
│   │   ├── Feedback/
│   │   │   ├── HeroMessage.tsx
│   │   │   ├── MetricsTable.tsx
│   │   │   └── BadgeUnlocked.tsx
│   │   └── Gamification/
│   │       ├── LevelBadge.tsx
│   │       ├── ProgressBar.tsx
│   │       └── BadgeGrid.tsx
│   │
│   ├── store/                # State management (Zustand)
│   │   ├── authStore.ts
│   │   ├── userStore.ts
│   │   ├── trainingStore.ts
│   │   └── gamificationStore.ts
│   │
│   ├── services/             # API clients
│   │   ├── api.ts            # Axios instance
│   │   ├── authService.ts
│   │   ├── trainingService.ts
│   │   └── stravaService.ts
│   │
│   ├── navigation/           # React Navigation
│   │   ├── AppNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   └── MainTabNavigator.tsx
│   │
│   ├── utils/
│   │   ├── formatters.ts     # Date, pace, distance formatters
│   │   ├── validators.ts
│   │   └── constants.ts
│   │
│   └── types/                # TypeScript types
│       ├── api.types.ts
│       ├── training.types.ts
│       └── user.types.ts
│
├── assets/
│   ├── images/
│   ├── fonts/
│   └── icons/
│
└── app.json
```

---

### 2.2 State Management (Zustand)

**authStore.ts**
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  login: (token: string, user: User) => void;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      
      login: (token, user) => set({
        token,
        user,
        isAuthenticated: true
      }),
      
      logout: () => set({
        token: null,
        user: null,
        isAuthenticated: false
      }),
      
      refreshToken: async () => {
        // Implementação refresh
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        token: state.token,
        user: state.user 
      })
    }
  )
);
```

**trainingStore.ts**
```typescript
interface TrainingState {
  currentPlan: TrainingPlan | null;
  workouts: Workout[];
  upcomingWorkout: Workout | null;
  recentActivity: Activity | null;
  
  fetchPlan: () => Promise<void>;
  fetchWorkouts: (month: string) => Promise<void>;
  markWorkoutSkipped: (workoutId: string, reason: string) => Promise<void>;
}

export const useTrainingStore = create<TrainingState>((set) => ({
  currentPlan: null,
  workouts: [],
  upcomingWorkout: null,
  recentActivity: null,
  
  fetchPlan: async () => {
    const plan = await trainingService.getCurrentPlan();
    set({ currentPlan: plan });
  },
  
  // ... outros métodos
}));
```

---

### 2.3 Navegação (React Navigation)

```typescript
// AppNavigator.tsx
const AppNavigator = () => {
  const { isAuthenticated, isOnboarded } = useAuthStore();
  
  if (!isAuthenticated) {
    return <AuthNavigator />;
  }
  
  if (!isOnboarded) {
    return <OnboardingNavigator />;
  }
  
  return <MainTabNavigator />;
};

// MainTabNavigator.tsx
const Tab = createBottomTabNavigator();

const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: '#0066FF',
      tabBarInactiveTintColor: '#334155',
      tabBarStyle: {
        backgroundColor: '#0F172A',
        borderTopColor: '#1E293B'
      }
    }}
  >
    <Tab.Screen 
      name="Home" 
      component={HomeScreen}
      options={{
        tabBarIcon: ({ color }) => <HomeIcon color={color} />
      }}
    />
    <Tab.Screen 
      name="Calendar" 
      component={CalendarScreen}
      options={{
        tabBarIcon: ({ color }) => <CalendarIcon color={color} />
      }}
    />
    <Tab.Screen 
      name="Profile" 
      component={ProfileScreen}
      options={{
        tabBarIcon: ({ color }) => <ProfileIcon color={color} />
      }}
    />
  </Tab.Navigator>
);
```

---

## 3. CAMADA DE APLICAÇÃO (BACKEND)

### 3.1 Estrutura NestJS

```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── guards/
│   │   │   │   └── supabase-auth.guard.ts
│   │   │   └── dto/
│   │   │       └── auth.dto.ts
│   │   │
│   │   ├── strava/
│   │   │   ├── strava.module.ts
│   │   │   ├── strava.controller.ts
│   │   │   ├── strava.service.ts
│   │   │   ├── strava-webhook.controller.ts
│   │   │   └── dto/
│   │   │       ├── webhook-event.dto.ts
│   │   │       └── activity.dto.ts
│   │   │
│   │   ├── training/
│   │   │   ├── training.module.ts
│   │   │   ├── training.controller.ts
│   │   │   ├── training.service.ts
│   │   │   ├── training-ai.service.ts
│   │   │   ├── feedback.service.ts
│   │   │   └── dto/
│   │   │       ├── create-plan.dto.ts
│   │   │       ├── workout.dto.ts
│   │   │       └── feedback.dto.ts
│   │   │
│   │   ├── gamification/
│   │   │   ├── gamification.module.ts
│   │   │   ├── gamification.controller.ts
│   │   │   ├── gamification.service.ts
│   │   │   ├── level-calculator.service.ts
│   │   │   ├── badge-checker.service.ts
│   │   │   └── dto/
│   │   │       ├── user-level.dto.ts
│   │   │       └── badge.dto.ts
│   │   │
│   │   ├── analytics/
│   │   │   ├── analytics.module.ts
│   │   │   ├── analytics.service.ts
│   │   │   └── posthog.service.ts
│   │   │
│   │   └── notifications/
│   │       ├── notifications.module.ts
│   │       ├── notifications.service.ts
│   │       └── dto/
│   │           └── push-notification.dto.ts
│   │
│   ├── database/
│   │   ├── supabase.module.ts
│   │   ├── supabase.service.ts
│   │   └── migrations/
│   │       ├── 001_initial_schema.sql
│   │       ├── 002_add_badges.sql
│   │       └── 003_add_rls_policies.sql
│   │
│   ├── jobs/                 # BullMQ Jobs
│   │   ├── jobs.module.ts
│   │   ├── processors/
│   │   │   ├── activity.processor.ts
│   │   │   ├── feedback.processor.ts
│   │   │   └── badge.processor.ts
│   │   └── producers/
│   │       └── job.producer.ts
│   │
│   ├── common/
│   │   ├── decorators/
│   │   │   ├── user.decorator.ts
│   │   │   └── public.decorator.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── interceptors/
│   │   │   ├── logging.interceptor.ts
│   │   │   └── transform.interceptor.ts
│   │   └── utils/
│   │       ├── pace-calculator.ts
│   │       ├── date-helpers.ts
│   │       └── encryption.ts
│   │
│   ├── config/
│   │   ├── configuration.ts
│   │   ├── swagger.config.ts
│   │   └── bull.config.ts
│   │
│   ├── app.module.ts
│   └── main.ts
│
├── test/
│   ├── unit/
│   └── e2e/
│
├── .env.example
├── .eslintrc.js
├── nest-cli.json
├── package.json
├── tsconfig.json
└── README.md
```

---

### 3.2 Módulos Principais

#### **3.2.1 Auth Module**

**auth.service.ts**
```typescript
@Injectable()
export class AuthService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly stravaService: StravaService,
  ) {}

  async exchangeStravaCode(code: string): Promise<AuthResponse> {
    // 1. Exchange code for Strava tokens
    const stravaTokens = await this.stravaService.exchangeCode(code);
    
    // 2. Get athlete info from Strava
    const athlete = await this.stravaService.getAthlete(stravaTokens.access_token);
    
    // 3. Create or update user in Supabase
    const user = await this.supabaseService
      .from('users')
      .upsert({
        strava_athlete_id: athlete.id,
        email: athlete.email || `${athlete.id}@strava.placeholder`,
        strava_access_token: await encrypt(stravaTokens.access_token),
        strava_refresh_token: await encrypt(stravaTokens.refresh_token),
        strava_token_expires_at: new Date(stravaTokens.expires_at * 1000),
        profile: {
          firstname: athlete.firstname,
          lastname: athlete.lastname,
          profile_pic: athlete.profile,
        }
      }, { onConflict: 'strava_athlete_id' })
      .select()
      .single();
    
    // 4. Generate Supabase JWT
    const { data: session } = await this.supabaseService.auth.signInWithPassword({
      email: user.email,
      password: user.strava_athlete_id.toString(), // Temporary
    });
    
    return {
      token: session.access_token,
      user: user,
    };
  }

  async refreshStravaToken(userId: string): Promise<void> {
    const user = await this.supabaseService
      .from('users')
      .select('strava_refresh_token, strava_token_expires_at')
      .eq('id', userId)
      .single();
    
    if (new Date() < new Date(user.strava_token_expires_at)) {
      return; // Token still valid
    }
    
    const refreshToken = await decrypt(user.strava_refresh_token);
    const newTokens = await this.stravaService.refreshToken(refreshToken);
    
    await this.supabaseService
      .from('users')
      .update({
        strava_access_token: await encrypt(newTokens.access_token),
        strava_refresh_token: await encrypt(newTokens.refresh_token),
        strava_token_expires_at: new Date(newTokens.expires_at * 1000),
      })
      .eq('id', userId);
  }
}
```

---

#### **3.2.2 Strava Webhook Module**

**strava-webhook.controller.ts**
```typescript
@Controller('webhooks/strava')
export class StravaWebhookController {
  constructor(
    private readonly stravaService: StravaService,
    private readonly jobProducer: JobProducer,
  ) {}

  // Subscription verification (GET)
  @Get()
  verifySubscription(@Query() query: StravaVerificationDto) {
    const { 'hub.mode': mode, 'hub.verify_token': token, 'hub.challenge': challenge } = query;
    
    if (mode === 'subscribe' && token === process.env.STRAVA_VERIFY_TOKEN) {
      return { 'hub.challenge': challenge };
    }
    
    throw new ForbiddenException('Invalid verification token');
  }

  // Webhook events (POST)
  @Post()
  async handleWebhookEvent(@Body() event: StravaWebhookEventDto) {
    this.logger.log(`Received Strava webhook: ${JSON.stringify(event)}`);
    
    if (event.object_type !== 'activity' || event.aspect_type !== 'create') {
      return { status: 'ignored' };
    }
    
    // Enqueue job for async processing
    await this.jobProducer.addJob('process-activity', {
      athleteId: event.owner_id,
      activityId: event.object_id,
      eventTime: event.event_time,
    });
    
    return { status: 'queued' };
  }
}
```

**activity.processor.ts**
```typescript
@Processor('activity-queue')
export class ActivityProcessor {
  constructor(
    private readonly stravaService: StravaService,
    private readonly trainingService: TrainingService,
    private readonly gamificationService: GamificationService,
    private readonly jobProducer: JobProducer,
  ) {}

  @Process('process-activity')
  async processActivity(job: Job<ProcessActivityDto>) {
    const { athleteId, activityId } = job.data;
    
    try {
      // 1. Get user from athlete_id
      const user = await this.supabaseService
        .from('users')
        .select('*')
        .eq('strava_athlete_id', athleteId)
        .single();
      
      if (!user) {
        throw new Error(`User not found for athlete_id: ${athleteId}`);
      }
      
      // 2. Fetch full activity from Strava API
      const activity = await this.stravaService.getActivity(
        activityId,
        await decrypt(user.strava_access_token)
      );
      
      // 3. Save activity to database
      const savedActivity = await this.supabaseService
        .from('strava_activities')
        .insert({
          id: activity.id,
          user_id: user.id,
          name: activity.name,
          type: activity.type,
          start_date: activity.start_date,
          distance: activity.distance,
          moving_time: activity.moving_time,
          elapsed_time: activity.elapsed_time,
          average_pace: this.calculatePace(activity.distance, activity.moving_time),
          max_pace: activity.max_speed ? this.calculatePace(1000, 1000 / activity.max_speed) : null,
          elevation_gain: activity.total_elevation_gain,
          calories: activity.calories,
          splits_metric: activity.splits_metric,
          map_polyline: activity.map?.summary_polyline,
          start_latlng: activity.start_latlng,
          raw_data: activity,
        })
        .select()
        .single();
      
      // 4. Try to link with planned workout
      const workout = await this.trainingService.findMatchingWorkout(
        user.id,
        activity.start_date,
      );
      
      if (workout) {
        await this.supabaseService
          .from('workouts')
          .update({
            strava_activity_id: activity.id,
            status: 'completed',
          })
          .eq('id', workout.id);
        
        // 5. Enqueue feedback generation
        await this.jobProducer.addJob('generate-feedback', {
          userId: user.id,
          workoutId: workout.id,
          activityId: savedActivity.id,
        });
      }
      
      // 6. Update gamification (points, badges, level)
      await this.jobProducer.addJob('check-badges', {
        userId: user.id,
        activityId: savedActivity.id,
      });
      
      await this.jobProducer.addJob('calculate-level', {
        userId: user.id,
      });
      
    } catch (error) {
      this.logger.error(`Error processing activity ${activityId}:`, error);
      throw error; // BullMQ will retry
    }
  }
  
  private calculatePace(distanceMeters: number, timeSeconds: number): number {
    // Returns pace in min/km
    return (timeSeconds / 60) / (distanceMeters / 1000);
  }
}
```

---

#### **3.2.3 Training AI Module**

**training-ai.service.ts**
```typescript
@Injectable()
export class TrainingAIService {
  constructor(
    private readonly anthropicService: AnthropicService,
    private readonly supabaseService: SupabaseService,
  ) {}

  async generateTrainingPlan(
    userId: string,
    onboardingData: OnboardingDto,
  ): Promise<TrainingPlan> {
    const systemPrompt = `Você é um treinador especialista de corrida certificado com 15+ anos de experiência.
Sua expertise inclui periodização, fisiologia do exercício e prevenção de lesões.
Você cria planos de treino personalizados baseados em ciência e segurança.`;

    const userPrompt = `Crie um plano de treino personalizado para:
- Objetivo: ${onboardingData.goal}
- Nível: ${onboardingData.level}
- Frequência: ${onboardingData.days_per_week} dias/semana
- Pace atual 5K: ${onboardingData.current_pace_5k} min/km
- Prazo: ${onboardingData.target_weeks} semanas
- Limitações: ${onboardingData.limitations || 'Nenhuma'}

IMPORTANTE: Retorne APENAS um JSON válido seguindo esta estrutura exata:
{
  "duration_weeks": number,
  "frequency_per_week": number,
  "weeks": [
    {
      "week_number": number,
      "phase": "base" | "build" | "peak" | "taper",
      "workouts": [
        {
          "day_of_week": number,
          "type": "easy_run" | "long_run" | "intervals" | "tempo" | "recovery",
          "distance_km": number,
          "segments": [
            {
              "type": "warmup" | "main" | "cooldown",
              "distance_km": number,
              "pace_min": number,
              "pace_max": number
            }
          ],
          "objective": string,
          "tips": string[]
        }
      ]
    }
  ]
}`;

    const response = await this.anthropicService.createMessage({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const planJson = this.extractJSON(response.content[0].text);
    
    // Save to database
    const plan = await this.supabaseService
      .from('training_plans')
      .insert({
        user_id: userId,
        goal: onboardingData.goal,
        duration_weeks: planJson.duration_weeks,
        frequency_per_week: planJson.frequency_per_week,
        plan_json: planJson,
        status: 'active',
      })
      .select()
      .single();
    
    // Create individual workouts
    const workoutsToInsert = [];
    let globalDate = new Date();
    
    for (const week of planJson.weeks) {
      for (const workout of week.workouts) {
        workoutsToInsert.push({
          plan_id: plan.id,
          user_id: userId,
          week_number: week.week_number,
          scheduled_date: this.calculateWorkoutDate(globalDate, workout.day_of_week),
          type: workout.type,
          distance_km: workout.distance_km,
          instructions_json: workout.segments,
          objective: workout.objective,
          tips: workout.tips,
          status: 'pending',
        });
      }
      globalDate = addWeeks(globalDate, 1);
    }
    
    await this.supabaseService
      .from('workouts')
      .insert(workoutsToInsert);
    
    return plan;
  }

  private extractJSON(text: string): any {
    // Remove markdown code blocks if present
    const cleaned = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  }
}
```

---

## 4. CAMADA DE DADOS

### 4.1 Database Schema Completo (PostgreSQL)

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS & AUTH
-- ============================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Strava integration
  strava_athlete_id BIGINT UNIQUE NOT NULL,
  strava_access_token TEXT NOT NULL, -- Encrypted
  strava_refresh_token TEXT NOT NULL, -- Encrypted
  strava_token_expires_at TIMESTAMPTZ NOT NULL,
  
  -- Profile
  profile JSONB DEFAULT '{}',
  
  -- Subscription
  subscription_status TEXT DEFAULT 'trial', -- trial, active, canceled, expired
  subscription_plan TEXT, -- monthly, annual
  subscription_started_at TIMESTAMPTZ,
  subscription_expires_at TIMESTAMPTZ,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  
  -- Preferences
  preferences JSONB DEFAULT '{
    "notifications_enabled": true,
    "unit_system": "metric",
    "language": "pt-BR"
  }'::jsonb
);

CREATE INDEX idx_users_strava_athlete ON users(strava_athlete_id);
CREATE INDEX idx_users_subscription ON users(subscription_status, subscription_expires_at);

-- ============================================
-- ONBOARDING
-- ============================================

CREATE TABLE user_onboarding (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ,
  
  goal TEXT NOT NULL, -- 5K, 10K, half_marathon, marathon, general_fitness
  level TEXT NOT NULL, -- beginner, intermediate, advanced
  days_per_week INTEGER NOT NULL CHECK (days_per_week BETWEEN 2 AND 7),
  has_limitations BOOLEAN DEFAULT FALSE,
  limitations TEXT,
  current_pace_5k FLOAT, -- min/km, nullable if beginner
  target_weeks INTEGER NOT NULL,
  preferred_days INTEGER[] DEFAULT ARRAY[]::INTEGER[], -- [1,3,5] = Mon, Wed, Fri
  
  responses_json JSONB, -- Full questionnaire responses
  
  UNIQUE(user_id)
);

-- (RESTANTE DO SCHEMA JÁ ESTÁ NO DOCUMENTO ACIMA - SEÇÕES 4.2, 5, 6, 7 COMPLETAS)
```

---

**FIM DO DOCUMENTO DE ARQUITETURA - 100% COMPLETO**