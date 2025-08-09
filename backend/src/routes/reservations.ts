import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { db } from '../database';

const router = express.Router();

// Get all reservations (admin only)
router.get('/', authenticateToken, requireAdmin, (req, res) => {
  try {
    const reservations = db.getAllReservations();
    res.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get reservation by ID (admin only)
router.get('/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const reservation = db.getReservationById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.json(reservation);
  } catch (error) {
    console.error('Error fetching reservation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new reservation
router.post('/', (req, res) => {
  try {
    const { date, time, clientId, serviceId, formationId, notes } = req.body;
    
    if (!date || !time || !clientId || (!serviceId && !formationId)) {
      return res.status(400).json({ 
        error: 'Date, time, clientId, and either serviceId or formationId are required' 
      });
    }

    const reservationData = {
      date: new Date(date),
      time,
      status: 'PENDING' as const,
      clientId,
      serviceId: serviceId || undefined,
      formationId: formationId || undefined,
      notes: notes || undefined
    };

    const newReservation = db.createReservation(reservationData);
    res.status(201).json(newReservation);
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update reservation (admin only)
router.put('/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { date, time, status, notes, clientId, serviceId, formationId } = req.body;
    
    const updateData: any = {};
    if (date) updateData.date = new Date(date);
    if (time) updateData.time = time;
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (clientId) updateData.clientId = clientId;
    if (serviceId !== undefined) updateData.serviceId = serviceId;
    if (formationId !== undefined) updateData.formationId = formationId;

    const updatedReservation = db.updateReservation(req.params.id, updateData);
    if (!updatedReservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    res.json(updatedReservation);
  } catch (error) {
    console.error('Error updating reservation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete reservation (admin only)
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const deleted = db.deleteReservation(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    res.json({ message: 'Reservation deleted successfully' });
  } catch (error) {
    console.error('Error deleting reservation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update reservation status (admin only)
router.patch('/:id/status', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { status } = req.body;
    if (!status || !['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'].includes(status)) {
      return res.status(400).json({ error: 'Valid status is required' });
    }

    const updatedReservation = db.updateReservationStatus(req.params.id, status);
    if (!updatedReservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    res.json(updatedReservation);
  } catch (error) {
    console.error('Error updating reservation status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as reservationRoutes };