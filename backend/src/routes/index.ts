import { Router } from 'express';
import doctorRoutes from './doctors';
import patientRoutes from './patients';
import appointmentRoutes from './appointments';
import medicalRecordRoutes from './medicalRecords';
import consultationRoutes from './consultations';

const router = Router();

// API Routes
router.use('/doctors', doctorRoutes);
router.use('/patients', patientRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/medical-records', medicalRecordRoutes);
router.use('/consultations', consultationRoutes);

// Root API endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'TeleHealth API v1.0.0',
    endpoints: {
      doctors: '/api/doctors',
      patients: '/api/patients',
      appointments: '/api/appointments',
      medicalRecords: '/api/medical-records',
      consultations: '/api/consultations'
    },
    documentation: 'https://docs.telehealth.api'
  });
});

export default router;