# Guia de Estudo para a Defesa do TCC — Lumi Libras

> Use este roteiro para estudar por ordem de prioridade. Você **não precisa decorar cada linha de CSS** — foque em dominar a arquitetura, as regras de negócio e a segurança.

---

## Nível 1 — ESSENCIAL (precisa dominar com segurança)

### 1. Orquestração central do aplicativo (`src/App.tsx`)
- **Onde olhar:** `src/App.tsx` (linhas 75–220 para estados, efeitos e ações; linhas 290–455 para a montagem das telas e modais).
- **O que entender:** O `App.tsx` funciona como o "maestro" do sistema. Ele guarda quem está logado (`currentUser`), todo o progresso agrupado (`progress`), a aba ativa (`currentTab`) e os modais (`modals`). Se `currentUser` for `null`, mostra a `LandingScreen`; se estiver logado, renderiza `Sidebar` + `Header` + a tela selecionada.
- **Exemplo de pergunta da banca:** *"Como funciona a navegação entre telas se vocês não usaram React Router?"*
  - **Como responder:** *"Como o Lumi Libras é uma SPA focada em sessões de estudo guiadas, controlamos a tela ativa por um estado tipado (`currentTab: TabType`) no `App.tsx`. Isso simplifica o código e evita problemas de rotas profundas em hospedagem estática como o GitHub Pages."*

### 2. Regras de gamificação e progressão (`src/logic/gamification.ts`)
- **Onde olhar:** `src/logic/gamification.ts` (linhas 1–260 — o arquivo inteiro é curto e muito claro!).
- **O que entender:** Todas as regras são **funções puras** com os mesmos nomes do diagrama de classes:
  - `adicionarEstrelas` (+5 XP por estrela) e `adicionarXP`
  - `atualizarNivel` (`Math.floor(xp / 50) + 1`, nunca regride)
  - `atualizarSequenciaDias` (incrementa `streakDays` apenas 1 vez por dia usando `todayCompleted`)
  - `registrarRecompensaDiaria` ("Toca aqui!": +3 estrelas uma vez por dia via `lastHighFiveDate`)
  - `concluirEtapa` e `estaEtapaLiberada` (Etapa 1 livre; Etapa N exige Etapa N-1 concluída)
  - `registrarVitoriaMemoria` (+5 estrelas ao vencer o Jogo da Memória)
  - `calcularSemanaTreino` (calendário real de segunda a domingo, nunca marcando dias futuros)
- **Exemplo de pergunta da banca:** *"Como vocês garantem que um aluno não ganhe vários dias de sequência jogando 10 vezes no mesmo dia?"*
  - **Como responder:** *"Na função `atualizarSequenciaDias` em `src/logic/gamification.ts`, verificamos o campo booleano `todayCompleted`. O incremento de `streakDays` só acontece quando `!stats.todayCompleted`, marcando em seguida `todayCompleted = true` e registrando a data local `YYYY-MM-DD` em `weeklyTrainedDates` sem duplicar."*

### 3. Autenticação e banco de dados na nuvem (`src/services/firebase.ts` e `firestore.rules`)
- **Onde olhar:** `src/services/firebase.ts` (linhas 90–255) e `firestore.rules` (linhas 46–65).
- **O que entender:** O app usa Firebase Auth (e-mail/senha e Google) e grava um documento por usuário em `users/{uid}` usando `setDoc(..., { merge: true })`. Antes de escrever, o cliente confere `auth.currentUser.uid === user.id`, e no servidor o arquivo `firestore.rules` bloqueia qualquer tentativa de acessar dados de outro `uid`.
- **Exemplo de pergunta da banca:** *"A chave `apiKey` do Firebase aparece no código do frontend. Isso não é uma falha de segurança?"*
  - **Como responder:** *"Não. Na arquitetura do Firebase Web, a `apiKey` é um identificador público do projeto, não um segredo administrativo. A segurança real está nas regras do lado do servidor (`firestore.rules`), que exigem autenticação válida e restringem leitura e escrita exclusivamente ao dono do documento (`request.auth.uid == userId`), além dos domínios autorizados no Firebase Authentication."*

### 4. Fluxo da Trilha de Aprendizado (`src/components/screens/TrailScreen.tsx`)
- **Onde olhar:** `src/components/screens/TrailScreen.tsx` (linhas 45–175) e subcomponentes em `src/components/screens/trail/`.
- **O que entender:** Cada uma das 9 etapas segue uma sequência pedagógica em 3 momentos: **Mapa da Trilha** → **Passo 1: Observar as mãos** (`TrailObserveView`) → **Passo 2: Quiz de 3 opções** (`TrailQuizView`) → **Modal de celebração** (`TrailCelebrationModal`). Errar uma questão não penaliza nem tira vidas — o aluno pode tentar novamente com calma.
- **Exemplo de pergunta da banca:** *"Por que vocês não colocaram sistema de vidas ou cronômetro no quiz?"*
  - **Como responder:** *"Por decisão pedagógica e de acessibilidade: o público-alvo são iniciantes em Libras (incluindo crianças e familiares). Remover punição por erro reduz a ansiedade e incentiva a observação e imitação das configurações de mão no ritmo de cada aprendiz."*

---

## Nível 2 — IMPORTANTE (precisa entender bem a lógica)

### 5. Autenticação Firebase e modo visitante (`src/components/modals/AuthModal.tsx` e `src/utils/auth.ts`)
- **Onde olhar:** `src/components/modals/AuthModal.tsx` (linhas 15–135) e `src/utils/auth.ts` (linhas 35–75 e 100–165).
- **O que entender:** O `AuthModal` autentica e cadastra exclusivamente via Firebase Authentication (e-mail/senha ou Google), traduzindo todos os códigos de erro do Firebase para mensagens claras em português (`obterMensagemErroFirebase`) e gravando o cache local da sessão em `localStorage`. Já o modo visitante cria uma conta temporária `guest_session` em memória (não grava no Firestore) e exibe um aviso amigável após a primeira etapa concluída.
- **Exemplo de pergunta da banca:** *"O que acontece se alguém usar o app sem criar conta?"*
  - **Como responder:** *"O modo visitante instancia um perfil limpo com ID `guest_session`. Como o `App.tsx` só sincroniza no Firestore contas com UID real do Firebase, o visitante explora todo o app sem gravar dados no banco e recebe um convite para criar conta ao concluir uma etapa."*

### 6. Acessibilidade na prática (`src/components/modals/AccessibilityModal.tsx`, `src/App.tsx` e `src/index.css`)
- **Onde olhar:** `src/App.tsx` (linhas 150–170) e `src/index.css` (classes `.dark`, `.high-contrast` e `.font-size-large`).
- **O que entender:** Os toggles do modal alteram campos de `stats` (`darkMode`, `highContrast`, `fontSize`, `soundEnabled`), e `useEffect`s no `App.tsx` aplicam/removem classes CSS na raiz do documento (`<html>` e `<body>`). As preferências também ficam salvas no perfil do usuário.
- **Exemplo de pergunta da banca:** *"Como funciona o aumento de fonte e o alto contraste?"*
  - **Como responder:** *"Quando o usuário ativa essas opções no modal de acessibilidade, o `App.tsx` aplica as classes `font-size-large` (que escala a raiz tipográfica em +22%) e `high-contrast` (que reforça contrastes de texto e bordas) definidas em `src/index.css`, refletindo imediatamente em todas as telas."*

### 7. Datas locais e Missão Semanal (`src/utils/storage.ts` e `src/logic/gamification.ts`)
- **Onde olhar:** `src/utils/storage.ts` (linhas 1–25) e `calcularSemanaTreino` em `src/logic/gamification.ts` (linhas 210–255).
- **O que entender:** As datas são formatadas usando o horário local (`getFullYear`, `getMonth`, `getDate`) em vez de `toISOString()` (UTC), evitando que a virada do dia aconteça às 21h no Brasil. A semana sempre vai de segunda a domingo e bloqueia a marcação de dias futuros.

### 8. Feedback sonoro e comunicação visual (`src/utils/sound.ts`)
- **Onde olhar:** `src/utils/sound.ts` (linhas 1–45 e 170–190).
- **O que entender:** Usa `Web Audio API` (osciladores simples) para gerar sons de feedback leve sem depender de arquivos de áudio externos. A síntese de fala (`speechSynthesis`) é cancelada propositalmente porque o foco do Lumi Libras é comunicação visual.

---

## Nível 3 — SABER QUE EXISTE (basta saber explicar a ideia geral)

- **Acervo de dados pedagógicos (`src/data/`):**
  - `librasTrailAlphabetData.ts`: 9 etapas da trilha (`etapa_1`..`etapa_9`) com ilustrações das mãos e perguntas.
  - `librasRecoveredData.ts`: 26 letras do alfabeto (marcando as 6 letras com movimento: H, J, K, X, Y, Z) e 30 sinais do cotidiano com vídeos da UFV/CEAD.
  - `librasData.ts`: conquistas (`ACHIEVEMENTS_DATA`) e dicas da Lumi (`LUMI_TIPS`).
  - `librasMediaData.ts`: créditos institucionais (UFSM, UFV/CEAD e UTFPR — fonte Libras 2016).
- **Jogo da Memória (`src/components/screens/MemoryGameScreen.tsx`):** filtra apenas letras sem movimento (`!isMotion`) para que cartas estáticas não confundam o aluno, embaralha pares (letra escrita + configuração de mão) e concede +5 estrelas ao vencer.
- **Telas de exploração livre (`AlphabetScreen.tsx`, `DailySignsScreen.tsx`, `AchievementsScreen.tsx`, `CreditsCuriositiesScreen.tsx`):** permitem consultar letras em câmera lenta, assistir aos vídeos de sinais cotidianos, resgatar figurinhas por estrelas e conhecer a cultura/legislação da Libras (Lei nº 10.436/2002).
- **Deploy automatizado (`.github/workflows/deploy.yml` e `vite.config.ts`):** a cada push na `main`, o GitHub Actions executa `npm ci` e `npm run build` (com `base: '/Lumi-libras-V-final/'`) e publica a pasta `dist/` no GitHub Pages.
