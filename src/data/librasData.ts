/**
 * O que este arquivo faz: armazena o catálogo de conquistas gamificadas (ACHIEVEMENTS_DATA)
 * e as dicas pedagógicas exibidas pelo mascote Lumi (LUMI_TIPS).
 * Quem usa: AchievementsScreen.tsx e LumiTipModal.tsx.
 */
import { Achievement } from '../types';

export const ACHIEVEMENTS_DATA: Achievement[] = [
  {
    id: 'first-sign',
    title: 'Primeiro Sinal',
    description: 'Fez sua primeira descoberta em Libras com o Lumi.',
    icon: '✨',
    unlocked: true,
    rewardStars: 5
  },
  {
    id: 'alphabet-explorer',
    title: 'Explorador do Alfabeto',
    description: 'Concluiu as duas primeiras etapas da trilha: as vogais e as primeiras consoantes.',
    icon: '🔤',
    unlocked: true,
    rewardStars: 10
  },
  {
    id: 'five-day-streak',
    title: 'Chama Olímpica (5 Dias)',
    description: 'Manteve 5 dias seguidos praticando sem falhar!',
    icon: '🔥',
    unlocked: true,
    rewardStars: 15
  },
  {
    id: 'memory-champion',
    title: 'Mestre da Memória',
    description: 'Venceu o jogo da memória.',
    icon: '🧠',
    unlocked: false,
    rewardStars: 20,
    progress: { current: 1, total: 3 }
  },
  {
    id: 'friendly-hands',
    title: 'Mãos Amigas',
    description: 'Concluiu as etapas 3 e 4 da trilha, dominando as posições de dedos.',
    icon: '🤝',
    unlocked: false,
    rewardStars: 25,
    progress: { current: 2, total: 6 }
  },
  {
    id: 'lumi-best-friend',
    title: 'Melhor Amigo do Lumi',
    description: 'Chegou até o fim da etapa 5 da trilha com o Lumi.',
    icon: '🌟',
    unlocked: false,
    rewardStars: 30,
    progress: { current: 4, total: 10 }
  }
];

export const LUMI_TIPS = [
  {
    title: 'O poder do rosto!',
    text: 'Em Libras, a expressão do seu rosto faz parte da palavra! Dê um sorriso sincero ao sinalizar "Oi!" ou "Bom dia!"!',
    tag: 'Expressão facial = Gramática 😊✨'
  },
  {
    title: 'Mão dominante',
    text: 'Use sempre a mesma mão para soletrar as letras (geralmente a mão com a qual você escreve ou desenha). A outra pode descansar!',
    tag: 'Conforto & Postura ✍️'
  },
  {
    title: 'O espaço ao seu redor',
    text: 'Os sinais acontecem no seu "espaço de sinalização", que vai da sua cintura até acima da cabeça. Mantenha os cotovelos relaxados!',
    tag: 'Espaço Visual 🎈'
  },
  {
    title: 'Sem pressa para soletrar',
    text: 'Na datilologia (soletrar com os dedos), a clareza é muito mais importante que a velocidade. Faça cada letra com calma e carinho!',
    tag: 'Ritmo & Clareza 🐢✨'
  }
];
