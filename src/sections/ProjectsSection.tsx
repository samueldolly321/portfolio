import React, { useState } from 'react';
import { Project } from '../types';
import { ProjectModal } from '../components/ProjectModal';
import { ExternalLink } from 'lucide-react';
import { Reveal } from '../components/Reveal';

// Themed placeholder used when a project has no image or the image fails to load.
const projectPlaceholder = (title: string) =>
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8b2b9e"/><stop offset="1" stop-color="#d73f73"/></linearGradient></defs><rect width="600" height="400" fill="#180312"/><rect width="600" height="400" fill="url(#g)" opacity="0.25"/><text x="300" y="200" dy="0.35em" text-anchor="middle" font-family="Space Grotesk, sans-serif" font-size="36" font-weight="700" fill="#ffffff" opacity="0.85">${title}</text></svg>`
  );

interface ProjectsSectionProps {
  projects: Project[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // Default projects matching the mockup exactly
  const mockupProjects: Project[] = [
    {
      id: 'p1',
      title: 'Vokatra-ko',
      slug: 'vokatra-ko',
      category: 'ERP / Application métier',
      shortDescription:
        "Système ERP complet pour la gestion d'entreprise. Modules d'inventaire, facturation, RH et CRM intégrés dans une interface unifiée.",
      description:
        "Système ERP complet pour la gestion d'entreprise. Modules d'inventaire, facturation, RH et CRM intégrés dans une interface unifiée.",
      featuredImage:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBSo6Q_2WrKTa_bGGDKxtGBmVYGf879zW4jbjZGDyVeudlK88L6mBXM8JAnQNG_ujZQtn5BaOsd_XSAbyycoE0Qwq2khmw5OQ0CSbRXn6DfAU1sUhsbtKirdm8FkzQM3vIDRmbvlB0O1HdfEz1kyh6bAyHi-JLKR9ItRAf7Zl-8yt9l96amZAjsUnJN0d3qdkksOWgT1XKFEH2d22c_ZhgNSl_fdHm4JBYa806UejHb4Tz-4iu0z-dSwA',
      technologies: ['React', 'Node.js', 'PostgreSQL'],
      year: '2023',
      featured: true,
      isVisible: true,
      gallery: [],
      sortOrder: 1,
    },
    {
      id: 'p2',
      title: 'Portail MNDPT',
      slug: 'portail-mndpt',
      category: 'Site institutionnel',
      shortDescription:
        'Portail institutionnel développé sur mesure avec WordPress. Architecture de thème personnalisée et plugins spécifiques pour la gestion de documents.',
      description:
        'Portail institutionnel développé sur mesure avec WordPress. Architecture de thème personnalisée et plugins spécifiques pour la gestion de documents.',
      featuredImage:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCa8pd1DBPVqJ51NYS2ITlXI7f0trHb0SC1ypseS8zLM6QL_K78FDnyjoF9nEXZvevfhFvkXxDV9unHJmlXnGrEZix3XNdySHCd5gKSgvfCTVozowQrTPyvt1tMdCcFM1gRryvqp8Lsj8Kng70zsyAnShQOv9JzPvBlGAqf-VTV6Ki6B3nG6Y33HQNDbwt9Ys-NKJoqlwej6kNGs9LxUBaDLDdcEHEaFvKyDzn7Bg7TT1NBg9vMOi7fSA',
      technologies: ['WordPress', 'PHP', 'Tailwind CSS'],
      year: '2022',
      featured: true,
      isVisible: true,
      gallery: [],
      sortOrder: 2,
    },
    {
      id: 'p3',
      title: 'Nexus Talent System',
      slug: 'nexus-talent-system',
      category: 'RH / Recruitment',
      shortDescription:
        'Plateforme de recrutement et de gestion des talents. Matching par algorithme, suivi des candidatures et dashboard analytics en temps réel.',
      description:
        'Plateforme de recrutement et de gestion des talents. Matching par algorithme, suivi des candidatures et dashboard analytics en temps réel.',
      featuredImage:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBsFl4aHeC5DOvD2E_fgFgic7luMFHIXqdahy-oeHqVE0-8zv1g_wwfYi_G1ntXyJKwGEWY-JVbjKiLeNdA2H_M1JIZeJjw2G-HDHupLhyuh0mozKUeK8dV3W5bltBF6wARnXWsc69CCMtb29P-MA7YszFbXvlx2WjAKHP-_6Ze3Laeud4X9O28QQtLHXlXFTOuTxs5r0QRPMYxeLDwM6TH10OKiWW2DIsq-aqmqXVp2jhVBreWNmR5yg',
      technologies: ['Vue.js', 'Laravel', 'MySQL'],
      year: '2023',
      featured: true,
      isVisible: true,
      gallery: [],
      sortOrder: 3,
    },
    {
      id: 'p4',
      title: 'Gestion de restaurant',
      slug: 'gestion-de-restaurant',
      category: 'Application métier',
      shortDescription:
        "Application métier pour la gestion d'un restaurant. Tableaux de bord, gestion des stocks, des réservations et des équipes de manière fluide et intuitive.",
      description:
        "Application métier pour la gestion d'un restaurant. Tableaux de bord, gestion des stocks, des réservations et des équipes de manière fluide et intuitive.",
      featuredImage:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC_kg_syH8JyODY9ysYqkBLAaPzYUOsTOeY2xWvy-gw1E-7bZoyPAW_LpkJhANiNS5evsb52uddbbnsil2hGq0QA07kkr67eoXvxBy4sTJYkldaZDN_rMaMSP8wJTzYCz8dcIC7apJkMkt2qMwKGufASJZhazcO8UUhtQGTxRwK-q5OSxWRYBOD6w0LbYtf2Katnllu8L84e2lSw2b6ZWJVOQSscfwTVbNMIgRVWRHYPJrrXjhG2t62ow',
      technologies: ['React', 'TypeScript', 'Tailwind CSS'],
      year: '2021',
      featured: false,
      isVisible: true,
      gallery: [],
      sortOrder: 4,
    },
    {
      id: 'p5',
      title: "Gestion d'agence",
      slug: 'gestion-dagence',
      category: 'Application métier',
      shortDescription:
        "Application métier centralisant la gestion des projets, des clients et des finances d'une agence, avec un suivi analytique précis de la rentabilité.",
      description:
        "Application métier centralisant la gestion des projets, des clients et des finances d'une agence, avec un suivi analytique précis de la rentabilité.",
      featuredImage:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBeKkKHF5fuI3vzlNwZLhLf3K6xPJ37VsCWBzDY4jjrZKqKq-i3b5yCDvIx44_Jz23hvmIIkmRagfazexeMCWoud-TYt9iKd_Ed3E1HWWdI3E2SgTL8T0HnaBjVMsObfAXsK-AK9MUA6IQROuy82IY-vGFufFtmEphxprY-YBdC025IyEzVNhCIsUYO9pHSzbdMCUs_thr0i5uYF5uZkZZysHO12jDJoRuXNVNiQ46foagx9ZdDHeYqAA',
      technologies: ['React', 'TypeScript', 'Node.js'],
      year: '2022',
      featured: false,
      isVisible: true,
      gallery: [],
      sortOrder: 5,
    },
    {
      id: 'p6',
      title: 'Portfolio Personnel',
      slug: 'portfolio-personnel',
      category: 'Portfolio',
      shortDescription:
        'Design éditorial moderne pour un portfolio en ligne. Mise en valeur des réalisations avec des animations fluides et une typographie audacieuse.',
      description:
        'Design éditorial moderne pour un portfolio en ligne. Mise en valeur des réalisations avec des animations fluides et une typographie audacieuse.',
      featuredImage:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBSo6Q_2WrKTa_bGGDKxtGBmVYGf879zW4jbjZGDyVeudlK88L6mBXM8JAnQNG_ujZQtn5BaOsd_XSAbyycoE0Qwq2khmw5OQ0CSbRXn6DfAU1sUhsbtKirdm8FkzQM3vIDRmbvlB0O1HdfEz1kyh6bAyHi-JLKR9ItRAf7Zl-8yt9l96amZAjsUnJN0d3qdkksOWgT1XKFEH2d22c_ZhgNSl_fdHm4JBYa806UejHb4Tz-4iu0z-dSwA',
      technologies: ['React', 'Tailwind CSS', 'Framer Motion'],
      year: '2024',
      featured: false,
      isVisible: true,
      gallery: [],
      sortOrder: 6,
    },
  ];

  const displayList = projects && projects.length > 0 ? projects : mockupProjects;

  return (
    <section id="projects" className="py-24 bg-theme-main relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <Reveal direction="top">
          <div className="text-left mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gradient-h2 font-heading tracking-tight">
              Projets Récents
            </h2>
            <p className="mt-2 text-theme-muted text-sm sm:text-base max-w-2xl">
              Une sélection de mes travaux les plus marquants, démontrant mon expertise technique.
            </p>
          </div>
        </Reveal>

        {/* 6 Cards Grid (3 columns x 2 rows) matching Mockup */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayList.map((project, idx) => (
            <Reveal key={project.id} direction="up" delay={(idx % 3) * 100}>
            <div
              onClick={() => setActiveProject(project)}
              className="h-full bg-theme-card border border-theme rounded-2xl overflow-hidden shadow-xl hover:border-theme-primary/50 transition-all duration-300 group flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Image Card Container */}
                <div className="relative h-48 bg-theme-surface overflow-hidden p-2">
                  <img
                    src={project.featuredImage || projectPlaceholder(project.title)}
                    alt={project.title}
                    onError={(e) => {
                      const ph = projectPlaceholder(project.title);
                      if (e.currentTarget.src !== ph) e.currentTarget.src = ph;
                    }}
                    className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Card Header & Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-theme-main font-heading group-hover:text-[#f38038] transition-colors">
                      {project.title}
                    </h3>
                    <div className="p-1.5 rounded-lg bg-theme-surface border border-theme text-[#f38038] group-hover:text-theme-main transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </div>

                  <p className="text-sm text-theme-muted leading-relaxed line-clamp-3 mb-6">
                    {project.shortDescription || project.description}
                  </p>

                  {/* Tech stack chips */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-theme">
                      {project.technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-md bg-theme-surface border border-theme text-[11px] font-mono text-theme-main flex items-center gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#f38038]" />
                          <span>{tech}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Project Detail Modal */}
      <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
    </section>
  );
};

