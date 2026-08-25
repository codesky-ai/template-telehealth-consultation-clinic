import { Router } from 'express';
import * as medicalRecordController from '../controllers/medicalRecordController';

const router = Router();

// GET /api/medical-records - Get all medical records
router.get('/', medicalRecordController.getAllMedicalRecords);

// GET /api/medical-records/:id - Get medical record by ID
router.get('/:id', medicalRecordController.getMedicalRecordById);

// POST /api/medical-records - Create new medical record
router.post('/', medicalRecordController.createMedicalRecord);

// PUT /api/medical-records/:id - Update medical record
router.put('/:id', medicalRecordController.updateMedicalRecord);

// DELETE /api/medical-records/:id - Delete medical record
router.delete('/:id', medicalRecordController.deleteMedicalRecord);

// GET /api/medical-records/patient/:patientId - Get medical records by patient
router.get('/patient/:patientId', medicalRecordController.getMedicalRecordsByPatient);

// GET /api/medical-records/doctor/:doctorId - Get medical records by doctor
router.get('/doctor/:doctorId', medicalRecordController.getMedicalRecordsByDoctor);

export default router;