/**
 * O que este arquivo faz: centraliza as interfaces e tipos TypeScript compartilhados
 * (abas de navegação, estatísticas do usuário, etapas da trilha e conquistas).
 * Quem usa: App.tsx, telas, modais, lógica de gamificação e arquivos de dados.
 */
export type TabType =
  | 'home'
  | 'trail'
  | 'alphabet'
  | 'daily-signs'
  | 'memory-game'
  | 'achievements'
  | 'credits-curiosities';

export interface UserStats {
  stars: number;
  streakDays: number;
  xp: number;
  level: number;
  levelTitle: string;
  todayCompleted: boolean;
  soundEnabled: boolean;
  highContrast: boolean;
  darkMode: boolean;
  fontSize: 'normal' | 'large';
  colorblindMode?: boolean; // Campo legado: mantido apenas por compatibilidade com documentos antigos no Firestore
  lastHighFiveDate?: string; // Data 'YYYY-MM-DD' do último Toca aqui
  weeklyTrainedDates?: string[]; // Array de strings 'YYYY-MM-DD' dos treinos concluídos
}

export interface TrailStageLetter {
  letter: string;
  name: string;
  signImagePath: string;
  tip?: string;
}

export interface TrailStageQuestionOption {
  id: string;
  signImagePath: string;
  isCorrect: boolean;
}

export interface TrailStageQuestion {
  id: string;
  targetLetter: string;
  prompt: string;
  options: TrailStageQuestionOption[];
  hint?: string;
}

export interface TrailAlphabetStage {
  id: string;
  stageNumber: number;
  title: string;
  subtitle: string;
  lettersSummary: string;
  letters: TrailStageLetter[];
  questions: TrailStageQuestion[];
  rewardStars: number;
  rewardXp: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  rewardStars: number;
  progress?: { current: number; total: number };
}
