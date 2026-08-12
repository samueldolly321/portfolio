import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface StorageFile {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
}

export interface StorageService {
  uploadFile(file: Express.Multer.File): Promise<StorageFile>;
  deleteFile(filename: string): Promise<boolean>;
}

class LocalStorageService implements StorageService {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<StorageFile> {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeRandom = crypto.randomBytes(16).toString('hex');
    const filename = `${Date.now()}-${safeRandom}${ext}`;
    const filePath = path.join(this.uploadDir, filename);

    await fs.promises.writeFile(filePath, file.buffer);

    return {
      filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      url: `/uploads/${filename}`,
    };
  }

  async deleteFile(filename: string): Promise<boolean> {
    // Prevent path traversal
    const safeFilename = path.basename(filename);
    const filePath = path.join(this.uploadDir, safeFilename);

    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        return true;
      }
    } catch (err) {
      console.error('Error deleting file:', err);
    }
    return false;
  }
}

// Export singleton instance
export const storageService: StorageService = new LocalStorageService();
