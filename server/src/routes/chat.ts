import express from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Apply authentication to all routes
router.use(authenticate);

// Get user's chat sessions
router.get('/sessions', async (req: AuthRequest, res) => {
  try {
    const { projectId } = req.query;
    
    const where: any = { userId: req.user!.id };
    if (projectId) {
      where.projectId = projectId as string;
    }

    const sessions = await prisma.chatSession.findMany({
      where,
      include: {
        tool: {
          select: {
            id: true,
            title: true,
            category: {
              select: {
                name: true
              }
            }
          }
        },
        project: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    // Transform to match frontend expectations
    const transformedSessions = sessions.map(session => ({
      id: session.id,
      toolId: session.toolId,
      toolTitle: session.toolTitle,
      messages: session.messages,
      timestamp: session.createdAt.getTime(),
      projectId: session.projectId,
      project: session.project,
      tool: session.tool
    }));

    res.json({
      success: true,
      data: transformedSessions
    });
  } catch (error) {
    console.error('Get chat sessions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create chat session
router.post('/sessions', [
  body('toolId').isUUID(),
  body('toolTitle').trim().isLength({ min: 1 }),
  body('messages').isArray(),
  body('projectId').isUUID().optional()
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { toolId, toolTitle, messages, projectId } = req.body;

    // Verify tool exists
    const tool = await prisma.tool.findUnique({
      where: { id: toolId }
    });

    if (!tool) {
      return res.status(404).json({ error: 'Tool not found' });
    }

    // Verify project ownership if provided
    if (projectId) {
      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          userId: req.user!.id
        }
      });

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
    }

    const session = await prisma.chatSession.create({
      data: {
        userId: req.user!.id,
        toolId,
        toolTitle,
        messages,
        projectId
      }
    });

    res.status(201).json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Create chat session error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update chat session
router.put('/sessions/:id', [
  body('toolTitle').trim().isLength({ min: 1 }).optional(),
  body('messages').isArray().optional(),
  body('projectId').isUUID().optional()
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Verify ownership
    const existingSession = await prisma.chatSession.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id
      }
    });

    if (!existingSession) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    const session = await prisma.chatSession.update({
      where: { id: req.params.id },
      data: req.body
    });

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Update chat session error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete chat session
router.delete('/sessions/:id', async (req: AuthRequest, res) => {
  try {
    // Verify ownership
    const existingSession = await prisma.chatSession.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id
      }
    });

    if (!existingSession) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    await prisma.chatSession.delete({
      where: { id: req.params.id }
    });

    res.json({
      success: true,
      message: 'Chat session deleted successfully'
    });
  } catch (error) {
    console.error('Delete chat session error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;