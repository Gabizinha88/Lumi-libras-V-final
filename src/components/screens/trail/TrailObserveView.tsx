/**
 * O que este arquivo faz: exibe o Passo 1 de uma etapa da trilha ("1. OBSERVE AS MÃOS"),
 * mostrando cada letra e sua configuração de mão antes do quiz.
 * Quem usa: TrailScreen.tsx.
 */
import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { TrailAlphabetStage } from '../../../types';
import { playSound } from '../../../utils/sound';

interface TrailObserveViewProps {
  stage: TrailAlphabetStage;
  soundEnabled: boolean;
  showTipBubble: boolean;
  onToggleTipBubble: () => void;
  onBackToMap: () => void;
  onStartQuiz: () => void;
  celebrationModal: React.ReactNode;
}

export const TrailObserveView: React.FC<TrailObserveViewProps> = ({
  stage,
  soundEnabled,
  showTipBubble,
  onToggleTipBubble,
  onBackToMap,
  onStartQuiz,
  celebrationModal
}) => {
  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 space-y-6">
      {/* Main Observation Card */}
      <div className="bg-white dark:bg-[#111C35] rounded-3xl p-5 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex items-center justify-between gap-4 mb-6">
          <button
            onClick={() => {
              playSound.pop(soundEnabled);
              onBackToMap();
            }}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 dark:text-sky-400 hover:text-blue-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar à trilha</span>
          </button>

          <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-100 dark:border-indigo-900/60">
            Etapa {stage.stageNumber} · {stage.title}
          </span>
        </div>

        <div className="space-y-1.5 mb-6 text-left">
          <span className="text-[11px] sm:text-xs font-extrabold uppercase text-blue-600 dark:text-sky-400 tracking-wider font-outfit">
            1. OBSERVE AS MÃOS
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-outfit">
            {stage.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
            Veja a letra e a mão. Experimente fazer com a sua!
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 my-8">
          {stage.letters.map((item, idx) => (
            <div
              key={idx}
              className="h-full rounded-2xl bg-[#F4F1FD] dark:bg-[#181B38] p-2.5 sm:p-4 border border-indigo-100/70 dark:border-indigo-900/40 flex flex-col items-center transition-all hover:scale-102 hover:shadow-xs"
            >
              <span className="text-base sm:text-lg font-black text-indigo-700 dark:text-indigo-300 mb-2 font-outfit">
                {item.letter}
              </span>

              <div className="w-full aspect-square shrink-0 bg-white dark:bg-[#11162B] rounded-xl p-2 flex items-center justify-center border border-indigo-100/50 dark:border-slate-800 shadow-2xs">
                <img
                  src={item.signImagePath}
                  alt={`Sinal da letra ${item.letter} em Libras`}
                  className="w-full h-full object-contain pointer-events-none select-none drop-shadow-xs"
                  loading="eager"
                />
              </div>

              {item.tip && (
                <span className="w-full text-[10px] text-slate-500 dark:text-slate-400 font-medium text-center leading-snug break-words mt-2">
                  {item.tip}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
            Observe. Imite. Descubra.
          </span>

          <button
            onClick={onStartQuiz}
            className="btn-3d btn-primary-3d w-full sm:w-auto px-8 py-3.5 rounded-2xl text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer font-outfit"
          >
            <span>Vamos ao desafio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Lumi Companion Card */}
      <div className="bg-white dark:bg-[#111C35] rounded-3xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center gap-4 text-left transition-colors">
        <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 relative flex items-center justify-center">
          <img
            src="./assets/mascot_stitch.png"
            alt="Lumi Mascote"
            className="w-full h-full object-contain pointer-events-none select-none drop-shadow-md"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white font-outfit">
            Lumi está com você
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Observe as mãos antes do desafio. Você pode rever as letras quando quiser.
          </p>
          <button
            onClick={onToggleTipBubble}
            className="mt-1 text-xs font-bold text-blue-600 dark:text-sky-400 hover:text-blue-700 inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Me dá uma dica</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {showTipBubble && (
            <div className="mt-2.5 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 font-medium">
              💡 <strong>Dica do Lumi:</strong> Tente posicionar a mão na frente do seu peito ou rosto, imitando o mesmo formato da ilustração antes de clicar no desafio!
            </div>
          )}
        </div>
      </div>

      {celebrationModal}
    </div>
  );
};
