import React from 'react';
import { Experience } from '../types';
import { Reveal } from '../components/Reveal';

interface ExperienceSectionProps {
  experiences: Experience[];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = () => {
  const defaultExperiences = [
    {
      id: '1',
      position: 'Développeur web',
      company: 'Salathis',
      startDate: '2016',
      endDate: 'Aujourd\'hui',
      current: true,
      description:
        "Développement et livraison de sites et d'applications web pour des clients à l'étranger (Europe / France), en partenariat avec la société Cliken-web. Prise en charge de bout en bout : conception, intégration, développement et suivi.",
      stack: ['Drupal', 'WordPress', 'React', 'Node.js', 'PostgreSQL'],
    },
    {
      id: '2',
      position: 'Intégrateur web',
      company: 'Softibox',
      startDate: '2015',
      endDate: '2016',
      current: false,
      description:
        "Intégration de maquettes graphiques (PSD) en pages web responsive et conformes aux standards.",
      stack: ['Symfony', 'PHP', 'CSS', 'JavaScript'],
    },
    {
      id: '3',
      position: 'Stagiaire développeur web',
      company: 'Prestatics',
      startDate: '2015',
      endDate: '2015',
      current: false,
      description:
        "Conception et réalisation du site web du Rotary Club Antananarivo.",
      stack: ['Joomla', 'WordPress', 'PHP', 'CSS', 'JavaScript'],
    },
  ];

  return (
    <section id="experiences" className="py-24 bg-theme-main relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <Reveal direction="top">
          <div className="text-left mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gradient-h2 font-heading tracking-tight">
              Expériences Professionnelles
            </h2>
          </div>
        </Reveal>

        {/* Timeline List matching mockup */}
        <div className="relative border-l-2 border-theme ml-3 sm:ml-4 space-y-10">
          {defaultExperiences.map((exp, idx) => (
            <Reveal key={exp.id} direction="left" delay={idx * 100} className="relative pl-8 sm:pl-10 group">
              {/* Bullet node */}
              <div
                className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 ${
                  exp.current
                    ? 'bg-[#f38038] border-[#f38038] shadow-[0_0_12px_#f38038]'
                    : 'bg-theme-surface border-theme'
                }`}
              />

              {/* Entry Content */}
              <div className="bg-theme-card border border-theme p-6 sm:p-7 rounded-2xl shadow-xl hover:border-[#f38038]/50 transition-all">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-theme-main font-heading">
                    {exp.position}
                  </h3>
                  <span className="text-[#f38038] font-bold">•</span>
                  <span className="text-base font-semibold text-[#f38038]">
                    {exp.company}
                  </span>
                  <span className="text-theme-muted font-normal text-sm">
                    • {exp.startDate} - {exp.endDate}
                  </span>
                </div>

                <p className="text-theme-muted text-sm sm:text-base leading-relaxed pt-1">
                  {exp.description}
                </p>

                {/* Tech stack used */}
                <div className="mt-4 pt-4 border-t border-theme">
                  <span className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-theme-muted mb-2">
                    Stack utilisé
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {exp.stack.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 rounded-lg bg-theme-surface border border-theme text-xs font-mono font-semibold text-theme-main flex items-center gap-1.5 hover:border-[#f38038] transition-colors"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#f38038]" />
                        <span>{tech}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

