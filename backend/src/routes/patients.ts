import { Router } from 'express';
import * as patientController from '../controllers/patientController';

const router = Router();

// GET /api/patients - Get all patients
router.get('/', patientController.getAllPatients);

// GET /api/patients/:id - Get patient by ID
router.get('/:id', patientController.getPatientById);

// POST /api/patients - Create new patient
router.post('/', patientController.createPatient);

// PUT /api/patients/:id - Update patient
router.put('/:id', patientController.updatePatient);

// DELETE /api/patients/:id - Delete patient
router.delete('/:id', patientController.deletePatient);

// GET /api/patients/:id/medical-history - Get patient medical history
router.get('/:id/medical-history', patientController.getPatientMedicalHistory);

export default router;