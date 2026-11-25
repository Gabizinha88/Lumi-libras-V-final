# Lumi Libras

Plataforma web educativa, inclusiva e gratuita para iniciantes na **Língua Brasileira de Sinais (Libras)**, desenvolvida como Trabalho de Conclusão de Curso (TCC).

**App publicado:** https://gabizinha88.github.io/Lumi-libras-V-final/

## Autoria e Orientação

- **Autores:** Gabriella Oliveira de Souza Dias e Enzo Gabriel Silva Oliveira
- **Orientadora:** Profa. Kerlla De Souza Luz
- **Instituição / Curso:** UDF – Ciência da Computação

## Sobre o Projeto

O **Lumi Libras** oferece uma jornada interativa para aprender datilologia e sinais do cotidiano em Libras com foco em clareza visual e acessibilidade:

- **Trilha de Aprendizado (A–Z):** 9 etapas progressivas com observação guiada, dicas e desafios interativos.
- **Alfabeto Manual:** 26 configurações de mão ampliadas, exemplos em português, marcação de letras com movimento e vídeo do alfabeto em movimento (UFSM).
- **Sinais do Dia a Dia:** 30 sinais em 4 temas com vídeos demonstrativos (UFV/CEAD), controle de velocidade e registro de prática.
- **Jogo da Memória:** partidas de 4 ou 6 pares combinando letra e sinal manual, sem perda de vidas.
- **Conquistas, Estrelas e Perfil:** progresso salvo na nuvem com Firebase Authentication e Cloud Firestore, além do modo visitante.
- **Acessibilidade:** modo escuro, alto contraste, fonte ampliada (`+22%`), controle de áudio e layout responsivo.

## Tecnologias

- **React 19** + **TypeScript**
- **Vite**
- **Tailwind CSS v4**
- **Firebase** (Authentication e Cloud Firestore)
- **Lucide React**

## Como rodar localmente

**Pré-requisito:** Node.js (versão LTS recomendada)

```bash
npm install
npm run dev
```

Para gerar o build de produção localmente:

```bash
npm run build
```

## Como o deploy funciona

O projeto é publicado automaticamente no **GitHub Pages** por meio do workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):

1. A cada `push` na branch `main` (ou execução manual via *workflow_dispatch*), o GitHub Actions instala as dependências com `npm ci` e executa `npm run build` (com `base: '/Lumi-libras-V-final/'` no `vite.config.ts`).
2. A pasta `dist/` gerada é publicada automaticamente no GitHub Pages usando as actions oficiais (`actions/configure-pages`, `actions/upload-pages-artifact` e `actions/deploy-pages`).
3. A autenticação e o armazenamento de progresso continuam conectados diretamente ao **Firebase Authentication** e **Cloud Firestore** (sem uso de Firebase Hosting).

## Estrutura do Projeto

```text
├── docs/                       # Documentação técnica e guias de estudo para o TCC
├── public/                     # Assets públicos (ilustrações das mãos, mascote, fonte Libras-2016)
├── src/
│   ├── main.tsx                # Ponto de entrada React
│   ├── App.tsx                 # Estado global, navegação entre telas e modais
│   ├── index.css               # Tailwind CSS v4, fonte Libras-2016 e modos de acessibilidade
│   ├── types/                  # Interfaces e tipos TypeScript
│   ├── logic/                  # Regras puras de gamificação, trilha, conquistas e semana
│   ├── services/               # Integração com Firebase Authentication e Cloud Firestore
│   ├── utils/                  # Autenticação/cache local, formatação de datas e Web Audio
│   ├── data/                   # Conteúdo pedagógico (trilha, alfabeto, sinais UFV, conquistas, créditos)
│   └── components/
│       ├── modals/             # Modais (Auth + subformulários, Acessibilidade, Perfil, Toca aqui, Dicas, Créditos)
│       └── screens/            # Telas principais (Landing, Home, Trilha, Alfabeto, Sinais, Memória, Conquistas, Fontes)
├── firestore.rules             # Regras de segurança do Cloud Firestore (users/{uid})
└── vite.config.ts              # Configuração de build e base do GitHub Pages
```

## Documentação para Estudo (TCC)

- [Mapa do Código](docs/MAPA_DO_CODIGO.md) — inventário completo dos arquivos, código morto e mapa das regras.
- [Arquitetura do Sistema](docs/ARQUITETURA.md) — visão geral da SPA, fluxo do clique até o Firestore e diagrama Mermaid.
- [Guia de Estudo](docs/GUIA_DE_ESTUDO.md) — roteiro priorizado (Essencial / Importante / Saber que existe) para a defesa.
- [20 Perguntas da Banca](docs/PERGUNTAS_DA_BANCA.md) — perguntas técnicas prováveis com respostas fundamentadas no código.
- [Como Cada Funcionalidade Funciona](docs/COMO_CADA_FUNCIONALIDADE_FUNCIONA.md) — passo a passo por tela/fluxo com arquivos e funções.
- [Registro de Renomeações e Extrações](docs/RENOMEACOES.md) — mapeamento de funções e arquivos alterados para atualizar o TCC.

## Fontes Educacionais e Créditos

- **UFSM / Libras ON (NTE Tube):** vídeo do alfabeto em movimento (CC BY-NC-SA 4.0).
- **UFV / CEAD:** vídeos demonstrativos do Dicionário Online Libras–Português.
- **UTFPR / DaFont:** fonte gratuita *Libras 2016* (Diego Aguiar da Silva, Alexandre Nassar de Peder e Ricardo Ernani Sander).
