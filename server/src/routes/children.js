import express from 'express';
import { body, param, validationResult } from 'express-validator';
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

// GET /api/children - Get all children
router.get('/', async (req, res) => {
  try {
    const children = await Child.find().sort({ name: 1 });
    res.json(children);
  } catch (error) {
    console.error('Error fetching children:', error);
    res.status(500).json({ message: 'Error fetching children' });
  }
});

// GET /api/children/:id - Get child by ID
router.get('/:id', [
  param('id').isMongoId().withMessage('Invalid child ID')
], handleValidationErrors, async (req, res) => {
  try {
    const child = await Child.findById(req.params.id);
    
    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }
    
    res.json(child);
  } catch (error) {
    console.error('Error fetching child:', error);
    res.status(500).json({ message: 'Error fetching child' });
  }
});

// POST /api/children - Create new child
router.post('/', [
  body('name').trim().isLength({ min: 1, max: 50 }).withMessage('Name is required and must be less than 50 characters'),
  body('personality').trim().isLength({ min: 1, max: 200 }).withMessage('Personality is required and must be less than 200 characters'),
  body('age').optional().isInt({ min: 5, max: 18 }).withMessage('Age must be between 5 and 18'),
  body('avatar').optional().isURL().withMessage('Avatar must be a valid URL'),
  body('preferences').optional().isArray().withMessage('Preferences must be an array')
], handleValidationErrors, async (req, res) => {
  try {
    const child = new Child(req.body);
    await child.save();
    res.status(201).json(child);
  } catch (error) {
    console.error('Error creating child:', error);
    res.status(500).json({ message: 'Error creating child' });
  }
});

// PUT /api/children/:id - Update child
router.put('/:id', [
  param('id').isMongoId().withMessage('Invalid child ID'),
  body('name').optional().trim().isLength({ min: 1, max: 50 }).withMessage('Name must be less than 50 characters'),
  body('personality').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Personality must be less than 200 characters'),
  body('age').optional().isInt({ min: 5, max: 18 }).withMessage('Age must be between 5 and 18'),
  body('avatar').optional().isURL().withMessage('Avatar must be a valid URL'),
  body('preferences').optional().isArray().withMessage('Preferences must be an array')
], handleValidationErrors, async (req, res) => {
  try {
    const child = await Child.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }
    
    res.json(child);
  } catch (error) {
    console.error('Error updating child:', error);
    res.status(500).json({ message: 'Error updating child' });
  }
});

// DELETE /api/children/:id - Delete child
router.delete('/:id', [
  param('id').isMongoId().withMessage('Invalid child ID')
], handleValidationErrors, async (req, res) => {
  try {
    const child = await Child.findByIdAndDelete(req.params.id);
    
    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }
    
    res.json({ message: 'Child deleted successfully' });
  } catch (error) {
    console.error('Error deleting child:', error);
    res.status(500).json({ message: 'Error deleting child' });
  }
});

export default router;