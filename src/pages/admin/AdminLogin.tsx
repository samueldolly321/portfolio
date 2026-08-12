import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Shield, Lock, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Veuillez saisir votre email et mot de passe.', 'error');
      return;
    }

    try {
      setIsLoading(true);
      await login(email, password);
      showToast('Connexion réussie ! Bienvenue dans l\'Espace Admin.', 'success');
      navigate('/admin');
    } catch (err: any) {
      showToast(err.message || 'Identifiants incorrects.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-theme-main flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background glow effects */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#36E0C2]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-[#29B6E6]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-theme-card border border-theme/80 p-8 rounded-2xl shadow-2xl relative z-10 text-left space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#36E0C2] to-[#29B6E6] flex items-center justify-center text-slate-950 mx-auto shadow-lg">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold font-heading text-theme-main">
            Administration CMS
          </h1>
          <p className="text-xs text-theme-muted font-mono">
            Espace de gestion dynamique du Portfolio
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-semibold text-theme-main mb-1.5">
              ADRESSE EMAIL
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-theme-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-theme-surface border border-theme text-theme-main placeholder:text-theme-muted/50 text-sm mint-border-glow transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-theme-main mb-1.5">
              MOT DE PASSE
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-theme-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-11 py-3 rounded-xl bg-theme-surface border border-theme text-theme-main placeholder:text-theme-muted/50 text-sm mint-border-glow transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-muted hover:text-theme-primary transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#36E0C2] to-[#29B6E6] text-slate-950 font-heading font-bold text-sm shadow-md hover:shadow-lg hover:opacity-95 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <span>CONNEXION...</span>
            ) : (
              <>
                <span>SE CONNECTER</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center">
          <a href="/" className="text-xs font-mono text-theme-muted hover:text-theme-primary transition-colors">
            ← Retourner sur le site public
          </a>
        </div>
      </div>
    </div>
  );
};
