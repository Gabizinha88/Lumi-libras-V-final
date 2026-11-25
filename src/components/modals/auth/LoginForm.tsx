/**
 * O que este arquivo faz: exibe o formulário de login (e-mail, senha, botão de entrada, login Google e link para cadastro).
 * Quem usa: AuthModal.tsx.
 */
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoginFormProps {
  email: string;
  password: string;
  isLoadingGoogle: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onGoogleAuth: () => void;
  onSwitchToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  email,
  password,
  isLoadingGoogle,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onGoogleAuth,
  onSwitchToRegister
}) => {
  return (
    <div>
      <div className="text-center mb-5">
        <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight font-outfit">
          Bem-vindo de volta! 👋
        </h2>
        <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">
          Continue sua jornada de aprendizado
        </p>
      </div>

      <form className="space-y-3.5" onSubmit={onSubmit}>
        <div>
          <label className="block text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            E-mail ou Usuário
          </label>
          <input
            type="text"
            required
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="seu@email.com"
            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-700 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-[#2952E3] focus:ring-0 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Senha
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="Sua senha"
            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-700 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-[#2952E3] focus:ring-0 transition-colors"
          />
        </div>

        <button
          type="submit"
          className="btn-3d btn-primary-3d w-full py-3.5 rounded-2xl text-white font-black text-sm uppercase tracking-wider block mt-3 shadow-md hover:shadow-lg cursor-pointer"
        >
          Entrar na Conta
        </button>
      </form>

      <div className="relative my-5 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
        </div>
        <span className="relative bg-white dark:bg-[#111C35] px-3 text-xs font-black text-slate-400 uppercase tracking-widest">
          ou
        </span>
      </div>

      <div>
        <button
          type="button"
          disabled={isLoadingGoogle}
          onClick={onGoogleAuth}
          className="btn-social-3d w-full py-2.5 px-4 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center gap-3 transition-colors cursor-pointer disabled:opacity-60"
        >
          {isLoadingGoogle ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#2952E3]" />
          ) : (
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
          )}
          <span className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-wide">
            {isLoadingGoogle ? 'Conectando ao Google...' : 'Continuar com Google'}
          </span>
        </button>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
          Não tem conta?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-black text-[#2952E3] dark:text-sky-400 uppercase hover:underline ml-1 cursor-pointer"
          >
            Cadastre-se grátis
          </button>
        </p>
      </div>
    </div>
  );
};
