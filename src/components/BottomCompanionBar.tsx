/**
 * O que este arquivo faz: exibe a barra fixa inferior com o mascote Lumi oferecendo dicas rápidas
 * e um botão de atalho para iniciar ou continuar a trilha de aprendizado.
 * Quem usa: App.tsx.
 */
import React, { useEffect, useId, useRef, useState } from 'react';
import { LumiMascot } from './LumiMascot';
import { ArrowRight, Lightbulb, X } from 'lucide-react';
import { playSound } from '../utils/sound';

interface BottomCompanionBarProps {
  hasStartedTrail: boolean;
  onOpenTip: () => void;
  onContinueTrail: () => void;
  soundEnabled: boolean;
}

export const BottomCompanionBar: React.FC<BottomCompanionBarProps> = ({
  hasStartedTrail,
  onOpenTip,
  onContinueTrail,
  soundEnabled
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const dialogId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isOpen]);

  const handleToggle = () => {
    playSound.pop(soundEnabled);
    setIsOpen((prev) => !prev);
  };

  const handleClose = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleTipClick = () => {
    playSound.pop(soundEnabled);
    setIsOpen(false);
    onOpenTip();
  };

  const handleContinueClick = () => {
    playSound.pop(soundEnabled);
    setIsOpen(false);
    onContinueTrail();
  };

  return (
    <div
      ref={containerRef}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 flex flex-col items-end"
    >
      {/* Floating Companion Card */}
      {isOpen && (
        <div
          id={dialogId}
          role="dialog"
          aria-labelledby={titleId}
          className="mb-3 w-[calc(100vw-2rem)] max-w-[18rem] rounded-2xl bg-white/95 dark:bg-[#111C35]/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-900/15 dark:shadow-black/60 p-4 text-left transition-colors"
        >
          <div className="flex items-start justify-between gap-2">
            <h2
              id={titleId}
              className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight font-outfit"
            >
              Lumi está com você
            </h2>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Fechar painel do Lumi"
              className="p-1 -mt-1 -mr-1 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-sky-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            Uma descoberta de cada vez, no seu ritmo.
          </p>

          <div className="mt-3.5 flex flex-col gap-2">
            <button
              type="button"
              onClick={handleTipClick}
              className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100/80 dark:hover:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-100 dark:border-indigo-800/60 transition-all cursor-pointer shadow-2xs active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#111C35]"
            >
              <Lightbulb className="w-4 h-4 text-amber-500 fill-amber-300 shrink-0" />
              <span>Dica do Lumi</span>
            </button>

            <button
              type="button"
              onClick={handleContinueClick}
              className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-extrabold shadow-md shadow-blue-500/25 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#111C35]"
            >
              <span>{hasStartedTrail ? 'Continuar trilha' : 'Começar a trilha'}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Round Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        aria-label={
          hasStartedTrail
            ? 'Abrir o Lumi: dicas e continuar trilha'
            : 'Abrir o Lumi: dicas e começar a trilha'
        }
        aria-expanded={isOpen}
        aria-controls={isOpen ? dialogId : undefined}
        className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-cyan-100 to-sky-200 dark:from-cyan-900/90 dark:to-blue-900/90 border-2 border-white dark:border-slate-700 shadow-lg shadow-blue-900/20 dark:shadow-black/60 hover:scale-105 active:scale-95 transition-transform cursor-pointer flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-sky-400 dark:focus-visible:ring-offset-[#0A1128]"
      >
        <span className="w-full h-full rounded-full overflow-hidden flex items-center justify-center p-1">
          <LumiMascot size="compact" showSparkles={false} />
        </span>
        <span
          aria-hidden="true"
          className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900"
        />
      </button>
    </div>
  );
};
