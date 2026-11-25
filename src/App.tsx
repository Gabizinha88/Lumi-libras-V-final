/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * O que este arquivo faz: componente raiz (sumário do app) que gerencia sessão do usuário,
 * estado global de progresso, navegação entre telas, preferências de acessibilidade e modais.
 * Quem usa: src/main.tsx.
 */

import React, { useEffect, useState } from 'react';
import { TabType } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomCompanionBar } from './components/BottomCompanionBar';
import { LandingScreen } from './components/screens/LandingScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { TrailScreen } from './components/screens/TrailScreen';
import { AlphabetScreen } from './components/screens/AlphabetScreen';
import { DailySignsScreen } from './components/screens/DailySignsScreen';
import { MemoryGameScreen } from './components/screens/MemoryGameScreen';
import { AchievementsScreen } from './components/screens/AchievementsScreen';
import { CreditsCuriositiesScreen } from './components/screens/CreditsCuriositiesScreen';
import { HighFiveModal } from './components/modals/HighFiveModal';
import { LumiTipModal } from './components/modals/LumiTipModal';
import { AccessibilityModal } from './components/modals/AccessibilityModal';
import { ProfileModal } from './components/modals/ProfileModal';
import { MediaCreditsModal } from './components/modals/MediaCreditsModal';
import { AuthModal } from './components/modals/AuthModal';
import {
  DEFAULT_USER_STATS,
  UserProgressState,
  adicionarEstrelas,
  concluirEtapa,
  registrarRecompensaDiaria,
  registrarVitoriaMemoria
} from './logic/gamification';
import { encerrarSessao, salvarProgresso } from './services/firebase';
import {
  UserAccount,
  createInitialUserProgress,
  getCurrentSession,
  logoutUser,
  syncUserProgress
} from './utils/auth';
import { playSound } from './utils/sound';
import { getTodayDateString } from './utils/storage';

interface ModalState {
  auth: boolean;
  authInitialTab: 'login' | 'register';
  highFive: boolean;
  tip: boolean;
  accessibility: boolean;
  profile: boolean;
  mediaCredits: boolean;
}

function extrairProgressoDoUsuario(user: UserAccount | null): UserProgressState {
  if (!user) {
    return {
      stats: DEFAULT_USER_STATS,
      completedTrailNodes: [],
      seenAlphabetLetters: ['A'],
      practicedWords: [],
      unlockedAchievements: [],
      unlockedStickers: [],
      memoryGameWins: 0
    };
  }

  return {
    stats: user.stats,
    completedTrailNodes: user.completedTrailNodes || [],
    seenAlphabetLetters: user.seenAlphabetLetters || ['A'],
    practicedWords: user.practicedWords || [],
    unlockedAchievements: user.unlockedAchievements || [],
    unlockedStickers: user.unlockedStickers || [],
    memoryGameWins: user.memoryGameWins || 0
  };
}

export default function App() {
  // 1. Sessão e progresso do usuário (agrupados em um único objeto de estado)
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => getCurrentSession());
  const [progress, setProgress] = useState<UserProgressState>(() => extrairProgressoDoUsuario(currentUser));

  // 2. Navegação e layout
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [guestNoticeShown, setGuestNoticeShown] = useState<boolean>(false);
  const [memoryGameInitialMode, setMemoryGameInitialMode] = useState<'express' | 'normal' | 'master'>('normal');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('lumilibras_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  // 3. Estado dos modais (agrupados para fácil leitura)
  const [modals, setModals] = useState<ModalState>({
    auth: false,
    authInitialTab: 'login',
    highFive: false,
    tip: false,
    accessibility: false,
    profile: false,
    mediaCredits: false
  });

  const { stats, completedTrailNodes, seenAlphabetLetters, practicedWords, unlockedAchievements, unlockedStickers, memoryGameWins } = progress;

  const abrirModal = (nome: keyof Omit<ModalState, 'authInitialTab'>, aberto = true) => {
    setModals((prev) => ({ ...prev, [nome]: aberto }));
  };

  const abrirAuthModal = (abaInicial: 'login' | 'register') => {
    setModals((prev) => ({ ...prev, auth: true, authInitialTab: abaInicial }));
  };

  const navegarParaAba = (tab: TabType) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // =========================================================
  // EFEITOS: sincronização de progresso e preferências visuais
  // =========================================================
  useEffect(() => {
    if (currentUser) {
      setProgress(extrairProgressoDoUsuario(currentUser));
    }
  }, [currentUser?.id]);

  useEffect(() => {
    if (!currentUser) return;

    // Por quê: salvamos sempre no localStorage primeiro para garantir resposta imediata e funcionamento offline.
    syncUserProgress(currentUser.id, progress);

    // Por quê: contas locais/visitante usam IDs curtos ('guest_session' ou 'user_...');
    // apenas UIDs reais do Firebase Auth (> 20 caracteres) têm permissão nas regras do Firestore (users/{uid}).
    if (currentUser.id.length > 20 && !currentUser.id.startsWith('user_')) {
      salvarProgresso({ ...currentUser, ...progress }).catch((err) => {
        console.warn('Sincronização Firestore ignorada:', err);
      });
    }
  }, [currentUser?.id, progress]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', stats.darkMode);
    document.body.classList.toggle('dark', stats.darkMode);
  }, [stats.darkMode]);

  useEffect(() => {
    document.body.classList.toggle('high-contrast', stats.highContrast);
  }, [stats.highContrast]);

  useEffect(() => {
    document.documentElement.classList.toggle('font-size-large', stats.fontSize === 'large');
  }, [stats.fontSize]);

  useEffect(() => {
    if (!stats.soundEnabled) {
      playSound.stopSpeaking();
    }
  }, [stats.soundEnabled]);

  // =========================================================
  // AÇÕES DE GAMIFICAÇÃO (regras puras em src/logic/gamification.ts)
  // =========================================================
  const handleHighFiveReward = (amount: number) => {
    setProgress((prev) => ({
      ...prev,
      stats: registrarRecompensaDiaria(prev.stats, amount)
    }));
  };

  const handleRewardStars = (amount: number) => {
    setProgress((prev) => ({
      ...prev,
      stats: adicionarEstrelas(prev.stats, amount)
    }));
  };

  const handleMemoryVictory = (amount: number) => {
    setProgress((prev) => registrarVitoriaMemoria(prev, amount));
  };

  const handleCompleteTrailStage = (stageId: string, starsReward: number, xpReward: number) => {
    setProgress((prev) => concluirEtapa(prev, stageId, starsReward, xpReward));
  };

  const handleUnlockSticker = (stickerId: string) => {
    setProgress((prev) => {
      if (prev.unlockedStickers.includes(stickerId)) return prev;
      return { ...prev, unlockedStickers: [...prev.unlockedStickers, stickerId] };
    });
  };

  // =========================================================
  // AÇÕES DE SESSÃO E ACESSIBILIDADE
  // =========================================================
  const handleToggleDesktopSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('lumilibras_sidebar_collapsed', String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleStartExpressGame = () => {
    playSound.pop(stats.soundEnabled);
    setMemoryGameInitialMode('express');
    setCurrentTab('memory-game');
  };

  const atualizarStats = (atualizador: (s: typeof stats) => typeof stats) => {
    setProgress((prev) => ({ ...prev, stats: atualizador(prev.stats) }));
  };

  const handleToggleDarkMode = () => atualizarStats((s) => ({ ...s, darkMode: !s.darkMode }));

  const handleLogout = () => {
    logoutUser();
    encerrarSessao();
    setCurrentUser(null);
    setGuestNoticeShown(false);
    setCurrentTab('home');
  };

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    setProgress(extrairProgressoDoUsuario(user));
    setCurrentTab('home');
  };

  const handleExploreAsGuest = () => {
    const guestUser = createInitialUserProgress('Visitante', '', 'guest_session');
    setCurrentUser(guestUser);
    setGuestNoticeShown(false);
    setProgress(extrairProgressoDoUsuario(guestUser));
  };

  const hasStartedTrail = completedTrailNodes.length > 0;

  // =========================================================
  // TELA PÚBLICA (sem login): LandingScreen + Auth + Acessibilidade
  // =========================================================
  if (!currentUser) {
    return (
      <div className={`min-h-screen bg-white dark:bg-[#0A1128] text-slate-800 dark:text-slate-100 ${stats.fontSize === 'large' ? 'text-lg' : 'text-base'}`}>
        <LandingScreen
          onOpenLogin={() => abrirAuthModal('login')}
          onOpenRegister={() => abrirAuthModal('register')}
          onOpenAccessibility={() => abrirModal('accessibility')}
          onExploreAsGuest={handleExploreAsGuest}
        />

        <AuthModal
          isOpen={modals.auth}
          initialTab={modals.authInitialTab}
          onClose={() => abrirModal('auth', false)}
          onSuccess={handleLoginSuccess}
        />

        <AccessibilityModal
          isOpen={modals.accessibility}
          onClose={() => abrirModal('accessibility', false)}
          stats={stats}
          onToggleSound={() => atualizarStats((s) => ({ ...s, soundEnabled: !s.soundEnabled }))}
          onToggleHighContrast={() => atualizarStats((s) => ({ ...s, highContrast: !s.highContrast }))}
          onToggleDarkMode={handleToggleDarkMode}
          onToggleFontSize={() =>
            atualizarStats((s) => ({ ...s, fontSize: s.fontSize === 'normal' ? 'large' : 'normal' }))
          }
        />
      </div>
    );
  }

  // =========================================================
  // APLICATIVO AUTENTICADO: Sidebar + Header + Tela Ativa + Modais
  // =========================================================
  return (
    <div className={`min-h-screen bg-[#F8FAFD] dark:bg-[#0A1128] text-slate-800 dark:text-slate-100 flex transition-colors duration-300 ${stats.fontSize === 'large' ? 'text-lg' : 'text-base'}`}>
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          playSound.stopSpeaking();
          navegarParaAba(tab);
        }}
        onOpenAccessibility={() => abrirModal('accessibility')}
        onOpenMediaCredits={() => abrirModal('mediaCredits')}
        soundEnabled={stats.soundEnabled}
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        onLogout={handleLogout}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleDesktopSidebar}
      />

      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        <Header
          stats={stats}
          currentUser={{
            name: currentUser.name,
            avatar: currentUser.avatar
          }}
          onToggleSound={() => atualizarStats((s) => ({ ...s, soundEnabled: !s.soundEnabled }))}
          onToggleDarkMode={handleToggleDarkMode}
          onOpenAccessibility={() => abrirModal('accessibility')}
          onOpenProfile={() => abrirModal('profile')}
          onOpenMediaCredits={() => abrirModal('mediaCredits')}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onToggleDesktopSidebar={handleToggleDesktopSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
          onLogout={handleLogout}
        />

        <main className={`flex-1 px-3 sm:px-8 pt-4 sm:pt-6 w-full pb-24 sm:pb-28 transition-all duration-300 ${
          isSidebarCollapsed ? 'max-w-7xl mx-auto' : 'max-w-7xl mx-auto'
        }`}>
          {currentTab === 'home' && (
            <HomeScreen
              stats={stats}
              completedTrailNodes={completedTrailNodes}
              hasStartedTrail={hasStartedTrail}
              onNavigateTab={navegarParaAba}
              onOpenHighFive={() => abrirModal('highFive')}
              onOpenTipModal={() => abrirModal('tip')}
              onStartExpressGame={handleStartExpressGame}
            />
          )}

          {currentTab === 'trail' && (
            <TrailScreen
              completedStages={completedTrailNodes}
              userStats={stats}
              soundEnabled={stats.soundEnabled}
              onCompleteStage={handleCompleteTrailStage}
              onNavigateToAlphabet={() => navegarParaAba('alphabet')}
              onNavigateToMemoryGame={() => navegarParaAba('memory-game')}
              shouldShowGuestNotice={currentUser.id === 'guest_session' && !guestNoticeShown}
              onMarkGuestNoticeShown={() => setGuestNoticeShown(true)}
              onOpenRegisterModal={() => {
                setGuestNoticeShown(true);
                abrirAuthModal('register');
              }}
            />
          )}

          {currentTab === 'alphabet' && (
            <AlphabetScreen
              stats={stats}
              onRewardStars={handleRewardStars}
              seenLetters={seenAlphabetLetters}
              onUpdateSeenLetters={(letters) =>
                setProgress((prev) => ({ ...prev, seenAlphabetLetters: letters }))
              }
            />
          )}

          {currentTab === 'daily-signs' && (
            <DailySignsScreen
              stats={stats}
              onRewardStars={handleRewardStars}
              practicedWords={practicedWords}
              onUpdatePracticedWords={(words) =>
                setProgress((prev) => ({ ...prev, practicedWords: words }))
              }
            />
          )}

          {currentTab === 'memory-game' && (
            <MemoryGameScreen
              stats={stats}
              onRewardStars={handleMemoryVictory}
              initialMode={memoryGameInitialMode}
            />
          )}

          {currentTab === 'achievements' && (
            <AchievementsScreen
              stats={stats}
              completedTrailNodes={completedTrailNodes}
              unlockedAchievements={unlockedAchievements}
              unlockedStickers={unlockedStickers}
              memoryGameWins={memoryGameWins}
              onUnlockSticker={handleUnlockSticker}
            />
          )}

          {currentTab === 'credits-curiosities' && (
            <CreditsCuriositiesScreen
              onOpenAccessibility={() => abrirModal('accessibility')}
            />
          )}
        </main>

        <BottomCompanionBar
          hasStartedTrail={hasStartedTrail}
          onOpenTip={() => abrirModal('tip')}
          onContinueTrail={() => navegarParaAba('trail')}
          soundEnabled={stats.soundEnabled}
        />
      </div>

      <HighFiveModal
        isOpen={modals.highFive}
        onClose={() => abrirModal('highFive', false)}
        onRewardStars={handleHighFiveReward}
        soundEnabled={stats.soundEnabled}
        alreadyClaimedToday={stats.lastHighFiveDate === getTodayDateString()}
      />

      <LumiTipModal
        isOpen={modals.tip}
        onClose={() => abrirModal('tip', false)}
        soundEnabled={stats.soundEnabled}
      />

      <AccessibilityModal
        isOpen={modals.accessibility}
        onClose={() => abrirModal('accessibility', false)}
        stats={stats}
        onToggleSound={() => atualizarStats((s) => ({ ...s, soundEnabled: !s.soundEnabled }))}
        onToggleHighContrast={() => atualizarStats((s) => ({ ...s, highContrast: !s.highContrast }))}
        onToggleDarkMode={handleToggleDarkMode}
        onToggleFontSize={() =>
          atualizarStats((s) => ({ ...s, fontSize: s.fontSize === 'normal' ? 'large' : 'normal' }))
        }
      />

      <ProfileModal
        isOpen={modals.profile}
        onClose={() => abrirModal('profile', false)}
        stats={stats}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenRegister={() => {
          abrirModal('profile', false);
          abrirAuthModal('register');
        }}
      />

      <MediaCreditsModal
        isOpen={modals.mediaCredits}
        onClose={() => abrirModal('mediaCredits', false)}
      />

      <AuthModal
        isOpen={modals.auth}
        initialTab={modals.authInitialTab}
        onClose={() => abrirModal('auth', false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}
