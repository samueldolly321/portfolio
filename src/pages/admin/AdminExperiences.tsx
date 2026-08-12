import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Experience } from '../../types';
import { useToast } from '../../context/ToastContext';
import { Plus, Trash2, Edit2, Eye, EyeOff, Briefcase, Calendar, MapPin, ArrowUp, ArrowDown } from 'lucide-react';

export const AdminExperiences: React.FC = () => {
  const { showToast } = useToast();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form / Modal state
  const [editingExp, setEditingExp] = useState<Partial<Experience> | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [responsibilitiesText, setResponsibilitiesText] = useState('');
  const [techText, setTechText] = useState('');

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const data = await api.getExperiences();
      setExperiences(data || []);
    } catch (err) {
      showToast('Erreur lors du chargement des expériences.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (exp?: Experience) => {
    if (exp) {
      setEditingExp(exp);
      setResponsibilitiesText((exp.responsibilities || []).join('\n'));
      setTechText((exp.technologies || []).join(', '));
    } else {
      setEditingExp({
        company: '',
        position: '',
        startDate: '2020',
        endDate: '',
        current: false,
        description: '',
        location: '',
        isVisible: true,
        sortOrder: experiences.length + 1,
      });
      setResponsibilitiesText('');
      setTechText('');
    }
    setShowModal(true);
  };

  const handleSaveExp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp?.company || !editingExp?.position || !editingExp?.startDate) {
      showToast('Entreprise, poste et date de début sont requis.', 'error');
      return;
    }

    const respArray = responsibilitiesText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const techArray = techText
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      ...editingExp,
      responsibilities: respArray,
      technologies: techArray,
    };

    try {
      if (editingExp.id) {
        await api.updateExperience(editingExp.id, payload);
        showToast('Expérience mise à jour.', 'success');
      } else {
        await api.createExperience(payload);
        showToast('Expérience créée.', 'success');
      }
      setShowModal(false);
      setEditingExp(null);
      fetchExperiences();
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de la sauvegarde.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Voulez-vous supprimer cette expérience ?')) return;
    try {
      await api.deleteExperience(id);
      showToast('Expérience supprimée.', 'success');
      fetchExperiences();
    } catch (err) {
      showToast('Erreur lors de la suppression.', 'error');
    }
  };

  const handleToggleVisibility = async (exp: Experience) => {
    try {
      await api.updateExperience(exp.id, { isVisible: !exp.isVisible });
      fetchExperiences();
    } catch (err) {
      showToast('Erreur de visibilité.', 'error');
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= experiences.length) return;

    const updated = [...experiences];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    const items = updated.map((e, idx) => ({ id: e.id, sortOrder: idx + 1 }));
    setExperiences(updated);

    try {
      await api.reorderExperiences(items);
    } catch (err) {
      showToast('Erreur lors de la réorganisation.', 'error');
      fetchExperiences();
    }
  };

  if (isLoading) {
    return <div className="py-20 text-center font-mono text-xs text-theme-muted">Chargement...</div>;
  }

  return (
    <div className="space-y-8 text-left max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-theme-main">Parcours Professionnel</h1>
          <p className="text-xs text-theme-muted font-mono">
            Gérez vos postes occupés, missions et technologies associées.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#36E0C2] to-[#29B6E6] text-slate-950 font-bold font-heading text-xs shadow-md"
        >
          <Plus className="w-4 h-4" /> Nouvelle Expérience
        </button>
      </div>

      {/* Experience Items List */}
      <div className="space-y-4">
        {experiences.map((exp, idx) => (
          <div
            key={exp.id}
            className={`p-6 rounded-2xl border transition-all ${
              exp.isVisible ? 'bg-theme-card border-theme shadow-md' : 'bg-theme-surface/30 border-theme/40 opacity-60'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
              <div>
                <span className="text-xs font-mono font-bold text-theme-primary block">
                  {exp.startDate} — {exp.current ? "Aujourd'hui" : exp.endDate}
                </span>
                <h3 className="text-lg font-bold font-heading text-theme-main">{exp.position}</h3>
                <span className="text-sm font-semibold text-theme-secondary flex items-center gap-1 mt-0.5">
                  <Briefcase className="w-3.5 h-3.5" /> {exp.company}
                </span>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleMoveOrder(idx, 'up')}
                  disabled={idx === 0}
                  className="p-1.5 rounded-lg border border-theme text-theme-muted hover:text-theme-main disabled:opacity-20"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleMoveOrder(idx, 'down')}
                  disabled={idx === experiences.length - 1}
                  className="p-1.5 rounded-lg border border-theme text-theme-muted hover:text-theme-main disabled:opacity-20"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleToggleVisibility(exp)}
                  className="p-1.5 rounded-lg border border-theme text-theme-muted hover:text-theme-main"
                >
                  {exp.isVisible ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-rose-400" />}
                </button>
                <button
                  onClick={() => handleOpenModal(exp)}
                  className="p-1.5 rounded-lg border border-theme text-theme-muted hover:text-theme-primary"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(exp.id)}
                  className="p-1.5 rounded-lg border border-theme text-theme-muted hover:text-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-sm text-theme-muted mb-3 leading-relaxed">{exp.description}</p>

            {exp.technologies && exp.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-3 border-t border-theme/40">
                {exp.technologies.map((t, i) => (
                  <span key={i} className="px-2.5 py-0.5 rounded bg-theme-surface text-[10px] font-mono text-theme-main border border-theme/60">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {showModal && editingExp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <form
            onSubmit={handleSaveExp}
            className="bg-theme-card border border-theme max-w-lg w-full p-6 sm:p-8 rounded-2xl space-y-4 shadow-2xl text-left my-8"
          >
            <h3 className="text-xl font-bold font-heading text-theme-main">
              {editingExp.id ? "Modifier l'Expérience" : 'Nouvelle Expérience'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-semibold text-theme-main mb-1.5">
                  POSTE / INTITULÉ *
                </label>
                <input
                  type="text"
                  required
                  value={editingExp.position || ''}
                  onChange={(e) => setEditingExp({ ...editingExp, position: e.target.value })}
                  placeholder="Développeur Web Full-Stack"
                  className="w-full px-4 py-2.5 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-theme-main mb-1.5">
                  ENTREPRISE / CLIENT *
                </label>
                <input
                  type="text"
                  required
                  value={editingExp.company || ''}
                  onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                  placeholder="Salathys"
                  className="w-full px-4 py-2.5 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-semibold text-theme-main mb-1.5">
                  ANNEÉ DE DÉBUT *
                </label>
                <input
                  type="text"
                  required
                  value={editingExp.startDate || ''}
                  onChange={(e) => setEditingExp({ ...editingExp, startDate: e.target.value })}
                  placeholder="2016"
                  className="w-full px-4 py-2.5 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-theme-main mb-1.5">
                  ANNÉE DE FIN (Laissez vide si actuel)
                </label>
                <input
                  type="text"
                  value={editingExp.endDate || ''}
                  disabled={editingExp.current}
                  onChange={(e) => setEditingExp({ ...editingExp, endDate: e.target.value })}
                  placeholder="Aujourd'hui / 2022"
                  className="w-full px-4 py-2.5 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm disabled:opacity-40"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="currentExp"
                checked={editingExp.current || false}
                onChange={(e) => setEditingExp({ ...editingExp, current: e.target.checked })}
                className="rounded text-theme-primary focus:ring-0"
              />
              <label htmlFor="currentExp" className="text-xs font-mono font-semibold text-theme-main cursor-pointer">
                Poste actuellement occupé
              </label>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-theme-main mb-1.5">
                DESCRIPTION PRINCIPALE
              </label>
              <textarea
                rows={3}
                value={editingExp.description || ''}
                onChange={(e) => setEditingExp({ ...editingExp, description: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-theme-main mb-1.5">
                RESPONSABILITÉS & RÉALISATIONS (Une par ligne)
              </label>
              <textarea
                rows={3}
                value={responsibilitiesText}
                onChange={(e) => setResponsibilitiesText(e.target.value)}
                placeholder="Développement full-stack de solutions web sur mesure&#10;Collaboration directe avec les équipes en France..."
                className="w-full px-4 py-2.5 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-theme-main mb-1.5">
                TECHNOLOGIES UTILISÉES (Séparées par des virgules)
              </label>
              <input
                type="text"
                value={techText}
                onChange={(e) => setTechText(e.target.value)}
                placeholder="React, TypeScript, Node.js, PostgreSQL"
                className="w-full px-4 py-2.5 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-theme">
              <button
                type="button"
                onClick={() => setShowModal(false)}
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
