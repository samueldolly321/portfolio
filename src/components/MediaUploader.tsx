import React, { useState, useRef } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { UploadCloud, Image as ImageIcon, Loader2 } from 'lucide-react';

interface MediaUploaderProps {
  onUploadSuccess?: (url: string) => void;
  accept?: string;
  label?: string;
  hint?: string;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  onUploadSuccess,
  accept = 'image/*',
  label = 'Cliquez ou glissez une image ici',
  hint = 'PNG, JPG, WEBP, SVG (Max 5MB)',
}) => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    // Validate size < 5MB
    if (file.size > 5 * 1024 * 1024) {
      showToast('La taille du fichier doit être inférieure à 5MB.', 'error');
      return;
    }

    try {
      setIsUploading(true);
      const res = await api.uploadFile(file);
      showToast('Fichier téléversé avec succès !', 'success');
      if (onUploadSuccess && res.url) {
        onUploadSuccess(res.url);
      }
    } catch (err: any) {
      showToast(err.message || 'Erreur lors du téléversement.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
      }}
      onClick={() => fileInputRef.current?.click()}
      className={`p-8 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all ${
        isDragging
          ? 'border-theme-primary bg-theme-primary/10'
          : 'border-theme/80 bg-theme-surface/50 hover:border-theme-primary/60 hover:bg-theme-surface'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
        className="hidden"
      />

      <div className="max-w-xs mx-auto space-y-3">
        <div className="w-12 h-12 rounded-xl bg-theme-surface border border-theme text-theme-primary flex items-center justify-center mx-auto">
          {isUploading ? (
            <Loader2 className="w-6 h-6 animate-spin text-theme-primary" />
          ) : (
            <UploadCloud className="w-6 h-6" />
          )}
        </div>

        <div>
          <span className="text-sm font-bold font-heading text-theme-main block">
            {isUploading ? 'Téléversement en cours...' : label}
          </span>
          <span className="text-xs text-theme-muted font-mono block mt-1">
            {hint}
          </span>
        </div>
      </div>
    </div>
  );
};
