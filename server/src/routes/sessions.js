import express from 'express';
import { body, param, validationResult } from 'express-validator';
import { ChatSession } from '../models/ChatSession.js';
import { Lesson } from '../models/Lesson.js';
import { Child } from '../models/Child.js';

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// GET /api/sessions - Get all sessions
router.get('/', async (req, res) => {
  try {
    const sessions = await ChatSession.find()
      .populate('lessonId', 'title subject')
      .populate('participants', 'name avatar')
      .sort({ startTime: -1 });
    
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ message: 'Error fetching sessions' });
  }
});

// GET /api/sessions/:id - Get session by ID
router.get('/:id', [
  param('id').isMongoId().withMessage('Invalid session ID')
], handleValidationErrors, async (req, res) => {
  try {
    const session = await ChatSession.findById(req.params.id)
      .populate('lessonId', 'title subject steps')
      .populate('participants', 'name avatar personality');
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    res.json(session);
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ message: 'Error fetching session' });
  }
});

// POST /api/sessions - Create new session
router.post('/', [
  body('lessonId').isMongoId().withMessage('Valid lesson ID is required'),
  body('participants').optional().isArray().withMessage('Participants must be an array')
], handleValidationErrors, async (req, res) => {
  try {
    const { lessonId, participants = [] } = req.body;
    
    // Validate lesson exists
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    // Validate participants exist
    if (participants.length > 0) {
      const existingChildren = await Child.find({ _id: { $in: participants } });
      if (existingChildren.length !== participants.length) {
        return res.status(400).json({ message: 'Some participants do not exist' });
      }
    }
    
    const session = new ChatSession({
      lessonId,
      participants,
      messages: [],
      currentStep: 0,
      currentSpeaker: null,
      isActive: true,
      startTime: new Date()
    });
    
    await session.save();
    await session.populate('lessonId', 'title subject steps');
    await session.populate('participants', 'name avatar personality');
    
    res.status(201).json(session);
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ message: 'Error creating session' });
  }
});

// PUT /api/sessions/:id - Update session
router.put('/:id', [
  param('id').isMongoId().withMessage('Invalid session ID'),
  body('currentStep').optional().isInt({ min: 0 }).withMessage('Current step must be a non-negative integer'),
  body('currentSpeaker').optional().isString().withMessage('Current speaker must be a string'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
], handleValidationErrors, async (req, res) => {
  try {
    const updateData = req.body;
    
    // If ending the session, set endTime
    if (updateData.isActive === false) {
      updateData.endTime = new Date();
    }
    
    const session = await ChatSession.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('lessonId', 'title subject steps')
      .populate('participants', 'name avatar personality');
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    res.json(session);
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({ message: 'Error updating session' });
  }
});

// POST /api/sessions/:id/messages - Add message to session
router.post('/:id/messages', [
  param('id').isMongoId().withMessage('Invalid session ID'),
  body('senderId').isString().withMessage('Sender ID is required'),
  body('senderName').trim().isLength({ min: 1 }).withMessage('Sender name is required'),
  body('senderType').isIn(['child', 'ai']).withMessage('Sender type must be child or ai'),
  body('content').trim().isLength({ min: 1, max: 1000 }).withMessage('Content is required and must be less than 1000 characters')
], handleValidationErrors, async (req, res) => {
  try {
    const { senderId, senderName, senderType, content, reactions = [] } = req.body;
    
    const message = {
      id: `msg-${Date.now()}-${Math.random()}`,
      senderId,
      senderName,
      senderType,
      content,
      timestamp: new Date(),
      reactions
    };
    
    const session = await ChatSession.findByIdAndUpdate(
      req.params.id,
      { $push: { messages: message } },
      { new: true }
    )
      .populate('lessonId', 'title subject steps')
      .populate('participants', 'name avatar personality');
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    res.json(session);
  } catch (error) {
    console.error('Error adding message:', error);
    res.status(500).json({ message: 'Error adding message' });
  }
});

// DELETE /api/sessions/:id - Delete session
router.delete('/:id', [
  param('id').isMongoId().withMessage('Invalid session ID')
], handleValidationErrors, async (req, res) => {
  try {
    const session = await ChatSession.findByIdAndDelete(req.params.id);
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ message: 'Error deleting session' });
  }
});

export default router;