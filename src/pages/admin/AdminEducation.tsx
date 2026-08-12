import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Education } from '../../types';
import { useToast } from '../../context/ToastContext';
import { Plus, Trash2, Edit2, Eye, EyeOff, GraduationCap, Calendar, ArrowUp, ArrowDown } from 'lucide-react';

export const AdminEducation: React.FC = () => {
  const { showToast } = useToast();
  const [education, setEducation] = useState<Education[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal / Form state
  const [editingEdu, setEditingEdu] = useState<Partial<Education> | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const data = await api.getEducation();
      setEducation(data || []);
    } catch (err) {
      showToast('Erreur lors du chargement des formations.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEdu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEdu?.year || !editingEdu?.title || !editingEdu?.institution) {
      showToast('Année, diplôme et établissement sont requis.', 'error');
      return;
    }

    try {
      if (editingEdu.id) {
        await api.updateEducation(editingEdu.id, editingEdu);
        showToast('Formation mise à jour.', 'success');
      } else {
        await api.createEducation(editingEdu);
        showToast('Formation ajoutée.', 'success');
      }
      setShowModal(false);
      setEditingEdu(null);
      fetchEducation();
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de la sauvegarde.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Voulez-vous supprimer cette formation ?')) return;
    try {
      await api.deleteEducation(id);
      showToast('Formation supprimée.', 'success');
      fetchEducation();
    } catch (err) {
      showToast('Erreur lors de la suppression.', 'error');
    }
  };

  const handleToggleVisibility = async (edu: Education) => {
    try {
      await api.updateEducation(edu.id, { isVisible: !edu.isVisible });
      fetchEducation();
    } catch (err) {
      showToast('Erreur lors du changement de visibilité.', 'error');
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= education.length) return;

    const updated = [...education];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    const items = updated.map((e, idx) => ({ id: e.id, sortOrder: idx + 1 }));
    setEducation(updated);

    try {
      await api.reorderEducation(items);
    } catch (err) {
      showToast('Erreur lors de la réorganisation.', 'error');
      fetchEducation();
    }
  };

  if (isLoading) {
    return <div className="py-20 text-center font-mono text-xs text-theme-muted">Chargement...</div>;
  }

  return (
    <div className="space-y-8 text-left max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-theme-main">Gestion des Formations</h1>
          <p className="text-xs text-theme-muted font-mono">
            Gérez vos diplômes universitaires, certificats et formations suivies.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingEdu({
              year: '2020',
              title: '',
              institution: '',
              description: '',
              isVisible: true,
              sortOrder: education.length + 1,
            });
            setShowModal(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#36E0C2] to-[#29B6E6] text-slate-950 font-bold font-heading text-xs shadow-md"
        >
          <Plus className="w-4 h-4" /> Nouvelle Formation
        </button>
      </div>

      {/* Education List */}
      <div className="space-y-4">
        {education.map((edu, idx) => (
          <div
            key={edu.id}
            className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
              edu.isVisible ? 'bg-theme-card border-theme shadow-md' : 'bg-theme-surface/30 border-theme/40 opacity-60'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-theme-surface border border-theme text-theme-primary shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-theme-primary">{edu.year}</span>
                <h3 className="text-base font-bold font-heading text-theme-main">{edu.title}</h3>
                <span className="text-xs font-semibold text-theme-secondary block mt-0.5">{edu.institution}</span>
                {edu.description && <p className="text-xs text-theme-muted mt-1">{edu.description}</p>}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => handleMoveOrder(idx, 'up')}
                disabled={idx === 0}
                className="p-1.5 rounded-lg border border-theme text-theme-muted hover:text-theme-main disabled:opacity-20"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleMoveOrder(idx, 'down')}
                disabled={idx === education.length - 1}
                className="p-1.5 rounded-lg border border-theme text-theme-muted hover:text-theme-main disabled:opacity-20"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleToggleVisibility(edu)}
                className="p-1.5 rounded-lg border border-theme text-theme-muted hover:text-theme-main"
              >
                {edu.isVisible ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-rose-400" />}
              </button>
              <button
                onClick={() => {
                  setEditingEdu(edu);
                  setShowModal(true);
                }}
                className="p-1.5 rounded-lg border border-theme text-theme-muted hover:text-theme-primary"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(edu.id)}
                className="p-1.5 rounded-lg border border-theme text-theme-muted hover:text-rose-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {showModal && editingEdu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <form
            onSubmit={handleSaveEdu}
            className="bg-theme-card border border-theme max-w-md w-full p-6 rounded-2xl space-y-4 shadow-2xl text-left"
          >
            <h3 className="text-lg font-bold font-heading text-theme-main">
              {editingEdu.id ? 'Modifier la Formation' : 'Nouvelle Formation'}
            </h3>

            <div>
              <label className="block text-xs font-mono font-semibold text-theme-main mb-1.5">
                ANNÉE / PÉRIODE *
              </label>
              <input
                type="text"
                required
                value={editingEdu.year || ''}
                onChange={(e) => setEditingEdu({ ...editingEdu, year: e.target.value })}
                placeholder="2012 — 2015"
                className="w-full px-4 py-2.5 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-theme-main mb-1.5">
                DIPLÔME / TITRE *
              </label>
              <input
                type="text"
                required
                value={editingEdu.title || ''}
                onChange={(e) => setEditingEdu({ ...editingEdu, title: e.target.value })}
                placeholder="Licence en Informatique"
                className="w-full px-4 py-2.5 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-theme-main mb-1.5">
                ÉTABLISSEMENT / ÉCOLE *
              </label>
              <input
                type="text"
                required
                value={editingEdu.institution || ''}
                onChange={(e) => setEditingEdu({ ...editingEdu, institution: e.target.value })}
                placeholder="IT University"
                className="w-full px-4 py-2.5 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-theme-main mb-1.5">
                DESCRIPTION / SPÉCIALITÉ
              </label>
              <textarea
                rows={3}
                value={editingEdu.description || ''}
                onChange={(e) => setEditingEdu({ ...editingEdu, description: e.target.value })}
                placeholder="Développement web, programmation et génie logiciel..."
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
