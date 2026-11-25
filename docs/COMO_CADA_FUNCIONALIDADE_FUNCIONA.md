# Como Cada Funcionalidade Funciona — Lumi Libras

> Guia passo a passo ligando o que o usuário vê na tela aos arquivos e funções exatos do código.

---

## 1. Landing Page, Login, Cadastro e Visitante
- **Arquivos:** `LandingScreen.tsx`, `AuthModal.tsx`, `auth/LoginForm.tsx`, `auth/RegisterForm.tsx`, `services/firebase.ts`, `utils/auth.ts`, `App.tsx`.
- **Passo a passo:**
  1. Quando `currentUser` é `null`, o `App.tsx` renderiza a `LandingScreen`.
  2. Ao clicar em **Entrar** ou **Criar conta**, abre o `AuthModal` na aba correspondente.
  3. **E-mail/Senha:** `handleLoginSubmit` chama `autenticar()` (Firebase Auth) e `handleRegisterSubmit` chama `cadastrar()`. Se o Firebase responder, o perfil é carregado/criado em `users/{uid}` e salvo no cache local (`saveAccount`). Em caso de indisponibilidade do provedor de e-mail, usa `loginUser`/`registerUser` no `localStorage`.
  4. **Google:** `handleGoogleAuth` chama `signInWithGoogleReal()`, abre o popup OAuth do Google, carrega `users/{uid}` (ou cria um documento limpo na primeira vez) e autentica o aluno.
  5. **Visitante:** `handleExploreAsGuest` no `App.tsx` cria um perfil temporário com ID `guest_session` (sem gravação na nuvem).
  6. **Logout:** `handleLogout` chama `logoutUser()` (limpa sessão local) e `encerrarSessao()` (desloga do Firebase) e volta para a `LandingScreen`.

---

## 2. Tela Inicial (Home) e Missão da Semana
- **Arquivos:** `HomeScreen.tsx`, `home/HomeHeroBanner.tsx`, `home/HomeDiscoveryCards.tsx`, `home/HomeWeeklyMission.tsx`, `logic/gamification.ts`.
- **Passo a passo:**
  1. `HomeScreen` calcula quantas das 9 etapas já estão em `completedTrailNodes` para montar a barra de progresso e o rótulo do botão principal (`Começar` / `Continuar` / `Rever`).
  2. Chama `calcularSemanaTreino(stats)` para gerar os 7 círculos da semana (Segunda a Domingo), comparando `weeklyTrainedDates` com a data local de hoje e bloqueando dias futuros.
  3. Verifica `stats.lastHighFiveDate === getTodayDateString()` para alterar o estado visual do botão **"Toca aqui!"**.
  4. Os 4 cards de descoberta e o botão "Jogo da Memória Express" chamam `onNavigateTab` ou `onStartExpressGame` no `App.tsx`.

---

## 3. Trilha de Aprendizado (9 Etapas A–Z)
- **Arquivos:** `TrailScreen.tsx`, `trail/TrailObserveView.tsx`, `trail/TrailQuizView.tsx`, `trail/TrailCelebrationModal.tsx`, `data/librasTrailAlphabetData.ts`, `logic/gamification.ts`.
- **Passo a passo:**
  1. **Mapa da Trilha:** lista as 9 etapas de `ALPHABET_TRAIL_STAGES`. Para cada etapa, `estaEtapaLiberada(idx, completedStages, ALPHABET_TRAIL_STAGES)` decide se ela está concluída (verde), atual (azul pulsando) ou bloqueada (cadeado).
  2. **Observação (`TrailObserveView`):** ao clicar em uma etapa liberada, mostra as letras da etapa com a ilustração da configuração de mão e dicas.
  3. **Desafio/Quiz (`TrailQuizView`):** ao clicar em "Vamos ao desafio", apresenta uma letra por vez com 3 opções de mão.
     - Em `handleSelectOption`, se `isCorrect === true`, toca som de acerto, dispara confete e aguarda `1100 ms` para avançar para a próxima pergunta (ou chamar `triggerStageCelebration` na última).
     - Se `isCorrect === false`, marca erro em vermelho com animação suave e permite tentar de novo.
  4. **Celebração e salvamento (`TrailCelebrationModal` + `App.tsx`):** `onCompleteStage` dispara `concluirEtapa()` em `gamification.ts`, que grava o ID da etapa, soma estrelas e XP, recalcula nível e atualiza a sequência de dias. O `useEffect` do `App.tsx` sincroniza automaticamente com `localStorage` e Firestore.

---

## 4. Alfabeto em Libras (A–Z)
- **Arquivos:** `AlphabetScreen.tsx`, `data/librasRecoveredData.ts`, `App.tsx`.
- **Passo a passo:**
  1. Renderiza os botões das 26 letras a partir de `RECOVERED_ALPHABET_DATA`.
  2. Ao selecionar uma letra (`handleSelectLetter`), exibe a imagem da mão, palavra de exemplo, orientação anatômica e indica se a letra exige movimento (`isMotion`: H, J, K, X, Y, Z).
  3. Se for a primeira vez que o aluno visita aquela letra, adiciona a letra em `seenAlphabetLetters` e concede `+1` estrela via `handleRewardStars` → `adicionarEstrelas`.
  4. Permite abrir o vídeo demonstrativo da UFSM com controle de velocidade (`0.5x`, `0.75x`, `1x`).

---

## 5. Sinais do Dia a Dia (Acervo UFV)
- **Arquivos:** `DailySignsScreen.tsx`, `data/librasRecoveredData.ts`, `App.tsx`.
- **Passo a passo:**
  1. Filtra os 30 sinais (`RECOVERED_WORDS_DATA`) conforme a categoria escolhida (`RECOVERED_SIGN_CATEGORIES`: Cumprimentos, Família, Escola, Emoções).
  2. Ao abrir um sinal, exibe o player de vídeo com seletor de velocidade (`0.5x`, `0.75x`, `1x`), descrição do movimento e fonte acadêmica (UFV/CEAD).
  3. Quando o aluno marca o sinal como praticado pela primeira vez, adiciona o ID em `practicedWords` e concede `+1` estrela via `adicionarEstrelas`.

---

## 6. Jogo da Memória
- **Arquivos:** `MemoryGameScreen.tsx`, `data/librasRecoveredData.ts`, `logic/gamification.ts`, `App.tsx`.
- **Passo a passo:**
  1. Filtra apenas letras estáticas (`!item.isMotion`), sorteia a quantidade de pares escolhida (4, 6 ou 8 pares) e cria duas cartas para cada letra: uma com a letra escrita (`kind: 'letter'`) e outra com a mão (`kind: 'sign'`), embaralhando o baralho.
  2. Em `handleFlip`, permite virar até 2 cartas por jogada:
     - Se `firstCard.letter === secondCard.letter`: marca par encontrado, toca som de estrela e verifica vitória.
     - Se diferentes: aguarda `1100 ms` para o aluno observar e desvira automaticamente.
  3. Ao completar todos os pares, dispara confete e chama `onRewardStars(5)` → `registrarVitoriaMemoria` (+5 estrelas / +25 XP).

---

## 7. Recompensa Diária ("Toca aqui!" / High Five) e Dicas da Lumi
- **Arquivos:** `HighFiveModal.tsx`, `LumiTipModal.tsx`, `data/librasData.ts`, `logic/gamification.ts`, `App.tsx`.
- **Passo a passo:**
  1. **Toca aqui!:** ao clicar no botão do modal, verifica `alreadyClaimedToday`. Se ainda não resgatou hoje, toca fanfarra, solta confete e chama `registrarRecompensaDiaria(stats, 3)`, somando `+3` estrelas (`+15 XP`) e gravando `lastHighFiveDate = hoje`.
  2. **Dicas da Lumi:** `LumiTipModal` percorre as dicas pedagógicas de `LUMI_TIPS` com botões de anterior/próxima.

---

## 8. Conquistas e Álbum de Figurinhas
- **Arquivos:** `AchievementsScreen.tsx`, `data/librasData.ts`, `logic/gamification.ts`, `App.tsx`.
- **Passo a passo:**
  1. `avaliarConquistas()` combina `ACHIEVEMENTS_DATA` com o progresso do aluno para exibir quais medalhas já estão desbloqueadas.
  2. No álbum de figurinhas, cada figurinha exige um mínimo de estrelas (`requiredStars`). Quando `stats.stars >= sticker.requiredStars`, o aluno pode clicar para resgatar, disparando confete e gravando o ID em `unlockedStickers` (`handleUnlockSticker`).

---

## 9. Acessibilidade e Perfil do Usuário
- **Arquivos:** `AccessibilityModal.tsx`, `ProfileModal.tsx`, `Header.tsx`, `App.tsx`, `src/index.css`.
- **Passo a passo:**
  1. No `AccessibilityModal`, cada interruptor atualiza `progress.stats` (`darkMode`, `highContrast`, `fontSize`, `soundEnabled`).
  2. Os `useEffect`s do `App.tsx` aplicam as classes CSS correspondentes (`.dark`, `.high-contrast`, `.font-size-large`) no `<html>` / `<body>` e salvam a preferência junto ao perfil do aluno.
  3. O `ProfileModal` exibe nome, e-mail, estrelas, sequência, nível atual, barra de progresso até o próximo nível (`xp % 50` de `50 XP`) e o botão de encerrar sessão.
