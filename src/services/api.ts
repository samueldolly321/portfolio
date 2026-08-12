import {
  User,
  Profile,
  HeroData,
  AboutData,
  Statistic,
  Skill,
  Experience,
  Education,
  Project,
  Media,
  ContactMessage,
  DashboardData,
  Testimonial,
} from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Erreur (${res.status})`);
  }
  return data as T;
}

export const api = {
  // Auth
  login: async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await handleResponse<{ token: string; user: User }>(res);
    localStorage.setItem('admin_token', data.token);
    return data;
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<{ user: User }>(res);
  },

  logout: () => {
    localStorage.removeItem('admin_token');
  },

  // Profile
  getProfile: async (): Promise<Profile> => {
    const res = await fetch(`${API_BASE}/profile`);
    return handleResponse<Profile>(res);
  },

  updateProfile: async (data: Partial<Profile>): Promise<Profile> => {
    const res = await fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<Profile>(res);
  },

  // Hero
  getHero: async (): Promise<HeroData> => {
    const res = await fetch(`${API_BASE}/hero`);
    return handleResponse<HeroData>(res);
  },

  updateHero: async (data: Partial<HeroData>): Promise<HeroData> => {
    const res = await fetch(`${API_BASE}/hero`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<HeroData>(res);
  },

  // About
  getAbout: async (): Promise<AboutData> => {
    const res = await fetch(`${API_BASE}/about`);
    return handleResponse<AboutData>(res);
  },

  updateAbout: async (data: Partial<AboutData>): Promise<AboutData> => {
    const res = await fetch(`${API_BASE}/about`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<AboutData>(res);
  },

  // Statistics
  getStatistics: async (): Promise<Statistic[]> => {
    const res = await fetch(`${API_BASE}/statistics`);
    return handleResponse<Statistic[]>(res);
  },

  createStatistic: async (data: Partial<Statistic>): Promise<Statistic> => {
    const res = await fetch(`${API_BASE}/statistics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<Statistic>(res);
  },

  updateStatistic: async (id: string, data: Partial<Statistic>): Promise<Statistic> => {
    const res = await fetch(`${API_BASE}/statistics/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<Statistic>(res);
  },

  deleteStatistic: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/statistics/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    await handleResponse<{ success: boolean }>(res);
  },

  // Testimonials
  getTestimonials: async (): Promise<Testimonial[]> => {
    const res = await fetch(`${API_BASE}/testimonials`);
    return handleResponse<Testimonial[]>(res);
  },

  getAllTestimonials: async (): Promise<Testimonial[]> => {
    const res = await fetch(`${API_BASE}/testimonials/all`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<Testimonial[]>(res);
  },

  createTestimonial: async (data: Partial<Testimonial>): Promise<Testimonial> => {
    const res = await fetch(`${API_BASE}/testimonials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<Testimonial>(res);
  },

  updateTestimonial: async (id: string, data: Partial<Testimonial>): Promise<Testimonial> => {
    const res = await fetch(`${API_BASE}/testimonials/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<Testimonial>(res);
  },

  deleteTestimonial: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/testimonials/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    await handleResponse<{ success: boolean }>(res);
  },

  // Skills
  getSkills: async (): Promise<Skill[]> => {
    const res = await fetch(`${API_BASE}/skills`);
    return handleResponse<Skill[]>(res);
  },

  createSkill: async (data: Partial<Skill>): Promise<Skill> => {
    const res = await fetch(`${API_BASE}/skills`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<Skill>(res);
  },

  updateSkill: async (id: string, data: Partial<Skill>): Promise<Skill> => {
    const res = await fetch(`${API_BASE}/skills/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<Skill>(res);
  },

  deleteSkill: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/skills/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    await handleResponse<{ success: boolean }>(res);
  },

  reorderSkills: async (items: { id: string; sortOrder: number }[]): Promise<void> => {
    const res = await fetch(`${API_BASE}/skills/reorder`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ items }),
    });
    await handleResponse<{ success: boolean }>(res);
  },

  // Experiences
  getExperiences: async (): Promise<Experience[]> => {
    const res = await fetch(`${API_BASE}/experiences`);
    return handleResponse<Experience[]>(res);
  },

  createExperience: async (data: Partial<Experience>): Promise<Experience> => {
    const res = await fetch(`${API_BASE}/experiences`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<Experience>(res);
  },

  updateExperience: async (id: string, data: Partial<Experience>): Promise<Experience> => {
    const res = await fetch(`${API_BASE}/experiences/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<Experience>(res);
  },

  deleteExperience: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/experiences/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    await handleResponse<{ success: boolean }>(res);
  },

  reorderExperiences: async (items: { id: string; sortOrder: number }[]): Promise<void> => {
    const res = await fetch(`${API_BASE}/experiences/reorder`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ items }),
    });
    await handleResponse<{ success: boolean }>(res);
  },

  // Education
  getEducation: async (): Promise<Education[]> => {
    const res = await fetch(`${API_BASE}/education`);
    return handleResponse<Education[]>(res);
  },

  createEducation: async (data: Partial<Education>): Promise<Education> => {
    const res = await fetch(`${API_BASE}/education`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<Education>(res);
  },

  updateEducation: async (id: string, data: Partial<Education>): Promise<Education> => {
    const res = await fetch(`${API_BASE}/education/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<Education>(res);
  },

  deleteEducation: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/education/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    await handleResponse<{ success: boolean }>(res);
  },

  reorderEducation: async (items: { id: string; sortOrder: number }[]): Promise<void> => {
    const res = await fetch(`${API_BASE}/education/reorder`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ items }),
    });
    await handleResponse<{ success: boolean }>(res);
  },

  // Projects
  getProjects: async (): Promise<Project[]> => {
    const res = await fetch(`${API_BASE}/projects`);
    return handleResponse<Project[]>(res);
  },

  getProjectBySlug: async (slug: string): Promise<Project> => {
    const res = await fetch(`${API_BASE}/projects/${slug}`);
    return handleResponse<Project>(res);
  },

  createProject: async (data: Partial<Project>): Promise<Project> => {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<Project>(res);
  },

  updateProject: async (id: string, data: Partial<Project>): Promise<Project> => {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<Project>(res);
  },

  duplicateProject: async (id: string): Promise<Project> => {
    const res = await fetch(`${API_BASE}/projects/${id}/duplicate`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    });
    return handleResponse<Project>(res);
  },

  deleteProject: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    await handleResponse<{ success: boolean }>(res);
  },

  reorderProjects: async (items: { id: string; sortOrder: number }[]): Promise<void> => {
    const res = await fetch(`${API_BASE}/projects/reorder`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ items }),
    });
    await handleResponse<{ success: boolean }>(res);
  },

  // Uploads
  getMediaList: async (): Promise<Media[]> => {
    const res = await fetch(`${API_BASE}/uploads`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<Media[]>(res);
  },

  getUploads: async (): Promise<Media[]> => {
    const res = await fetch(`${API_BASE}/uploads`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<Media[]>(res);
  },

  uploadFile: async (file: File): Promise<Media> => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE}/uploads`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
      body: formData,
    });
    return handleResponse<Media>(res);
  },

  deleteMedia: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/uploads/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    await handleResponse<{ success: boolean }>(res);
  },

  deleteUpload: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/uploads/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    await handleResponse<{ success: boolean }>(res);
  },

  getProjectById: async (id: string): Promise<Project> => {
    const res = await fetch(`${API_BASE}/projects/${id}`);
    return handleResponse<Project>(res);
  },

  // Contact
  sendMessage: async (data: { name: string; email: string; subject?: string; message: string }) => {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<{ success: boolean; message: string; id: string }>(res);
  },

  // Admin Messages
  getMessages: async (): Promise<ContactMessage[]> => {
    const res = await fetch(`${API_BASE}/messages`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<ContactMessage[]>(res);
  },

  updateMessageStatus: async (id: string, status: 'UNREAD' | 'READ' | 'ARCHIVED'): Promise<ContactMessage> => {
    const res = await fetch(`${API_BASE}/messages/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status }),
    });
    return handleResponse<ContactMessage>(res);
  },

  deleteMessage: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/messages/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    await handleResponse<{ success: boolean }>(res);
  },

  // Admin Dashboard
  getDashboardStats: async (): Promise<DashboardData> => {
    const res = await fetch(`${API_BASE}/admin/dashboard`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<DashboardData>(res);
  },
};
