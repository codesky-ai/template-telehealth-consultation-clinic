import { Router } from 'express';
import * as doctorController from '../controllers/doctorController';

const router = Router();

// GET /api/doctors - Get all doctors
router.get('/', doctorController.getAllDoctors);

// GET /api/doctors/search - Search doctors
router.get('/search', doctorController.searchDoctors);

// GET /api/doctors/specialties - Get all specialties
router.get('/specialties', doctorController.getSpecialties);

// GET /api/doctors/specialty/:specialty - Get doctors by specialty
router.get('/specialty/:specialty', doctorController.getDoctorsBySpecialty);

// GET /api/doctors/:id - Get doctor by ID
router.get('/:id', doctorController.getDoctorById);

// GET /api/doctors/:id/availability - Get doctor availability
router.get('/:id/availability', doctorController.getDoctorAvailability);

// GET /api/doctors/:id/reviews - Get doctor reviews
router.get('/:id/reviews', doctorController.getDoctorReviews);

export default router;