import express from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';
import bcrypt from 'bcryptjs';

const router = express.Router();
const prisma = new PrismaClient();

// Apply authentication and admin requirement to all routes
router.use(authenticate);
router.use(requireAdmin);

// CATEGORIES MANAGEMENT
// Get all categories (including inactive)
router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        _count: {
          select: {
            tools: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get admin categories error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create category
router.post('/categories', [
  body('name').trim().isLength({ min: 1 }),
  body('active').isBoolean().optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, active = true } = req.body;

    // Get next display order
    const lastCategory = await prisma.category.findFirst({
      orderBy: { displayOrder: 'desc' }
    });
    const displayOrder = (lastCategory?.displayOrder || 0) + 1;

    const category = await prisma.category.create({
      data: {
        name,
        displayOrder,
        active
      }
    });

    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update category
router.put('/categories/:id', [
  body('name').trim().isLength({ min: 1 }).optional(),
  body('active').isBoolean().optional(),
  body('displayOrder').isInt({ min: 1 }).optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const category = await prisma.category.update({
      where: { id: req.params.id },
      data: req.body
    });

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete category
router.delete('/categories/:id', async (req, res) => {
  try {
    await prisma.category.delete({
      where: { id: req.params.id }
    });

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// TOOLS MANAGEMENT
// Get all tools (including inactive)
router.get('/tools', async (req, res) => {
  try {
    const tools = await prisma.tool.findMany({
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

    res.json({
      success: true,
      data: tools
    });
  } catch (error) {
    console.error('Get admin tools error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create tool
router.post('/tools', [
  body('title').trim().isLength({ min: 1 }),
  body('description').trim().isLength({ min: 1 }),
  body('categoryId').isUUID(),
  body('primaryModel').isIn(['ChatGPT', 'Claude', 'Grok', 'Gemini']),
  body('fallbackModels').isArray(),
  body('promptInstructions').trim().isLength({ min: 1 }),
  body('questions').isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      description,
      categoryId,
      active = true,
      featured = false,
      primaryModel,
      fallbackModels,
      promptInstructions,
      questions
    } = req.body;

    const tool = await prisma.tool.create({
      data: {
        title,
        description,
        categoryId,
        active,
        featured,
        primaryModel,
        fallbackModels,
        promptInstructions,
        questions: {
          create: questions.map((q: any, index: number) => ({
            label: q.label,
            type: q.type,
            placeholder: q.placeholder,
            required: q.required,
            order: q.order || index + 1,
            options: q.options || []
          }))
        }
      },
      include: {
        category: true,
        questions: {
          orderBy: { order: 'asc' }
        }
      }
    });

    res.status(201).json({
      success: true,
      data: tool
    });
  } catch (error) {
    console.error('Create tool error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update tool
router.put('/tools/:id', async (req, res) => {
  try {
    const { questions, ...toolData } = req.body;

    // Update tool
    const tool = await prisma.tool.update({
      where: { id: req.params.id },
      data: toolData
    });

    // Update questions if provided
    if (questions) {
      // Delete existing questions
      await prisma.toolQuestion.deleteMany({
        where: { toolId: req.params.id }
      });

      // Create new questions
      await prisma.toolQuestion.createMany({
        data: questions.map((q: any, index: number) => ({
          toolId: req.params.id,
          label: q.label,
          type: q.type,
          placeholder: q.placeholder,
          required: q.required,
          order: q.order || index + 1,
          options: q.options || []
        }))
      });
    }

    // Fetch updated tool with questions
    const updatedTool = await prisma.tool.findUnique({
      where: { id: req.params.id },
      include: {
        category: true,
        questions: {
          orderBy: { order: 'asc' }
        }
      }
    });

    res.json({
      success: true,
      data: updatedTool
    });
  } catch (error) {
    console.error('Update tool error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete tool
router.delete('/tools/:id', async (req, res) => {
  try {
    await prisma.tool.delete({
      where: { id: req.params.id }
    });

    res.json({
      success: true,
      message: 'Tool deleted successfully'
    });
  } catch (error) {
    console.error('Delete tool error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// USERS MANAGEMENT
// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        active: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            projects: true,
            chatSessions: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create/invite user
router.post('/users', [
  body('email').isEmail().normalizeEmail(),
  body('name').trim().isLength({ min: 2 }),
  body('role').isIn(['USER', 'ADMIN']).optional(),
  body('active').isBoolean().optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, name, role = 'USER', active = true } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(tempPassword, salt);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role,
        active
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        active: true,
        createdAt: true
      }
    });

    // TODO: Send email with temporary password
    console.log(`Temporary password for ${email}: ${tempPassword}`);

    res.status(201).json({
      success: true,
      data: user,
      tempPassword // Remove this in production
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user
router.put('/users/:id', [
  body('name').trim().isLength({ min: 2 }).optional(),
  body('role').isIn(['USER', 'ADMIN']).optional(),
  body('active').isBoolean().optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: req.body,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        active: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    // Don't allow deleting yourself
    if (req.params.id === (req as AuthRequest).user!.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    await prisma.user.delete({
      where: { id: req.params.id }
    });

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DASHBOARD STATS
router.get('/stats', async (req, res) => {
  try {
    const [
      totalTools,
      activeUsers,
      totalCategories,
      todayUsage
    ] = await Promise.all([
      prisma.tool.count(),
      prisma.user.count({ where: { active: true } }),
      prisma.category.count(),
      prisma.chatSession.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      })
    ]);

    res.json({
      success: true,
      data: {
        totalTools,
        activeUsers,
        totalCategories,
        todayUsage
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;