import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Github, Linkedin } from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Reveal } from '../components/Reveal';

interface ContactSectionProps {
  profile?: {
    email?: string;
    phone?: string;
    location?: string;
    githubUrl?: string | null;
    linkedinUrl?: string | null;
  } | null;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ profile }) => {
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      showToast('Veuillez remplir tous les champs obligatoires.', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      await api.sendMessage(formData);
      setIsSent(true);
      showToast('Votre message a été envoyé avec succès !', 'success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      showToast(err?.message || "Échec de l'envoi. Veuillez réessayer.", 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const email = profile?.email || 'hariniainasamuelandrianirina@gmail.com';
  const phone = profile?.phone || '+261 34 21 890 51';
  const location = profile?.location || 'Antananarivo, Madagascar';
  const githubUrl = profile?.githubUrl || 'https://github.com/samueldolly321';
  const linkedinUrl =
    profile?.linkedinUrl ||
    'https://www.linkedin.com/in/hariniaina-samuel-andrianirina-8922b92b8/';

  return (
    <section id="contact" className="py-24 bg-theme-main relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <Reveal direction="top">
          <div className="text-left mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gradient-h2 font-heading tracking-tight">
              Contact
            </h2>
            <p className="mt-2 text-theme-muted text-sm sm:text-base max-w-2xl">
              Un projet en tête ou une opportunité de collaboration ? N'hésitez pas à me contacter.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Info Cards */}
          <Reveal direction="left" className="lg:col-span-5 space-y-4">
            {/* Email Card */}
            <div className="bg-theme-card border border-theme p-6 rounded-2xl shadow-xl flex items-center gap-4">
              <div className="p-3 rounded-xl bg-theme-surface border border-theme text-[#f38038] shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div className="overflow-hidden">
                <span className="text-xs font-semibold text-theme-muted uppercase tracking-wider block">
                  Email
                </span>
                <a
                  href={`mailto:${email}`}
                  className="text-sm font-bold text-theme-main hover:text-[#f38038] transition-colors truncate block"
                >
                  {email}
                </a>
              </div>
            </div>

            {/* Phone Card */}
            <div className="bg-theme-card border border-theme p-6 rounded-2xl shadow-xl flex items-center gap-4">
              <div className="p-3 rounded-xl bg-theme-surface border border-theme text-[#f38038] shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-theme-muted uppercase tracking-wider block">
                  Téléphone
                </span>
                <a
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  className="text-sm font-bold text-theme-main hover:text-[#f38038] transition-colors block"
                >
                  {phone}
                </a>
              </div>
            </div>

            {/* Location Card */}
            <div className="bg-theme-card border border-theme p-6 rounded-2xl shadow-xl flex items-center gap-4">
              <div className="p-3 rounded-xl bg-theme-surface border border-theme text-[#f38038] shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-theme-muted uppercase tracking-wider block">
                  Localisation
                </span>
                <span className="text-sm font-bold text-theme-main block">{location}</span>
              </div>
            </div>

            {/* GitHub Card */}
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-theme-card border border-theme p-6 rounded-2xl shadow-xl flex items-center gap-4 hover:border-[#f38038] transition-colors group"
            >
              <div className="p-3 rounded-xl bg-theme-surface border border-theme text-[#f38038] shrink-0">
                <Github className="w-6 h-6" />
              </div>
              <div className="overflow-hidden">
                <span className="text-xs font-semibold text-theme-muted uppercase tracking-wider block">
                  GitHub
                </span>
                <span className="text-sm font-bold text-theme-main group-hover:text-[#f38038] transition-colors truncate block">
                  github.com/samueldolly321
                </span>
              </div>
            </a>

            {/* LinkedIn Card */}
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-theme-card border border-theme p-6 rounded-2xl shadow-xl flex items-center gap-4 hover:border-[#f38038] transition-colors group"
            >
              <div className="p-3 rounded-xl bg-theme-surface border border-theme text-[#f38038] shrink-0">
                <Linkedin className="w-6 h-6" />
              </div>
              <div className="overflow-hidden">
                <span className="text-xs font-semibold text-theme-muted uppercase tracking-wider block">
                  LinkedIn
                </span>
                <span className="text-sm font-bold text-theme-main group-hover:text-[#f38038] transition-colors truncate block">
                  hariniaina-samuel-andrianirina
                </span>
              </div>
            </a>
          </Reveal>

          {/* Right Contact Form */}
          <Reveal direction="right" className="lg:col-span-7 bg-theme-card border border-theme p-8 rounded-2xl shadow-2xl">
            {isSent ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-theme-surface border border-theme-primary text-theme-primary flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-theme-main font-heading">
                  Message envoyé avec succès !
                </h3>
                <p className="text-sm text-theme-muted max-w-md mx-auto">
                  Merci de m'avoir contacté. Je vous répondrai dans les plus brefs délais.
                </p>
                <button
                  onClick={() => setIsSent(false)}
                  className="px-6 py-2.5 rounded-xl bg-theme-surface border border-theme text-xs font-bold text-theme-main hover:border-theme-primary transition-all"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-theme-muted mb-2 uppercase tracking-wider">
                      Nom
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Votre nom"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm focus:outline-none focus:border-theme-primary transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-theme-muted mb-2 uppercase tracking-wider">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="votre.email@exemple.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm focus:outline-none focus:border-theme-primary transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-theme-muted mb-2 uppercase tracking-wider">
                    Sujet
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Sujet de votre message"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm focus:outline-none focus:border-theme-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-theme-muted mb-2 uppercase tracking-wider">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Décrivez votre projet ou votre demande..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm focus:outline-none focus:border-theme-primary transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-mockup text-white text-sm font-bold shadow-xl disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-[#f38038]" />
                  <span>{isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}</span>
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
};

