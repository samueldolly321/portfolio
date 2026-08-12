import React from 'react';
import { Skill } from '../types';
import { Code2, Server, Database, Palette } from 'lucide-react';
import { Reveal } from '../components/Reveal';

interface SkillsSectionProps {
  skills: Skill[];
}

const categories = [
  {
    title: 'Front-end',
    icon: Code2,
    items: ['HTML/CSS', 'JavaScript', 'React.js', 'Vue.js', 'Tailwind CSS', 'TypeScript'],
  },
  {
    title: 'Back-end',
    icon: Server,
    items: ['Node.js', 'Express', 'PHP', 'Python', 'REST API', 'GraphQL'],
  },
  {
    title: 'Data & Outils',
    icon: Database,
    items: ['PostgreSQL', 'MySQL', 'Git/GitHub', 'XAMPP', 'VS Code', 'Local WP', 'FTP'],
  },
  {
    title: 'Design',
    icon: Palette,
    items: ['Photoshop', 'Figma', 'Canva'],
  },
];

export const SkillsSection: React.FC<SkillsSectionProps> = () => {
  return (
    <section id="skills" className="py-24 bg-theme-main relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <Reveal direction="top">
          <div className="text-left mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gradient-h2 font-heading tracking-tight">
              Compétences Techniques
            </h2>
            <p className="mt-2 text-theme-muted text-sm sm:text-base max-w-2xl">
              Aperçu des technologies et outils que j'utilise au quotidien pour construire des solutions modernes et robustes.
            </p>
          </div>
        </Reveal>

        {/* 4 Columns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Reveal key={cat.title} direction="up" delay={idx * 120}>
                <div className="h-full bg-theme-card border border-theme rounded-2xl p-6 sm:p-7 shadow-xl hover:border-[#f38038]/50 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-theme-surface border border-theme text-[#f38038]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-theme-main font-heading">{cat.title}</h3>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {cat.items.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 rounded-lg bg-theme-surface border border-theme text-xs font-mono text-theme-main flex items-center gap-1.5 hover:border-[#f38038] transition-colors"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#f38038]" />
                        <span>{tech}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
