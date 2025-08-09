import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { Service } from '../types/index';

const router = express.Router();

// Mock services data
const mockServices: Service[] = [
  {
    id: '1',
    name: 'Maquillage Jour',
    description: 'Maquillage naturel pour tous les jours',
    price: 45,
    duration: 60,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Maquillage Soirée',
    description: 'Maquillage sophistiqué pour vos soirées',
    price: 65,
    duration: 90,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'Maquillage Mariée',
    description: 'Maquillage parfait pour votre jour J',
    price: 120,
    duration: 120,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    name: 'Consultation Beauté',
    description: 'Conseils personnalisés selon votre morphologie',
    price: 35,
    duration: 45,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Get all services
router.get('/', (req, res) => {
  res.json(mockServices.filter(s => s.isActive));
});

// Get service by ID
router.get('/:id', (req, res) => {
  const service = mockServices.find(s => s.id === req.params.id);
  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }
  res.json(service);
});

// Create new service (admin only)
router.post('/', authenticateToken, requireAdmin, (req, res) => {
  const { name, description, price, duration } = req.body;
  
  if (!name || !description || !price || !duration) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newService: Service = {
    id: Date.now().toString(),
    name,
    description,
    price: parseFloat(price),
    duration: parseInt(duration),
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  mockServices.push(newService);
  res.status(201).json(newService);
});

// Update service (admin only)
router.put('/:id', authenticateToken, requireAdmin, (req, res) => {
  const index = mockServices.findIndex(s => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Service not found' });
  }

  const { name, description, price, duration, isActive } = req.body;
  const service = mockServices[index];

  mockServices[index] = {
    ...service,
    name: name || service.name,
    description: description || service.description,
    price: price ? parseFloat(price) : service.price,
    duration: duration ? parseInt(duration) : service.duration,
    isActive: isActive !== undefined ? isActive : service.isActive,
    updatedAt: new Date()
  };

  res.json(mockServices[index]);
});

// Delete service (admin only)
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  const index = mockServices.findIndex(s => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Service not found' });
  }

  // Soft delete - mark as inactive
  mockServices[index].isActive = false;
  mockServices[index].updatedAt = new Date();

  res.json({ message: 'Service deleted successfully' });
});

export { router as serviceRoutes };