import React from 'react';
import { Download } from 'lucide-react';
import { AboutData } from '../types';
import { Reveal } from '../components/Reveal';
import { CountUp } from '../components/CountUp';

interface AboutSectionProps {
  about?: AboutData | null;
}

const DEFAULT_ABOUT_TEXT =
  "Fort de plus de 6 ans d'expérience dans le développement web, je suis passionné par la création de solutions digitales performantes et intuitives. Mon parcours m'a permis de développer une expertise solide couvrant l'ensemble du cycle de vie d'un projet web, de la conception initiale au déploiement." +
  '\n\n' +
  "Spécialisé dans les technologies front-end et back-end modernes, j'accorde une importance particulière à la qualité du code, aux performances et à l'expérience utilisateur. Mon approche combine rigueur technique et créativité pour répondre aux besoins spécifiques de chaque projet.";

export const AboutSection: React.FC<AboutSectionProps> = ({ about }) => {
  // Text is editable from the admin: "À Propos & Stats" > "Texte Parcours & Philosophie".
  // Paragraphs are split on blank lines and laid out side by side.
  const rawText = about?.description?.trim() ? about.description : DEFAULT_ABOUT_TEXT;
  const paragraphs = rawText.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);

  const stats = [
    { value: '6+', label: "Années d'expérience" },
    { value: '15+', label: 'Projets réalisés' },
    { value: '100%', label: 'Engagement & Qualité' },
  ];

  return (
    <section id="about" className="py-24 bg-theme-main relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <Reveal direction="top">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-left mb-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gradient-h2 font-heading tracking-tight">
              À Propos
            </h2>
            {about?.cvUrl && (
              <a
                href={about.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                download="CV-Samuel-Andrianirina.pdf"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-mockup text-white font-semibold text-sm shadow-xl w-full sm:w-auto"
              >
                <Download className="w-4 h-4" />
                <span>Télécharger mon CV</span>
              </a>
            )}
          </div>
        </Reveal>

        {/* Paragraphs side by side (in a row), fading in from left & right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-theme-muted text-base sm:text-lg leading-relaxed mb-10">
          {paragraphs.map((para, idx) => (
            <Reveal key={idx} direction={idx % 2 === 0 ? 'left' : 'right'}>
              <p>{para}</p>
            </Reveal>
          ))}
        </div>

        {/* Three stat blocks as columns, fading up with a stagger */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((st, idx) => (
            <Reveal key={idx} direction="up" delay={idx * 120}>
              <div className="h-full bg-theme-card border border-theme p-6 rounded-2xl shadow-xl flex flex-col justify-center">
                <CountUp
                  value={st.value}
                  className="text-3xl sm:text-4xl font-extrabold text-gradient-mockup font-heading mb-1"
                />
                <span className="text-xs sm:text-sm font-semibold text-theme-main">
                  {st.label}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

