import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Profile } from '../../types';
import { useToast } from '../../context/ToastContext';
import { Save, Github, Linkedin, Image as ImageIcon, Trash2 } from 'lucide-react';
import { MediaUploader } from '../../components/MediaUploader';

export const AdminProfile: React.FC = () => {
  const { showToast } = useToast();
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.getProfile();
        setProfile(data || {});
      } catch (err) {
        showToast('Erreur lors du chargement du profil.', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const updated = await api.updateProfile(profile);
      setProfile(updated);
      showToast('Profil mis à jour avec succès !', 'success');
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de la mise à jour.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="py-20 text-center font-mono text-xs text-theme-muted">Chargement...</div>;
  }

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-theme-main">Profil & Informations</h1>
          <p className="text-xs text-theme-muted font-mono">
            Modifiez vos informations personnelles affichées sur tout le portfolio.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-theme-card border border-theme p-6 sm:p-8 rounded-2xl shadow-md space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-mono font-semibold text-theme-main mb-2">
              PRÉNOM *
            </label>
            <input
              type="text"
              required
              value={profile.firstName || ''}
              onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm mint-border-glow"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-theme-main mb-2">
              NOM *
            </label>
            <input
              type="text"
              required
              value={profile.lastName || ''}
              onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm mint-border-glow"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono font-semibold text-theme-main mb-2">
            TITRE PROFESSIONNEL *
          </label>
          <input
            type="text"
            required
            value={profile.title || ''}
            onChange={(e) => setProfile({ ...profile, title: e.target.value })}
            placeholder="Développeur Web Full-Stack"
            className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm mint-border-glow"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-mono font-semibold text-theme-main mb-2">
              EMAIL DE CONTACT *
            </label>
            <input
              type="email"
              required
              value={profile.email || ''}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm mint-border-glow"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-theme-main mb-2">
              TÉLÉPHONE
            </label>
            <input
              type="text"
              value={profile.phone || ''}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm mint-border-glow"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-theme-main mb-2">
              LOCALISATION
            </label>
            <input
              type="text"
              value={profile.location || ''}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm mint-border-glow"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono font-semibold text-theme-main mb-2 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5" /> PHOTO / AVATAR
          </label>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            {profile.avatarUrl ? (
              <div className="relative shrink-0">
                <img
                  src={profile.avatarUrl}
                  alt="Aperçu de l'avatar"
                  className="w-28 h-28 rounded-2xl object-cover border border-theme"
                />
                <button
                  type="button"
                  onClick={() => setProfile({ ...profile, avatarUrl: '' })}
                  title="Retirer la photo"
                  className="absolute -top-2 -right-2 p-1.5 rounded-full bg-theme-surface border border-theme text-theme-muted hover:text-red-400 hover:border-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="w-28 h-28 rounded-2xl border border-dashed border-theme bg-theme-surface flex items-center justify-center text-theme-muted shrink-0">
                <ImageIcon className="w-6 h-6" />
              </div>
            )}
            <div className="flex-1 w-full">
              <MediaUploader
                onUploadSuccess={(url) => setProfile({ ...profile, avatarUrl: url })}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-mono font-semibold text-theme-main mb-2 flex items-center gap-1.5">
              <Github className="w-3.5 h-3.5" /> URL GITHUB
            </label>
            <input
              type="url"
              value={profile.githubUrl || ''}
              onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })}
              placeholder="https://github.com/username"
              className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm mint-border-glow"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-theme-main mb-2 flex items-center gap-1.5">
              <Linkedin className="w-3.5 h-3.5" /> URL LINKEDIN
            </label>
            <input
              type="url"
              value={profile.linkedinUrl || ''}
              onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
              placeholder="https://linkedin.com/in/username"
              className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm mint-border-glow"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono font-semibold text-theme-main mb-2">
            BIOGRAPHIE COURTE
          </label>
          <textarea
            rows={4}
            value={profile.bio || ''}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm mint-border-glow"
          />
        </div>

        <div className="pt-4 border-t border-theme flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#36E0C2] to-[#29B6E6] text-slate-950 font-heading font-bold text-xs shadow-md hover:opacity-90 disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>ENREGISTRER LE PROFIL</span>
          </button>
        </div>
      </form>
    </div>
  );
};
