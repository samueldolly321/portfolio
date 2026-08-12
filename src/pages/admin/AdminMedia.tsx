import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { MediaUploader } from '../../components/MediaUploader';
import { useToast } from '../../context/ToastContext';
import { Image as ImageIcon, Copy, Trash2, ExternalLink } from 'lucide-react';

export const AdminMedia: React.FC = () => {
  const { showToast } = useToast();
  const [uploads, setUploads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMedia = async () => {
    try {
      const data = await api.getUploads();
      setUploads(data || []);
    } catch (err) {
      showToast('Erreur lors du chargement des fichiers.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleCopyUrl = (url: string) => {
    const fullUrl = window.location.origin + url;
    navigator.clipboard.writeText(fullUrl);
    showToast('Lien copié dans le presse-papier !', 'success');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette image ?')) return;
    try {
      await api.deleteUpload(id);
      showToast('Image supprimée.', 'success');
      fetchMedia();
    } catch (err) {
      showToast('Erreur lors de la suppression.', 'error');
    }
  };

  return (
    <div className="space-y-8 text-left max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-heading text-theme-main">Médiathèque</h1>
        <p className="text-xs text-theme-muted font-mono">
          Téléversez vos captures d'écran, logos et images de projets.
        </p>
      </div>

      {/* Upload Zone */}
      <div className="bg-theme-card border border-theme p-6 rounded-2xl shadow-md">
        <MediaUploader onUploadSuccess={() => fetchMedia()} />
      </div>

      {/* Media Grid */}
      <div className="bg-theme-card border border-theme p-6 rounded-2xl shadow-md space-y-4">
        <h3 className="text-lg font-bold font-heading text-theme-main border-b border-theme pb-3">
          Fichiers Stockés ({uploads.length})
        </h3>

        {isLoading ? (
          <p className="py-8 text-center text-xs font-mono text-theme-muted">Chargement...</p>
        ) : uploads.length === 0 ? (
          <p className="py-8 text-center text-xs font-mono text-theme-muted">
            Aucun fichier téléversé pour l'instant.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploads.map((file) => (
              <div
                key={file.id}
                className="bg-theme-surface border border-theme rounded-xl overflow-hidden shadow-xs group flex flex-col justify-between"
              >
                <div className="relative h-36 bg-slate-950 flex items-center justify-center overflow-hidden">
                  <img
                    src={file.url}
                    alt={file.filename}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleCopyUrl(file.url)}
                      className="p-2 rounded-lg bg-slate-900 border border-white/20 text-white hover:text-theme-primary"
                      title="Copier URL"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-slate-900 border border-white/20 text-white hover:text-theme-primary"
                      title="Ouvrir grand format"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleDelete(file.id)}
                      className="p-2 rounded-lg bg-slate-900 border border-white/20 text-rose-400"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-3 text-xs font-mono border-t border-theme truncate">
                  <span className="text-theme-main block truncate">{file.originalName || file.filename}</span>
                  <span className="text-theme-muted text-[10px]">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
