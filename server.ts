import express from 'express';
import path from 'path';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';

import authRoutes from './server/src/routes/auth.js';
import profileRoutes from './server/src/routes/profile.js';
import heroRoutes from './server/src/routes/hero.js';
import aboutRoutes from './server/src/routes/about.js';
import statisticsRoutes from './server/src/routes/statistics.js';
import skillsRoutes from './server/src/routes/skills.js';
import experiencesRoutes from './server/src/routes/experiences.js';
import educationRoutes from './server/src/routes/education.js';
import projectsRoutes from './server/src/routes/projects.js';
import uploadsRoutes from './server/src/routes/uploads.js';
import contactRoutes from './server/src/routes/contact.js';
import messagesRoutes from './server/src/routes/messages.js';
import dashboardRoutes from './server/src/routes/dashboard.js';
import testimonialsRoutes from './server/src/routes/testimonials.js';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Security & Middleware
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Static uploads directory
  const uploadsPath = path.join(process.cwd(), 'uploads');
  app.use('/uploads', express.static(uploadsPath));

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Mount API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/profile', profileRoutes);
  app.use('/api/hero', heroRoutes);
  app.use('/api/about', aboutRoutes);
  app.use('/api/statistics', statisticsRoutes);
  app.use('/api/skills', skillsRoutes);
  app.use('/api/experiences', experiencesRoutes);
  app.use('/api/education', educationRoutes);
  app.use('/api/projects', projectsRoutes);
  app.use('/api/uploads', uploadsRoutes);
  app.use('/api/contact', contactRoutes);
  app.use('/api/messages', messagesRoutes);
  app.use('/api/admin/dashboard', dashboardRoutes);
  app.use('/api/testimonials', testimonialsRoutes);

  // Vite middleware in development mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
