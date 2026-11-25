# Registro de Renomeações, Extrações e Mudanças de Caminho — Lumi Libras

> Documento de apoio para manter o texto e os diagramas do TCC sincronizados com o código organizado na branch `refactor/organizacao-tcc`.

---

## 1. Funções alinhadas ao diagrama de classes do TCC

As regras de gamificação e persistência foram extraídas ou receberam nomes diretos em português para facilitar a localização e a explicação na defesa:

| Nome anterior (e local) | Nome novo / alias | Novo arquivo | Observação |
|---|---|---|---|
| `addStars` (`src/App.tsx`) | `adicionarEstrelas` | `src/logic/gamification.ts` | Função pura que soma estrelas, XP proporcional (`5 × estrelas`), nível e data treinada. |
| cálculo inline de XP (`src/App.tsx`) | `adicionarXP` | `src/logic/gamification.ts` | Soma XP e chama `atualizarNivel`. |
| cálculo inline de nível (`src/App.tsx`) | `atualizarNivel` | `src/logic/gamification.ts` | Calcula `Math.floor(xp / 50) + 1` (sem regredir) e atualiza `levelTitle`. |
| cálculo inline de streak (`src/App.tsx`) | `atualizarSequenciaDias` | `src/logic/gamification.ts` | Incrementa `streakDays` apenas na primeira conclusão do dia. |
| `handleHighFiveReward` inline (`src/App.tsx`) | `registrarRecompensaDiaria` | `src/logic/gamification.ts` | Concede +3 estrelas (+15 XP) e registra `lastHighFiveDate`. |
| `handleCompleteTrailStage` inline (`src/App.tsx`) | `concluirEtapa` | `src/logic/gamification.ts` | Registra o ID da etapa concluída, soma estrelas/XP e atualiza sequência. |
| `addStars` usado no Jogo da Memória (`src/App.tsx`) | `registrarVitoriaMemoria` | `src/logic/gamification.ts` | Encapsula a recompensa de vitória no Jogo da Memória (+5 estrelas). |
| `isStageUnlocked` (`TrailScreen.tsx`) | `estaEtapaLiberada` | `src/logic/gamification.ts` | Regra pura de desbloqueio sequencial das 9 etapas da trilha. |
| `evaluatedAchievements` inline (`AchievementsScreen.tsx`) | `avaliarConquistas` | `src/logic/gamification.ts` | Regra pura de avaliação de conquistas desbloqueadas. |
| cálculo semanal inline (`HomeScreen.tsx`) | `calcularSemanaTreino` | `src/logic/gamification.ts` | Monta os 7 dias (Seg–Dom) da Missão da Semana. |
| `registerWithFirebaseEmail` (`src/services/firebase.ts`) | `cadastrar` *(alias mantido)* | `src/services/firebase.ts` | Mantido o nome original para compatibilidade; `cadastrar` aponta para a mesma função. |
| `loginWithFirebaseEmail` (`src/services/firebase.ts`) | `autenticar` *(alias mantido)* | `src/services/firebase.ts` | Mantido o nome original; `autenticar` aponta para a mesma função. |
| `loadUserFromFirestore` (`src/services/firebase.ts`) | `carregarProgresso` *(alias mantido)* | `src/services/firebase.ts` | Mantido o nome original; `carregarProgresso` aponta para a mesma função. |
| `saveUserToFirestore` (`src/services/firebase.ts`) | `salvarProgresso` *(alias mantido)* | `src/services/firebase.ts` | Mantido o nome original; `salvarProgresso` aponta para a mesma função. |
| `signOutFirebase` (`src/services/firebase.ts`) | `encerrarSessao` *(alias mantido)* | `src/services/firebase.ts` | Mantido o nome original; `encerrarSessao` aponta para a mesma função. |

---

## 2. Novos arquivos criados por modularização (Etapa 3)

| Arquivo original | Novo arquivo extraído | Responsabilidade |
|---|---|---|
| `src/App.tsx`, `HomeScreen.tsx`, `TrailScreen.tsx`, `AchievementsScreen.tsx` | `src/logic/gamification.ts` | Regras puras de gamificação, trilha, conquistas e calendário semanal. |
| `src/components/screens/TrailScreen.tsx` | `src/components/screens/trail/TrailObserveView.tsx` | Passo 1 da trilha: observação das configurações de mão da etapa. |
| `src/components/screens/TrailScreen.tsx` | `src/components/screens/trail/TrailQuizView.tsx` | Passo 2 da trilha: desafio de múltipla escolha com 3 opções visuais. |
| `src/components/screens/TrailScreen.tsx` | `src/components/screens/trail/TrailCelebrationModal.tsx` | Modal de parabéns ao concluir uma etapa (com aviso para visitante). |
| `src/components/screens/HomeScreen.tsx` | `src/components/screens/home/HomeHeroBanner.tsx` | Banner principal da Home com o mascote Lumi e botões de ação. |
| `src/components/screens/HomeScreen.tsx` | `src/components/screens/home/HomeDiscoveryCards.tsx` | Grade dos 4 cards de descoberta (Trilha, Alfabeto, Sinais e Memória). |
| `src/components/screens/HomeScreen.tsx` | `src/components/screens/home/HomeWeeklyMission.tsx` | Cartão de Missão da Semana (Seg–Dom) e card do Jogo da Memória Express. |
| `src/components/modals/AuthModal.tsx` | `src/components/modals/auth/LoginForm.tsx` | Formulário de login por e-mail/senha + botão Google. |
| `src/components/modals/AuthModal.tsx` | `src/components/modals/auth/RegisterForm.tsx` | Formulário de cadastro de nova conta. |

---

## 3. Arquivos removidos por serem código morto ou legado inalcançável (Etapa 2)

| Arquivo removido | Motivo |
|---|---|
| `src/components/HandSignIcon.tsx` | 0 importações no projeto (versão antiga de ícones SVG). |
| `src/components/modals/LessonModal.tsx` | Modal da trilha antiga (`node-1`..`node-6`); nenhum botão do app o abria mais. |
| `src/data/librasTrailLessons.ts` | Usado exclusivamente pelo `LessonModal.tsx` removido. |
| `src/components/media/RealHandSignImage.tsx` | Usado exclusivamente pelo `LessonModal.tsx` removido. |
| `src/components/media/SignVideoPlayer.tsx` | Usado exclusivamente pelo `LessonModal.tsx` removido. |
