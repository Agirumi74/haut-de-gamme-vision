import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { db } from '../database';

const router = express.Router();

// Get all clients (admin only)
router.get('/', authenticateToken, requireAdmin, (req, res) => {
  try {
    const clients = db.getAllClients();
    res.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get client by ID (admin only)
router.get('/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const client = db.getClientById(req.params.id);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json(client);
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new client
router.post('/', (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;
    
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ error: 'First name, last name, and email are required' });
    }

    const clientData = {
      firstName,
      lastName,
      email,
      phone: phone || undefined
    };

    const newClient = db.createClient(clientData);
    res.status(201).json(newClient);
  } catch (error: any) {
    if (error.message.includes('already exists')) {
      return res.status(400).json({ error: error.message });
    }
    console.error('Error creating client:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update client (admin only)
router.put('/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;
    
    const updateData: any = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;

    const updatedClient = db.updateClient(req.params.id, updateData);
    if (!updatedClient) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json(updatedClient);
  } catch (error: any) {
    if (error.message.includes('already exists')) {
      return res.status(400).json({ error: error.message });
    }
    console.error('Error updating client:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete client (admin only)
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const deleted = db.deleteClient(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as clientRoutes };