import express from 'express';
import { body, param, validationResult } from 'express-validator';
import { Lesson } from '../models/Lesson.js';
import { Child } from '../models/Child.js';

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// GET /api/lessons - Get all lessons
router.get('/', async (req, res) => {
  try {
    const lessons = await Lesson.find({ isActive: true })
      .populate('participants', 'name avatar personality')
      .sort({ createdAt: -1 });
    
    res.json(lessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).json({ message: 'Error fetching lessons' });
  }
});

// GET /api/lessons/:id - Get lesson by ID
router.get('/:id', [
  param('id').isMongoId().withMessage('Invalid lesson ID')
], handleValidationErrors, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id)
      .populate('participants', 'name avatar personality');
    
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    res.json(lesson);
  } catch (error) {
    console.error('Error fetching lesson:', error);
    res.status(500).json({ message: 'Error fetching lesson' });
  }
});

// POST /api/lessons - Create new lesson
router.post('/', [
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title is required and must be less than 100 characters'),
  body('subject').trim().isLength({ min: 1 }).withMessage('Subject is required'),
  body('targetAge').isInt({ min: 5, max: 18 }).withMessage('Target age must be between 5 and 18'),
  body('description').trim().isLength({ min: 1, max: 500 }).withMessage('Description is required and must be less than 500 characters'),
  body('steps').isArray({ min: 1 }).withMessage('At least one step is required'),
  body('participants').optional().isArray().withMessage('Participants must be an array')
], handleValidationErrors, async (req, res) => {
  try {
    const { title, subject, targetAge, description, steps, participants = [] } = req.body;
    
    // Validate participants exist
    if (participants.length > 0) {
      const existingChildren = await Child.find({ _id: { $in: participants } });
      if (existingChildren.length !== participants.length) {
        return res.status(400).json({ message: 'Some participants do not exist' });
      }
    }
    
    const lesson = new Lesson({
      title,
      subject,
      targetAge,
      description,
      steps,
      participants
    });
    
    await lesson.save();
    await lesson.populate('participants', 'name avatar personality');
    
    res.status(201).json(lesson);
  } catch (error) {
    console.error('Error creating lesson:', error);
    res.status(500).json({ message: 'Error creating lesson' });
  }
});

// PUT /api/lessons/:id - Update lesson
router.put('/:id', [
  param('id').isMongoId().withMessage('Invalid lesson ID'),
  body('title').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Title must be less than 100 characters'),
  body('subject').optional().trim().isLength({ min: 1 }).withMessage('Subject cannot be empty'),
  body('targetAge').optional().isInt({ min: 5, max: 18 }).withMessage('Target age must be between 5 and 18'),
  body('description').optional().trim().isLength({ min: 1, max: 500 }).withMessage('Description must be less than 500 characters'),
  body('participants').optional().isArray().withMessage('Participants must be an array')
], handleValidationErrors, async (req, res) => {
  try {
    const { participants, ...updateData } = req.body;
    
    // Validate participants if provided
    if (participants && participants.length > 0) {
      const existingChildren = await Child.find({ _id: { $in: participants } });
      if (existingChildren.length !== participants.length) {
        return res.status(400).json({ message: 'Some participants do not exist' });
      }
      updateData.participants = participants;
    }
    
    const lesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('participants', 'name avatar personality');
    
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    res.json(lesson);
  } catch (error) {
    console.error('Error updating lesson:', error);
    res.status(500).json({ message: 'Error updating lesson' });
  }
});

// DELETE /api/lessons/:id - Soft delete lesson
router.delete('/:id', [
  param('id').isMongoId().withMessage('Invalid lesson ID')
], handleValidationErrors, async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    res.status(500).json({ message: 'Error deleting lesson' });
  }
});

export default router;