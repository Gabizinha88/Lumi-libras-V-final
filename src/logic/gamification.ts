/**
 * O que este arquivo faz: concentra todas as regras puras de gamificação e negócio do Lumi Libras
 * (estrelas, XP, nível, sequência de dias, recompensa diária, trilha sequencial, conquistas e semana de treino).
 * Quem usa: App.tsx, TrailScreen.tsx, HomeScreen.tsx e AchievementsScreen.tsx.
 */
import { Achievement, TrailAlphabetStage, UserStats } from '../types';
import { getLocalDateString, getTodayDateString, getLevelTitle } from '../utils/storage';

export interface UserProgressState {
  stats: UserStats;
  completedTrailNodes: string[];
  seenAlphabetLetters: string[];
  practicedWords: string[];
  unlockedAchievements: string[];
  unlockedStickers: string[];
  memoryGameWins: number;
}

export interface WeeklyTrainingDay {
  label: string;
  dateStr: string;
  isToday: boolean;
  isTrained: boolean;
  isPast: boolean;
  isFuture: boolean;
}

const XP_POR_ESTRELA = 5;
const XP_POR_NIVEL = 50;

export const DEFAULT_USER_STATS: UserStats = {
  stars: 0,
  streakDays: 0,
  xp: 0,
  level: 1,
  levelTitle: 'Lumi Aprendiz',
  todayCompleted: false,
  soundEnabled: true,
  highContrast: false,
  darkMode: false,
  fontSize: 'normal'
};

/**
 * Registra uma data (YYYY-MM-DD) no histórico semanal sem duplicar.
 */
function registrarDataTreinada(datasExistentes: string[] | undefined, dataHoje: string): string[] {
  const lista = datasExistentes || [];
  return lista.includes(dataHoje) ? lista : [...lista, dataHoje];
}

/**
 * Recalcula o nível e o título do aprendiz a partir do XP total.
 * Por quê: a progressão é linear (1 nível a cada 50 XP) e usa Math.max para impedir
 * que o aprendiz regrida de nível caso algum dado legado traga nível superior.
 */
export function atualizarNivel(stats: UserStats, novoXp: number): Pick<UserStats, 'level' | 'levelTitle'> {
  const nivelCalculado = Math.floor(novoXp / XP_POR_NIVEL) + 1;
  const nivelFinal = Math.max(stats.level, nivelCalculado);

  return {
    level: nivelFinal,
    levelTitle: getLevelTitle(nivelFinal)
  };
}

/**
 * Soma XP ao aprendiz e recalcula nível e título automaticamente.
 */
export function adicionarXP(stats: UserStats, xpGanho: number): UserStats {
  const nextXp = stats.xp + xpGanho;
  const { level, levelTitle } = atualizarNivel(stats, nextXp);

  return {
    ...stats,
    xp: nextXp,
    level,
    levelTitle
  };
}

/**
 * Atualiza a sequência de dias (streak): soma +1 apenas na primeira conclusão do dia.
 * Por quê: evita inflar a sequência caso o aluno conclua várias etapas no mesmo dia.
 */
export function atualizarSequenciaDias(stats: UserStats, dataHoje: string = getTodayDateString()): UserStats {
  const streakIncrement = !stats.todayCompleted ? 1 : 0;

  return {
    ...stats,
    todayCompleted: true,
    streakDays: stats.streakDays + streakIncrement,
    weeklyTrainedDates: registrarDataTreinada(stats.weeklyTrainedDates, dataHoje)
  };
}

/**
 * Adiciona estrelas e o XP proporcional (5 XP por estrela), atualizando nível e treino do dia.
 */
export function adicionarEstrelas(
  stats: UserStats,
  quantidade: number,
  dataHoje: string = getTodayDateString()
): UserStats {
  const comXpENivel = adicionarXP(stats, quantidade * XP_POR_ESTRELA);

  return {
    ...comXpENivel,
    stars: stats.stars + quantidade,
    todayCompleted: true,
    weeklyTrainedDates: registrarDataTreinada(stats.weeklyTrainedDates, dataHoje)
  };
}

/**
 * Registra a recompensa diária ("Toca aqui!" / High Five): +3 estrelas (+15 XP) e marca a data de hoje.
 */
export function registrarRecompensaDiaria(
  stats: UserStats,
  quantidade: number = 3,
  dataHoje: string = getTodayDateString()
): UserStats {
  const atualizado = adicionarEstrelas(stats, quantidade, dataHoje);

  return {
    ...atualizado,
    lastHighFiveDate: dataHoje
  };
}

/**
 * Registra vitória no Jogo da Memória: incrementa memoryGameWins e concede +5 estrelas (+XP proporcional).
 */
export function registrarVitoriaMemoria(
  progresso: UserProgressState,
  estrelas: number = 5,
  dataHoje: string = getTodayDateString()
): UserProgressState {
  return {
    ...progresso,
    stats: adicionarEstrelas(progresso.stats, estrelas, dataHoje),
    memoryGameWins: (progresso.memoryGameWins || 0) + 1
  };
}

/**
 * Conclui uma etapa da trilha: salva o ID da etapa sem duplicar,
 * soma estrelas + XP próprios da etapa, recalcula nível e atualiza a sequência de dias.
 */
export function concluirEtapa(
  progresso: UserProgressState,
  stageId: string,
  estrelas: number,
  xp: number,
  dataHoje: string = getTodayDateString()
): UserProgressState {
  const etapasAtualizadas = progresso.completedTrailNodes.includes(stageId)
    ? progresso.completedTrailNodes
    : [...progresso.completedTrailNodes, stageId];

  const comXpENivel = adicionarXP(progresso.stats, xp);
  const comSequencia = atualizarSequenciaDias(
    {
      ...comXpENivel,
      stars: progresso.stats.stars + estrelas
    },
    dataHoje
  );

  return {
    ...progresso,
    completedTrailNodes: etapasAtualizadas,
    stats: comSequencia
  };
}

/**
 * Regra de desbloqueio sequencial da Trilha:
 * A Etapa 1 (índice 0) é sempre livre; a Etapa N exige que a Etapa N-1 esteja concluída.
 */
export function estaEtapaLiberada(
  indiceEtapa: number,
  etapasConcluidas: string[],
  etapas: TrailAlphabetStage[]
): boolean {
  if (indiceEtapa === 0) return true;
  const etapaAnterior = etapas[indiceEtapa - 1];
  return Boolean(etapaAnterior && etapasConcluidas.includes(etapaAnterior.id));
}

/**
 * Avalia quais conquistas estão desbloqueadas com base no progresso atual do aluno.
 */
export function avaliarConquistas(
  conquistasBase: Achievement[],
  conquistasDesbloqueadas: string[],
  etapasConcluidas: string[],
  stats: UserStats,
  memoryGameWins: number = 0
): Achievement[] {
  return conquistasBase.map((item) => {
    let isUnlocked = conquistasDesbloqueadas.includes(item.id);

    if (item.id === 'first-sign') {
      isUnlocked = isUnlocked || etapasConcluidas.length > 0;
    } else if (item.id === 'alphabet-explorer') {
      isUnlocked = isUnlocked || (etapasConcluidas.includes('etapa_1') && etapasConcluidas.includes('etapa_2'));
    } else if (item.id === 'five-day-streak') {
      isUnlocked = isUnlocked || stats.streakDays >= 5;
    } else if (item.id === 'memory-champion') {
      isUnlocked = isUnlocked || memoryGameWins >= 1;
    } else if (item.id === 'friendly-hands') {
      isUnlocked = isUnlocked || (etapasConcluidas.includes('etapa_3') && etapasConcluidas.includes('etapa_4'));
    } else if (item.id === 'lumi-best-friend') {
      isUnlocked = isUnlocked || etapasConcluidas.includes('etapa_5');
    }

    return {
      ...item,
      unlocked: isUnlocked
    };
  });
}

/**
 * Monta os 7 dias da semana atual (Segunda a Domingo) para o cartão de Missão da Semana.
 * Dias futuros nunca são marcados como treinados.
 */
export function calcularSemanaTreino(stats: UserStats, referencia: Date = new Date()): WeeklyTrainingDay[] {
  const currentDayOfWeek = referencia.getDay(); // 0 = Domingo, 1 = Segunda ... 6 = Sábado
  const currentMondayIndex = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;

  const mondayDate = new Date(referencia);
  mondayDate.setDate(referencia.getDate() - currentMondayIndex);
  mondayDate.setHours(0, 0, 0, 0);

  const todayStr = getLocalDateString(referencia);
  const diasSemana = [
    { label: 'Seg', offset: 0 },
    { label: 'Ter', offset: 1 },
    { label: 'Qua', offset: 2 },
    { label: 'Qui', offset: 3 },
    { label: 'Sex', offset: 4 },
    { label: 'Sáb', offset: 5 },
    { label: 'Dom', offset: 6 }
  ];

  return diasSemana.map((item) => {
    const d = new Date(mondayDate.getTime() + item.offset * 86400000);
    const dateStr = getLocalDateString(d);
    const isToday = item.offset === currentMondayIndex;
    const isPast = item.offset < currentMondayIndex;
    const isFuture = item.offset > currentMondayIndex;

    const isTrained = !isFuture && (
      (stats.weeklyTrainedDates || []).filter((dt) => dt <= todayStr).includes(dateStr) ||
      (isToday && stats.todayCompleted)
    );

    return {
      label: isToday ? 'Hoje' : item.label,
      dateStr,
      isToday,
      isTrained,
      isPast,
      isFuture
    };
  });
}
