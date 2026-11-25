/**
 * O que este arquivo faz: tela da Trilha de Aprendizado (9 etapas A–Z); coordena o mapa sequencial,
 * o modo de observação das mãos, o quiz interativo com confete e o modal de celebração.
 * Quem usa: App.tsx (quando currentTab === 'trail').
 */
import React, { useState } from 'react';
import { Award, Check, Lock, Sparkles, Star, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ALPHABET_TRAIL_STAGES } from '../../data/librasTrailAlphabetData';
import { estaEtapaLiberada } from '../../logic/gamification';
import { TrailAlphabetStage, UserStats } from '../../types';
import { playSound } from '../../utils/sound';
import { TrailCelebrationModal } from './trail/TrailCelebrationModal';
import { TrailObserveView } from './trail/TrailObserveView';
import { TrailQuizView } from './trail/TrailQuizView';

interface TrailScreenProps {
  completedStages: string[];
  userStats: UserStats;
  soundEnabled: boolean;
  onCompleteStage: (stageId: string, rewardStars: number, rewardXp: number) => void;
  onNavigateToAlphabet?: () => void;
  onNavigateToMemoryGame?: () => void;
  shouldShowGuestNotice?: boolean;
  onMarkGuestNoticeShown?: () => void;
  onOpenRegisterModal?: () => void;
}

export const TrailScreen: React.FC<TrailScreenProps> = ({
  completedStages,
  userStats,
  soundEnabled,
  onCompleteStage,
  onNavigateToAlphabet,
  onNavigateToMemoryGame,
  shouldShowGuestNotice = false,
  onMarkGuestNoticeShown,
  onOpenRegisterModal
}) => {
  const [activeStageId, setActiveStageId] = useState<string | null>(null);
  const [stageViewMode, setStageViewMode] = useState<'observe' | 'quiz'>('observe');

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [showTipBubble, setShowTipBubble] = useState(false);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);
  const [showGuestNoticeInModal, setShowGuestNoticeInModal] = useState(false);

  const activeStage: TrailAlphabetStage | undefined = ALPHABET_TRAIL_STAGES.find(
    (s) => s.id === activeStageId
  );

  const completedCount = completedStages.filter((id) =>
    ALPHABET_TRAIL_STAGES.some((s) => s.id === id)
  ).length;
  const totalStages = ALPHABET_TRAIL_STAGES.length;
  const progressPercent = Math.min(100, Math.round((completedCount / totalStages) * 100));

  const currentStageIndex = ALPHABET_TRAIL_STAGES.findIndex((s) => s.id === activeStageId);
  const nextStage =
    currentStageIndex >= 0 && currentStageIndex + 1 < ALPHABET_TRAIL_STAGES.length
      ? ALPHABET_TRAIL_STAGES[currentStageIndex + 1]
      : null;

  const resetQuizState = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptionId(null);
    setAnswerState('idle');
  };

  const handleSelectStage = (stage: TrailAlphabetStage, index: number) => {
    // Por quê: a trilha é progressiva — impede pular etapas para garantir que o aluno veja
    // os sinais anteriores antes de avançar para combinações mais complexas.
    if (!estaEtapaLiberada(index, completedStages, ALPHABET_TRAIL_STAGES)) {
      playSound.error(soundEnabled);
      return;
    }
    playSound.pop(soundEnabled);
    setActiveStageId(stage.id);
    setStageViewMode('observe');
    resetQuizState();
    setShowTipBubble(false);
  };

  const handleStartQuiz = () => {
    playSound.pop(soundEnabled);
    setStageViewMode('quiz');
    resetQuizState();
  };

  const triggerStageCelebration = (stage: TrailAlphabetStage) => {
    playSound.celebrate(soundEnabled);
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {
      // Confetti fallback
    }
    setShowCelebrationModal(true);
    if (shouldShowGuestNotice) {
      setShowGuestNoticeInModal(true);
      onMarkGuestNoticeShown?.();
    }
    onCompleteStage(stage.id, stage.rewardStars, stage.rewardXp);
  };

  const handleSelectOption = (optionId: string, isCorrect: boolean) => {
    if (answerState === 'correct') return;

    setSelectedOptionId(optionId);
    if (isCorrect) {
      setAnswerState('correct');
      playSound.correct(soundEnabled);
      try {
        confetti({
          particleCount: 25,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch {
        // Confetti fallback
      }

      // Por quê: aguarda 1,1s antes de passar para a próxima pergunta para o aprendiz ver
      // o destaque verde e o confete (reforço visual imediato), sem precisar clicar em "Próximo".
      setTimeout(() => {
        if (!activeStage) return;
        if (currentQuestionIndex + 1 < activeStage.questions.length) {
          setCurrentQuestionIndex((prev) => prev + 1);
          setSelectedOptionId(null);
          setAnswerState('idle');
        } else {
          triggerStageCelebration(activeStage);
        }
      }, 1100);
    } else {
      setAnswerState('wrong');
      playSound.error(soundEnabled);
    }
  };

  const handleAdvanceToNextStage = () => {
    playSound.celebrate(soundEnabled);
    setShowCelebrationModal(false);
    setShowGuestNoticeInModal(false);
    if (nextStage) {
      setActiveStageId(nextStage.id);
      setStageViewMode('observe');
      resetQuizState();
      setShowTipBubble(false);
    } else {
      setActiveStageId(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReturnToTrailMap = () => {
    playSound.pop(soundEnabled);
    setShowCelebrationModal(false);
    setShowGuestNoticeInModal(false);
    setActiveStageId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const celebrationModal = (
    <TrailCelebrationModal
      isOpen={showCelebrationModal}
      activeStage={activeStage}
      nextStage={nextStage}
      soundEnabled={soundEnabled}
      showGuestNoticeInModal={showGuestNoticeInModal}
      onDismissGuestNotice={() => setShowGuestNoticeInModal(false)}
      onOpenRegisterFromModal={() => {
        setShowCelebrationModal(false);
        setShowGuestNoticeInModal(false);
        onOpenRegisterModal?.();
      }}
      onAdvanceToNextStage={handleAdvanceToNextStage}
      onReturnToTrailMap={handleReturnToTrailMap}
    />
  );

  // Modo 1: Observação das letras da etapa
  if (activeStage && stageViewMode === 'observe') {
    return (
      <TrailObserveView
        stage={activeStage}
        soundEnabled={soundEnabled}
        showTipBubble={showTipBubble}
        onToggleTipBubble={() => setShowTipBubble((prev) => !prev)}
        onBackToMap={() => setActiveStageId(null)}
        onStartQuiz={handleStartQuiz}
        celebrationModal={celebrationModal}
      />
    );
  }

  // Modo 2: Desafio (Quiz) da etapa
  if (activeStage && stageViewMode === 'quiz') {
    return (
      <TrailQuizView
        stage={activeStage}
        currentQuestionIndex={currentQuestionIndex}
        selectedOptionId={selectedOptionId}
        answerState={answerState}
        soundEnabled={soundEnabled}
        onReturnToObserve={() => setStageViewMode('observe')}
        onSelectOption={handleSelectOption}
        celebrationModal={celebrationModal}
      />
    );
  }

  // Modo 3: Mapa principal da Trilha
  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 space-y-6">
      <div className="text-left space-y-1">
        <span className="text-[11px] sm:text-xs font-black uppercase text-blue-600 dark:text-sky-400 tracking-wider font-outfit">
          CADA PASSO É UMA DESCOBERTA
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight font-outfit">
          Sua trilha de aprendizado
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
          Observe, pratique e conquiste estrelas. Você pode repetir quando quiser.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 bg-white dark:bg-[#111C35] rounded-3xl p-5 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-outfit">
              O caminho das letras
            </h2>
            <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs font-black border border-indigo-100 dark:border-indigo-900/60 font-outfit">
              {completedCount} / {totalStages} etapas
            </span>
          </div>

          <div className="relative space-y-8 sm:space-y-10 pl-2">
            {ALPHABET_TRAIL_STAGES.map((stage, idx) => {
              const isCompleted = completedStages.includes(stage.id);
              const isUnlocked = estaEtapaLiberada(idx, completedStages, ALPHABET_TRAIL_STAGES);
              const isCurrent = isUnlocked && !isCompleted;
              const isLast = idx === ALPHABET_TRAIL_STAGES.length - 1;

              return (
                <div key={stage.id} className="relative flex items-start gap-4 sm:gap-6 group text-left">
                  {!isLast && (
                    <div
                      className={`absolute left-[19px] sm:left-[23px] top-[42px] sm:top-[50px] bottom-[-32px] sm:bottom-[-40px] w-0.5 border-l-2 border-dashed ${
                        isCompleted
                          ? 'border-emerald-300 dark:border-emerald-800'
                          : 'border-slate-200 dark:border-slate-800'
                      }`}
                    />
                  )}

                  <button
                    onClick={() => handleSelectStage(stage, idx)}
                    disabled={!isUnlocked}
                    className={`relative z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isUnlocked ? 'cursor-pointer hover:scale-105 active:scale-95' : 'cursor-not-allowed opacity-60'
                    } ${
                      isCompleted
                        ? 'bg-[#008272] text-white shadow-sm ring-4 ring-[#008272]/20'
                        : isCurrent
                        ? 'bg-[#2952E3] text-white shadow-md ring-4 ring-blue-300 dark:ring-blue-900/60 animate-pulse'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
                    ) : isCurrent ? (
                      <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 fill-white" />
                    ) : (
                      <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </button>

                  <div
                    onClick={() => handleSelectStage(stage, idx)}
                    className={`flex-1 min-w-0 pt-0.5 ${isUnlocked ? 'cursor-pointer' : ''}`}
                  >
                    <span className="text-[10px] sm:text-[11px] font-black uppercase text-blue-600 dark:text-sky-400 tracking-wider font-outfit block">
                      ETAPA {stage.stageNumber}
                    </span>
                    <h3 className={`text-base sm:text-lg font-black font-outfit transition-colors ${
                      isUnlocked
                        ? 'text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-sky-400'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}>
                      {stage.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                      {stage.lettersSummary}
                    </p>
                  </div>

                  <div className="hidden sm:flex items-center gap-1 shrink-0 pt-1 text-xs font-bold text-amber-500 dark:text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>+{stage.rewardStars}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-5">
          <div className="bg-gradient-to-b from-[#F3F6FF] to-[#E8EFFF] dark:from-[#131F3F] dark:to-[#0C1428] rounded-3xl p-6 border border-indigo-100 dark:border-indigo-950 flex flex-col items-center text-center shadow-xs">
            <div className="w-32 h-32 sm:w-36 sm:h-36 relative flex items-center justify-center my-2">
              <img
                src="./assets/mascot_stitch.png"
                alt="Lumi segurando uma estrela dourada"
                className="w-full h-full object-contain pointer-events-none select-none drop-shadow-xl animate-float-gentle"
              />
            </div>

            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-outfit mt-2">
              Cada descoberta conta!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
              Sem pressa. Você pode tentar quantas vezes quiser.
            </p>

            <div className="w-full mt-5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                <span>Progresso da Trilha</span>
                <span className="font-outfit text-blue-600 dark:text-sky-400">
                  {completedCount} de {totalStages} etapas
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700/60 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#008272] h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => onNavigateToAlphabet?.()}
                title="Ver todas as letras do Alfabeto"
                className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-2xs cursor-pointer"
              >
                <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
              </button>

              <button
                onClick={() => onNavigateToMemoryGame?.()}
                title="Jogar Jogo da Memória"
                className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-2xs cursor-pointer"
              >
                <Award className="w-5 h-5 text-amber-600" />
              </button>

              <div
                title={`${userStats.stars} estrelas conquistadas`}
                className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 flex items-center justify-center shadow-2xs"
              >
                <Trophy className="w-5 h-5 text-amber-600" />
              </div>
            </div>

            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-6">
              Seu progresso fica salvo na sua conta.
            </p>
          </div>
        </div>
      </div>

      {celebrationModal}
    </div>
  );
};
