import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { db } from '../database.js';

const router = express.Router();

// Get all formations
router.get('/', (req, res) => {
  try {
    const formations = db.getAllFormations();
    res.json(formations);
  } catch (error) {
    console.error('Error fetching formations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get formation by ID
router.get('/:id', (req, res) => {
  try {
    const formation = db.getFormationById(req.params.id);
    if (!formation) {
      return res.status(404).json({ error: 'Formation not found' });
    }
    res.json(formation);
  } catch (error) {
    console.error('Error fetching formation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new formation (admin only)
router.post('/', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { title, description, duration, level, price, maxStudents } = req.body;
    
    if (!title || !description || !duration || !level || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const formationData = {
      title,
      description,
      duration: parseInt(duration),
      level,
      price: parseFloat(price),
      maxStudents: maxStudents ? parseInt(maxStudents) : 10,
      isActive: true
    };

    const newFormation = db.createFormation(formationData);
    res.status(201).json(newFormation);
  } catch (error) {
    console.error('Error creating formation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update formation (admin only)
router.put('/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { title, description, duration, level, price, maxStudents, isActive } = req.body;
    
    const updateData: any = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (duration) updateData.duration = parseInt(duration);
    if (level) updateData.level = level;
    if (price) updateData.price = parseFloat(price);
    if (maxStudents) updateData.maxStudents = parseInt(maxStudents);
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedFormation = db.updateFormation(req.params.id, updateData);
    if (!updatedFormation) {
      return res.status(404).json({ error: 'Formation not found' });
    }

    res.json(updatedFormation);
  } catch (error) {
    console.error('Error updating formation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete formation (admin only)
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const deleted = db.deleteFormation(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Formation not found' });
    }

    res.json({ message: 'Formation deleted successfully' });
  } catch (error) {
    console.error('Error deleting formation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as formationRoutes };