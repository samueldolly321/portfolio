import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Testimonial } from '../../types';
import { useToast } from '../../context/ToastContext';
import { Plus, Trash2, Edit2, Eye, EyeOff, Quote, Star } from 'lucide-react';

export const AdminTestimonials: React.FC = () => {
  const { showToast } = useToast();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await api.getAllTestimonials();
      setTestimonials(data || []);
    } catch (err) {
      showToast('Erreur lors du chargement des témoignages.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (t?: Testimonial) => {
    setEditing(
      t
        ? { ...t }
        : {
            author: '',
            role: '',
            company: '',
            message: '',
            rating: 5,
            isVisible: true,
            sortOrder: testimonials.length + 1,
          }
    );
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing?.author || !editing?.message) {
      showToast("L'auteur et le message sont requis.", 'error');
      return;
    }
    try {
      if (editing.id) {
        await api.updateTestimonial(editing.id, editing);
        showToast('Témoignage mis à jour.', 'success');
      } else {
        await api.createTestimonial(editing);
        showToast('Témoignage créé.', 'success');
      }
      setShowModal(false);
      setEditing(null);
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de la sauvegarde.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Supprimer ce témoignage ?')) return;
    try {
      await api.deleteTestimonial(id);
      showToast('Témoignage supprimé.', 'success');
      fetchData();
    } catch {
      showToast('Erreur lors de la suppression.', 'error');
    }
  };

  const handleToggle = async (t: Testimonial) => {
    try {
      await api.updateTestimonial(t.id, { isVisible: !t.isVisible });
      fetchData();
    } catch {
      showToast('Erreur de visibilité.', 'error');
    }
  };

  if (isLoading) {
    return <div className="py-20 text-center font-mono text-xs text-theme-muted">Chargement...</div>;
  }

  return (
    <div className="space-y-8 text-left max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-theme-main">Témoignages</h1>
          <p className="text-xs text-theme-muted font-mono">Gérez les avis affichés sur le site public.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#36E0C2] to-[#29B6E6] text-slate-950 font-bold font-heading text-xs shadow-md"
        >
          <Plus className="w-4 h-4" /> Nouveau témoignage
        </button>
      </div>

      <div className="space-y-4">
        {testimonials.length === 0 && (
          <p className="text-sm text-theme-muted font-mono">Aucun témoignage pour l'instant.</p>
        )}

        {testimonials.map((t) => (
          <div
            key={t.id}
            className={`p-6 rounded-2xl border transition-all ${
              t.isVisible ? 'bg-theme-card border-theme shadow-md' : 'bg-theme-surface/30 border-theme/40 opacity-60'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1">
                <Quote className="w-6 h-6 text-[#f38038] mb-2" />
                <p className="text-sm text-theme-muted leading-relaxed mb-3">{t.message}</p>
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < t.rating ? 'text-[#f38038] fill-[#f38038]' : 'text-theme-muted'}`} />
                  ))}
                </div>
                <span className="text-sm font-bold text-theme-main font-heading">{t.author}</span>
                {(t.role || t.company) && (
                  <span className="text-xs text-theme-muted"> — {[t.role, t.company].filter(Boolean).join(' · ')}</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => handleToggle(t)} className="p-1.5 rounded-lg border border-theme text-theme-muted hover:text-theme-main" title="Afficher/Masquer">
                  {t.isVisible ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-rose-400" />}
                </button>
                <button onClick={() => handleOpenModal(t)} className="p-1.5 rounded-lg border border-theme text-theme-muted hover:text-theme-primary" title="Modifier">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(t.id)} className="p-1.5 rounded-lg border border-theme text-theme-muted hover:text-rose-400" title="Supprimer">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <form onSubmit={handleSave} className="bg-theme-card border border-theme max-w-lg w-full p-6 sm:p-8 rounded-2xl space-y-4 shadow-2xl text-left my-8">
            <h3 className="text-xl font-bold font-heading text-theme-main">
              {editing.id ? 'Modifier le témoignage' : 'Nouveau témoignage'}
            </h3>

            <div>
              <label className="block text-xs font-mono font-semibold text-theme-main mb-1.5">AUTEUR *</label>
              <input type="text" required value={editing.author || ''}
                onChange={(e) => setEditing({ ...editing, author: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-semibold text-theme-main mb-1.5">RÔLE</label>
                <input type="text" value={editing.role || ''}
                  onChange={(e) => setEditing({ ...editing, role: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm" />
              </div>
              <div>
                <label className="block text-xs font-mono font-semibold text-theme-main mb-1.5">ENTREPRISE</label>
                <input type="text" value={editing.company || ''}
                  onChange={(e) => setEditing({ ...editing, company: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-theme-main mb-1.5">MESSAGE *</label>
              <textarea rows={4} required value={editing.message || ''}
                onChange={(e) => setEditing({ ...editing, message: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm" />
            </div>

            <div className="flex items-center gap-6">
              <div>
                <label className="block text-xs font-mono font-semibold text-theme-main mb-1.5">NOTE</label>
                <select value={editing.rating ?? 5}
                  onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })}
                  className="px-4 py-2.5 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm">
                  {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} étoile{n > 1 ? 's' : ''}</option>)}
                </select>
              </div>
              <label className="flex items-center gap-2 mt-5 cursor-pointer">
                <input type="checkbox" checked={editing.isVisible ?? true}
                  onChange={(e) => setEditing({ ...editing, isVisible: e.target.checked })}
                  className="rounded text-theme-primary focus:ring-0" />
                <span className="text-xs font-mono font-semibold text-theme-main">Visible sur le site</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-theme">
              <button type="button" onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl bg-theme-surface border border-theme text-xs font-semibold text-theme-main">
                Annuler
              </button>
              <button type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#36E0C2] to-[#29B6E6] text-slate-950 text-xs font-bold font-heading">
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
