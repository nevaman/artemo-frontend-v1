import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { FileProcessor } from '../services/fileProcessor';

const router = express.Router();
const prisma = new PrismaClient();
const fileProcessor = new FileProcessor();

// Apply authentication to all routes
router.use(authenticate);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760') // 10MB default
  },
  fileFilter: (req, file, cb) => {
    // Allow specific file types
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain',
      'text/markdown'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOCX, DOC, TXT, and MD files are allowed.'));
    }
  }
});

// Upload file
router.post('/upload', upload.single('file'), async (req: AuthRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { toolId } = req.body;

    // Process file content
    const content = await fileProcessor.extractText(req.file.path, req.file.mimetype);

    // Save file record to database
    const knowledgeFile = await prisma.knowledgeFile.create({
      data: {
        toolId: toolId || null,
        filename: req.file.originalname,
        filePath: req.file.path,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        content
      }
    });

    res.json({
      success: true,
      data: {
        id: knowledgeFile.id,
        filename: knowledgeFile.filename,
        fileSize: knowledgeFile.fileSize,
        mimeType: knowledgeFile.mimeType,
        content: content.substring(0, 500) + (content.length > 500 ? '...' : '') // Preview
      }
    });
  } catch (error) {
    console.error('File upload error:', error);
    
    // Clean up file if database save failed
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      error: 'File upload failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get file
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const file = await prisma.knowledgeFile.findUnique({
      where: { id: req.params.id }
    });

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Check if file exists on disk
    if (!fs.existsSync(file.filePath)) {
      return res.status(404).json({ error: 'File not found on disk' });
    }

    res.json({
      success: true,
      data: {
        id: file.id,
        filename: file.filename,
        fileSize: file.fileSize,
        mimeType: file.mimeType,
        content: file.content,
        createdAt: file.createdAt
      }
    });
  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Download file
router.get('/:id/download', async (req: AuthRequest, res) => {
  try {
    const file = await prisma.knowledgeFile.findUnique({
      where: { id: req.params.id }
    });

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Check if file exists on disk
    if (!fs.existsSync(file.filePath)) {
      return res.status(404).json({ error: 'File not found on disk' });
    }

    res.download(file.filePath, file.filename);
  } catch (error) {
    console.error('Download file error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete file
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const file = await prisma.knowledgeFile.findUnique({
      where: { id: req.params.id }
    });

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Delete from database
    await prisma.knowledgeFile.delete({
      where: { id: req.params.id }
    });

    // Delete from disk
    if (fs.existsSync(file.filePath)) {
      fs.unlinkSync(file.filePath);
    }

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;