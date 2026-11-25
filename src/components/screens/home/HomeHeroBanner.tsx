import React from 'react';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { LumiMascot } from '../../LumiMascot';
import { TabType } from '../../../types';
import { playSound } from '../../../utils/sound';

interface HomeHeroBannerProps {
  soundEnabled: boolean;
  heroPrimaryCtaLabel: string;
  isHighFiveDoneToday: boolean;
  onNavigateTab: (tab: TabType) => void;
  onOpenHighFive: () => void;
  onOpenTipModal: () => void;
}

export const HomeHeroBanner: React.FC<HomeHeroBannerProps> = ({
  soundEnabled,
  heroPrimaryCtaLabel,
  isHighFiveDoneToday,
  onNavigateTab,
  onOpenHighFive,
  onOpenTipModal
}) => {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 dark:from-blue-800 dark:via-blue-700 dark:to-indigo-900 text-white p-6 sm:p-10 shadow-xl shadow-blue-500/15">
      <div className="absolute top-4 left-1/3 text-sky-300/40 text-lg">✦</div>
      <div className="absolute top-10 right-1/4 text-amber-300/50 text-xl">✦</div>
      <div className="absolute bottom-6 left-1/4 text-sky-200/30 text-sm">✧</div>
      <div className="absolute bottom-12 right-12 text-yellow-300/40 text-lg">✦</div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        <div className="lg:col-span-7 space-y-5 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold text-sky-100 font-outfit">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>SUA PRÓXIMA DESCOBERTA COMEÇA AQUI</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.12] font-outfit">
            Primeiros sinais. <br />
            <span className="text-[#FDE047] drop-shadow-sm">Grandes descobertas.</span>
          </h1>

          <p className="text-sm sm:text-base text-blue-100 max-w-xl font-medium leading-relaxed">
            Eu sou o Lumi, seu companheiro nessa jornada! Vamos descobrir a Libras e comemorar cada novo passo juntos? No seu ritmo. Do seu jeito. Juntos.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => {
                playSound.pop(soundEnabled);
                onNavigateTab('trail');
              }}
              className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#FDE047] hover:bg-[#FACC15] active:scale-95 text-slate-950 font-black text-sm shadow-md shadow-amber-400/25 transition-transform cursor-pointer font-outfit"
            >
              <span>{heroPrimaryCtaLabel}</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>

            <button
              onClick={onOpenHighFive}
              className={`flex items-center gap-2 px-5 py-3.5 rounded-full active:scale-95 font-extrabold text-sm shadow-md transition-all cursor-pointer font-outfit ${
                isHighFiveDoneToday
                  ? 'bg-blue-100/90 dark:bg-blue-950/80 text-blue-900 dark:text-sky-200 border border-blue-200 dark:border-blue-700/70'
                  : 'bg-white dark:bg-slate-100 hover:bg-slate-50 text-blue-900 shadow-black/5'
              }`}
              title={isHighFiveDoneToday ? 'Você já deu o toca aqui hoje! Volte amanhã para mais estrelas' : 'Dar um toca aqui no Lumi e ganhar estrelas'}
            >
              <span className="text-base">{isHighFiveDoneToday ? '✨' : '✋'}</span>
              <span>{isHighFiveDoneToday ? 'Toca aqui! (Feito hoje ✦)' : 'Toca aqui!'}</span>
            </button>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-blue-200/90 font-medium">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-300 stroke-[3]" />
              Conteúdo pedagógico inclusivo
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-300 stroke-[3]" />
              Acessível e visual
            </span>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col items-center relative">
          <div className="w-full max-w-xs bg-white dark:bg-[#111C35] text-slate-800 dark:text-slate-100 p-4 rounded-2xl shadow-xl border border-blue-100 dark:border-slate-700/80 relative mb-4 text-left transition-colors">
            <div className="flex items-center justify-between mb-1.5">
              <div className="text-xs font-black text-blue-950 dark:text-white flex items-center gap-1 font-outfit">
                Oi! Eu sou o Lumi! <span className="text-amber-400">✦</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
                100% Grátis
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug font-medium mb-2.5">
              Vou acompanhar você em cada descoberta. Vamos aprender Libras juntos?
            </p>
            <button
              onClick={() => {
                playSound.pop(soundEnabled);
                onOpenTipModal();
              }}
              className="text-xs font-bold text-blue-600 dark:text-sky-400 hover:text-blue-700 dark:hover:text-sky-300 flex items-center gap-1 cursor-pointer font-outfit"
            >
              <span>Me conta mais</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="absolute -bottom-2 right-12 w-4 h-4 bg-white dark:bg-[#111C35] rotate-45 border-r border-b border-blue-100 dark:border-slate-700/80" />
          </div>

          <div className="relative flex flex-col items-center">
            <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-gradient-to-tr from-sky-400/40 via-cyan-300/30 to-blue-200/40 dark:from-sky-500/20 dark:via-cyan-400/20 dark:to-blue-600/20 p-2.5 backdrop-blur-xs border-2 border-white/40 dark:border-white/20 shadow-inner flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-gradient-to-b from-[#2B86C5]/60 to-[#104880]/90 dark:from-[#1b4e75]/80 dark:to-[#0b2848]/90 overflow-hidden flex items-center justify-center relative">
                <LumiMascot size="hero" />
              </div>
            </div>

            <div className="mt-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#111C35] text-slate-800 dark:text-slate-100 text-[11px] font-black uppercase tracking-wider shadow-md border border-slate-100 dark:border-slate-700 font-outfit">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>SEU COMPANHEIRO DE DESCOBERTAS</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
