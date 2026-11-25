import React from 'react';
import { ArrowRight, BookOpen, Lightbulb, Star } from 'lucide-react';
import { ALPHABET_TRAIL_STAGES } from '../../data/librasTrailAlphabetData';
import { calcularSemanaTreino } from '../../logic/gamification';
import { TabType, UserStats } from '../../types';
import { playSound } from '../../utils/sound';
import { getTodayDateString } from '../../utils/storage';
import { HomeDiscoveryCards } from './home/HomeDiscoveryCards';
import { HomeHeroBanner } from './home/HomeHeroBanner';
import { HomeWeeklyMission } from './home/HomeWeeklyMission';

interface HomeScreenProps {
  stats: UserStats;
  completedTrailNodes?: string[];
  hasStartedTrail?: boolean;
  onNavigateTab: (tab: TabType) => void;
  onOpenHighFive: () => void;
  onOpenTipModal: () => void;
  onStartExpressGame: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  stats,
  completedTrailNodes = [],
  hasStartedTrail = completedTrailNodes.length > 0,
  onNavigateTab,
  onOpenHighFive,
  onOpenTipModal,
  onStartExpressGame
}) => {
  const completedStagesCount = completedTrailNodes.filter(
    (id) => ALPHABET_TRAIL_STAGES.some((s) => s.id === id) || ['node-1', 'node-2'].includes(id)
  ).length;
  const totalTrailStages = ALPHABET_TRAIL_STAGES.length;
  const trailProgressPercent = Math.min(100, Math.round((completedStagesCount / totalTrailStages) * 100));
  const nextTrailStage = ALPHABET_TRAIL_STAGES.find((s) => !completedTrailNodes.includes(s.id));

  const heroPrimaryCtaLabel = !hasStartedTrail
    ? `Começar: ${ALPHABET_TRAIL_STAGES[0].title}`
    : nextTrailStage
    ? `Continuar: ${nextTrailStage.title}`
    : 'Rever trilha completa';

  const weekDays = calcularSemanaTreino(stats);
  const trainedDaysCount = weekDays.filter((d) => d.isTrained).length;
  const isTodayTrained = weekDays.some((d) => d.isToday && d.isTrained);
  const isHighFiveDoneToday = stats.lastHighFiveDate === getTodayDateString();

  return (
    <div className="space-y-8 pb-8 text-left transition-colors">
      <HomeHeroBanner
        soundEnabled={stats.soundEnabled}
        heroPrimaryCtaLabel={heroPrimaryCtaLabel}
        isHighFiveDoneToday={isHighFiveDoneToday}
        onNavigateTab={onNavigateTab}
        onOpenHighFive={onOpenHighFive}
        onOpenTipModal={onOpenTipModal}
      />

      <HomeDiscoveryCards
        soundEnabled={stats.soundEnabled}
        onNavigateTab={onNavigateTab}
      />

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          {/* Card de progresso na trilha */}
          <div className="rounded-3xl bg-white dark:bg-[#111C35] p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-xs relative overflow-hidden transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-[11px] font-black uppercase text-blue-600 dark:text-sky-400 tracking-wider font-outfit">
                  SUA TRILHA DE LIBRAS
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-outfit mt-0.5">
                  O Caminho das Letras (A-Z)
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
                  Avance pelas 9 etapas com o mascote Lumi, observe os sinais e teste seus conhecimentos!
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  playSound.pop(stats.soundEnabled);
                  onNavigateTab('trail');
                }}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 dark:text-sky-400 hover:text-blue-700 dark:hover:text-sky-300 hover:underline transition-colors cursor-pointer font-outfit shrink-0 self-start sm:self-center"
              >
                <span>Ver trilha completa</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-indigo-950 dark:text-indigo-200 font-outfit">
                  Progresso na Trilha
                </span>
                {completedStagesCount > 0 && (
                  <span className="text-indigo-700 dark:text-sky-400 font-black font-outfit">
                    {completedStagesCount} de {totalTrailStages} Etapas ({trailProgressPercent}%)
                  </span>
                )}
              </div>
              <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-700/60 overflow-hidden">
                <div
                  className="h-full bg-[#008272] rounded-full transition-all duration-500 shadow-xs"
                  style={{ width: `${trailProgressPercent}%` }}
                />
              </div>
              {completedStagesCount === 0 && (
                <p className="text-xs font-medium text-indigo-800 dark:text-indigo-200 pt-0.5">
                  Comece pela primeira etapa: leva só alguns minutos.
                </p>
              )}
            </div>

            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                  <Star className="w-5 h-5 fill-emerald-500 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white font-outfit">
                    Etapa recomendada para você
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {ALPHABET_TRAIL_STAGES[Math.min(completedStagesCount, totalTrailStages - 1)]?.title || 'Todas as etapas concluídas!'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  playSound.pop(stats.soundEnabled);
                  onNavigateTab('trail');
                }}
                className="text-xs font-black text-blue-600 dark:text-sky-400 hover:text-blue-700 flex items-center gap-1 cursor-pointer font-outfit"
              >
                <span>{hasStartedTrail ? 'Continuar' : 'Começar'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card: Dica do Mestre Lumi */}
          <div className="rounded-3xl bg-gradient-to-br from-[#F5F8FF] to-[#E9F0FE] dark:from-[#131F3F] dark:to-[#0C152B] p-6 border border-indigo-100 dark:border-indigo-950 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4 text-left">
              <div className="w-14 h-14 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center shrink-0 shadow-sm">
                <Lightbulb className="w-7 h-7 fill-amber-300 text-amber-950" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 font-outfit">
                  DICA DO MESTRE LUMI
                </span>
                <h4 className="text-base font-black text-slate-900 dark:text-white font-outfit">
                  A Expressão Facial é Gramática!
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium max-w-md mt-0.5">
                  Ao fazer perguntas em Libras, incline levemente a cabeça e erga as sobrancelhas. Seu rosto dá vida às mãos!
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                playSound.pop(stats.soundEnabled);
                onNavigateTab('daily-signs');
              }}
              className="px-5 py-2.5 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-blue-700 dark:text-sky-300 text-xs font-bold border border-blue-200 dark:border-slate-700 transition-all shadow-2xs whitespace-nowrap cursor-pointer font-outfit"
            >
              Ver Sinais com Expressão
            </button>
          </div>

          {/* Banner: Fontes e Curiosidades */}
          <div className="rounded-3xl bg-gradient-to-br from-sky-50 via-blue-50/70 to-indigo-50/90 dark:from-[#111F3D] dark:via-[#111C35] dark:to-[#0C152B] p-6 border border-sky-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-5 transition-colors shadow-xs">
            <div className="flex items-center gap-4 text-left">
              <div className="w-14 h-14 rounded-2xl bg-sky-500/15 dark:bg-sky-500/20 text-sky-600 dark:text-sky-300 flex items-center justify-center shrink-0 border border-sky-200/50 dark:border-sky-800/60 shadow-xs">
                <BookOpen className="w-7 h-7 text-sky-600 dark:text-sky-300" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-sky-700 dark:text-sky-400 font-outfit">
                  FONTES, CRÉDITOS & CURIOSIDADES
                </span>
                <h4 className="text-base font-black text-slate-900 dark:text-white font-outfit">
                  Descubra a história e a cultura da Libras
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium max-w-md mt-0.5">
                  Conheça 5 curiosidades fascinantes, leis de inclusão e as fontes oficiais do projeto!
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                playSound.pop(stats.soundEnabled);
                onNavigateTab('credits-curiosities');
              }}
              className="px-5 py-2.5 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-sky-700 dark:text-sky-300 text-xs font-bold border border-sky-200 dark:border-slate-700 transition-all shadow-2xs whitespace-nowrap cursor-pointer font-outfit flex items-center gap-2 shrink-0"
            >
              <span>Explorar Curiosidades & Fontes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <HomeWeeklyMission
          weekDays={weekDays}
          trainedDaysCount={trainedDaysCount}
          isTodayTrained={isTodayTrained}
          soundEnabled={stats.soundEnabled}
          onNavigateTab={onNavigateTab}
          onStartExpressGame={onStartExpressGame}
        />
      </section>
    </div>
  );
};
