# 20 Perguntas Prováveis da Banca — Lumi Libras

> Respostas curtas, diretas e fundamentadas diretamente no código do projeto para você revisar antes da defesa.

---

### Arquitetura e Tecnologias

**1. Por que vocês escolheram React + TypeScript + Vite para este projeto?**
- **Resposta:** O React facilita criar interfaces interativas e componentizadas (telas, modais e cards reutilizáveis). O TypeScript garante tipagem estática dos dados do usuário e da trilha (`src/types/index.ts`), reduzindo erros em tempo de desenvolvimento. O Vite oferece build muito rápido e configuração simples para publicar como SPA no GitHub Pages.
- **Onde está:** `package.json`, `vite.config.ts`, `src/types/index.ts`.

**2. O projeto tem um servidor backend próprio? Por que escolheram o Firebase?**
- **Resposta:** Não há servidor backend próprio. Adotamos o modelo *BaaS (Backend as a Service)* com Firebase Authentication e Cloud Firestore, o que reduz custo de infraestrutura, acelera o desenvolvimento e já oferece autenticação segura (incluindo OAuth do Google) e persistência em nuvem em tempo real.
- **Onde está:** `src/services/firebase.ts`, `firebase-applet-config.json`.

**3. Como funciona a navegação entre telas sem usar uma biblioteca de rotas como o React Router?**
- **Resposta:** A navegação é controlada por um estado `currentTab` do tipo `TabType` em `src/App.tsx`. Como todas as telas dependem do estado global do aprendiz e o site está hospedado em páginas estáticas (GitHub Pages), essa abordagem evita complexidade extra e erros 404 em recarregamento de sub-rotas.
- **Onde está:** `src/types/index.ts` (`TabType`), `src/App.tsx` (`currentTab` e `navegarParaAba`).

**4. Por que vocês não usaram Redux ou Zustand para gerenciar o estado global?**
- **Resposta:** O volume de estado global do app é enxuto (sessão do usuário, progresso agrupado em `progress` e visibilidade de modais em `modals`). Usar `useState` no componente raiz com regras puras extraídas para `src/logic/gamification.ts` mantém a arquitetura simples, sem adicionar dependências desnecessárias.
- **Onde está:** `src/App.tsx`, `src/logic/gamification.ts`.

**5. Como o código separa interface visual das regras de negócio?**
- **Resposta:** As telas e subcomponentes cuidam apenas de exibir dados e capturar cliques, enquanto todas as fórmulas de gamificação, liberação de etapas, conquistas e calendário semanal vivem como funções puras em `src/logic/gamification.ts`.
- **Onde está:** `src/logic/gamification.ts`.

---

### Banco de Dados, Autenticação e Segurança

**6. Qual é a estrutura de dados no Cloud Firestore?**
- **Resposta:** Utilizamos um banco NoSQL orientado a documentos. Existe uma coleção `users`, onde cada documento tem como chave o `uid` do Firebase Auth (`users/{uid}`) e armazena os dados de perfil, o objeto `stats` (estrelas, XP, nível, streak, acessibilidade) e os arrays de progresso (`completedTrailNodes`, `seenAlphabetLetters`, `practicedWords`, `unlockedAchievements`, `unlockedStickers`).
- **Onde está:** `src/services/firebase.ts` (`saveUserToFirestore` / `salvarProgresso`).

**7. Como vocês garantem que um aluno não consiga ler ou alterar os dados de outro aluno?**
- **Resposta:** A proteção está configurada no servidor do Firestore em `firestore.rules`: só permite leitura (`get`) e escrita (`create`/`update`) quando `request.auth != null && request.auth.uid == userId`, além de validar os campos obrigatórios e bloquear listagem geral da coleção (`allow list: if false`).
- **Onde está:** `firestore.rules` (linhas 46–65).

**8. A `apiKey` do Firebase ficar visível no repositório público não é um risco de segurança?**
- **Resposta:** Não. No Firebase Web SDK, a `apiKey` serve apenas para identificar qual projeto Firebase o navegador deve contatar — não é uma chave secreta de servidor. O controle de acesso real é imposto pelas regras do Firestore (`firestore.rules`) e pelos domínios autorizados no Firebase Auth. Nenhuma chave privada (como `GEMINI_API_KEY`) existe no projeto.
- **Onde está:** `firebase-applet-config.json`, `firestore.rules`.

**9. O que acontece com o progresso quando o usuário entra como visitante?**
- **Resposta:** O modo visitante cria uma conta temporária em memória com ID `guest_session`. O `App.tsx` só envia dados ao Firestore quando o ID é um UID real do Firebase (`id.length > 20 && !id.startsWith('user_')`). Ao concluir uma etapa da trilha, o modal exibe um aviso incentivando o visitante a criar uma conta para salvar seu progresso.
- **Onde está:** `src/App.tsx` (`handleExploreAsGuest` e `useEffect` de sincronização), `src/components/screens/trail/TrailCelebrationModal.tsx`.

**10. Por que o sistema salva no `localStorage` além do Firestore?**
- **Resposta:** O `localStorage` funciona como cache local imediato (reabre a sessão sem demora) e garante uma camada de fallback caso o usuário perca conexão ou o provedor de e-mail não responda no momento do teste.
- **Onde está:** `src/utils/auth.ts` (`syncUserProgress`, `getCurrentSession`), `src/App.tsx`.

---

### Regras de Gamificação e Pedagogia

**11. Como funciona o cálculo de estrelas, XP e nível?**
- **Resposta:** Ações gerais (como explorar letras, praticar sinais, dar "Toca aqui!" ou vencer o Jogo da Memória) concedem estrelas e `5 XP` por estrela. Etapas da trilha concedem `rewardStars` e `rewardXp` próprios. A cada `50 XP`, o aluno sobe 1 nível (`Math.floor(xp / 50) + 1`), nunca regredindo de nível, e recebe um novo título por faixa (`Lumi Aprendiz` até `Campeão de Libras`).
- **Onde está:** `src/logic/gamification.ts` (`adicionarEstrelas`, `adicionarXP`, `atualizarNivel`), `src/utils/storage.ts` (`getLevelTitle`).

**12. Como é controlada a sequência de dias (`streakDays`) e o calendário semanal?**
- **Resposta:** Ao concluir uma etapa pela primeira vez no dia (`!stats.todayCompleted`), `atualizarSequenciaDias` soma `+1` em `streakDays` e registra a data local (`YYYY-MM-DD`) em `weeklyTrainedDates`. A função `calcularSemanaTreino` monta de segunda a domingo da semana atual usando o fuso horário local e impede que dias futuros sejam marcados como concluídos.
- **Onde está:** `src/logic/gamification.ts` (`atualizarSequenciaDias`, `calcularSemanaTreino`), `src/utils/storage.ts` (`getLocalDateString`).

**13. Como o sistema impede que o usuário clique 50 vezes no "Toca aqui!" no mesmo dia para ganhar estrelas infinitas?**
- **Resposta:** Ao resgatar a recompensa diária, `registrarRecompensaDiaria` grava a data de hoje (`YYYY-MM-DD`) em `stats.lastHighFiveDate`. O `HighFiveModal` e o banner da Home comparam `stats.lastHighFiveDate === getTodayDateString()` e bloqueiam novos resgates até o dia seguinte.
- **Onde está:** `src/logic/gamification.ts` (`registrarRecompensaDiaria`), `src/components/modals/HighFiveModal.tsx`, `src/App.tsx`.

**14. Como funciona o desbloqueio das etapas na Trilha de Aprendizado?**
- **Resposta:** O desbloqueio é sequencial: a função pura `estaEtapaLiberada` libera sempre a Etapa 1 (`índice 0`) e só libera a Etapa `N` quando o ID da Etapa `N-1` já está presente no array `completedTrailNodes`.
- **Onde está:** `src/logic/gamification.ts` (`estaEtapaLiberada`), `src/components/screens/TrailScreen.tsx`.

**15. Por que o Jogo da Memória exclui as letras H, J, K, X, Y e Z?**
- **Resposta:** Em Libras, essas 6 letras possuem movimento obrigatório na execução do sinal. Como as cartas do Jogo da Memória exibem imagens estáticas, incluir letras dinâmicas poderia induzir o iniciante ao erro. Por isso, o filtro `.filter(item => !item.isMotion)` usa apenas letras estáticas no jogo, enquanto as letras com movimento são ensinadas com vídeo na tela do Alfabeto.
- **Onde está:** `src/components/screens/MemoryGameScreen.tsx`, `src/data/librasRecoveredData.ts` (`isMotion`).

---

### Acessibilidade, Mídia, Deploy e Limitações

**16. Quais recursos de acessibilidade foram implementados e como funcionam no código?**
- **Resposta:** Quatro recursos configuráveis em tempo real: **Modo Escuro** (classe `.dark`), **Alto Contraste** (classe `.high-contrast`), **Fonte Ampliada +22%** (classe `.font-size-large` na raiz HTML) e **Controle de Sons** (`soundEnabled`). Além disso, a interface prioriza feedback visual (cores, ícones e confete) e mantém a narração por voz desativada para respeitar o foco visual-espacial da Libras.
- **Onde está:** `src/components/modals/AccessibilityModal.tsx`, `src/App.tsx`, `src/index.css`.

**17. Como funcionam os efeitos sonoros sem arquivos `.mp3` ou `.wav` na pasta `public/`?**
- **Resposta:** Utilizamos a **Web Audio API** nativa do navegador (`AudioContext` + osciladores) em `src/utils/sound.ts` para sintetizar notas curtas de clique, acerto, erro e celebração em tempo real. Isso reduz o tamanho do app e elimina falhas de carregamento de mídia.
- **Onde está:** `src/utils/sound.ts`.

**18. De onde vêm as imagens, vídeos e fonte de Libras usadas no app? Há respeito a direitos autorais?**
- **Resposta:** Sim. Todas as fontes são acadêmicas e creditadas dentro do próprio aplicativo (tela "Fontes e Curiosidades" e modal de Créditos de Mídia): fonte **Libras 2016** (UTFPR), vídeos do alfabeto da **UFSM (Libras ON — CC BY-NC-SA 4.0)** e acervo de sinais cotidianos da **UFV/CEAD**.
- **Onde está:** `src/data/librasMediaData.ts`, `src/components/modals/MediaCreditsModal.tsx`, `src/components/screens/CreditsCuriositiesScreen.tsx`.

**19. Como o site é publicado no GitHub Pages e como os caminhos de arquivos funcionam em subdiretório?**
- **Resposta:** No `vite.config.ts`, definimos `base: '/Lumi-libras-V-final/'` para que o build aponte todos os bundles e fontes para o subcaminho do repositório. O deploy é automatizado via **GitHub Actions** (`.github/workflows/deploy.yml`), que instala dependências, gera `dist/` e publica usando as actions oficiais do GitHub Pages.
- **Onde está:** `vite.config.ts`, `.github/workflows/deploy.yml`.

**20. Quais limitações atuais vocês identificaram e o que fica como trabalho futuro?**
- **Resposta:** Como o foco foi um MVP acessível sem custos de servidor, podemos citar três evoluções naturais: (1) reconhecer sinais pela webcam usando visão computacional (ex.: MediaPipe Hands); (2) adicionar validação server-side de sequência diária (streak) no Firebase; (3) aplicar *code-splitting* por tela para reduzir o tamanho do bundle JS inicial.
- **Onde está:** `src/logic/gamification.ts`, `vite.config.ts`.
