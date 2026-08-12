import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Project } from '../../types';
import { useToast } from '../../context/ToastContext';
import { Plus, Edit2, Trash2, Eye, EyeOff, FolderCode, Search, Sparkles, Copy } from 'lucide-react';

export const AdminProjects: React.FC = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await api.getProjects();
      setProjects(data || []);
    } catch (err) {
      showToast('Erreur lors du chargement des projets.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce projet ?')) return;
    try {
      await api.deleteProject(id);
      showToast('Projet supprimé.', 'success');
      fetchProjects();
    } catch (err) {
      showToast('Erreur lors de la suppression.', 'error');
    }
  };

  const handleToggleVisibility = async (project: Project) => {
    try {
      await api.updateProject(project.id, { isVisible: !project.isVisible });
      fetchProjects();
    } catch (err) {
      showToast('Erreur de visibilité.', 'error');
    }
  };

  const categories = ['ALL', ...Array.from(new Set(projects.map((p) => p.category)))];

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  if (isLoading) {
    return <div className="py-20 text-center font-mono text-xs text-theme-muted">Chargement...</div>;
  }

  return (
    <div className="space-y-8 text-left max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-theme-main">Gestion des Projets CMS</h1>
          <p className="text-xs text-theme-muted font-mono">
            Créez, éditez et organisez vos réalisations web et applications.
          </p>
        </div>

        <Link
          to="/admin/projects/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#36E0C2] to-[#29B6E6] text-slate-950 font-bold font-heading text-xs shadow-md"
        >
          <Plus className="w-4 h-4" /> Nouveau Projet
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-theme-card border border-theme p-4 rounded-2xl flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-theme-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un projet..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-theme-surface border border-theme text-xs text-theme-main"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors whitespace-nowrap ${
                categoryFilter === cat
                  ? 'bg-theme-primary text-slate-950 font-bold'
                  : 'bg-theme-surface text-theme-muted border border-theme'
              }`}
            >
              {cat === 'ALL' ? 'TOUS' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-theme-card border border-theme rounded-2xl overflow-hidden shadow-md">
        <div className="divide-y divide-theme/60">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className={`p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                project.isVisible ? 'hover:bg-theme-surface/50' : 'bg-theme-surface/30 opacity-60'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-12 rounded-lg bg-slate-950 border border-theme overflow-hidden shrink-0 flex items-center justify-center">
                  {project.featuredImage ? (
                    <img src={project.featuredImage} alt={project.title} className="w-full h-full object-cover" />
                  ) : (
                    <FolderCode className="w-6 h-6 text-theme-muted" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-theme-surface border border-theme text-theme-primary font-bold">
                      {project.category}
                    </span>
                    {project.featured && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> VEDETTE
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold font-heading text-base text-theme-main">{project.title}</h3>
                  <span className="text-xs text-theme-muted font-mono">{project.year}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end md:self-center">
                <button
                  onClick={() => handleToggleVisibility(project)}
                  className="p-2 rounded-xl border border-theme text-theme-muted hover:text-theme-main"
                  title={project.isVisible ? 'Masquer' : 'Afficher'}
                >
                  {project.isVisible ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-rose-400" />}
                </button>

                <Link
                  to={`/admin/projects/edit/${project.id}`}
                  className="p-2 rounded-xl border border-theme text-theme-muted hover:text-theme-primary"
                  title="Modifier"
                >
                  <Edit2 className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => handleDelete(project.id)}
                  className="p-2 rounded-xl border border-theme text-theme-muted hover:text-rose-400"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
