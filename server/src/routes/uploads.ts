import { Router, Request, Response } from 'express';
import multer from 'multer';
import prisma from '../db.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { storageService } from '../services/storage.js';

const router = Router();

// Configure multer memory storage for validation before saving
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/svg+xml',
      'application/pdf',
    ];

    if (allowedMimeTypes.includes(file.mimetype.toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Format de fichier non supporté. Formats acceptés : JPG, JPEG, PNG, WEBP, SVG, PDF.'));
    }
  },
});

// GET /api/uploads
router.get('/', authenticate, requireAdmin, async (_req: Request, res: Response) => {
  try {
    const media = await prisma.media.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return res.json(media);
  } catch (error) {
    console.error('Error fetching media list:', error);
    return res.status(500).json({ error: 'Erreur lors de la récupération de la médiathèque.' });
  }
});

// POST /api/uploads
router.post(
  '/',
  authenticate,
  requireAdmin,
  (req, res, next) => {
    upload.single('file')(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'Fichier trop volumineux. La taille maximale est de 5 Mo.' });
        }
        return res.status(400).json({ error: err.message });
      } else if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Aucun fichier fourni.' });
      }

      // Upload file using abstraction
      const fileResult = await storageService.uploadFile(req.file);

      // Store record in database
      const mediaRecord = await prisma.media.create({
        data: {
          filename: fileResult.filename,
          originalName: fileResult.originalName,
          mimeType: fileResult.mimeType,
          size: fileResult.size,
          url: fileResult.url,
        },
      });

      return res.status(201).json(mediaRecord);
    } catch (error) {
      console.error('Error uploading file:', error);
      return res.status(500).json({ error: 'Erreur serveur lors de l\'upload du fichier.' });
    }
  }
);

// DELETE /api/uploads/:id
router.delete('/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) {
      return res.status(404).json({ error: 'Média introuvable.' });
    }

    // Delete physical file
    await storageService.deleteFile(media.filename);

    // Delete record from database
    await prisma.media.delete({ where: { id } });

    return res.json({ success: true, message: 'Fichier supprimé avec succès.' });
  } catch (error) {
    console.error('Error deleting media:', error);
    return res.status(500).json({ error: 'Erreur lors de la suppression du média.' });
  }
});

export default router;
