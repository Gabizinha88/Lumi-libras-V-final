/**
 * O que este arquivo faz: gerencia o cache local da sessão ativa e o progresso inicial no localStorage
 * (usado para cache imediato de contas autenticadas no Firebase e para o modo visitante).
 * Quem usa: App.tsx, AuthModal.tsx, ProfileModal.tsx e services/firebase.ts.
 */
import { UserStats } from '../types';
import { getTodayDateString } from './storage';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
  stats: UserStats;
  completedTrailNodes: string[];
  seenAlphabetLetters?: string[];
  practicedWords?: string[];
  unlockedAchievements: string[];
  unlockedStickers: string[];
  memoryGameWins: number;
  lastActiveDate: string;
}

const USERS_STORAGE_KEY = 'lumi_libras_accounts_v1';
const CURRENT_SESSION_KEY = 'lumi_libras_active_session_id';

/**
 * Cria o estado inicial 100% limpo para um novo usuário:
 * Trilha do zero, sem fases prontas, 0 estrelas, 0 streak.
 */
export const createInitialUserProgress = (
  name: string,
  email: string,
  idOverride?: string
): UserAccount => {
  return {
    id: idOverride || `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: name.trim() || 'Aventureiro Lumi',
    email: email.trim().toLowerCase(),
    avatar: '🌟',
    createdAt: new Date().toISOString(),
    stats: {
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
    },
    completedTrailNodes: [], // Início limpo: NENHUMA fase concluída previamente! Apenas a Fase 1 está aberta para jogar.
    seenAlphabetLetters: ['A'], // Letra A explorada inicialmente
    practicedWords: [], // Nenhum sinal praticado inicialmente
    unlockedAchievements: [],
    unlockedStickers: [],
    memoryGameWins: 0,
    lastActiveDate: getTodayDateString()
  };
};

/**
 * Carrega todas as contas salvas
 */
export const getAllAccounts = (): UserAccount[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Erro ao ler contas salvas:', err);
    return [];
  }
};

/**
 * Salva a lista de contas
 */
export const saveAllAccounts = (accounts: UserAccount[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(accounts));
  } catch (err) {
    console.error('Erro ao salvar contas:', err);
  }
};

/**
 * Obtém a sessão ativa
 */
export const getCurrentSession = (): UserAccount | null => {
  if (typeof window === 'undefined') return null;
  const activeId = localStorage.getItem(CURRENT_SESSION_KEY);
  if (!activeId) return null;

  const accounts = getAllAccounts();
  const user = accounts.find((u) => u.id === activeId);
  return user || null;
};

/**
 * Define a sessão ativa
 */
export const setCurrentSession = (userId: string | null): void => {
  if (typeof window === 'undefined') return;
  if (!userId) {
    localStorage.removeItem(CURRENT_SESSION_KEY);
  } else {
    localStorage.setItem(CURRENT_SESSION_KEY, userId);
  }
};

/**
 * Atualiza o progresso do usuário ativo
 */
export const syncUserProgress = (
  userId: string,
  updates: Partial<UserAccount>
): void => {
  const accounts = getAllAccounts();
  const index = accounts.findIndex((u) => u.id === userId);
  if (index === -1) return;

  accounts[index] = {
    ...accounts[index],
    ...updates,
    lastActiveDate: getTodayDateString()
  };

  saveAllAccounts(accounts);
};

/**
 * Salva ou atualiza uma conta individual e define como sessão ativa
 */
export const saveAccount = (user: UserAccount): void => {
  const accounts = getAllAccounts();
  const index = accounts.findIndex((u) => u.id === user.id);
  if (index >= 0) {
    accounts[index] = user;
  } else {
    accounts.push(user);
  }
  saveAllAccounts(accounts);
  setCurrentSession(user.id);
};

/**
 * Logout
 */
export const logoutUser = (): void => {
  setCurrentSession(null);
};
