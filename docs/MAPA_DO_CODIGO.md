# Mapa do Código — Lumi Libras (Etapa 1)

> **Data do levantamento:** 24/11/2026  
> **Branch:** `main`  
> **Status:** Análise somente leitura (nenhum arquivo de `src/` foi alterado nesta etapa)  
> **Total atual em `src/`:** 35 arquivos · 9.500 linhas

---

## a) Inventário de todos os arquivos em `src/`

Legenda de importância:
- **Essencial:** núcleo do app; sem ele o sistema não funciona ou perde funcionalidades principais do TCC.
- **Importante:** agrega gamificação, acessibilidade, áudio, feedbacks ou telas complementares relevantes.
- **Secundário:** apoio visual/informativo ou código legado/morto que não entra no fluxo atual.

### Entrada, configuração e tipos

| Arquivo | Linhas | O que faz | Quem usa | Importância |
|---|---:|---|---|---|
| `src/main.tsx` | 5 | Ponto de entrada React que monta o componente `<App />` na `#root` do `index.html`. | `index.html` | Essencial |
| `src/App.tsx` | 625 | Orquestra autenticação, estado global do usuário, navegação entre abas, efeitos de acessibilidade, sincronização com Firestore e todos os modais. | `src/main.tsx` | Essencial |
| `src/index.css` | 179 | Carrega Tailwind CSS v4, a fonte `Libras-2016.ttf`, modo escuro, alto contraste, escala de fonte (`font-size-large`) e animações. | `src/main.tsx` | Essencial |
| `src/types/index.ts` | 122 | Define as interfaces e tipos TypeScript compartilhados (`TabType`, `UserStats`, tipos da Trilha, conquistas e tipos legados). | Quase todo `src/` | Essencial |

### Serviços e utilitários

| Arquivo | Linhas | O que faz | Quem usa | Importância |
|---|---:|---|---|---|
| `src/services/firebase.ts` | 249 | Inicializa Firebase Auth e Firestore e implementa cadastro/login por e-mail, login com Google, leitura/gravação em `users/{uid}` e logout. | `App.tsx`, `AuthModal.tsx` | Essencial |
| `src/utils/auth.ts` | 165 | Gerencia o cache local da sessão ativa no `localStorage`, o modo visitante, a estrutura `UserAccount` e a criação de progresso inicial. | `App.tsx`, `AuthModal.tsx`, `ProfileModal.tsx`, `firebase.ts` | Essencial |
| `src/utils/storage.ts` | 131 | Fornece datas locais (`getTodayDateString`) e títulos por nível (`getLevelTitle`), além de um sistema antigo de `localStorage` não mais usado. | `App.tsx`, `Header.tsx`, `auth.ts` | Essencial |
| `src/utils/sound.ts` | 229 | Gera efeitos sonoros via Web Audio API (pop, acerto, erro, estrela, celebração) e desativa narração por voz (`speechSynthesis.cancel`). | `App.tsx` e quase todas as telas/modais | Importante |

### Componentes de layout e reutilizáveis

| Arquivo | Linhas | O que faz | Quem usa | Importância |
|---|---:|---|---|---|
| `src/components/Header.tsx` | 226 | Barra superior fixa com logo, título da tela, estrelas, XP/nível, botão de acessibilidade, tema escuro e perfil do usuário. | `App.tsx` | Essencial |
| `src/components/Sidebar.tsx` | 235 | Menu lateral fixo (desktop) e gaveta deslizante (mobile) para navegar entre as 7 telas do app e sair da conta. | `App.tsx` | Essencial |
| `src/components/BottomCompanionBar.tsx` | 155 | Barra inferior com o mascote Lumi exibindo mensagens motivacionais e atalhos para "Toca aqui!" e "Dica da Lumi". | `App.tsx` | Importante |
| `src/components/LumiMascot.tsx` | 57 | Renderiza a imagem do mascote Lumi em tamanhos e estilos configuráveis (com animação opcional). | `HomeScreen`, `BottomCompanionBar`, `HighFiveModal`, `LumiTipModal`, `LessonModal` | Importante |
| `src/components/HandSignIcon.tsx` | 142 | Desenhava ícones SVG manuais de sinais de Libras (versão inicial do projeto). | **Ninguém (código morto)** | Secundário |
| `src/components/media/RealHandSignImage.tsx` | 87 | Exibe foto/ilustração de configuração de mão a partir de `REAL_ALPHABET_MEDIA`. | Apenas `LessonModal.tsx` *(inalcançável)* | Secundário |
| `src/components/media/SignVideoPlayer.tsx` | 263 | Player de vídeo com controles de velocidade para lições antigas. | Apenas `LessonModal.tsx` *(inalcançável)* | Secundário |

### Telas (`src/components/screens/`)

| Arquivo | Linhas | O que faz | Quem usa | Importância |
|---|---:|---|---|---|
| `src/components/screens/LandingScreen.tsx` | 299 | Página inicial pública (antes do login) apresentando o Lumi Libras com botões de entrar, cadastrar e explorar como visitante. | `App.tsx` | Essencial |
| `src/components/screens/HomeScreen.tsx` | 644 | Painel principal do aluno: banner da Lumi, atalhos das áreas, progresso da trilha, missão semanal (Seg–Dom), desafio rápido e dicas. | `App.tsx` | Essencial |
| `src/components/screens/TrailScreen.tsx` | 756 | Trilha guiada de 9 etapas do alfabeto em Libras: mapa com desbloqueio sequencial, tela de observação, quiz interativo e celebração. | `App.tsx` | Essencial |
| `src/components/screens/AlphabetScreen.tsx` | 347 | Catálogo interativo do alfabeto A–Z com configuração de mão, filtro de letras com movimento (H, J, K, X, Y, Z) e modal de detalhes. | `App.tsx` | Essencial |
| `src/components/screens/DailySignsScreen.tsx` | 343 | Biblioteca de 30 sinais do cotidiano em vídeo (acervo UFV) organizados por 4 categorias, com busca e marcação de praticado. | `App.tsx` | Essencial |
| `src/components/screens/MemoryGameScreen.tsx` | 363 | Jogo da memória combinando letra escrita e sinal em Libras, com contagem de tentativas, pares encontrados e recompensa em estrelas. | `App.tsx` | Essencial |
| `src/components/screens/AchievementsScreen.tsx` | 229 | Galeria de conquistas e coleção de figurinhas da Lumi desbloqueáveis por estrelas acumuladas. | `App.tsx` | Importante |
| `src/components/screens/CreditsCuriositiesScreen.tsx` | 396 | Tela "Fontes e Curiosidades" com fatos sobre Libras, créditos acadêmicos (UFV, INES, fontes) e informações do projeto. | `App.tsx` | Importante |

### Modais (`src/components/modals/`)

| Arquivo | Linhas | O que faz | Quem usa | Importância |
|---|---:|---|---|---|
| `src/components/modals/AuthModal.tsx` | 250 | Modal de login e cadastro exclusivamente via Firebase Authentication (e-mail/senha + botão Google) com mensagens de erro em português. | `App.tsx` | Essencial |
| `src/components/modals/AccessibilityModal.tsx` | 179 | Modal de configurações de acessibilidade: modo escuro, alto contraste, fonte ampliada e sons. | `App.tsx` | Importante |
| `src/components/modals/ProfileModal.tsx` | 144 | Modal de perfil do aluno exibindo nome, e-mail, nível, barra de XP, estrelas, etapas concluídas e botão de logout. | `App.tsx` | Importante |
| `src/components/modals/HighFiveModal.tsx` | 112 | Modal da recompensa diária "Toca aqui!" que concede +3 estrelas (+15 XP) uma vez por dia. | `App.tsx` | Importante |
| `src/components/modals/LumiTipModal.tsx` | 116 | Modal que sorteia e exibe dicas pedagógicas da Lumi sobre Libras (`LUMI_TIPS`). | `App.tsx` | Importante |
| `src/components/modals/MediaCreditsModal.tsx` | 109 | Modal exibindo os créditos detalhados das mídias (`CREDITS_DATA`). | `App.tsx` | Secundário |
| `src/components/modals/LessonModal.tsx` | 545 | Modal antigo de lição por nó (`node-1`..`node-6`) da versão anterior da trilha. | `App.tsx` *(renderizado, mas nunca aberto)* | Secundário |

### Dados (`src/data/`)

| Arquivo | Linhas | O que faz | Quem usa | Importância |
|---|---:|---|---|---|
| `src/data/librasTrailAlphabetData.ts` | 543 | Conteúdo oficial das 9 etapas (`etapa_1`..`etapa_9`) da Trilha de Aprendizado, com letras, imagens e perguntas de quiz. | `HomeScreen.tsx`, `TrailScreen.tsx` | Essencial |
| `src/data/librasRecoveredData.ts` | 374 | Conteúdo oficial do Alfabeto (26 letras + lista de movimento) e dos 30 sinais do cotidiano com vídeos da UFV. | `AlphabetScreen.tsx`, `DailySignsScreen.tsx`, `MemoryGameScreen.tsx` | Essencial |
| `src/data/librasData.ts` | 531 | Contém `ACHIEVEMENTS_DATA` e `LUMI_TIPS` (usados) + 3 listas antigas (`ALPHABET_DATA`, `DAILY_SIGNS`, `TRAIL_NODES`) sem uso. | `AchievementsScreen.tsx`, `LumiTipModal.tsx` | Importante *(com ~450 linhas mortas)* |
| `src/data/librasMediaData.ts` | 435 | Contém `CREDITS_DATA` (usado) + `REAL_ALPHABET_MEDIA` (só no legado) + `REAL_SIGNS_MEDIA` (nunca usado). | `MediaCreditsModal.tsx`, `RealHandSignImage.tsx` | Secundário *(com ~410 linhas mortas/legadas)* |
| `src/data/librasTrailLessons.ts` | 284 | Conteúdo das 6 lições antigas (`node-1`..`node-6`) usadas apenas pelo `LessonModal` inalcançável. | Apenas `LessonModal.tsx` *(inalcançável)* | Secundário |

---

## b) Código morto, inalcançável ou duplicado

### 1. Arquivo 100% morto (zero referências)
- **`src/components/HandSignIcon.tsx`** (142 linhas): confirmado por busca em todo o repositório — nenhum arquivo importa ou referencia `HandSignIcon`.

### 2. Cadeia legada e inalcançável da Trilha antiga (`LessonModal` — ~1.180 linhas)
Na versão anterior do app, a trilha usava 6 nós (`node-1` até `node-6`) abertos dentro do `LessonModal`. Hoje, a trilha foi substituída pela `TrailScreen` (9 etapas `etapa_1`..`etapa_9`):
- Em `src/App.tsx:241-250`, `handleOpenLesson(nodeId?)` só abre o `LessonModal` se receber um `nodeId`.
- O único componente que recebe `onOpenLesson` é o `HomeScreen` (`src/components/screens/HomeScreen.tsx:28`), e ele **nunca chama `onOpenLesson`** — todos os botões da Home navegam direto para a aba `'trail'`.
- Com isso, **4 arquivos inteiros nunca são executados pelo usuário**:
  1. `src/components/modals/LessonModal.tsx` (545 linhas)
  2. `src/data/librasTrailLessons.ts` (284 linhas)
  3. `src/components/media/SignVideoPlayer.tsx` (263 linhas)
  4. `src/components/media/RealHandSignImage.tsx` (87 linhas)
- E em `src/App.tsx`: os estados `isLessonOpen`, `activeLessonNodeId`, e a função `handleLessonCompleted` (linhas 283–314) também nunca são acionados.

> **Ponto para decisão:** Embora comprovadamente inalcançáveis, representam 4 arquivos grandes. Só serão removidos na Etapa 2 se você confirmar.

### 3. Análise dos 5 arquivos em `src/data/` (sobreposições e dados sem uso)

| Arquivo | Export | Status | Observação |
|---|---|---|---|
| `librasTrailAlphabetData.ts` | `ALPHABET_TRAIL_STAGES` | **Ativo** | Alimenta `TrailScreen` e `HomeScreen`. |
| `librasRecoveredData.ts` | `ALPHABET_ITEMS`, `DAILY_SIGNS_CATEGORIES`, `DAILY_SIGNS_ITEMS`, `MOTION_LETTERS` | **Ativo** *(exceto `MOTION_LETTERS`)* | Alimenta `AlphabetScreen`, `DailySignsScreen` e `MemoryGameScreen`. `MOTION_LETTERS` é importado em `AlphabetScreen`, mas não é usado (a tela já usa `item.isMotion`). |
| `librasData.ts` | `ACHIEVEMENTS_DATA`, `LUMI_TIPS` | **Ativo** | Usados em `AchievementsScreen` e `LumiTipModal` (~75 linhas). |
| `librasData.ts` | `ALPHABET_DATA`, `DAILY_SIGNS`, `TRAIL_NODES` | **Morto (duplicado/antigo)** | **~450 linhas sem nenhum import no projeto**, substituídas por `librasRecoveredData.ts` e `librasTrailAlphabetData.ts`. |
| `librasMediaData.ts` | `CREDITS_DATA` | **Ativo** | Usado apenas em `MediaCreditsModal` (24 linhas). |
| `librasMediaData.ts` | `REAL_ALPHABET_MEDIA` | **Só legado** | Usado apenas por `RealHandSignImage.tsx` (que só é usado pelo `LessonModal` inalcançável). |
| `librasMediaData.ts` | `REAL_SIGNS_MEDIA` | **Morto** | Zero imports no projeto inteiro. |
| `librasTrailLessons.ts` | `TRAIL_LESSONS_CONTENT` | **Só legado** | Usado apenas pelo `LessonModal` inalcançável. |

**Resumo da sobreposição:** Não há duplicação de dados *ativos* em conflito (as telas ativas já leem de `librasTrailAlphabetData.ts` e `librasRecoveredData.ts`). O que existe em `librasData.ts`, `librasMediaData.ts` e `librasTrailLessons.ts` são versões antigas abandonadas lado a lado com 3 listas pequenas ainda em uso (`ACHIEVEMENTS_DATA`, `LUMI_TIPS` e `CREDITS_DATA`).

### 4. Funções e tipos não usados em `src/utils/` e `src/types/`
- **`src/utils/storage.ts`:** `STORAGE_KEY`, `SavedUserData`, `DEFAULT_USER_DATA`, `getYesterdayDateString`, `loadUserData` e `saveUserData` têm **zero imports** (o projeto passou a salvar tudo via `src/utils/auth.ts` + `src/services/firebase.ts`). Apenas `getTodayDateString` e `getLevelTitle` são usados (e `getLocalDateString` como auxiliar).
- **`src/utils/auth.ts`:** `loginWithGoogle` (linhas 154–170, simulação antiga de login Google) tem **zero imports** — o `AuthModal` usa `signInWithGoogleReal` do Firebase.
- **`src/utils/sound.ts`:** `playSound.cardFlip` e `playSound.matchSuccess` nunca são chamados. Já `speakText` existe de propósito como função vazia que chama `speechSynthesis.cancel()` para garantir que a narração fique desligada.
- **`src/types/index.ts`:** `AlphabetLetter`, `SignItem`, `MemoryCard` e `TrailNode` só são referenciados pelas listas mortas de `librasData.ts` (o `MemoryGameScreen` define sua própria interface local `MemoryCard`).

### 5. Imports, variáveis e props sobrando
- `HomeScreen.tsx`: imports `Play`, `Lock`, `Gift`, `WholeWord` sem uso; prop `onOpenLesson` nunca chamada.
- `TrailScreen.tsx`: imports `RotateCcw`, `Lightbulb`, `HelpCircle` sem uso; prop `onOpenTip` nunca chamada.
- `AlphabetScreen.tsx`: imports `useEffect`, `MOTION_LETTERS`, `Check` sem uso.
- `DailySignsScreen.tsx`: imports `useEffect`, `Play` sem uso.
- `MemoryGameScreen.tsx`: imports `Trophy`, `Sparkles`, `Check` sem uso.
- `AchievementsScreen.tsx`: import `Achievement` sem uso; prop `onRewardStars` nunca chamada.
- `CreditsCuriositiesScreen.tsx`: imports `Award`, `BookOpen`, `HeartHandshake` sem uso; props `stats` e `onOpenMediaCredits` não usadas.
- `MediaCreditsModal.tsx`: imports `BookOpen`, `Heart`, `Award` sem uso.
- `Sidebar.tsx`: prop `onOpenTipModal` recebida mas não usada.

### 6. Restos do recurso de daltonismo (`colorblindMode`)
- `src/types/index.ts:21`: campo opcional `colorblindMode?: boolean;` em `UserStats`. **Será mantido** com comentário de campo legado para preservar compatibilidade com documentos antigos no Firestore.
- `src/App.tsx:186-189`: `useEffect` defensivo que chama `document.body.classList.remove('colorblind-mode')` ao montar. Não há mais nenhum CSS `.colorblind-mode` em `src/index.css`.

### 7. Restos do Google AI Studio
- **No código `src/`:** nenhum código ou dependência do Gemini/AI Studio encontrado.
- **Em `firebase-applet-config.json`:** o campo `firestoreDatabaseId` tem o valor `"ai-studio-lumilibras-ced03eec-fdaa-48cd-a920-15f8ba7b7732"`. **Não deve ser alterado**, pois esse é o identificador real do banco Firestore criado no Google Cloud.
- **URLs de fallback em `LandingScreen.tsx`, `Sidebar.tsx` e `AuthModal.tsx`:** possuem `onError` apontando para uma imagem hospedada em `lh3.googleusercontent.com/aida-public/...` caso o asset local falhe (inofensivo, não exibe marca do AI Studio).

---

## c) Arquivos muito grandes ou com responsabilidades misturadas

1. **`src/components/screens/TrailScreen.tsx` (756 linhas)**
   - Mistura **4 telas/modos em um só arquivo**: (1) mapa visual da trilha com bloqueio sequencial, (2) modo de observação das letras da etapa, (3) modo de quiz com validação, confete e temporizador, e (4) modal de celebração + aviso para usuário visitante.
   - Também contém regra de negócio (`isStageUnlocked`) misturada à interface.

2. **`src/components/screens/HomeScreen.tsx` (644 linhas)**
   - Mistura **6 blocos visuais distintos** (Hero com mascote, 4 cards de descoberta, card de progresso da trilha, calendário semanal Seg–Dom, card de desafio rápido de memória e banners de dicas/curiosidades) junto com o **cálculo de datas da semana** (linhas 60–109) feito inline no corpo do componente.

3. **`src/App.tsx` (625 linhas)**
   - Mistura **18+ estados soltos (`useState`)** (usuário, aba, menu mobile, 6 estados de progresso, 8 booleanos de modais, modo do jogo da memória, aviso visitante), **6 `useEffect`** (carga de progresso, sincronização localStorage+Firestore, tema escuro, alto contraste, fonte grande, silenciamento de voz, limpeza de daltonismo) e **4 handlers com lógica duplicada de estrelas/XP/nível/sequência** (`handleHighFiveReward`, `addStars`, `handleCompleteTrailStage`, `handleLessonCompleted`).

4. **`src/components/modals/LessonModal.tsx` (545 linhas)**
   - Modal legado (hoje inalcançável) que misturava passos de lição, vídeo, quiz, baú de recompensas e desafio final.

5. **`src/components/modals/AuthModal.tsx`**
   - Orquestrava autenticação (Firebase Auth + Google OAuth) junto com o JSX completo dos dois formulários (Login e Cadastro) — hoje modularizado em `auth/LoginForm.tsx` e `auth/RegisterForm.tsx`.

---

## d) Onde está cada regra do sistema

| Regra do sistema | Onde está hoje (arquivo e linhas) | Como funciona |
|---|---|---|
| **Cálculo de estrelas, XP e nível** | `src/App.tsx:198-314` (duplicado em 4 handlers) · `src/utils/storage.ts:51-58` (`getLevelTitle`) · `src/components/Header.tsx:41-45` · `src/components/modals/ProfileModal.tsx:23-27` | Ao ganhar estrelas genéricas (`addStars` ou `handleHighFiveReward`): `xp += amount * 5`. Na trilha (`handleCompleteTrailStage`): soma `starsReward` e `xpReward` da etapa. Fórmula do nível: `Math.floor(nextXp / 50) + 1`, nunca diminui (`Math.max(prev.level, nextLevel)`). Título do nível vem de `getLevelTitle(level)`. |
| **Sequência de dias (`streakDays`) e treino semanal** | `src/App.tsx:252-281` (`handleCompleteTrailStage`) · `src/App.tsx:198-239` (`weeklyTrainedDates`) · `src/components/screens/HomeScreen.tsx:60-109` | Ao concluir etapa da trilha pela primeira vez no dia (`!prev.todayCompleted`), soma `+1` em `streakDays` e marca `todayCompleted = true`. Todas as ações de recompensa adicionam `YYYY-MM-DD` em `weeklyTrainedDates`. A Home calcula segunda a domingo da semana atual e nunca marca dias futuros. |
| **Recompensa diária ("Toca aqui!" / High Five)** | `src/components/modals/HighFiveModal.tsx:22-38` · `src/App.tsx:198-218` e `L569` · `src/components/screens/HomeScreen.tsx:108-109` | Compara `stats.lastHighFiveDate === getTodayDateString()`. Se ainda não resgatou hoje, concede `+3` estrelas (`+15 XP`) e grava `lastHighFiveDate = hoje`. |
| **Desbloqueio de conquistas e figurinhas** | `src/logic/gamification.ts` (`avaliarConquistas`) · `src/components/screens/AchievementsScreen.tsx` · `src/App.tsx` (`handleUnlockSticker`) | **Figurinhas:** libera quando `stats.stars >= requiredStars` e salva ID em `unlockedStickers`. **Conquistas:** avaliadas dinamicamente em `avaliarConquistas` usando `etapa_1`..`etapa_5`, `streakDays >= 5` e `memoryGameWins >= 1`. |
| **Liberação das etapas da trilha** | `src/components/screens/TrailScreen.tsx:62-67` (`isStageUnlocked`) | A Etapa 1 (`index === 0`) é sempre livre. A Etapa `N` só abre se o ID da Etapa `N-1` estiver em `completedTrailNodes`. |
| **Validação das respostas do quiz** | `src/components/screens/TrailScreen.tsx:91-124` (`handleSelectOption`) | Verifica `isCorrect` da opção escolhida em `ALPHABET_TRAIL_STAGES`. Se acertar, toca som + confete e avança após `1100 ms` (ou chama `triggerStageCelebration` na última pergunta). Se errar, marca `'wrong'` e toca som de erro, permitindo nova tentativa. |
| **Salvamento no Firestore e `localStorage`** | `src/App.tsx:124-155` · `src/utils/auth.ts:200-215` (`syncUserProgress`) · `src/services/firebase.ts:92-120` (`saveUserToFirestore`) · `firestore.rules:46-65` | Sempre que o progresso muda, o `useEffect` grava no `localStorage` (`syncUserProgress`) e, se o usuário tiver UID real do Firebase (`id.length > 20 && !id.startsWith('user_')`), grava em `users/{uid}` no Firestore. As regras garantem que apenas o próprio dono (`request.auth.uid == userId`) lê e escreve. |
| **Login, cadastro, visitante e logout** | `src/components/modals/AuthModal.tsx` · `src/services/firebase.ts` · `src/utils/auth.ts` · `src/App.tsx` | Login e cadastro por e-mail usam exclusivamente Firebase Auth (com mensagens de erro traduzidas em português e senha mínima de 6 caracteres). Login Google usa `signInWithPopup` do Firebase. Modo visitante cria conta temporária `guest_session` (sem nuvem). Logout limpa cache de sessão local e chama `encerrarSessao()`. |

---

## Plano proposto para as próximas etapas (aguardando aprovação)

### Etapa 2 — Limpeza segura
1. Remover o arquivo morto `src/components/HandSignIcon.tsx`.
2. Remover a cadeia legada inalcançável do `LessonModal` (`LessonModal.tsx`, `librasTrailLessons.ts`, `RealHandSignImage.tsx`, `SignVideoPlayer.tsx` + estados/handler mortos no `App.tsx`) — *mediante sua confirmação*.
3. Limpar dados não usados de `librasData.ts` (mantendo `ACHIEVEMENTS_DATA` e `LUMI_TIPS`) e de `librasMediaData.ts` (mantendo `CREDITS_DATA`).
4. Remover funções mortas em `src/utils/storage.ts`, `src/utils/auth.ts` (`loginWithGoogle`), `src/utils/sound.ts` (`cardFlip`, `matchSuccess`) e tipos órfãos em `src/types/index.ts`.
5. Remover imports e props não usados nos componentes.
6. Manter `colorblindMode?: boolean` em `src/types/index.ts` com comentário indicando que é campo legado do Firestore.

### Etapa 3 — Organização e modularização
1. Criar `src/logic/gamification.ts` com funções puras usando os nomes do seu diagrama de classes do TCC (`adicionarEstrelas`, `adicionarXP`, `atualizarNivel`, `atualizarSequenciaDias`, `registrarRecompensaDiaria`, `concluirEtapa`, `registrarVitoriaMemoria`, `estaEtapaLiberada`, `calcularSemanaTreino`).
2. Alinhar os nomes das funções de conta/persistência com o diagrama (`cadastrar`, `autenticar`, `carregarProgresso`, `salvarProgresso`, `encerrarSessao`), documentando qualquer renomeação ou mudança de caminho em `docs/RENOMEACOES.md`.
3. Quebrar os arquivos grandes em subcomponentes claros sem mudar nada visualmente:
   - `TrailScreen.tsx` → mapa da trilha, observação, quiz e modal de celebração.
   - `HomeScreen.tsx` → banner principal, cards de descoberta e painel de missão semanal.
   - `AuthModal.tsx` → formulário de login e formulário de cadastro.
4. Simplificar `App.tsx` agrupando estados relacionados (progresso do usuário e modais abertos) para que ele leia como um sumário do aplicativo.
