import React from 'react';
import { HeroData, Profile } from '../types';
import { Reveal } from '../components/Reveal';

interface HeroSectionProps {
  hero: HeroData | null;
  profile: Profile | null;
  isLoading?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ hero, profile, isLoading }) => {
  if (isLoading) {
    return (
      <section id="hero" className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-[#12010c]">
        <div className="w-10 h-10 border-4 border-[#ec4899]/20 border-t-[#ec4899] rounded-full animate-spin"></div>
      </section>
    );
  }

  const descText =
    hero?.description ||
    "Développeur web avec plus de 6 ans d'expérience dans la conception et le développement d'applications performantes, sécurisées et centrées sur l'utilisateur.";

  const primaryCtaText = hero?.primaryCtaText || 'Voir mes projets';
  const primaryCtaUrl = hero?.primaryCtaUrl || '#projects';
  const secondaryCtaText = hero?.secondaryCtaText || 'Me contacter';
  const secondaryCtaUrl = hero?.secondaryCtaUrl || '#contact';

  const firstName = profile?.firstName || 'Samuel';
  const lastName = profile?.lastName || 'Andrianirina';
  const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();
  const avatarFallback =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="600" viewBox="0 0 480 600"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ec4899"/><stop offset="1" stop-color="#f38038"/></linearGradient></defs><rect width="480" height="600" fill="#22071d"/><circle cx="240" cy="300" r="150" fill="url(#g)"/><text x="240" y="300" dy="0.35em" text-anchor="middle" font-family="Space Grotesk, sans-serif" font-size="120" font-weight="800" fill="#ffffff">${initials}</text></svg>`
    );
  const avatar = hero?.imageUrl || profile?.avatarUrl || avatarFallback;
  const techs = hero?.technologies || ['React', 'TypeScript', 'Node.js', 'PostgreSQL'];

  return (
    <section id="hero" className="min-h-screen pt-28 sm:pt-32 pb-16 flex flex-col justify-between relative overflow-x-hidden bg-theme-main transition-colors duration-300">
      {/* Background ambient lighting/glows */}
      <div className="absolute top-1/4 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-gradient-to-br from-[#d92672]/15 to-[#f38038]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-72 sm:w-96 h-72 sm:h-96 bg-[#3d0d34]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          
          {/* Left Column: Hero Text */}
          <Reveal direction="left" className="lg:col-span-7 flex flex-col items-start space-y-6 text-left">

            {/* Giant Title matching Mockup */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-theme-main leading-[1.08] font-heading">
              Je transforme <br className="hidden sm:inline" />
              les idées en <br className="hidden sm:inline" />
              <span className="text-gradient-mockup block sm:inline">solutions web.</span>
            </h1>

            {/* Subtitle Description */}
            <p className="text-base sm:text-lg text-theme-muted max-w-xl leading-relaxed font-normal pt-2">
              {descText}
            </p>

            {/* Tech stack badges */}
            {techs.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {techs.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1.5 rounded-lg bg-theme-card border border-theme text-xs font-mono text-theme-main flex items-center gap-1.5"
                  >
                    <span className="text-[#f38038] font-bold">&lt;/&gt;</span>
                    <span>{tech}</span>
                  </span>
                ))}
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4 w-full sm:w-auto">
              <a
                href={primaryCtaUrl}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-mockup text-white font-semibold text-sm shadow-xl"
              >
                <span>{primaryCtaText}</span>
              </a>

              <a
                href={secondaryCtaUrl}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-theme-card border border-theme text-theme-main font-semibold text-sm hover:bg-theme-surface hover:border-[#f38038] transition-colors"
              >
                <span>{secondaryCtaText}</span>
              </a>
            </div>
          </Reveal>

          {/* Right Column: Photo Card with floating status */}
          <Reveal direction="right" className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm sm:w-96 rounded-3xl bg-theme-card border border-theme p-3 shadow-2xl overflow-hidden group">
              {/* Photo */}
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-theme-surface">
                <img
                  src={avatar}
                  alt={profile?.firstName || 'Samuel Andrianirina'}
                  onError={(e) => {
                    const img = e.currentTarget;
                    if (img.src !== avatarFallback) img.src = avatarFallback;
                  }}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
          </Reveal>

        </div>
      </div>

      {/* Bottom Scroll Indicator */}
      <div className="flex flex-col items-center justify-center pt-8 pb-4 text-theme-muted hover:text-theme-main transition-colors">
        <a href="#about" className="flex flex-col items-center gap-1 group">
          <span className="text-[10px] font-mono tracking-widest uppercase">SCROLL</span>
          <span className="text-sm transform group-hover:translate-y-1 transition-transform">↓</span>
        </a>
      </div>
    </section>
  );
};

