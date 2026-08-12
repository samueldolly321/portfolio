import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Project } from '../../types';
import { MediaUploader } from '../../components/MediaUploader';
import { useToast } from '../../context/ToastContext';
import { Save, ArrowLeft, Plus, X, Image as ImageIcon, Sparkles } from 'lucide-react';

export const AdminProjectEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const isNew = !id;

  const [project, setProject] = useState<Partial<Project>>({
    title: '',
    category: 'Application Métier / ERP',
    year: '2024',
    shortDescription: '',
    description: '',
    featuredImage: '',
    gallery: [],
    technologies: [],
    projectUrl: '',
    githubUrl: '',
    featured: false,
    isVisible: true,
  });

  const [techInput, setTechInput] = useState('');
  const [galleryUrlInput, setGalleryUrlInput] = useState('');
  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isNew && id) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      const data = await api.getProjectById(id!);
      if (data) setProject(data);
    } catch (err) {
      showToast('Erreur lors du chargement du projet.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTech = () => {
    if (!techInput.trim()) return;
    const current = project.technologies || [];
    if (!current.includes(techInput.trim())) {
      setProject({ ...project, technologies: [...current, techInput.trim()] });
    }
    setTechInput('');
  };

  const handleRemoveTech = (index: number) => {
    const current = project.technologies || [];
    setProject({ ...project, technologies: current.filter((_, idx) => idx !== index) });
  };

  const handleAddGalleryUrl = (url: string) => {
    if (!url) return;
    const current = project.gallery || [];
    setProject({ ...project, gallery: [...current, url] });
    setGalleryUrlInput('');
  };

  const handleRemoveGalleryUrl = (index: number) => {
    const current = project.gallery || [];
    setProject({ ...project, gallery: current.filter((_, idx) => idx !== index) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project.title || !project.category) {
      showToast('Le titre et la catégorie sont obligatoires.', 'error');
      return;
    }

    try {
      setIsSaving(true);
      if (isNew) {
        await api.createProject(project);
        showToast('Projet créé avec succès !', 'success');
      } else {
        await api.updateProject(id!, project);
        showToast('Projet mis à jour avec succès !', 'success');
      }
      navigate('/admin/projects');
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
    <div className="space-y-8 text-left max-w-4xl mx-auto pb-16">
      <div className="flex items-center justify-between">
        <Link
          to="/admin/projects"
          className="inline-flex items-center gap-2 text-xs font-mono text-theme-muted hover:text-theme-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Retour aux Projets
        </Link>
        <h1 className="text-xl font-bold font-heading text-theme-main">
          {isNew ? 'Nouveau Projet CMS' : 'Édition du Projet'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-theme-card border border-theme p-6 sm:p-8 rounded-2xl shadow-md space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-mono font-semibold text-theme-main mb-2">
              TITRE DU PROJET *
            </label>
            <input
              type="text"
              required
              value={project.title || ''}
              onChange={(e) => setProject({ ...project, title: e.target.value })}
              placeholder="Ex: ERP Salathys, Port de Toamasina..."
              className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-theme-main mb-2">
              CATÉGORIE *
            </label>
            <input
              type="text"
              required
              value={project.category || ''}
              onChange={(e) => setProject({ ...project, category: e.target.value })}
              placeholder="Ex: Application Métier / ERP, Web, Port de Commerce..."
              className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-mono font-semibold text-theme-main mb-2">
              ANNÉE
            </label>
            <input
              type="text"
              value={project.year || ''}
              onChange={(e) => setProject({ ...project, year: e.target.value })}
              placeholder="2024"
              className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-theme-main mb-2">
              URL DÉMO LIVE
            </label>
            <input
              type="url"
              value={project.projectUrl || ''}
              onChange={(e) => setProject({ ...project, projectUrl: e.target.value })}
              placeholder="https://..."
              className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-theme-main mb-2">
              URL REPO GITHUB
            </label>
            <input
              type="url"
              value={project.githubUrl || ''}
              onChange={(e) => setProject({ ...project, githubUrl: e.target.value })}
              placeholder="https://github.com/..."
              className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono font-semibold text-theme-main mb-2">
            RÉSUMÉ COURT (Pour la carte)
          </label>
          <input
            type="text"
            value={project.shortDescription || ''}
            onChange={(e) => setProject({ ...project, shortDescription: e.target.value })}
            placeholder="Aperçu rapide du projet..."
            className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-semibold text-theme-main mb-2">
            DESCRIPTION DÉTAILLÉE
          </label>
          <textarea
            rows={5}
            value={project.description || ''}
            onChange={(e) => setProject({ ...project, description: e.target.value })}
            placeholder="Explication des fonctionnalités, défis et architectures..."
            className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm"
          />
        </div>

        {/* Featured Cover Image */}
        <div className="space-y-3">
          <label className="block text-xs font-mono font-semibold text-theme-main">
            IMAGE COUVERTURE PRINCIPALE
          </label>
          <input
            type="text"
            value={project.featuredImage || ''}
            onChange={(e) => setProject({ ...project, featuredImage: e.target.value })}
            placeholder="URL de l'image (ou téléversez ci-dessous)"
            className="w-full px-4 py-2.5 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm mb-3"
          />
          <MediaUploader onUploadSuccess={(url) => setProject({ ...project, featuredImage: url })} />
        </div>

        {/* Gallery Images */}
        <div className="space-y-3 pt-4 border-t border-theme">
          <label className="block text-xs font-mono font-semibold text-theme-main">
            GALERIE D'IMAGES SECONDAIRES
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={galleryUrlInput}
              onChange={(e) => setGalleryUrlInput(e.target.value)}
              placeholder="Collez l'URL d'une image de la galerie..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm"
            />
            <button
              type="button"
              onClick={() => handleAddGalleryUrl(galleryUrlInput)}
              className="px-4 py-2.5 rounded-xl bg-theme-surface border border-theme hover:border-theme-primary text-theme-primary text-xs font-bold"
            >
              Ajouter
            </button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2">
            {(project.gallery || []).map((imgUrl, idx) => (
              <div key={idx} className="relative h-24 rounded-xl border border-theme overflow-hidden group">
                <img src={imgUrl} alt="Gallery item" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveGalleryUrl(idx)}
                  className="absolute top-1 right-1 p-1 rounded-md bg-slate-950/80 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Technologies Chip Manager */}
        <div className="pt-4 border-t border-theme space-y-3">
          <label className="block text-xs font-mono font-semibold text-theme-main">
            STACK TECHNIQUE
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
              placeholder="Ex: React, Node.js, SQLite..."
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
            {(project.technologies || []).map((tech, idx) => (
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

        {/* Options */}
        <div className="pt-4 border-t border-theme flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={project.featured || false}
              onChange={(e) => setProject({ ...project, featured: e.target.checked })}
              className="rounded text-theme-primary focus:ring-0"
            />
            <span className="text-xs font-mono font-semibold text-theme-main flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Mettre en vedette (Featured)
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={project.isVisible !== false}
              onChange={(e) => setProject({ ...project, isVisible: e.target.checked })}
              className="rounded text-theme-primary focus:ring-0"
            />
            <span className="text-xs font-mono font-semibold text-theme-main">
              Visible sur le site public
            </span>
          </label>
        </div>

        {/* Submit */}
        <div className="pt-6 border-t border-theme flex items-center justify-end gap-3">
          <Link
            to="/admin/projects"
            className="px-5 py-2.5 rounded-xl bg-theme-surface border border-theme text-xs font-semibold text-theme-main"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#36E0C2] to-[#29B6E6] text-slate-950 font-bold font-heading text-xs shadow-md"
          >
            <Save className="w-4 h-4" /> Enregistrer le Projet
          </button>
        </div>
      </form>
    </div>
  );
};
