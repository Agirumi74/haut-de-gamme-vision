import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { Formation } from '../types/index';

const router = express.Router();

// Mock formations data
const mockFormations: Formation[] = [
  {
    id: '1',
    title: 'Formation Débutante',
    description: 'Apprenez les bases du maquillage pour un usage quotidien',
    duration: 4,
    level: 'débutant',
    price: 149,
    maxStudents: 8,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    title: 'Formation Professionnelle',
    description: 'Maîtrisez les techniques avancées pour devenir maquilleuse professionnelle',
    duration: 16,
    level: 'avancé',
    price: 599,
    maxStudents: 6,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    title: 'Formation Mariée',
    description: 'Spécialisez-vous dans le maquillage mariée',
    duration: 8,
    level: 'intermédiaire',
    price: 299,
    maxStudents: 10,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Get all formations
router.get('/', (req, res) => {
  res.json(mockFormations.filter(f => f.isActive));
});

// Get formation by ID
router.get('/:id', (req, res) => {
  const formation = mockFormations.find(f => f.id === req.params.id);
  if (!formation) {
    return res.status(404).json({ error: 'Formation not found' });
  }
  res.json(formation);
});

// Create new formation (admin only)
router.post('/', authenticateToken, requireAdmin, (req, res) => {
  const { title, description, duration, level, price, maxStudents } = req.body;
  
  if (!title || !description || !duration || !level || !price) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newFormation: Formation = {
    id: Date.now().toString(),
    title,
    description,
    duration: parseInt(duration),
    level,
    price: parseFloat(price),
    maxStudents: maxStudents ? parseInt(maxStudents) : 10,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  mockFormations.push(newFormation);
  res.status(201).json(newFormation);
});

// Update formation (admin only)
router.put('/:id', authenticateToken, requireAdmin, (req, res) => {
  const index = mockFormations.findIndex(f => f.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Formation not found' });
  }

  const { title, description, duration, level, price, maxStudents, isActive } = req.body;
  const formation = mockFormations[index];

  mockFormations[index] = {
    ...formation,
    title: title || formation.title,
    description: description || formation.description,
    duration: duration ? parseInt(duration) : formation.duration,
    level: level || formation.level,
    price: price ? parseFloat(price) : formation.price,
    maxStudents: maxStudents ? parseInt(maxStudents) : formation.maxStudents,
    isActive: isActive !== undefined ? isActive : formation.isActive,
    updatedAt: new Date()
  };

  res.json(mockFormations[index]);
});

// Delete formation (admin only)
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  const index = mockFormations.findIndex(f => f.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Formation not found' });
  }

  // Soft delete - mark as inactive
  mockFormations[index].isActive = false;
  mockFormations[index].updatedAt = new Date();

  res.json({ message: 'Formation deleted successfully' });
});

export { router as formationRoutes };