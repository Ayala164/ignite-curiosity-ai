import express from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// POST /api/auth/login - Simple login (for demo purposes)
router.post('/login', [
  body('username').trim().isLength({ min: 1 }).withMessage('Username is required'),
  body('password').isLength({ min: 1 }).withMessage('Password is required')
], handleValidationErrors, async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Simple demo authentication - replace with real authentication
    if (username === 'teacher' && password === 'demo123') {
      res.json({
        success: true,
        user: {
          id: 'teacher-1',
          username: 'teacher',
          role: 'teacher'
        },
        token: 'demo-token-123'
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Error during login' });
  }
});

// POST /api/auth/logout - Logout
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

export default router;