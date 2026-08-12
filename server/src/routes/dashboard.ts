import { Router, Request, Response } from 'express';
import prisma from '../db.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// GET /api/admin/dashboard
router.get('/', authenticate, requireAdmin, async (_req: Request, res: Response) => {
  try {
    const [
      projectsCount,
      skillsCount,
      experiencesCount,
      educationCount,
      totalMessagesCount,
      unreadMessagesCount,
      recentProjects,
      recentMessages,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.skill.count(),
      prisma.experience.count(),
      prisma.education.count(),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { status: 'UNREAD' } }),
      prisma.project.findMany({
        take: 5,
        orderBy: { updatedAt: 'desc' },
        select: { id: true, title: true, category: true, isVisible: true, updatedAt: true },
      }),
      prisma.contactMessage.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return res.json({
      counts: {
        projects: projectsCount,
        skills: skillsCount,
        experiences: experiencesCount,
        education: educationCount,
        messages: totalMessagesCount,
        unreadMessages: unreadMessagesCount,
      },
      recentProjects,
      recentMessages,
      systemStatus: {
        database: 'OK',
        storage: 'OK',
        uptime: process.uptime(),
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return res.status(500).json({ error: 'Erreur lors du chargement des statistiques dashboard.' });
  }
});

export default router;
