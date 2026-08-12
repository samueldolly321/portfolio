import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../sections/HeroSection';
import { AboutSection } from '../sections/AboutSection';
import { SkillsSection } from '../sections/SkillsSection';
import { ExperienceSection } from '../sections/ExperienceSection';
import { EducationSection } from '../sections/EducationSection';
import { ProjectsSection } from '../sections/ProjectsSection';
import { ContactSection } from '../sections/ContactSection';
import { Footer } from '../components/Footer';
import { ScrollToTop } from '../components/ScrollToTop';
import { api } from '../services/api';
import {
  Profile,
  HeroData,
  AboutData,
  Skill,
  Experience,
  Education,
  Project,
} from '../types';

export const PortfolioPage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [hero, setHero] = useState<HeroData | null>(null);
  const [about, setAbout] = useState<AboutData | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [
          profileData,
          heroData,
          aboutData,
          skillsData,
          expData,
          eduData,
          projData,
        ] = await Promise.all([
          api.getProfile(),
          api.getHero(),
          api.getAbout(),
          api.getSkills(),
          api.getExperiences(),
          api.getEducation(),
          api.getProjects(),
        ]);

        setProfile(profileData);
        setHero(heroData);
        setAbout(aboutData);
        setSkills(skillsData || []);
        setExperiences(expData || []);
        setEducation(eduData || []);
        setProjects(projData || []);
      } catch (err) {
        console.error('Error fetching public portfolio data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-theme-main text-theme-main flex flex-col items-center justify-center font-sans">
        <div className="w-10 h-10 border-4 border-theme-primary/20 border-t-theme-primary rounded-full animate-spin"></div>
        <span className="mt-4 text-xs font-semibold text-theme-muted tracking-widest uppercase">
          Chargement du Portfolio...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-main text-theme-main font-sans selection:bg-[#ec4899] selection:text-white transition-colors duration-300">
      <Navbar profile={profile} />
      <main>
        <HeroSection hero={hero} profile={profile} />
        <AboutSection about={about} />
        <SkillsSection skills={skills} />
        <ExperienceSection experiences={experiences} />
        <EducationSection education={education} />
        <ProjectsSection projects={projects} />
        <ContactSection profile={profile} />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

