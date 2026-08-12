import React from 'react';
import { GraduationCap } from 'lucide-react';
import { Education } from '../types';
import { Reveal } from '../components/Reveal';

interface EducationSectionProps {
  education: Education[];
}

export const EducationSection: React.FC<EducationSectionProps> = () => {
  const defaultEducation = [
    {
      id: '1',
      year: '2019',
      title: 'Formation Executive Management',
      institution: 'INSCAE',
      description: 'Gestion de projet, management et leadership.',
    },
    {
      id: '2',
      year: '2012 - 2015',
      title: 'Licence Développement web et webdesign',
      institution: 'IT University',
      description: 'Développement web, programmation et webdesign.',
    },
    {
      id: '3',
      year: '2010 - 2012',
      title: 'Informatique de Gestion & Génie Logiciel',
      institution: 'ISPM',
      description: 'Bases fondamentales en algorithmique et génie logiciel.',
    },
    {
      id: '4',
      year: '2009',
      title: 'Baccalauréat série C',
      institution: 'Lycée Saint François Xavier',
      description: 'Baccalauréat scientifique.',
    },
  ];

  return (
    <section id="education" className="py-24 bg-theme-main relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <Reveal direction="top">
          <div className="text-left mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gradient-h2 font-heading tracking-tight">
              Formations
            </h2>
          </div>
        </Reveal>

        {/* 3 Cards Grid matching Mockup */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {defaultEducation.map((edu, idx) => (
            <Reveal key={edu.id} direction="up" delay={idx * 100}>
            <div
              className="h-full bg-theme-card border border-theme p-6 sm:p-7 rounded-2xl shadow-xl hover:border-theme-primary/50 transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#f38038]" />
                <span className="text-xs font-mono font-bold text-[#f38038]">
                  {edu.year}
                </span>
              </div>

              <h3 className="text-xl font-bold text-theme-main font-heading mb-2">
                {edu.title}
              </h3>

              {/* Highlighted institution */}
              <div className="inline-flex items-center gap-1.5 mb-3 px-3 py-1.5 rounded-lg bg-theme-surface border border-[#f38038]/40 text-[#f38038]">
                <GraduationCap className="w-4 h-4 shrink-0" />
                <span className="text-sm font-bold">{edu.institution}</span>
              </div>

              <p className="text-sm text-theme-muted leading-relaxed">
                {edu.description}
              </p>
            </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

