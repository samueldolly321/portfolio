export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  avatarUrl?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  websiteUrl?: string | null;
}

export interface HeroData {
  id: string;
  badge: string;
  title: string;
  subtitle?: string | null;
  description: string;
  primaryCtaText: string;
  primaryCtaUrl: string;
  secondaryCtaText: string;
  secondaryCtaUrl: string;
  imageUrl?: string | null;
  technologies: string[];
}

export interface AboutData {
  id: string;
  title: string;
  tagline?: string | null;
  description: string;
  paragraph1?: string;
  paragraph2?: string;
  imageUrl?: string | null;
  cvUrl?: string | null;
}

export interface Statistic {
  id: string;
  label: string;
  value: string;
  subtext?: string | null;
  sortOrder: number;
  isVisible: boolean;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  icon?: string | null;
  level?: number | null;
  sortOrder: number;
  isVisible: boolean;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string | null;
  current: boolean;
  description: string;
  responsibilities: string[];
  technologies: string[];
  location?: string | null;
  sortOrder: number;
  isVisible: boolean;
}

export interface Education {
  id: string;
  year: string;
  startYear?: string | null;
  endYear?: string | null;
  title: string;
  institution: string;
  description: string;
  sortOrder: number;
  isVisible: boolean;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  description: string;
  featuredImage?: string | null;
  gallery: string[];
  technologies: string[];
  projectUrl?: string | null;
  githubUrl?: string | null;
  year: string;
  featured: boolean;
  sortOrder: number;
  isVisible: boolean;
}

export interface Media {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string | null;
  message: string;
  status: 'UNREAD' | 'READ' | 'ARCHIVED';
  createdAt: string;
}

export interface Testimonial {
  id: string;
  author: string;
  role?: string | null;
  company?: string | null;
  message: string;
  rating: number;
  sortOrder?: number;
  isVisible?: boolean;
}

export interface DashboardData {
  counts: {
    projects: number;
    skills: number;
    experiences: number;
    education: number;
    messages: number;
    unreadMessages: number;
  };
  recentProjects: { id: string; title: string; category: string; isVisible: boolean; updatedAt: string }[];
  recentMessages: ContactMessage[];
  systemStatus: {
    database: string;
    storage: string;
    uptime: number;
  };
}
