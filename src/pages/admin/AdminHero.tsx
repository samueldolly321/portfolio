import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { HeroData } from '../../types';
import { useToast } from '../../context/ToastContext';
import { Save, Sparkles, Eye, Plus, X } from 'lucide-react';

export const AdminHero: React.FC = () => {
  const { showToast } = useToast();
  const [hero, setHero] = useState<Partial<HeroData>>({
    badge: 'DÉVELOPPEUR WEB FULL-STACK',
    title: 'JE TRANSFORME LES IDÉES EN SOLUTIONS WEB.',
    subtitle: "Développeur web avec plus de 6 ans d'expérience",
    description: "Développeur web avec plus de 6 ans d'expérience, je pars d'une idée, d'un besoin ou d'un problème pour le transformer en une solution web fonctionnelle.",
    primaryCtaText: 'VOIR MES PROJETS',
    primaryCtaUrl: '#projects',
    secondaryCtaText: 'ME CONTACTER',
    secondaryCtaUrl: '#contact',
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
  });

  const [techInput, setTechInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const data = await api.getHero();
        if (data && data.title) {
          setHero(data);
        }
      } catch (err) {
        showToast('Erreur lors du chargement du Hero.', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchHero();
  }, []);

  const handleAddTech = () => {
    if (!techInput.trim()) return;
    const current = hero.technologies || [];
    if (!current.includes(techInput.trim())) {
      setHero({ ...hero, technologies: [...current, techInput.trim()] });
    }
    setTechInput('');
  };

  const handleRemoveTech = (index: number) => {
    const current = hero.technologies || [];
    setHero({ ...hero, technologies: current.filter((_, idx) => idx !== index) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const updated = await api.updateHero(hero);
      setHero(updated);
      showToast('Section Hero mise à jour avec succès !', 'success');
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de la sauvegarde.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="py-20 text-center font-mono text-xs text-theme-muted">Chargement...</div>;
  }

  return (
    <div className="space-y-8 text-left max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-heading text-theme-main">Section Hero</h1>
        <p className="text-xs text-theme-muted font-mono">
          Personnalisez le titre, l'accroche et les boutons d'action du haut de page.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor Form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="bg-theme-card border border-theme p-6 sm:p-8 rounded-2xl shadow-md space-y-6">
            <div>
              <label className="block text-xs font-mono font-semibold text-theme-main mb-2">
                BADGE D'EN-TÊTE
              </label>
              <input
                type="text"
                required
                value={hero.badge || ''}
                onChange={(e) => setHero({ ...hero, badge: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm mint-border-glow"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-theme-main mb-2">
                TITRE PRINCIPAL *
              </label>
              <input
                type="text"
                required
                value={hero.title || ''}
                onChange={(e) => setHero({ ...hero, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm mint-border-glow"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-theme-main mb-2">
                SOUS-TITRE (ACCROCHE)
              </label>
              <input
                type="text"
                value={hero.subtitle || ''}
                onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm mint-border-glow"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-theme-main mb-2">
                DESCRIPTION COMPLÈTE
              </label>
              <textarea
                rows={4}
                value={hero.description || ''}
                onChange={(e) => setHero({ ...hero, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm mint-border-glow"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-semibold text-theme-main mb-2">
                  TEXTE BOUTON 1 (PRINCIPAL)
                </label>
                <input
                  type="text"
                  value={hero.primaryCtaText || ''}
                  onChange={(e) => setHero({ ...hero, primaryCtaText: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-theme-main mb-2">
                  URL BOUTON 1
                </label>
                <input
                  type="text"
                  value={hero.primaryCtaUrl || ''}
                  onChange={(e) => setHero({ ...hero, primaryCtaUrl: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-semibold text-theme-main mb-2">
                  TEXTE BOUTON 2 (SECONDAIRE)
                </label>
                <input
                  type="text"
                  value={hero.secondaryCtaText || ''}
                  onChange={(e) => setHero({ ...hero, secondaryCtaText: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-theme-main mb-2">
                  URL BOUTON 2
                </label>
                <input
                  type="text"
                  value={hero.secondaryCtaUrl || ''}
                  onChange={(e) => setHero({ ...hero, secondaryCtaUrl: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm"
                />
              </div>
            </div>

            {/* Tech chips manager */}
            <div>
              <label className="block text-xs font-mono font-semibold text-theme-main mb-2">
                TECHNOLOGIES EN VEDETTE
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                  placeholder="Ex: React, Node.js..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddTech}
                  className="px-4 py-2.5 rounded-xl bg-theme-surface border border-theme hover:border-theme-primary text-theme-primary text-xs font-bold"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {(hero.technologies || []).map((tech, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-theme-surface border border-theme text-xs font-mono text-theme-main"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => handleRemoveTech(idx)}
                      className="text-theme-muted hover:text-rose-400 ml-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-theme flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#36E0C2] to-[#29B6E6] text-slate-950 font-heading font-bold text-xs shadow-md hover:opacity-90 disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>SAUVEGARDER SECTION HERO</span>
              </button>
            </div>
          </form>
        </div>

        {/* Realtime Live Preview Box */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-theme-primary font-bold">
            <Eye className="w-4 h-4" /> APERÇU EN TEMPS RÉEL
          </div>

          <div className="bg-theme-surface border border-theme p-6 rounded-2xl space-y-4 text-left shadow-lg">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-theme-card text-theme-primary text-[10px] font-mono">
              <Sparkles className="w-3 h-3" /> {hero.badge}
            </span>

            <h3 className="text-xl font-bold font-heading text-theme-main leading-tight">
              {hero.title}
            </h3>

            <p className="text-xs text-theme-muted leading-relaxed">
              {hero.description}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {(hero.technologies || []).map((t, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded bg-theme-card text-[10px] font-mono text-theme-main border border-theme/60">
                  {t}
                </span>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <span className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#36E0C2] to-[#29B6E6] text-slate-950 text-[10px] font-bold">
                {hero.primaryCtaText}
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-theme-card border border-theme text-[10px] font-bold text-theme-main">
                {hero.secondaryCtaText}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
