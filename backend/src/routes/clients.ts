import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { Client } from '../types/index';

const router = express.Router();

// Mock clients data
const mockClients: Client[] = [
  {
    id: '1',
    firstName: 'Marie',
    lastName: 'Dupont',
    email: 'marie.dupont@email.com',
    phone: '06 12 34 56 78',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Martin',
    email: 'sarah.martin@email.com',
    phone: '06 98 76 54 32',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Get all clients (admin only)
router.get('/', authenticateToken, requireAdmin, (req, res) => {
  res.json(mockClients);
});

// Get client by ID (admin only)
router.get('/:id', authenticateToken, requireAdmin, (req, res) => {
  const client = mockClients.find(c => c.id === req.params.id);
  if (!client) {
    return res.status(404).json({ error: 'Client not found' });
  }
  res.json(client);
});

// Create new client
router.post('/', (req, res) => {
  const { firstName, lastName, email, phone } = req.body;
  
  if (!firstName || !lastName || !email) {
    return res.status(400).json({ error: 'First name, last name, and email are required' });
  }

  // Check if email already exists
  const existingClient = mockClients.find(c => c.email === email);
  if (existingClient) {
    return res.status(400).json({ error: 'Client with this email already exists' });
  }

  const newClient: Client = {
    id: Date.now().toString(),
    firstName,
    lastName,
    email,
    phone: phone || undefined,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  mockClients.push(newClient);
  res.status(201).json(newClient);
});

// Update client (admin only)
router.put('/:id', authenticateToken, requireAdmin, (req, res) => {
  const index = mockClients.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Client not found' });
  }

  const { firstName, lastName, email, phone } = req.body;
  const client = mockClients[index];

  // Check if email is being changed and if it already exists
  if (email && email !== client.email) {
    const existingClient = mockClients.find(c => c.email === email && c.id !== req.params.id);
    if (existingClient) {
      return res.status(400).json({ error: 'Client with this email already exists' });
    }
  }

  mockClients[index] = {
    ...client,
    firstName: firstName || client.firstName,
    lastName: lastName || client.lastName,
    email: email || client.email,
    phone: phone !== undefined ? phone : client.phone,
    updatedAt: new Date()
  };

  res.json(mockClients[index]);
});

// Delete client (admin only)
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  const index = mockClients.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Client not found' });
  }

  mockClients.splice(index, 1);
  res.json({ message: 'Client deleted successfully' });
});

export { router as clientRoutes };