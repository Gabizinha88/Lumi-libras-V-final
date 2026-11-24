# Lumi Libras

Plataforma web educativa, inclusiva e gratuita para iniciantes na **Língua Brasileira de Sinais (Libras)**, desenvolvida como projeto de Trabalho de Conclusão de Curso (TCC).

## Funcionalidades

- **Trilha de Aprendizado (A–Z):** 9 etapas progressivas de datilologia com observação guiada, dicas e desafios interativos.
- **Alfabeto Manual:** visualização ampliada das 26 letras com indicação de movimento (`H, J, K, X, Y, Z`), exemplos em português, áudio de apoio e vídeo completo do alfabeto em movimento.
- **Sinais do Dia a Dia:** 30 sinais organizados em 4 temas (*Cumprimentos*, *Família e amigos*, *Na escola* e *Tempo e rotina*), com vídeos demonstrativos, controle de velocidade (`1x`, `0.75x`, `0.5x`) e registro de prática.
- **Jogo da Memória:** partidas de 4 ou 6 pares combinando letra e configuração de mão, sem perda de vidas.
- **Conquistas, Estrelas e Perfil:** acompanhamento de progresso, sequência de treino semanal, níveis por XP e álbum de figurinhas, com autenticação e sincronização no **Firebase (Auth + Firestore)**, além de modo visitante.
- **Acessibilidade:** modo escuro, alto contraste, ampliação de fonte (`+22%`), controle de áudio e navegação responsiva para celular, tablet e computador.

## Tecnologias Utilizadas

- **React 19** + **TypeScript**
- **Vite**
- **Tailwind CSS v4**
- **Firebase** (Authentication e Cloud Firestore)
- **Lucide React** (ícones)

## Fontes Educacionais e Créditos

- **UFSM / Libras ON (NTE Tube):** vídeo do alfabeto em movimento (Licença CC BY-NC-SA 4.0).
- **UFV / CEAD:** vídeos demonstrativos do Dicionário Online Libras–Português.
- **UTFPR / DaFont:** fonte gratuita *Libras 2016* (Diego Aguiar da Silva, Alexandre Nassar de Peder e Ricardo Ernani Sander) utilizada nas imagens do alfabeto manual.

## Como executar localmente

**Pré-requisito:** Node.js 18+

```bash
npm install --legacy-peer-deps
npm run dev
```

Para gerar a versão de produção:

```bash
npm run build
```
