import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { autenticar, cadastrar, signInWithGoogleReal } from '../../services/firebase';
import { loginUser, registerUser, saveAccount, UserAccount } from '../../utils/auth';
import { LoginForm } from './auth/LoginForm';
import { RegisterForm } from './auth/RegisterForm';

interface AuthModalProps {
  isOpen: boolean;
  initialTab?: 'login' | 'register';
  onClose: () => void;
  onSuccess: (user: UserAccount) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialTab = 'login',
  onClose,
  onSuccess
}) => {
  const [tab, setTab] = useState<'login' | 'register'>(initialTab);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setTab(initialTab);
      setErrorMessage(null);
      setSuccessNotice(null);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const concluirAcesso = (user: UserAccount, mensagem: string, atrasoMs: number) => {
    setSuccessNotice(mensagem);
    setTimeout(() => {
      onSuccess(user);
      onClose();
    }, atrasoMs);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      const fbUser = await autenticar(loginEmail, loginPassword);
      saveAccount(fbUser);
      concluirAcesso(fbUser, `Bem-vindo de volta, ${fbUser.name}!`, 400);
      return;
    } catch {
      // Fallback para login em contas locais salvas no navegador
      const res = loginUser(loginEmail, loginPassword);
      if (!res.success || !res.user) {
        setErrorMessage(res.error || 'Conta não encontrada ou senha incorreta.');
        return;
      }
      concluirAcesso(res.user, `Bem-vindo de volta, ${res.user.name}!`, 400);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      const fbUser = await cadastrar(registerName, registerEmail, registerPassword);
      saveAccount(fbUser);
      concluirAcesso(fbUser, `Conta criada no Firebase! Bem-vindo, ${fbUser.name}!`, 450);
      return;
    } catch (fbErr: unknown) {
      const msg = fbErr instanceof Error ? fbErr.message : String(fbErr);
      if (msg.includes('email-already-in-use')) {
        setErrorMessage('Este e-mail já está cadastrado no Firebase. Faça login!');
        return;
      }

      // Fallback para cadastro local
      const res = registerUser(registerName, registerEmail, registerPassword, 'geral');
      if (!res.success || !res.user) {
        setErrorMessage(res.error || 'Erro ao cadastrar.');
        return;
      }
      concluirAcesso(res.user, `Conta criada! Bem-vindo, ${res.user.name}!`, 450);
    }
  };

  const handleGoogleAuth = async () => {
    setErrorMessage(null);
    setIsLoadingGoogle(true);
    try {
      const googleUser = await signInWithGoogleReal();
      saveAccount(googleUser);
      concluirAcesso(googleUser, `Conectado com Google: ${googleUser.name}!`, 400);
    } catch (err: unknown) {
      console.error('Falha no login Google:', err);
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('popup-closed-by-user') || msg.includes('cancelled')) {
        setErrorMessage('A janela de login do Google foi fechada.');
      } else {
        setErrorMessage('Erro ao conectar com o Google. Tente novamente.');
      }
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  const trocarAba = (novaAba: 'login' | 'register') => {
    setTab(novaAba);
    setErrorMessage(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-[#111C35] rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 relative max-h-[92vh] overflow-y-auto text-left transform transition-all duration-200 animate-in fade-in zoom-in-95">
        <button
          aria-label="Fechar janela"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-xl overflow-hidden shrink-0 shadow-2xs">
            <img
              src="./assets/logo_stitch.png"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuBW9N146_koeeKHAoTrsuhr2gb5lxr_2jLTF2q96K-l87-NHXh_QkFuHjLP7gDu2n8-cARGADgseE6myD9_Mz2TLiaZS1y7PwEA40289iy9k9CstyIHqZUBF5V2-aywlWkT3_IMC7Ppi_UzoXqgM4zyzdNSkj1VPruFClDXV-wZVVmNov4TfpxBVyeodhVkD-e_KJ_o6b0NWUQurU0I6FkpMJDammbpYGMpTwUzOreLYZtdZ6kS7blSM4PC957vbkod-zY';
              }}
              alt="Logo Lumi Libras"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-2xl font-black tracking-tight text-[#2952E3] font-outfit">
            lumi<span className="text-[#FFC800]">libras</span>
          </span>
        </div>

        <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => trocarAba('login')}
            className={`py-2.5 rounded-xl font-black text-xs sm:text-sm tracking-wide uppercase transition-all cursor-pointer ${
              tab === 'login'
                ? 'bg-white dark:bg-[#1A2644] text-[#2952E3] dark:text-sky-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => trocarAba('register')}
            className={`py-2.5 rounded-xl font-black text-xs sm:text-sm tracking-wide uppercase transition-all cursor-pointer ${
              tab === 'register'
                ? 'bg-white dark:bg-[#1A2644] text-[#2952E3] dark:text-sky-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Cadastrar-se
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successNotice && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        {tab === 'login' ? (
          <LoginForm
            email={loginEmail}
            password={loginPassword}
            isLoadingGoogle={isLoadingGoogle}
            onEmailChange={setLoginEmail}
            onPasswordChange={setLoginPassword}
            onFillDemo={() => {
              if (!loginEmail) {
                setLoginEmail('aluno@lumilibras.com');
                setLoginPassword('123456');
              }
            }}
            onSubmit={handleLoginSubmit}
            onGoogleAuth={handleGoogleAuth}
            onSwitchToRegister={() => trocarAba('register')}
          />
        ) : (
          <RegisterForm
            name={registerName}
            email={registerEmail}
            password={registerPassword}
            onNameChange={setRegisterName}
            onEmailChange={setRegisterEmail}
            onPasswordChange={setRegisterPassword}
            onSubmit={handleRegisterSubmit}
            onSwitchToLogin={() => trocarAba('login')}
          />
        )}
      </div>
    </div>
  );
};
