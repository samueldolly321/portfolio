import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { AboutData, Statistic } from '../../types';
import { useToast } from '../../context/ToastContext';
import { Save, Plus, Trash2, Edit2, Eye, EyeOff, Info, FileText } from 'lucide-react';
import { MediaUploader } from '../../components/MediaUploader';

export const AdminAbout: React.FC = () => {
  const { showToast } = useToast();
  const [about, setAbout] = useState<Partial<AboutData>>({});
  const [statistics, setStatistics] = useState<Statistic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingAbout, setIsSavingAbout] = useState(false);

  // Modal / Form state for Statistics
  const [editingStat, setEditingStat] = useState<Partial<Statistic> | null>(null);
  const [showStatModal, setShowStatModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [aboutRes, statsRes] = await Promise.all([
        api.getAbout(),
        api.getStatistics(),
      ]);
      setAbout(aboutRes || {});
      setStatistics(statsRes || []);
    } catch (err) {
      showToast('Erreur lors du chargement des données.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSavingAbout(true);
      const updated = await api.updateAbout(about);
      setAbout(updated);
      showToast('Section À Propos sauvegardée !', 'success');
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de la sauvegarde.', 'error');
    } finally {
      setIsSavingAbout(false);
    }
  };

  const handleSaveStat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStat?.label || !editingStat?.value) {
      showToast('Intitulé et valeur sont requis.', 'error');
      return;
    }

    try {
      if (editingStat.id) {
        await api.updateStatistic(editingStat.id, editingStat);
        showToast('Statistique mise à jour.', 'success');
      } else {
        await api.createStatistic(editingStat);
        showToast('Statistique ajoutée.', 'success');
      }
      setShowStatModal(false);
      setEditingStat(null);
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de la sauvegarde.', 'error');
    }
  };

  const handleDeleteStat = async (id: string) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette statistique ?')) return;
    try {
      await api.deleteStatistic(id);
      showToast('Statistique supprimée.', 'success');
      fetchData();
    } catch (err) {
      showToast('Erreur lors de la suppression.', 'error');
    }
  };

  const handleToggleStatVisibility = async (stat: Statistic) => {
    try {
      await api.updateStatistic(stat.id, { isVisible: !stat.isVisible });
      fetchData();
    } catch (err) {
      showToast('Erreur lors du changement de visibilité.', 'error');
    }
  };

  if (isLoading) {
    return <div className="py-20 text-center font-mono text-xs text-theme-muted">Chargement...</div>;
  }

  return (
    <div className="space-y-8 text-left max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-heading text-theme-main">À Propos & Statistiques</h1>
        <p className="text-xs text-theme-muted font-mono">
          Modifiez votre texte de présentation et les chiffres clés de votre parcours.
        </p>
      </div>

      {/* About Section Form */}
      <form onSubmit={handleSaveAbout} className="bg-theme-card border border-theme p-6 sm:p-8 rounded-2xl shadow-md space-y-6">
        <h3 className="text-lg font-bold font-heading text-theme-main flex items-center gap-2 border-b border-theme pb-3">
          <Info className="w-5 h-5 text-theme-primary" /> Texte de Présentation
        </h3>

        <div>
          <label className="block text-xs font-mono font-semibold text-theme-main mb-2">
            TITRE DE SECTION
          </label>
          <input
            type="text"
            required
            value={about.title || ''}
            onChange={(e) => setAbout({ ...about, title: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-semibold text-theme-main mb-2">
            SOUS-TITRE / SLOGAN
          </label>
          <input
            type="text"
            value={about.tagline || ''}
            onChange={(e) => setAbout({ ...about, tagline: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-semibold text-theme-main mb-2">
            TEXTE PARCOURS & PHILOSOPHIE
          </label>
          <textarea
            rows={5}
            value={about.description || ''}
            onChange={(e) => setAbout({ ...about, description: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-semibold text-theme-main mb-2 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" /> CV (PDF) — bouton « Télécharger mon CV »
          </label>
          {about.cvUrl ? (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3 p-3 rounded-xl bg-theme-surface border border-theme">
              <FileText className="w-5 h-5 text-theme-primary shrink-0" />
              <a
                href={about.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-sm text-theme-main hover:text-theme-primary transition-colors truncate"
              >
                {about.cvUrl}
              </a>
              <button
                type="button"
                onClick={() => setAbout({ ...about, cvUrl: '' })}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-theme text-theme-muted hover:text-red-400 hover:border-red-400 transition-colors text-xs font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" /> Retirer
              </button>
            </div>
          ) : null}
          <MediaUploader
            accept="application/pdf,.pdf"
            label="Cliquez ou glissez votre CV (PDF) ici"
            hint="PDF uniquement (Max 5MB)"
            onUploadSuccess={(url) => setAbout({ ...about, cvUrl: url })}
          />
          <p className="text-[11px] text-theme-muted font-mono mt-2">
            Après téléversement, cliquez sur « Sauvegarder À Propos » pour enregistrer.
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSavingAbout}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#36E0C2] to-[#29B6E6] text-slate-950 font-heading font-bold text-xs shadow-md hover:opacity-90 disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>SAUVEGARDER À PROPOS</span>
          </button>
        </div>
      </form>

      {/* Statistics Cards Manager */}
      <div className="bg-theme-card border border-theme p-6 sm:p-8 rounded-2xl shadow-md space-y-6">
        <div className="flex items-center justify-between border-b border-theme pb-4">
          <div>
            <h3 className="text-lg font-bold font-heading text-theme-main">Statistiques & Chiffres Clés</h3>
            <p className="text-xs text-theme-muted font-mono">Affichés sur la page d'accueil</p>
          </div>
          <button
            onClick={() => {
              setEditingStat({ label: '', value: '', subtext: '', isVisible: true, sortOrder: statistics.length + 1 });
              setShowStatModal(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#36E0C2] to-[#29B6E6] text-slate-950 font-bold font-heading text-xs"
          >
            <Plus className="w-4 h-4" /> Ajouter Chiffre Clé
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {statistics.map((stat) => (
            <div
              key={stat.id}
              className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                stat.isVisible ? 'bg-theme-surface border-theme' : 'bg-theme-surface/40 border-theme/40 opacity-60'
              }`}
            >
              <div>
                <span className="text-2xl font-bold font-heading text-theme-primary block">
                  {stat.value}
                </span>
                <span className="text-sm font-semibold text-theme-main block mt-1">
                  {stat.label}
                </span>
                {stat.subtext && (
                  <span className="text-xs text-theme-muted font-mono block mt-0.5">{stat.subtext}</span>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-theme/40">
                <button
                  onClick={() => handleToggleStatVisibility(stat)}
                  className="p-1.5 rounded-lg border border-theme text-theme-muted hover:text-theme-main"
                  title={stat.isVisible ? 'Masquer' : 'Afficher'}
                >
                  {stat.isVisible ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-rose-400" />}
                </button>
                <button
                  onClick={() => {
                    setEditingStat(stat);
                    setShowStatModal(true);
                  }}
                  className="p-1.5 rounded-lg border border-theme text-theme-muted hover:text-theme-primary"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteStat(stat.id)}
                  className="p-1.5 rounded-lg border border-theme text-theme-muted hover:text-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Edit / Add Statistic */}
      {showStatModal && editingStat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <form
            onSubmit={handleSaveStat}
            className="bg-theme-card border border-theme max-w-md w-full p-6 rounded-2xl space-y-4 shadow-2xl text-left"
          >
            <h3 className="text-lg font-bold font-heading text-theme-main">
              {editingStat.id ? 'Modifier la Statistique' : 'Nouvelle Statistique'}
            </h3>

            <div>
              <label className="block text-xs font-mono font-semibold text-theme-main mb-1.5">
                VALEUR (Ex: 6+, 100%, 15+) *
              </label>
              <input
                type="text"
                required
                value={editingStat.value || ''}
                onChange={(e) => setEditingStat({ ...editingStat, value: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-theme-main mb-1.5">
                INTITULÉ PRINCIPAL *
              </label>
              <input
                type="text"
                required
                value={editingStat.label || ''}
                onChange={(e) => setEditingStat({ ...editingStat, label: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-theme-main mb-1.5">
                SOUS-TEXTE / PRÉCISION
              </label>
              <input
                type="text"
                value={editingStat.subtext || ''}
                onChange={(e) => setEditingStat({ ...editingStat, subtext: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-theme">
              <button
                type="button"
                onClick={() => setShowStatModal(false)}
                className="px-4 py-2 rounded-xl bg-theme-surface border border-theme text-xs font-semibold text-theme-main"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#36E0C2] to-[#29B6E6] text-slate-950 text-xs font-bold font-heading"
              >
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
