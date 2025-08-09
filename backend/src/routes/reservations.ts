import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { Reservation } from '../types/index';

const router = express.Router();

// Mock reservations data
const mockReservations: Reservation[] = [
  {
    id: '1',
    date: new Date('2024-12-20'),
    time: '14:00',
    status: 'CONFIRMED',
    notes: 'Première séance',
    clientId: '1',
    serviceId: '1',
    formationId: undefined,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    date: new Date('2024-12-22'),
    time: '10:00',
    status: 'PENDING',
    notes: undefined,
    clientId: '2',
    serviceId: undefined,
    formationId: '1',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Get all reservations (admin only)
router.get('/', authenticateToken, requireAdmin, (req, res) => {
  res.json(mockReservations);
});

// Get reservation by ID (admin only)
router.get('/:id', authenticateToken, requireAdmin, (req, res) => {
  const reservation = mockReservations.find(r => r.id === req.params.id);
  if (!reservation) {
    return res.status(404).json({ error: 'Reservation not found' });
  }
  res.json(reservation);
});

// Create new reservation
router.post('/', (req, res) => {
  const { date, time, clientId, serviceId, formationId, notes } = req.body;
  
  if (!date || !time || !clientId || (!serviceId && !formationId)) {
    return res.status(400).json({ 
      error: 'Date, time, clientId, and either serviceId or formationId are required' 
    });
  }

  const newReservation: Reservation = {
    id: Date.now().toString(),
    date: new Date(date),
    time,
    status: 'PENDING',
    notes: notes || undefined,
    clientId,
    serviceId: serviceId || undefined,
    formationId: formationId || undefined,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  mockReservations.push(newReservation);
  res.status(201).json(newReservation);
});

// Update reservation (admin only)
router.put('/:id', authenticateToken, requireAdmin, (req, res) => {
  const index = mockReservations.findIndex(r => r.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Reservation not found' });
  }

  const { date, time, status, notes, clientId, serviceId, formationId } = req.body;
  const reservation = mockReservations[index];

  mockReservations[index] = {
    ...reservation,
    date: date ? new Date(date) : reservation.date,
    time: time || reservation.time,
    status: status || reservation.status,
    notes: notes !== undefined ? notes : reservation.notes,
    clientId: clientId || reservation.clientId,
    serviceId: serviceId !== undefined ? serviceId : reservation.serviceId,
    formationId: formationId !== undefined ? formationId : reservation.formationId,
    updatedAt: new Date()
  };

  res.json(mockReservations[index]);
});

// Delete reservation (admin only)
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  const index = mockReservations.findIndex(r => r.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Reservation not found' });
  }

  mockReservations.splice(index, 1);
  res.json({ message: 'Reservation deleted successfully' });
});

// Update reservation status (admin only)
router.patch('/:id/status', authenticateToken, requireAdmin, (req, res) => {
  const index = mockReservations.findIndex(r => r.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Reservation not found' });
  }

  const { status } = req.body;
  if (!status || !['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'].includes(status)) {
    return res.status(400).json({ error: 'Valid status is required' });
  }

  mockReservations[index].status = status;
  mockReservations[index].updatedAt = new Date();

  res.json(mockReservations[index]);
});

export { router as reservationRoutes };