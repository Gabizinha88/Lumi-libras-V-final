/**
 * O que este arquivo faz: exibe o cartão lateral de Missão da Semana (Seg–Dom) com dias treinados
 * e o cartão do desafio rápido "Jogo da Memória Express".
 * Quem usa: HomeScreen.tsx.
 */
import React from 'react';
import { Check, Flame, Gamepad2, Star, Trophy } from 'lucide-react';
import { WeeklyTrainingDay } from '../../../logic/gamification';
import { TabType } from '../../../types';
import { playSound } from '../../../utils/sound';

interface HomeWeeklyMissionProps {
  weekDays: WeeklyTrainingDay[];
  trainedDaysCount: number;
  isTodayTrained: boolean;
  soundEnabled: boolean;
  onNavigateTab: (tab: TabType) => void;
  onStartExpressGame: () => void;
}

export const HomeWeeklyMission: React.FC<HomeWeeklyMissionProps> = ({
  weekDays,
  trainedDaysCount,
  isTodayTrained,
  soundEnabled,
  onNavigateTab,
  onStartExpressGame
}) => {
  return (
    <div className="lg:col-span-5 xl:col-span-4 space-y-5 text-left">
      {/* Card 1: MISSÃO DA SEMANA */}
      <div className="bg-white dark:bg-[#111C35] rounded-3xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
            <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white font-outfit">
              Missão da Semana
            </h4>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-[10px] font-black font-outfit">
            Meta: 5 dias
          </span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium mb-4">
          Treine seus sinais todos os dias para abrir o Baú de Estrelas Douradas!
        </p>

        <div className="flex items-center justify-between gap-1 mb-4">
          {weekDays.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  item.isTrained
                    ? 'bg-[#008272] text-white shadow-2xs ring-2 ring-[#008272]/30'
                    : item.isToday
                    ? 'bg-amber-400 text-amber-950 ring-2 ring-amber-300 ring-offset-2 dark:ring-offset-slate-900 animate-pulse'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}
              >
                {item.isTrained ? (
                  <Check className="w-4 h-4 text-white stroke-[3]" />
                ) : item.isToday ? (
                  <Star className="w-3.5 h-3.5 fill-amber-950 text-amber-950" />
                ) : (
                  <span className="text-[10px] text-slate-400 font-bold">•</span>
                )}
              </div>
              <span className={`text-[10px] font-bold ${
                item.isToday
                  ? 'text-amber-600 dark:text-amber-400 font-extrabold font-outfit'
                  : 'text-slate-500 dark:text-slate-400'
              }`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Trophy className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <div className="text-left text-xs">
              <div className="font-extrabold text-indigo-950 dark:text-indigo-200 font-outfit">
                Recompensa: 50 Estrelas
              </div>
              <div className="text-indigo-700 dark:text-indigo-300 font-semibold text-[11px]">
                {trainedDaysCount >= 5
                  ? 'Meta semanal atingida! Parabéns!'
                  : isTodayTrained
                  ? 'Sessão de hoje concluída! Volte amanhã.'
                  : 'Falta apenas 1 sessão hoje!'}
              </div>
            </div>
          </div>

          {!isTodayTrained && (
            <button
              onClick={() => {
                playSound.pop(soundEnabled);
                onNavigateTab('trail');
              }}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-extrabold cursor-pointer font-outfit shrink-0"
            >
              Treinar
            </button>
          )}
        </div>
      </div>

      {/* Card 2: DESAFIO RÁPIDO */}
      <div className="rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-purple-700 dark:from-indigo-800 dark:via-indigo-700 dark:to-purple-900 text-white p-5 shadow-md relative overflow-hidden">
        <span className="text-[10px] font-black uppercase text-indigo-200 tracking-wider font-outfit">
          DESAFIO RÁPIDO
        </span>
        <h4 className="text-base font-black text-white mt-0.5 mb-2 font-outfit">
          Jogo da Memória Express
        </h4>
        <p className="text-xs text-indigo-100 leading-relaxed font-medium mb-4">
          Uma partida rápida de 4 pares para praticar as letras, sem pressa.
        </p>

        <button
          onClick={onStartExpressGame}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#FDE047] hover:bg-[#FACC15] active:scale-95 text-slate-950 font-black text-xs shadow-md transition-transform cursor-pointer font-outfit"
        >
          <Gamepad2 className="w-4 h-4 text-slate-900" />
          <span>Jogar 1 Partida Rápida</span>
        </button>
      </div>
    </div>
  );
};
