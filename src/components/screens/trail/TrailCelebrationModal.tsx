import React from 'react';
import { ArrowRight, Check, Info, Sparkles, Star } from 'lucide-react';
import { TrailAlphabetStage } from '../../../types';
import { playSound } from '../../../utils/sound';

interface TrailCelebrationModalProps {
  isOpen: boolean;
  activeStage: TrailAlphabetStage | undefined;
  nextStage: TrailAlphabetStage | null;
  soundEnabled: boolean;
  showGuestNoticeInModal: boolean;
  onDismissGuestNotice: () => void;
  onOpenRegisterFromModal: () => void;
  onAdvanceToNextStage: () => void;
  onReturnToTrailMap: () => void;
}

export const TrailCelebrationModal: React.FC<TrailCelebrationModalProps> = ({
  isOpen,
  activeStage,
  nextStage,
  soundEnabled,
  showGuestNoticeInModal,
  onDismissGuestNotice,
  onOpenRegisterFromModal,
  onAdvanceToNextStage,
  onReturnToTrailMap
}) => {
  if (!isOpen || !activeStage) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white dark:bg-[#111C35] rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl animate-scaleUp">
        <div className="w-24 h-24 mx-auto relative flex items-center justify-center">
          <img
            src="./assets/mascot_stitch.png"
            alt="Lumi Comemorando"
            className="w-full h-full object-contain pointer-events-none select-none drop-shadow-xl animate-bounce"
          />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-black uppercase text-amber-500 tracking-wider">
            PARABÉNS! ETAPA CONCLUÍDA
          </span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white font-outfit">
            {activeStage.title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Você dominou os sinais desta etapa e desbloqueou o próximo desafio!
          </p>
        </div>

        <div className="py-3 px-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-center gap-6">
          <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-extrabold text-sm">
            <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
            <span>+{activeStage.rewardStars} Estrelas</span>
          </div>
          <div className="flex items-center gap-1.5 text-blue-600 dark:text-sky-400 font-extrabold text-sm">
            <Sparkles className="w-5 h-5" />
            <span>+{activeStage.rewardXp} XP</span>
          </div>
        </div>

        {showGuestNoticeInModal && (
          <div className="p-3.5 rounded-2xl bg-amber-50/90 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/80 text-left space-y-2.5">
            <div className="flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs font-medium text-amber-950 dark:text-amber-100 leading-relaxed">
                Você está como visitante: seu progresso não será salvo. Crie uma conta grátis para guardar suas estrelas.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onDismissGuestNotice}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-amber-900 dark:text-amber-200 hover:bg-amber-100/80 dark:hover:bg-amber-900/50 transition-colors cursor-pointer"
              >
                Agora não
              </button>
              <button
                type="button"
                onClick={() => {
                  playSound.pop(soundEnabled);
                  onOpenRegisterFromModal();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold transition-colors cursor-pointer shadow-xs"
              >
                Criar conta
              </button>
            </div>
          </div>
        )}

        <div className="pt-2 flex flex-col gap-2.5">
          {nextStage ? (
            <button
              onClick={onAdvanceToNextStage}
              className="btn-3d btn-primary-3d w-full py-3.5 px-6 rounded-2xl text-white font-black text-sm uppercase tracking-wider cursor-pointer font-outfit flex items-center justify-center gap-2"
            >
              <span>Avançar para Etapa {nextStage.stageNumber}: {nextStage.title}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onReturnToTrailMap}
              className="btn-3d btn-primary-3d w-full py-3.5 px-6 rounded-2xl text-white font-black text-sm uppercase tracking-wider cursor-pointer font-outfit flex items-center justify-center gap-2"
            >
              <span>Concluir Trilha</span>
              <Check className="w-4 h-4 stroke-[3]" />
            </button>
          )}

          <button
            onClick={onReturnToTrailMap}
            className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Voltar ao Mapa da Trilha
          </button>
        </div>
      </div>
    </div>
  );
};
