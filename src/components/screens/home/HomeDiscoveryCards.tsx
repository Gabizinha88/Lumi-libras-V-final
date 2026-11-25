import React from 'react';
import { ArrowRight, Gamepad2, Route, Sparkles } from 'lucide-react';
import { TabType } from '../../../types';
import { playSound } from '../../../utils/sound';

interface HomeDiscoveryCardsProps {
  soundEnabled: boolean;
  onNavigateTab: (tab: TabType) => void;
}

export const HomeDiscoveryCards: React.FC<HomeDiscoveryCardsProps> = ({
  soundEnabled,
  onNavigateTab
}) => {
  const navegar = (tab: TabType) => {
    playSound.pop(soundEnabled);
    onNavigateTab(tab);
  };

  return (
    <section className="space-y-4 text-left">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1">
        <div>
          <span className="text-[11px] font-black tracking-wider text-blue-600 dark:text-sky-400 uppercase font-outfit">
            QUAL VAI SER A DESCOBERTA DE HOJE?
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight font-outfit">
            Escolha por onde começar!
          </h2>
        </div>
        <button
          onClick={() => navegar('trail')}
          className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 flex items-center gap-1 cursor-pointer font-outfit"
        >
          <span>Ver Trilha Completa</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Trilha de Aprendizado */}
        <div className="bg-white dark:bg-[#111C35] rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 transition-all flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100/90 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-black text-lg group-hover:scale-105 transition-transform">
                <Route className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 uppercase tracking-wider font-outfit">
                TRILHA A-Z
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors font-outfit">
              O Caminho das Letras
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              9 etapas completas de A a Z com observação guiada e desafios para conquistar estrelas!
            </p>
          </div>
          <div className="pt-5">
            <button
              onClick={() => navegar('trail')}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/70 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition-colors cursor-pointer font-outfit"
            >
              <span>Acessar Trilha</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: Alfabeto Manual */}
        <div className="bg-white dark:bg-[#111C35] rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500 transition-all flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-blue-100/90 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 flex items-center justify-center font-black text-base group-hover:scale-105 transition-transform font-outfit">
                Aa
              </div>
              <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase tracking-wider font-outfit">
                ALFABETO
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors font-outfit">
              Alfabeto em Libras
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Conheça as 26 letras com fotos reais em alta definição e vídeos em câmera lenta (0.5x).
            </p>
          </div>
          <div className="pt-5">
            <button
              onClick={() => navegar('alphabet')}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/70 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold transition-colors cursor-pointer font-outfit"
            >
              <span>Ver fotos e vídeos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 3: Sinais do Dia a Dia */}
        <div className="bg-white dark:bg-[#111C35] rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-amber-300 dark:hover:border-amber-500 transition-all flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-amber-100/90 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center font-black text-lg group-hover:scale-105 transition-transform">
                👋
              </div>
              <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase tracking-wider font-outfit">
                VÍDEOS REAIS
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors font-outfit">
              Sinais do Dia a Dia
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Vídeos com sinalizadores reais em Libras (UFV/CEAD) para cumprimentos, família, escola e emoções.
            </p>
          </div>
          <div className="pt-5">
            <button
              onClick={() => navegar('daily-signs')}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300 text-xs font-bold transition-colors cursor-pointer font-outfit"
            >
              <span>Assistir aos sinais</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 4: Jogo da Memória */}
        <div className="bg-white dark:bg-[#111C35] rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-purple-300 dark:hover:border-purple-500 transition-all flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-purple-100/90 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center font-black text-lg group-hover:scale-105 transition-transform">
                <Gamepad2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase tracking-wider font-outfit">
                DIVERSÃO
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors font-outfit">
              Jogo da Memória
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Vire as cartas e encontre a mão que faz par com a letra certa em 3D.
            </p>
          </div>
          <div className="pt-5">
            <button
              onClick={() => navegar('memory-game')}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/50 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 text-xs font-bold transition-colors cursor-pointer font-outfit"
            >
              <span>Quero jogar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
