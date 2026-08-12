import React, { useState } from 'react';
import { Project } from '../types';
import { X, ExternalLink, Github, ChevronLeft, ChevronRight, Calendar, Tag } from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  const images = [
    ...(project.featuredImage ? [project.featuredImage] : []),
    ...(project.gallery || []),
  ].filter(Boolean);

  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  const nextImage = () => {
    setCurrentImageIdx((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-theme-card border border-theme max-w-4xl w-full max-h-[90vh] rounded-2xl shadow-2xl overflow-y-auto flex flex-col relative text-left text-theme-main">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-xl bg-theme-surface border border-theme hover:border-[#f38038] text-theme-main transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5 text-[#f38038]" />
        </button>

        {/* Gallery / Image Slider */}
        {images.length > 0 ? (
          <div className="relative w-full h-64 sm:h-96 bg-theme-surface flex items-center justify-center overflow-hidden">
            <img
              src={images[currentImageIdx]}
              alt={project.title}
              className="w-full h-full object-contain"
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-theme-card/80 border border-theme text-theme-main hover:border-[#f38038]"
                >
                  <ChevronLeft className="w-5 h-5 text-[#f38038]" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-theme-card/80 border border-theme text-theme-main hover:border-[#f38038]"
                >
                  <ChevronRight className="w-5 h-5 text-[#f38038]" />
                </button>

                <div className="absolute bottom-3 flex gap-1.5">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIdx(idx)}
                      className={`h-2.5 rounded-full transition-all ${
                        idx === currentImageIdx ? 'bg-[#f38038] w-6' : 'bg-black/30 dark:bg-white/40 w-2.5'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="w-full h-48 bg-theme-surface flex items-center justify-center text-theme-muted font-mono text-sm">
            Aucune image disponible
          </div>
        )}

        {/* Project Details Content */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-theme pb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-theme-surface border border-theme text-[#f38038] text-xs font-mono font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f38038]" />
                  <span>{project.category}</span>
                </span>
                <span className="text-xs font-mono text-theme-muted flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#f38038]" /> {project.year}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold font-heading text-theme-main">
                {project.title}
              </h3>
            </div>

            {/* Action Links */}
            <div className="flex items-center gap-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-theme-surface border border-theme hover:border-[#f38038] text-theme-main text-xs font-semibold"
                >
                  <Github className="w-4 h-4 text-[#f38038]" /> Code Source
                </a>
              )}
              {project.projectUrl && (
                <a
                  href={project.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-mockup text-white text-xs font-bold font-heading shadow-md"
                >
                  <ExternalLink className="w-4 h-4 text-[#f38038]" />
                  <span>Démo Live</span>
                </a>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h4 className="text-sm font-mono text-[#f38038] uppercase tracking-wider">
              À Propos du Projet
            </h4>
            <p className="text-theme-muted text-base leading-relaxed whitespace-pre-line">
              {project.description || project.shortDescription}
            </p>
          </div>

          {/* Technologies Stack */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-theme">
              <h4 className="text-sm font-mono text-[#f38038] uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-[#f38038]" /> Technologies Utilisées
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-lg bg-theme-surface border border-theme text-xs font-mono text-theme-main flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f38038]" />
                    <span>{tech}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
