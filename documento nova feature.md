📄 Especificação Técnica: Estado de Prontidão (Readiness) 

1. Visão Geral e Justificativa Lógica 

A funcionalidade substitui dashboards de gráficos estáticos por um motor de 

decisão proativo . O objetivo é mitigar o risco de lesões (overtraining) e 

otimizar a performance, decidindo se o atleta deve manter o plano, reduzir a 

carga ou descansar. 

+4  

> 

Abordagem de Perguntas: Programada (Hardcoded) via Array de 

Objetos.  

> o

Lógica: Redução de latência e custo de API; garantia de 

consistência no tom de voz e formatação.  

> 

Abordagem de Análise: Inteligência Artificial (Anthropic Claude 3.5/4.5 

Sonnet).  

> o

Lógica: A I.A. atua no cruzamento de dados subjetivos (percepção 

humana) com dados objetivos (carga real do Strava) e 

compromissos futuros (plano de treino). 

+3 

2. Arquitet ura e Fluxo do Sistema 

2.1 Fluxo de Dados (Step -by -Step) 

1.  Trigger (05:00 AM): O sistema (via expo -notifications ou cron job no 

NestJS) emite uma notificação local: "Como você está hoje? Faça seu 

check -in de prontidão" .

2.  Coleta de Input (Mobile): O usuário re sponde a 5 perguntas dinâmicas 

(escala de 1 a 5). O app seleciona um QuestionSetID aleatório do banco 

local para evitar monotonia. 

3.  Orquestração (Backend): O ReadinessService coleta três fontes de 

dados:  

> o

Subjetivo: Respostas do check -in diário (JSON).  

> o

Objet ivo: Carga Aguda (7 dias) e Carga Crônica (28 dias) via 

Strava API. 

+2  

> o

Contextual: Detalhes do treino de "Hoje" e "Amanhã" do 

training_plans. +1 

4.  Processamento IA: Os dados são enviados para o Claude com um 

prompt de "Head Coach". 

+1 

5.  Resposta e Renderização : O backend devolve um JSON estruturado; o 

frontend utiliza Zustand para gerenciar o estado e preencher o Gauge 

(medidor) e o card de análise. 

+1 

3. Engenharia de Prompt (Prompt Engineering) 

Este prompt deve ser utilizado no AnthropicService para gerar o veredito: 

System Prompt: 

"Você é o 'Head Coach IA' da RunEasy. Sua missão é decidir se o atleta deve 

manter o plano, reduzir a carga ou descansar hoje. 

Inputs Recebidos: 

1.  Check -in (1 -5): Sono, Dor, Energia, Estresse, Motivação. 

2.  Strava (Objetiv o): Carga Aguda (7d) vs Crônica (28d). 

3.  Plano (Futuro): Detalhes do treino de hoje e amanhã. 

Lógica de Análise (Prioridade Máxima):  

> 

Se Treino de Hoje = 'Alta Intensidade' E ('Dor Muscular' > 3 OU 'Sono' < 

3), sugira obrigatoriamente um 'Downgrade' ou 'Recup eração Ativa'.  

> 

Se Carga Aguda > 1.3x Carga Crônica, o risco de lesão é crítico; sugira 

'Descanso' independente da motivação. 

Output: Retorne APENAS um objeto JSON válido, sem explicações externas." 

4. Estrutura de Dados (Schema JSON) 

O contrato de interf ace entre Backend e Mobile deve seguir este padrão para 

garantir a renderização visual correta: 

JSON 

{

"readiness_score": 0 -100, "status_color": "green | yellow | red", 

"status_label": "String (ex: Pronto para o Desafio)", 

"ai_analysis": { 

"hea dline": "Frase de efeito curta", 

"reasoning": "Explicação técnica cruzando sono/carga/dor", 

"plan_adjustment": "Instrução prática para o treino de hoje" 

}, 

"metrics_summary": [ 

{ "label": "Sono", "value": 1 -5, "icon": "bed" }, 

{ "label ": "Carga Strava", "value": "Texto", "icon": "trending -up" } 

]

}

5. Banco de Dados de Perguntas (Hardcoded) 

O sistema deve alternar entre conjuntos para manter o engajamento. 

Conjunto 1: Foco em Energia Corporal  

> 

Sono: Quão completa foi sua recarga de b ateria esta noite? (1: 0% a 5: 

100%)  

> 

Dor: Algum sinal de 'alerta' nos músculos após o treino anterior? (1: 

Muita dor a 5: Perfeito)  

> 

Energia: Quão leve você sente o corpo para calçar o tênis agora? (1: 

Pesado a 5: Flutuando)  

> 

Mental: Como está o peso das pre ocupações hoje? (1: Esmagador a 5: 

Leve)  

> 

Desejo: Qual a sua pressa para iniciar o cronômetro? (1: Nenhuma a 5: 

Máxima) 

Conjunto 2: Foco em Prontidão Técnica  

> 

Sono: Quantas vezes o seu descanso foi interrompido? (1: Muitas a 5: 

Nenhuma)  

> 

Dor: Suas pernas estão pedindo um dia de gelo ou mais km? (1: Gelo a 

5: Mais KM)  Sentimento: Você se descreveria hoje como: (1: Esgotado a 5: 

Invencível)  

> 

Foco: Quão concentrado você está nos seus objetivos de corrida hoje? 

(1: Distraído a 5: Foco Total)  

> 

Prepar ação: Se o treino fosse uma maratona hoje, você: (1: Desistia a 

5: Vencia) 

6. Integração com Módulos Existentes  

> 

Strava Module: Fornece o cálculo de ACWR (Acute:Chronic Workload 

Ratio). 

+1  

> 

Training Module: Fornece o plan_json para que a IA saiba o que est ava 

previsto.  

> 

Notification Module: Agenda os triggers diários às 05:00 AM.  

> 

Zustand (Frontend): Gerencia o readinessStore para armazenar a 

resposta do dia e evitar chamadas repetidas à API.