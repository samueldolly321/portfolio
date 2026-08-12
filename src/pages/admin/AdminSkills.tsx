import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Skill } from '../../types';
import { useToast } from '../../context/ToastContext';
import { Plus, Trash2, Edit2, Eye, EyeOff, Code2, ArrowUp, ArrowDown } from 'lucide-react';

export const AdminSkills: React.FC = () => {
  const { showToast } = useToast();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal / Form state
  const [editingSkill, setEditingSkill] = useState<Partial<Skill> | null>(null);
  const [showModal, setShowModal] = useState(false);

  const categories = [
    'FRONT-END',
    'BACK-END',
    'DATABASE & ORM',
    'CMS & WEB',
    'API & SECURITY',
    'DESKTOP',
    'TOOLS',
    'AI & AUTOMATION',
  ];

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const data = await api.getSkills();
      setSkills(data || []);
    } catch (err) {
      showToast('Erreur lors du chargement des compétences.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill?.name || !editingSkill?.category) {
      showToast('Le nom et la catégorie sont obligatoires.', 'error');
      return;
    }

    try {
      if (editingSkill.id) {
        await api.updateSkill(editingSkill.id, editingSkill);
        showToast('Compétence mise à jour.', 'success');
      } else {
        await api.createSkill(editingSkill);
        showToast('Compétence créée avec succès.', 'success');
      }
      setShowModal(false);
      setEditingSkill(null);
      fetchSkills();
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de la sauvegarde.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette compétence ?')) return;
    try {
      await api.deleteSkill(id);
      showToast('Compétence supprimée.', 'success');
      fetchSkills();
    } catch (err) {
      showToast('Erreur lors de la suppression.', 'error');
    }
  };

  const handleToggleVisibility = async (skill: Skill) => {
    try {
      await api.updateSkill(skill.id, { isVisible: !skill.isVisible });
      fetchSkills();
    } catch (err) {
      showToast('Erreur lors du changement de visibilité.', 'error');
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= skills.length) return;

    const updated = [...skills];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    // Recalculate sortOrders
    const items = updated.map((s, idx) => ({ id: s.id, sortOrder: idx + 1 }));
    setSkills(updated);

    try {
      await api.reorderSkills(items);
    } catch (err) {
      showToast('Erreur lors de la réorganisation.', 'error');
      fetchSkills();
    }
  };

  if (isLoading) {
    return <div className="py-20 text-center font-mono text-xs text-theme-muted">Chargement...</div>;
  }

  return (
    <div className="space-y-8 text-left max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-theme-main">Gestion des Compétences</h1>
          <p className="text-xs text-theme-muted font-mono">
            Ajoutez, modifiez ou réorganisez votre liste de compétences et frameworks.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingSkill({
              name: '',
              category: 'FRONT-END',
              level: 85,
              isVisible: true,
              sortOrder: skills.length + 1,
            });
            setShowModal(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#36E0C2] to-[#29B6E6] text-slate-950 font-bold font-heading text-xs shadow-md"
        >
          <Plus className="w-4 h-4" /> Nouvelle Compétence
        </button>
      </div>

      {/* Skills Table List */}
      <div className="bg-theme-card border border-theme rounded-2xl overflow-hidden shadow-md">
        <div className="divide-y divide-theme/60">
          {skills.map((skill, idx) => (
            <div
              key={skill.id}
              className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                skill.isVisible ? 'bg-theme-card hover:bg-theme-surface/50' : 'bg-theme-surface/30 opacity-60'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-theme-surface border border-theme text-theme-primary">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold font-heading text-base text-theme-main">{skill.name}</h4>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-theme-surface border border-theme/60 text-theme-secondary font-bold">
                      {skill.category}
                    </span>
                    <span className="text-xs font-mono text-theme-muted">
                      Niveau : {skill.level}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions & Reordering */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => handleMoveOrder(idx, 'up')}
                  disabled={idx === 0}
                  className="p-1.5 rounded-lg border border-theme text-theme-muted hover:text-theme-main disabled:opacity-20"
                  title="Monter"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleMoveOrder(idx, 'down')}
                  disabled={idx === skills.length - 1}
                  className="p-1.5 rounded-lg border border-theme text-theme-muted hover:text-theme-main disabled:opacity-20"
                  title="Descendre"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleToggleVisibility(skill)}
                  className="p-1.5 rounded-lg border border-theme text-theme-muted hover:text-theme-main"
                  title={skill.isVisible ? 'Masquer' : 'Afficher'}
                >
                  {skill.isVisible ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-rose-400" />}
                </button>

                <button
                  onClick={() => {
                    setEditingSkill(skill);
                    setShowModal(true);
                  }}
                  className="p-1.5 rounded-lg border border-theme text-theme-muted hover:text-theme-primary"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDelete(skill.id)}
                  className="p-1.5 rounded-lg border border-theme text-theme-muted hover:text-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit / Create Skill Modal */}
      {showModal && editingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <form
            onSubmit={handleSaveSkill}
            className="bg-theme-card border border-theme max-w-md w-full p-6 rounded-2xl space-y-4 shadow-2xl text-left"
          >
            <h3 className="text-lg font-bold font-heading text-theme-main">
              {editingSkill.id ? 'Modifier la Compétence' : 'Nouvelle Compétence'}
            </h3>

            <div>
              <label className="block text-xs font-mono font-semibold text-theme-main mb-1.5">
                NOM DE LA TECHNOLOGIE *
              </label>
              <input
                type="text"
                required
                value={editingSkill.name || ''}
                onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                placeholder="Ex: React, TypeScript, PostgreSQL..."
                className="w-full px-4 py-2.5 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-theme-main mb-1.5">
                CATÉGORIE *
              </label>
              <select
                value={editingSkill.category || 'FRONT-END'}
                onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-theme-main mb-1.5">
                NIVEAU DE MAÎTRISE ({editingSkill.level || 80}%)
              </label>
              <input
                type="range"
                min={10}
                max={100}
                step={5}
                value={editingSkill.level || 80}
                onChange={(e) => setEditingSkill({ ...editingSkill, level: Number(e.target.value) })}
                className="w-full accent-theme-primary cursor-pointer"
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
