import { Router } from 'express';
import * as consultationController from '../controllers/consultationController';

const router = Router();

// GET /api/consultations - Get all consultations
router.get('/', consultationController.getAllConsultations);

// GET /api/consultations/:id - Get consultation by ID
router.get('/:id', consultationController.getConsultationById);

// POST /api/consultations - Create new consultation
router.post('/', consultationController.createConsultation);

// PUT /api/consultations/:id - Update consultation
router.put('/:id', consultationController.updateConsultation);

// PATCH /api/consultations/:id/start - Start consultation
router.patch('/:id/start', consultationController.startConsultation);

// PATCH /api/consultations/:id/end - End consultation
router.patch('/:id/end', consultationController.endConsultation);

// GET /api/consultations/appointment/:appointmentId - Get consultation by appointment
router.get('/appointment/:appointmentId', consultationController.getConsultationByAppointment);

export default router;