# RunEasy - Product Requirements Document (PRD)

**Versão:** 1.0  
**Data:** Dezembro 2025  
**Autor:** NEO - Product Specialist  
**Status:** Aprovado para Desenvolvimento

---

## 1. EXECUTIVE SUMMARY

### 1.1 Product Vision

**RunEasy** é o primeiro aplicativo brasileiro de corrida com treinador de IA conversacional que oferece orientação técnica personalizada através de feedback pós-treino inteligente e gamificação robusta.

**Visão (3 anos):**  
Tornar-se a plataforma #1 de coaching IA para corredores na América Latina, ajudando 100.000+ corredores a treinar corretamente e atingir seus objetivos com segurança.

**Missão:**  
Democratizar o acesso a orientação técnica profissional de corrida através de inteligência artificial, tornando o coaching especializado acessível a qualquer corredor brasileiro por menos de BRL 1/dia.

---

### 1.2 Problem Statement

**Dor Principal (Critical Pain):**
> "Corredores iniciantes e intermediários (20-35 anos) no Brasil não sabem se estão treinando corretamente, carecendo de orientação técnica especializada para evoluir com segurança, eficiência e consistência."

**Contexto do Problema:**
- 19+ milhões de brasileiros usam Strava (2º mercado global)
- 2.800+ eventos de corrida/ano no Brasil (+29% crescimento)
- Personal trainer presencial: BRL 8.000-12.000/ano (inacessível para 80%+ do público)
- Apps atuais oferecem apenas tracking (Strava) ou coaching genérico (Nike Run Club)
- Nenhum app brasileiro oferece feedback técnico inteligente pós-treino

**Consequências da Dor:**
- Platô de performance (não evoluem)
- Lesões por overtraining ou técnica inadequada
- Falta de consistência (77% abandonam apps de fitness em 3 dias)
- Desperdício de tempo e esforço em treinos ineficazes

---

### 1.3 Solution Overview

**Como o RunEasy Resolve:**

1. **Treinador IA Personalizado:** Cria planos técnicos baseados em 6 parâmetros individuais (objetivo, nível, frequência, pace atual, prazo, limitações)

2. **Feedback Pós-Treino Inteligente:** Analisa cada treino comparando planejado vs executado, identificando pontos fortes e áreas de melhoria com explicações técnicas

3. **Adaptação Dinâmica:** IA sugere ajustes no plano a cada 2-4 semanas baseado em performance real e aderência

4. **Gamificação Motivacional:** Sistema de níveis, pontos e badges (híbrido: milestones + progressão contínua) para manter consistência

5. **Integração Strava:** Aproveita dados de 19M+ brasileiros já usando Strava, sem necessidade de tracker próprio (MVP)

**Diferencial Competitivo:**
- Único app brasileiro com feedback técnico IA pós-treino
- Preço 37% menor que Strava Premium (BRL 249,99/ano vs BRL 400+/ano)
- Gamificação desde MVP (vs Strava que não tem coaching)
- Linguagem e cultura local

---

## 2. GOALS & SUCCESS METRICS

### 2.1 Business Goals (Year 1)

**Primary Goal:**  
Atingir 3.200 usuários pagantes com ARR de BRL 1,15M até final de 2026.

**Secondary Goals:**
- D30 Retention Rate: >30%
- CAC: <BRL 75
- LTV/CAC: >30:1
- NPS: >60
- App Store Rating: >4.5 stars

---

### 2.2 Product Success Metrics

**North Star Metric:**
- **Aderência ao Plano:** % de treinos completados conforme planejado pela IA
- **Target MVP:** >60% (beta)
- **Target Year 1:** >70%

**Secondary Metrics:**

1. **Retenção (Viabilidade Negócio):**
   - D1: >40%
   - D7: >30%
   - D30: >30%
   - Month 2: >50%
   - Churn mensal: <10%

2. **Evolução (Eficácia IA):**
   - % usuários melhorando pace em 30-60 dias: >50%
   - Melhoria média de pace: >5% em 8 semanas

3. **Engajamento (Valor Percebido):**
   - % usuários acessando feedback pós-treino: >80%
   - Tempo médio lendo feedback: >60 segundos
   - Feedbacks rated >4 stars: >85%

**Conversion Metrics:**
- Free → Trial: >70%
- Trial → Paid: >40% (com cartão obrigatório)
- Annual vs Monthly: >50% escolhem anual

---

### 2.3 User Impact Goals

**O que queremos que o usuário sinta:**
- **Dia 1:** "Finalmente tenho um plano feito para mim!"
- **Dia 7:** "A IA realmente entende meu treino e me guia"
- **Dia 30:** "Estou evoluindo de forma mensurável e segura"
- **Dia 90:** "Não consigo treinar sem o RunEasy"

**Behavioral Change:**
- De: treinar sem direção, desistir em 2-3 semanas
- Para: treinar consistentemente 3-4x/semana seguindo plano estruturado

---

## 3. TARGET USERS & PERSONAS

### 3.1 Target Market

**TAM (Total Addressable Market):** 7,6M corredores brasileiros 20-35 anos  
**SAM (Serviceable Addressable Market):** 3,2M com disposição a pagar por coaching  
**SOM Year 1 (Serviceable Obtainable Market):** 3.200 usuários pagantes (0,1% SAM)

**Geographic Focus (MVP):**
- São Paulo (Fase 1)
- Rio de Janeiro (Fase 1)
- Expansão: BH, Curitiba, POA, Nordeste (Fase 2)

---

### 3.2 Primary Persona: Carlos, 28 anos - Millennial Aspirante

**Demographics:**
- Idade: 25-32 anos
- Gênero: 65% masculino, 35% feminino
- Renda: BRL 8k-12k/mês
- Localização: Capitais (SP, RJ prioritário)
- Educação: Superior completo
- Profissão: Tech, marketing, finanças, gestão

**Psychographics:**
- Corre: 3-4x/semana há 6-18 meses
- Objetivo: Completar meia maratona em 4-6 meses
- Motivação: Performance mensurável, dados, conquistas
- Frustração: Não sabe se treina certo, planos genéricos não funcionam
- Tech-savvy: Usa Strava religiosamente, Apple Watch/Garmin
- Apps favoritos: Strava, Spotify, Instagram, YouTube

**Pain Points:**
- "Não sei se meu pace está adequado para meu nível"
- "Planos da internet são genéricos, não se adaptam a mim"
- "Personal trainer é muito caro (BRL 10k+/ano)"
- "Quero evoluir mas não sei como periodizar treinos"

**Goals:**
- Sub-2h meia maratona
- Pace <5:30/km consistente
- Treinar sem se machucar
- Medir progresso de forma clara

**Quote:**
> "Eu corro 3x por semana há 1 ano, mas sinto que estou só 'batendo perna'. Não sei se estou evoluindo ou só me cansando."

---

### 3.3 Secondary Persona: Júlia, 23 anos - Gen Z Ativa

**Demographics:**
- Idade: 20-25 anos
- Gênero: 60% feminino, 40% masculino
- Renda: BRL 2k-5k/mês (estudante ou início carreira)
- Localização: Capitais, perto de universidades
- Educação: Superior em andamento

**Psychographics:**
- Corre: 2-3x/semana há 0-6 meses (iniciante absoluta)
- Objetivo: Criar hábito, perder peso, ganhar condicionamento
- Motivação: Estética, redes sociais, gamificação, comunidade
- Frustração: Acha corrida "chata", falta consistência
- Hyper-conectada: TikTok 3h/dia, Instagram 2h/dia
- Apps favoritos: TikTok, Instagram, BeReal, Spotify

**Pain Points:**
- "Corrida é muito chata, preciso de algo que me motive"
- "Não sei por onde começar"
- "Desisto depois de 2 semanas"
- "Quero resultados visíveis rápido"

**Goals:**
- Correr 5K sem parar
- Fazer parte de comunidade fitness
- Compartilhar progresso no Instagram
- Conquistar badges e achievements

**Quote:**
> "Eu tentei correr várias vezes mas sempre desisto. Preciso de algo que transforme isso em um jogo."

---

### 3.4 Tertiary Persona: Rafael, 32 anos - Corredor Intermediário

**Demographics:**
- Idade: 30-35 anos
- Gênero: 70% masculino, 30% feminino
- Renda: BRL 12k-18k/mês
- Profissão: Gerente, diretor, empreendedor

**Psychographics:**
- Corre: 4-5x/semana há 2-5 anos
- Objetivo: Quebrar platô, preparar primeira maratona
- Motivação: Performance, dados avançados, prevenção lesões
- Já completou: 5+ meias maratonas
- Dispositivos: Garmin Forerunner, Strava Premium

**Pain Points:**
- "Estou estagnado no mesmo pace há 6 meses"
- "Não sei como treinar para maratona sem me machucar"
- "Preciso de análise técnica profunda"

**Goals:**
- Sub-4h maratona
- Treinar com periodização científica
- Detectar sinais de overtraining antes de virar lesão

---

## 4. MVP SCOPE & FEATURES

### 4.1 In Scope (MVP - Must Have)

**Core Features (Fase 1 - 16 semanas):**

1. **Autenticação e Onboarding**
   - OAuth Strava (obrigatório)
   - Questionário 6 perguntas (objetivo, nível, frequência, lesões, pace 5K, prazo)
   - Validação inteligente de inconsistências

2. **Treinador IA - Criação de Plano**
   - Plano personalizado 8-16 semanas
   - Detalhamento treino a treino (pace por segmento, objetivo, dicas técnicas)
   - Alocação em dias preferidos pelo usuário
   - Tipos de treino: rodagem leve, long run, intervalados, recovery

3. **Calendário Visual**
   - Visualização mensal/semanal
   - Treinos marcados por tipo (cores/ícones)
   - Tap para ver detalhes do treino
   - Status: pendente, completado, pulado

4. **Integração Strava (Webhooks)**
   - Sincronização automática pós-treino
   - Extração de dados: distância, pace, moving time, elevation, splits/km
   - Linking automático treino planejado ↔ atividade Strava

5. **Feedback Pós-Treino IA (5 Seções)**
   - Hero Message (tom emocional adaptativo)
   - Métricas Detalhadas (tabela comparativa planejado vs executado)
   - Pontos Fortes (lista com ícones)
   - O Que Melhorar + Explicação técnica
   - Impacto na Progressão

6. **Adaptação Dinâmica (Intermediária)**
   - Sugestão de ajuste a cada 2-4 semanas
   - Baseado em: aderência, performance, sinais de fadiga
   - Usuário aprova/rejeita ajuste
   - Se treino pulado: IA pergunta motivo (injury, busy, fadiga) e ajusta

7. **Sistema de Gamificação**
   - Cálculo de Nível do Corredor (métrica composta: performance + consistência + aderência)
   - Sistema de Pontos (50 pts/treino, +25 bonus se conforme planejado)
   - 10 Badges MVP (híbrido: milestones únicos + performance com níveis I/II/III)
   - Badges locked visíveis com critério transparente
   - Notificação contextual (badge aparece no final do feedback)

8. **Home Screen**
   - Header: Nome + Nível atual (badge visual + progress bar)
   - Card: Próximo treino agendado
   - Card: Última atividade + link para feedback
   - Card: Streak atual (dias consecutivos)
   - Pull-to-refresh

9. **Perfil e Settings**
   - Visualização de badges (earned + locked)
   - Total de pontos acumulados
   - Histórico de treinos e feedbacks
   - Settings: notificações, unidade medida, desconectar Strava, exportar dados, deletar conta

10. **Monetização**
    - Paywall após onboarding (tela overview do plano)
    - Trial 14 dias com cartão obrigatório
    - Desconto early-adopter 40% OFF anual (Day 7)
    - Modal retention ao cancelar

---

### 4.2 Out of Scope (Fase 2 - Pós-MVP)

**Não incluído no MVP:**

1. **Análise de Movimentos (Vídeo)**
   - Upload de vídeo para análise biomecânica
   - GCP Vertex AI para pose estimation
   - Feedback de postura e prevenção de lesões

2. **Rede Social Interna**
   - Perfis de usuários
   - Seguir outros corredores
   - Feed de atividades
   - Comentários e kudos

3. **Matching de Eventos**
   - Recomendação inteligente de corridas/provas
   - Integração com Ticket Sports ou similares
   - Filtro por nível, distância, localização

4. **Tracking GPS Nativo**
   - Rastreamento próprio sem depender do Strava
   - Desenvolvimento de módulo GPS

5. **Grupos e Clubes**
   - Descoberta de grupos de corrida
   - Chat entre membros
   - Desafios de grupo

6. **Planos de Treino Avançados**
   - Ultramaratonas (>42km)
   - Trail running específico
   - Multi-sport (triathlon)

---

## 5. FUNCTIONAL REQUIREMENTS

### 5.1 FR-001: Autenticação e Autorização

**Descrição:** Sistema de autenticação via Strava OAuth 2.0

**Requirements:**
- FR-001.1: App deve oferecer única opção de login: "Conectar com Strava"
- FR-001.2: OAuth flow deve redirecionar para Strava, solicitar permissões (read activities, write activities)
- FR-001.3: Após autorização, app deve receber tokens (access + refresh) e salvar encrypted no backend
- FR-001.4: Tokens devem ser refreshed automaticamente quando expirarem (validade: 6h)
- FR-001.5: Se usuário revogar acesso no Strava, app deve detectar e solicitar re-autenticação
- FR-001.6: Backend deve criar registro de usuário em Supabase Auth sincronizado com Strava athlete_id

**Acceptance Criteria:**
- Usuário consegue autenticar em <15 segundos
- Tokens armazenados com criptografia AES-256
- Auto-refresh funciona sem intervenção do usuário
- Erro de autorização exibe mensagem clara

---

### 5.2 FR-002: Onboarding e Questionário Inicial

**Descrição:** Coleta de informações para criação do plano personalizado

**Requirements:**
- FR-002.1: Exibir 6 perguntas sequenciais (1 por tela ou multi-step form):
  1. Qual seu objetivo? [5K, 10K, Meia, Maratona, Fitness Geral]
  2. Qual seu nível atual? [Iniciante 0-6m, Intermediário 6-24m, Avançado 2+anos]
  3. Quantos dias/semana pode treinar? [2, 3, 4, 5, 6, 7]
  4. Tem lesão ou limitação? [Sim/Não + campo texto opcional]
  5. Pace atual aproximado 5K? [Input numérico min/km ou "Não sei"]
  6. Quando quer atingir objetivo? [4sem, 8sem, 12sem, 16+sem]

- FR-002.2: Validação inteligente de inconsistências:
  - Se nível "Iniciante" mas pace <5:00/km → IA questiona: "Seu pace sugere nível intermediário. Confirma iniciante?"
  - Usuário pode confirmar ou corrigir

- FR-002.3: Progress indicator visual (1/6, 2/6...)
- FR-002.4: Botão "Voltar" para corrigir respostas anteriores
- FR-002.5: Validação de campos obrigatórios antes de avançar
- FR-002.6: Salvar respostas no backend (user_onboarding table)

**Acceptance Criteria:**
- Completar onboarding em <90 segundos
- Validação detecta >80% das inconsistências óbvias
- Zero crashes durante questionário
- Dados salvos corretamente no DB

---

### 5.3 FR-003: Criação de Plano de Treino (IA)

**Descrição:** IA gera plano personalizado baseado nas respostas do onboarding

**Requirements:**
- FR-003.1: Após questionário, exibir loading screen "IA criando seu plano..." (10-15s)
- FR-003.2: Backend chama Anthropic Claude API (Sonnet 4.5) com prompt estruturado:
  - System prompt: definição do treinador especialista
  - User input: respostas do questionário + contexto
  - Output esperado: JSON estruturado com plano 8-16 semanas

- FR-003.3: Plano deve conter:
  - Duração total (semanas)
  - Frequência (treinos/semana)
  - Por semana: progressão (ex: "Semana 1-4: Base aeróbica")
  - Por treino:
    - Data sugerida (baseado em dias preferidos)
    - Tipo (rodagem leve, long run, intervalado, recovery)
    - Distância total
    - Instruções detalhadas por segmento:
      - Aquecimento: Xkm @ pace Y-Z/km
      - Ritmo principal: Xkm @ pace Y-Z/km
      - Desaquecimento: Xkm @ pace Y+/km
    - Objetivo do treino (ex: "Desenvolver base aeróbica Zona 2")
    - Dicas técnicas (ex: "Mantenha cadência 170-180")

- FR-003.4: Parse resposta IA e salvar estruturado no DB:
  - training_plans table (plano geral)
  - workouts table (cada treino individual)

- FR-003.5: Se IA falhar (timeout, erro), retry até 3x com exponential backoff
- FR-003.6: Se falhar definitivamente, exibir erro amigável + opção "Tentar novamente"

**Acceptance Criteria:**
- Plano gerado em <20 segundos (p95)
- Plano contém mínimo 8 treinos (2x/semana × 4 semanas)
- Instruções de pace são tecnicamente corretas (baseadas no pace informado)
- 100% dos planos têm estrutura JSON válida
- Taxa de sucesso IA >98%

---

### 5.4 FR-004: Paywall e Monetização

**Descrição:** Controle de acesso ao plano através de paywall com trial obrigatório

**Requirements:**
- FR-004.1: Após criação do plano, exibir tela "Overview Resumida":
  - Card visual: Objetivo (ex: "Meia maratona em 12 semanas")
  - Preview primeiro treino (tipo + distância)
  - Badge inicial: "🎁 Primeiro Passo"
  - Plano completo (calendário) aparece embaçado/bloqueado

- FR-004.2: Único CTA ativo: "Desbloquear Meu Plano de Treino"
- FR-004.3: Tap CTA → Tela de assinatura com 2 opções:
  - Mensal: BRL 29,99/mês
  - Anual: BRL 249,99/ano (economia de 30%)

- FR-004.4: Trial obrigatório: "Experimente 14 dias GRÁTIS"
  - **OBRIGATÓRIO:** Solicitar dados de cartão de crédito
  - Validar cartão (sem cobrança imediata)
  - Cobrança automática no Day 15 se não cancelar

- FR-004.5: Desconto Early-Adopter (primeiros 500 usuários):
  - No Day 7 do trial, enviar push notification + email:
    - "🎉 Você se destacou! Por ser um dos primeiros, ganhe 40% OFF vitalício no plano anual"
    - BRL 249,99 → BRL 149,99/ano
  - Oferta expira em 48h

- FR-004.6: Após confirmação pagamento/trial:
  - Desbloquear calendário completo
  - Redirecionar para Home/Calendário

- FR-004.7: Durante trial, usuário tem acesso completo a todas as features premium

**Acceptance Criteria:**
- Paywall aparece 100% das vezes após onboarding
- Conversão Free → Trial >70%
- Integração com Stripe funcional (pagamentos processados)
- Desconto Day 7 enviado automaticamente
- Trial expira corretamente no Day 14 + cobrança automática Day 15

---

### 5.5 FR-005: Calendário Visual de Treinos

**Descrição:** Interface principal para visualização e acesso aos treinos planejados

**Requirements:**
- FR-005.1: Visualização padrão: mensal (mês atual)
- FR-005.2: Toggle: alternar entre visualização mensal/semanal
- FR-005.3: Treinos marcados no calendário:
  - Cores por tipo: azul (rodagem leve), verde (long run), laranja (intervalado), cinza (recovery)
  - Ícone: 🏃 (corrida), 💪 (tiro), 🔋 (recovery)
  - Distância exibida (ex: "5km")

- FR-005.4: Status visual:
  - Pendente: cor normal
  - Completado: check verde ✅
  - Pulado: X vermelho ❌

- FR-005.5: Tap em treino → Modal com detalhes:
  - Título: "Rodagem Leve - 5km"
  - Instruções completas (aquecimento, ritmo, desaquecimento)
  - Objetivo do treino
  - Dicas técnicas
  - Botão primário: "Iniciar no Strava"
  - Botão secundário: "Marcar como Pulado"

- FR-005.6: Navegação: swipe left/right para mudar mês
- FR-005.7: Indicador visual: dia atual destacado
- FR-005.8: Loading skeleton enquanto carrega treinos do backend

**Acceptance Criteria:**
- Calendário carrega em <2 segundos
- Treinos exibidos corretamente com cores e ícones
- Tap funciona em 100% dos treinos
- Transição entre meses smooth (60fps)

---

### 5.6 FR-006: Integração Strava (Webhooks)

**Descrição:** Sincronização automática de atividades do Strava para análise IA

**Requirements:**
- FR-006.1: Backend deve se inscrever no Strava Webhook (subscription verification)
- FR-006.2: Endpoint webhook deve aceitar eventos do tipo:
  - "create" (nova atividade)
  - "update" (atividade modificada)
  - "delete" (atividade deletada)

- FR-006.3: Ao receber evento "create":
  - Enfileirar job assíncrono (BullMQ ou similar)
  - Job faz GET request para Strava API: `/activities/{id}`
  - Extrair dados obrigatórios (Grupos A+B+D):
    - Grupo A: distance, moving_time, elapsed_time, average_speed, max_speed, start_date
    - Grupo B: total_elevation_gain, average_temp (se disponível)
    - Grupo D: splits_metric (splits por km), start_latlng, map.polyline

- FR-006.4: Salvar atividade em strava_activities table
- FR-006.5: Tentar fazer linking automático com workout planejado:
  - Buscar workout com data = start_date ± 24h
  - Se encontrar, vincular (workout.strava_activity_id = activity.id)
  - Se não encontrar, marcar como "unplanned run"

- FR-006.6: Após salvar atividade, disparar job de geração de feedback IA (FR-007)
- FR-006.7: Rate limiting: respeitar limites Strava (200 req/15min, 2000 req/dia)
- FR-006.8: Retry logic: se falhar, retry até 3x com backoff exponencial

**Acceptance Criteria:**
- Webhook subscrito com sucesso (challenge respondido)
- 100% das atividades "create" são capturadas
- Dados extraídos corretamente (validar splits, elevation)
- Linking automático funciona em >80% dos casos
- Latência webhook → dados salvos: <30 segundos (p95)

---

### 5.7 FR-007: Feedback Pós-Treino (IA - 5 Seções)

**Descrição:** Análise inteligente do treino comparando planejado vs executado

**Requirements:**
- FR-007.1: Trigger: após atividade Strava ser salva (FR-006)
- FR-007.2: Backend chama Claude API com prompt estruturado:
  - Input:
    - Workout planejado (instruções, pace target, distância)
    - Strava activity (dados reais: distance, pace, splits, elevation)
    - Histórico últimas 4 semanas (contexto)
  - Output esperado: JSON estruturado com 5 seções

- FR-007.3: Estrutura do feedback (5 seções):

**Seção 1: Hero Message**
- Tom emocional adaptativo baseado em desempenho:
  - Excepcional (>95% aderência): "Excepcional! Você superou as expectativas 🚀"
  - Bom (80-95%): "Ótimo trabalho! Treino completado com sucesso 💪"
  - Satisfatório (60-80%): "Bom esforço! Continue progredindo 👏"
  - Incompleto (<60%): "O importante é ter saído de casa. Vamos analisar o que aconteceu."

**Seção 2: Métricas Detalhadas (Tabela Comparativa)**
| Métrica | Planejado | Executado | Diferença | Status |
|---------|-----------|-----------|-----------|--------|
| Distância | 10.0km | 10.2km | +2% | ✅ |
| Pace médio | 5:37/km | 5:28/km | -3% | ⚠️ |
| Elevation | 50m | 65m | +30% | ℹ️ |
| Moving time | 56min | 55min | -2% | ✅ |

**Seção 3: Pontos Fortes (Lista)**
- ✅ Consistência de pace (variação <5% entre splits)
- ✅ Disciplina na distância total (+2% dentro da margem)
- ✅ Resiliência (elevation 30% maior que esperado)

**Seção 4: O Que Melhorar + Explicação Técnica**
- ⚠️ Pace médio 3% mais rápido que planejado
  - **Explicação:** "Para treino de base aeróbica (Zona 2), é importante manter ritmo conservador. Pace muito rápido prejudica adaptação aeróbica e aumenta risco de fadiga acumulada."
  - **Sugestão:** "No próximo treino longo, use monitor de frequência cardíaca para garantir Zona 2 (140-150 bpm para seu perfil)."

**Seção 5: Impacto na Progressão**
- "Com base neste treino e nos últimos 7 dias, você está 8% acima do volume planejado. Continuando assim, vou sugerir um ajuste no plano em 2 semanas para otimizar recuperação."

- FR-007.4: Se treino NÃO completado (<50% distância), tom muda para questionador:
  - Hero Message: "Você parou em 5km. O que aconteceu?"
  - Botões: [Cansaço | Dor | Falta de tempo | Outro]
  - Baseado na resposta, IA ajusta próximo treino (FR-008)

- FR-007.5: Salvar feedback em ai_feedbacks table
- FR-007.6: Enviar push notification: "🎉 Sua análise está pronta!"
- FR-007.7: Se usuário conquistou badge durante treino, adicionar seção "Conquistas Desbloqueadas" no final

**Fallback sem Heart Rate:**
- Se activity não tem average_heart_rate, adicionar nota ao final:
  - "💡 Dica: Use monitor cardíaco para análises mais precisas de zonas de treinamento."

**Acceptance Criteria:**
- Feedback gerado em <30 segundos após atividade salva
- 100% dos feedbacks têm 5 seções completas
- Tom emocional correto baseado em aderência
- Explicações técnicas são precisas e didáticas
- Taxa de satisfação feedback (rating 4-5 stars) >85%

---

### 5.8 FR-008: Adaptação Dinâmica do Plano (Intermediária)

**Descrição:** IA sugere ajustes no plano a cada 2-4 semanas baseado em performance

**Requirements:**
- FR-008.1: Trigger: cron job semanal (domingo, 20h)
- FR-008.2: Para cada usuário ativo, verificar:
  - Tempo desde criação do plano: >2 semanas?
  - Última sugestão de ajuste: >2 semanas atrás?

- FR-008.3: Se elegível, IA analisa:
  - % aderência ao plano (últimas 2-4 semanas)
  - Tendência de pace (melhorando, estável, piorando)
  - Volume acumulado vs planejado
  - Sinais de fadiga (pace caindo, treinos pulados por "cansaço")

- FR-008.4: IA gera sugestão de ajuste (JSON):
  - Tipo: "increase_volume" | "decrease_intensity" | "add_recovery" | "stay_course"
  - Justificativa: texto explicativo
  - Mudanças específicas: quais treinos ajustar e como

- FR-008.5: Enviar push notification + email:
  - "📊 Análise de Progresso: Baseado no seu desempenho das últimas 3 semanas, sugiro aumentar volume em 10%. Ver detalhes?"

- FR-008.6: Tela de Sugestão de Ajuste:
  - Resumo da análise
  - Comparação: plano atual vs plano ajustado
  - Botões: [Aceitar Ajuste] [Manter Plano Atual]

- FR-008.7: Se aceitar:
  - Atualizar training_plan e workouts tables
  - Gerar novo calendário
  - Notificar sucesso: "Plano atualizado! Veja suas próximas semanas."

- FR-008.8: Se rejeitar:
  - Salvar decisão (não sugerir mesmo ajuste novamente)
  - Registrar motivo (opcional): "Por que rejeitou?"

**Treino Pulado - Ajuste Imediato:**
- FR-008.9: Se usuário marca treino como "Pulado":
  - Exibir questionário: "O que aconteceu?" [Cansaço | Dor | Falta de tempo | Outro]
  - Baseado na resposta:
    - **Dor:** IA sugere: "Vou adicionar 1 dia de descanso extra e reduzir intensidade 20%"
    - **Cansaço:** "Vou trocar próximo treino intenso por recuperação ativa"
    - **Falta de tempo:** "Vou reorganizar treinos desta semana. Prefere qual dia?"
  - Usuário aprova → workouts reorganizados automaticamente

**Acceptance Criteria:**
- Sugestão enviada para 100% dos usuários elegíveis
- Análise IA tecnicamente correta
- Taxa de aceitação >60%
- Ajuste imediato funciona em <5 segundos

---

### 5.9 FR-009: Sistema de Gamificação (COMPLETO NO DOCUMENTO ANTERIOR)

### 5.10 FR-010: Home Screen (COMPLETO NO DOCUMENTO ANTERIOR)

---

## 6-12: SEÇÕES RESTANTES (COMPLETAS NO DOCUMENTO ANTERIOR)

---

**FIM DO PRD - DOCUMENTO 100% COMPLETO**

---

**Documento preparado por:** NEO - Agente Especialista em Projetos  
**Status:** FINALIZADO E APROVADO