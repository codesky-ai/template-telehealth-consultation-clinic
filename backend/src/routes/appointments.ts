import { Router } from 'express';
import * as appointmentController from '../controllers/appointmentController';

const router = Router();

// GET /api/appointments - Get all appointments
router.get('/', appointmentController.getAllAppointments);

// GET /api/appointments/:id - Get appointment by ID
router.get('/:id', appointmentController.getAppointmentById);

// POST /api/appointments - Create new appointment
router.post('/', appointmentController.createAppointment);

// PUT /api/appointments/:id - Update appointment
router.put('/:id', appointmentController.updateAppointment);

// PATCH /api/appointments/:id/cancel - Cancel appointment
router.patch('/:id/cancel', appointmentController.cancelAppointment);

// PATCH /api/appointments/:id/complete - Complete appointment
router.patch('/:id/complete', appointmentController.completeAppointment);

// GET /api/appointments/patient/:patientId - Get appointments by patient
router.get('/patient/:patientId', appointmentController.getAppointmentsByPatient);

// GET /api/appointments/doctor/:doctorId - Get appointments by doctor
router.get('/doctor/:doctorId', appointmentController.getAppointmentsByDoctor);

export default router;