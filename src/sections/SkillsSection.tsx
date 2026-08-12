import React from 'react';
import { Skill } from '../types';
import { Code2, Server, Database, Globe, Shield, Monitor, Wrench, Sparkles, Layers } from 'lucide-react';
import { Reveal } from '../components/Reveal';

interface SkillsSectionProps {
  skills: Skill[];
}

// "Config" d'affichage : pour chaque catégorie de la base, un libellé + une icône.
// L'ordre de ce tableau = l'ordre d'affichage des cartes.
const CATEGORY_CONFIG: { key: string; label: string; icon: React.ElementType }[] = [
  { key: 'FRONT-END', label: 'Front-end', icon: Code2 },
  { key: 'BACK-END', label: 'Back-end', icon: Server },
  { key: 'DATABASE & ORM', label: 'Base de données & ORM', icon: Database },
  { key: 'CMS & WEB', label: 'CMS & Web', icon: Globe },
  { key: 'API & SECURITY', label: 'API & Sécurité', icon: Shield },
  { key: 'DESKTOP', label: 'Desktop', icon: Monitor },
  { key: 'TOOLS', label: 'Outils', icon: Wrench },
  { key: 'AI & AUTOMATION', label: 'IA & Automatisation', icon: Sparkles },
];

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  // 1. On ne garde que les compétences visibles
  const visible = (skills || []).filter((s) => s.isVisible !== false);

  // 2. On regroupe par catégorie -> { 'FRONT-END': [...], 'BACK-END': [...], ... }
  const grouped = visible.reduce((acc, skill) => {
    (acc[skill.category] = acc[skill.category] || []).push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  // 3. On ordonne les catégories : celles de la config d'abord, puis toute catégorie "inconnue"
  const orderedKeys = [
    ...CATEGORY_CONFIG.map((c) => c.key).filter((k) => grouped[k]?.length),
    ...Object.keys(grouped).filter((k) => !CATEGORY_CONFIG.some((c) => c.key === k)),
  ];

  const iconFor = (key: string) => CATEGORY_CONFIG.find((c) => c.key === key)?.icon || Layers;
  const labelFor = (key: string) => CATEGORY_CONFIG.find((c) => c.key === key)?.label || key;

  if (orderedKeys.length === 0) return null;

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

        {/* Une carte par catégorie */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {orderedKeys.map((key, idx) => {
            const Icon = iconFor(key);
            const items = grouped[key];
            return (
              <Reveal key={key} direction="up" delay={idx * 120}>
                <div className="h-full bg-theme-card border border-theme rounded-2xl p-6 sm:p-7 shadow-xl hover:border-[#f38038]/50 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-theme-surface border border-theme text-[#f38038]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-theme-main font-heading">{labelFor(key)}</h3>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {items.map((tech) => (
                      <span
                        key={tech.id}
                        className="px-3 py-1.5 rounded-lg bg-theme-surface border border-theme text-xs font-mono text-theme-main flex items-center gap-1.5 hover:border-[#f38038] transition-colors"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#f38038]" />
                        <span>{tech.name}</span>
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
