import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all active tools
router.get('/', async (req, res) => {
  try {
    const { category, featured, search } = req.query;
    
    const where: any = { active: true };
    
    if (category) {
      where.category = { name: category };
    }
    
    if (featured === 'true') {
      where.featured = true;
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const tools = await prisma.tool.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        },
        questions: {
          orderBy: { order: 'asc' }
        },
        _count: {
          select: {
            chatSessions: true
          }
        }
      },
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    // Transform to match frontend expectations
    const transformedTools = tools.map(tool => ({
      id: tool.id,
      title: tool.title,
      category: tool.category.name.toUpperCase().replace(/\s+/g, '_'),
      description: tool.description,
      active: tool.active,
      featured: tool.featured,
      primaryModel: tool.primaryModel,
      fallbackModels: tool.fallbackModels,
      promptInstructions: tool.promptInstructions,
      questions: tool.questions.map(q => ({
        id: q.id,
        label: q.label,
        type: q.type,
        placeholder: q.placeholder,
        required: q.required,
        order: q.order,
        options: q.options
      })),
      knowledgeBaseFile: undefined, // Will be populated when files are uploaded
      usageCount: tool._count.chatSessions
    }));

    res.json({
      success: true,
      data: transformedTools
    });
  } catch (error) {
    console.error('Get tools error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get tool by ID
router.get('/:id', async (req, res) => {
  try {
    const tool = await prisma.tool.findUnique({
      where: { id: req.params.id },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        },
        questions: {
          orderBy: { order: 'asc' }
        },
        knowledgeFiles: {
          select: {
            id: true,
            filename: true,
            fileSize: true,
            mimeType: true,
            createdAt: true
          }
        }
      }
    });

    if (!tool || !tool.active) {
      return res.status(404).json({ error: 'Tool not found' });
    }

    // Transform to match frontend expectations
    const transformedTool = {
      id: tool.id,
      title: tool.title,
      category: tool.category.name.toUpperCase().replace(/\s+/g, '_'),
      description: tool.description,
      active: tool.active,
      featured: tool.featured,
      primaryModel: tool.primaryModel,
      fallbackModels: tool.fallbackModels,
      promptInstructions: tool.promptInstructions,
      questions: tool.questions.map(q => ({
        id: q.id,
        label: q.label,
        type: q.type,
        placeholder: q.placeholder,
        required: q.required,
        order: q.order,
        options: q.options
      })),
      knowledgeFiles: tool.knowledgeFiles
    };

    res.json({
      success: true,
      data: transformedTool
    });
  } catch (error) {
    console.error('Get tool error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;