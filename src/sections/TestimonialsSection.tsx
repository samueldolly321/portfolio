import React from 'react';
import { Quote, Star } from 'lucide-react';
import { Testimonial } from '../types';
import { Reveal } from '../components/Reveal';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-24 bg-theme-main relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal direction="top">
          <div className="text-left mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gradient-h2 font-heading tracking-tight">
              Témoignages
            </h2>
            <p className="mt-2 text-theme-muted text-sm sm:text-base max-w-2xl">
              Ce que mes clients et collaborateurs disent de mon travail.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <Reveal key={t.id} direction="up" delay={idx * 120}>
              <div className="h-full bg-theme-card border border-theme rounded-2xl p-6 sm:p-7 shadow-xl hover:border-[#f38038]/50 transition-all duration-300 flex flex-col">
                <Quote className="w-8 h-8 text-[#f38038] mb-4" />

                <p className="text-theme-muted text-sm sm:text-base leading-relaxed flex-1">
                  {t.message}
                </p>

                <div className="flex items-center gap-1 mt-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < t.rating ? 'text-[#f38038] fill-[#f38038]' : 'text-theme-muted'}`}
                    />
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-theme">
                  <span className="block text-sm font-bold text-theme-main font-heading">{t.author}</span>
                  {(t.role || t.company) && (
                    <span className="block text-xs text-theme-muted">
                      {[t.role, t.company].filter(Boolean).join(' · ')}
                    </span>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
