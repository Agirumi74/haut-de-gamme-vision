import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { db } from '../database.js';

const router = express.Router();

// Get all services
router.get('/', (req, res) => {
  try {
    const services = db.getAllServices();
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get service by ID
router.get('/:id', (req, res) => {
  try {
    const service = db.getServiceById(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new service (admin only)
router.post('/', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { name, description, price, duration } = req.body;
    
    if (!name || !description || !price || !duration) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const serviceData = {
      name,
      description,
      price: parseFloat(price),
      duration: parseInt(duration),
      isActive: true
    };

    const newService = db.createService(serviceData);
    res.status(201).json(newService);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update service (admin only)
router.put('/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { name, description, price, duration, isActive } = req.body;
    
    const updateData: any = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (price) updateData.price = parseFloat(price);
    if (duration) updateData.duration = parseInt(duration);
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedService = db.updateService(req.params.id, updateData);
    if (!updatedService) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json(updatedService);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete service (admin only)
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const deleted = db.deleteService(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as serviceRoutes };