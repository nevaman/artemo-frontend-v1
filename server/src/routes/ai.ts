import express from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { AIService } from '../services/aiService';

const router = express.Router();
const prisma = new PrismaClient();
const aiService = new AIService();

// Apply authentication to all routes
router.use(authenticate);

// Generate AI response
router.post('/generate', [
  body('toolId').isUUID(),
  body('messages').isArray(),
  body('knowledgeBase').optional()
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { toolId, messages, knowledgeBase } = req.body;

    // Get tool configuration
    const tool = await prisma.tool.findUnique({
      where: { id: toolId },
      include: {
        questions: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!tool || !tool.active) {
      return res.status(404).json({ error: 'Tool not found or inactive' });
    }

    // Generate AI response
    const response = await aiService.generateResponse(
      tool,
      messages,
      knowledgeBase
    );

    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('AI generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate AI response',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get AI models status
router.get('/models/status', async (req, res) => {
  try {
    const status = await aiService.getModelsStatus();
    
    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    console.error('Get models status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;