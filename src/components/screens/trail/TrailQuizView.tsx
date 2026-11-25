/**
 * O que este arquivo faz: exibe o Passo 2 de uma etapa da trilha ("2. ENCONTRE A MÃO"),
 * apresentando a letra-alvo e 3 opções de sinais em Libras com feedback visual imediato.
 * Quem usa: TrailScreen.tsx.
 */
import React from 'react';
import { ArrowLeft, Check, CheckCircle2, XCircle } from 'lucide-react';
import { TrailAlphabetStage } from '../../../types';
import { playSound } from '../../../utils/sound';

interface TrailQuizViewProps {
  stage: TrailAlphabetStage;
  currentQuestionIndex: number;
  selectedOptionId: string | null;
  answerState: 'idle' | 'correct' | 'wrong';
  soundEnabled: boolean;
  onReturnToObserve: () => void;
  onSelectOption: (optionId: string, isCorrect: boolean) => void;
  celebrationModal: React.ReactNode;
}

export const TrailQuizView: React.FC<TrailQuizViewProps> = ({
  stage,
  currentQuestionIndex,
  selectedOptionId,
  answerState,
  soundEnabled,
  onReturnToObserve,
  onSelectOption,
  celebrationModal
}) => {
  const currentQuestion = stage.questions[currentQuestionIndex];
  const totalQuestions = stage.questions.length;

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 space-y-6">
      <div className="bg-white dark:bg-[#111C35] rounded-3xl p-5 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex items-center justify-between gap-4 mb-3">
          <button
            onClick={() => {
              playSound.pop(soundEnabled);
              onReturnToObserve();
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

        <div className="flex items-center justify-between text-xs font-extrabold uppercase text-blue-600 dark:text-sky-400 tracking-wider mb-2 font-outfit">
          <span>2. ENCONTRE A MÃO</span>
          <span className="text-slate-500 dark:text-slate-400 font-bold">
            {currentQuestionIndex + 1} de {totalQuestions}
          </span>
        </div>

        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mb-8">
          <div
            className="bg-blue-600 dark:bg-sky-500 h-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>

        <div className="text-center space-y-3 mb-8">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-outfit">
            Qual mão combina com esta letra?
          </h3>

          <div className="py-2">
            <span className="text-6xl sm:text-7xl font-black text-[#5B3DF5] dark:text-[#8870FF] font-outfit tracking-tight select-none">
              {currentQuestion.targetLetter}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-semibold">
            Toque na mão que representa <strong>{currentQuestion.targetLetter}</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto my-6">
          {currentQuestion.options.map((opt, idx) => {
            const isSelected = selectedOptionId === opt.id;
            const isCorrectSelection = isSelected && answerState === 'correct';
            const isWrongSelection = isSelected && answerState === 'wrong';

            return (
              <button
                key={opt.id}
                onClick={() => onSelectOption(opt.id, opt.isCorrect)}
                disabled={answerState === 'correct'}
                className={`relative p-5 rounded-3xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer group ${
                  isCorrectSelection
                    ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/60 ring-2 ring-emerald-400 shadow-md'
                    : isWrongSelection
                    ? 'border-rose-400 bg-rose-50/70 dark:bg-rose-950/50 animate-shake shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B33] hover:border-indigo-400 hover:shadow-md'
                }`}
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
                  <img
                    src={opt.signImagePath}
                    alt={`Opção de sinal ${idx + 1}`}
                    className="w-full h-full object-contain pointer-events-none select-none transition-transform group-hover:scale-105"
                    loading="eager"
                  />
                </div>

                <span className={`mt-3 text-xs font-black w-6 h-6 rounded-full flex items-center justify-center ${
                  isCorrectSelection
                    ? 'bg-emerald-500 text-white'
                    : isWrongSelection
                    ? 'bg-rose-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}>
                  {idx + 1}
                </span>

                {isCorrectSelection && (
                  <span className="absolute top-2 right-2 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </span>
                )}
                {isWrongSelection && (
                  <span className="absolute top-2 right-2 text-rose-500">
                    <XCircle className="w-5 h-5" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="pt-4 mt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
            {answerState === 'wrong' ? (
              <span className="text-rose-600 dark:text-rose-400 font-bold">
                Ops! Quase lá. Tente outra mão com calma!
              </span>
            ) : answerState === 'correct' ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1.5 justify-center sm:justify-start">
                <Check className="w-4 h-4 stroke-[3]" />
                Mandou muito bem! Sinal correto!
              </span>
            ) : (
              <span>Você pode tentar quantas vezes quiser.</span>
            )}
          </div>

          <button
            onClick={() => {
              playSound.pop(soundEnabled);
              onReturnToObserve();
            }}
            className="text-xs sm:text-sm font-bold text-blue-600 dark:text-sky-400 hover:text-blue-700 underline transition-colors cursor-pointer"
          >
            Rever as letras
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
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5 line-clamp-2">
            Observe as mãos antes do desafio. Pode rever as letras quando quiser.
          </p>
          {currentQuestion.hint && (
            <p className="text-xs text-amber-600 dark:text-amber-400 font-bold mt-1">
              Dica: {currentQuestion.hint}
            </p>
          )}
        </div>
      </div>

      {celebrationModal}
    </div>
  );
};
