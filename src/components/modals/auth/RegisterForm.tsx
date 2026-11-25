import React from 'react';
import { Sparkles } from 'lucide-react';

interface RegisterFormProps {
  name: string;
  email: string;
  password: string;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  name,
  email,
  password,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onSwitchToLogin
}) => {
  return (
    <div>
      <div className="text-center mb-5">
        <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight font-outfit">
          Crie sua conta grátis 🚀
        </h2>
        <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">
          Comece do zero e aprenda Libras no seu ritmo
        </p>
      </div>

      <form className="space-y-3.5" onSubmit={onSubmit}>
        <div>
          <label className="block text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Seu Nome
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Como quer ser chamado?"
            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-700 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-[#2952E3] focus:ring-0 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            E-mail
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="seu@email.com"
            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-700 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-[#2952E3] focus:ring-0 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Criar Senha
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="Mínimo 4 caracteres"
            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-700 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-[#2952E3] focus:ring-0 transition-colors"
          />
        </div>

        <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] font-semibold text-amber-800 dark:text-amber-200 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>Sua conta começará na primeira fase da trilha, pronta para avançar!</span>
        </div>

        <button
          type="submit"
          className="btn-3d btn-primary-3d w-full py-3.5 rounded-2xl text-white font-black text-sm uppercase tracking-wider block mt-3 shadow-md hover:shadow-lg cursor-pointer"
        >
          Criar Minha Conta
        </button>
      </form>

      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
          Já tem uma conta?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-black text-[#2952E3] dark:text-sky-400 uppercase hover:underline ml-1 cursor-pointer"
          >
            Fazer login
          </button>
        </p>
      </div>
    </div>
  );
};
