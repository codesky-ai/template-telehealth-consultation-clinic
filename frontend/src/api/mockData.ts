import { Doctor, Patient, Appointment, MedicalRecord } from '../types';

export const mockData = {
  doctors: [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      specialty: 'General Medicine',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
      experience: 8,
      rating: 4.8,
      price: 75,
      availability: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
      bio: 'Dr. Johnson specializes in general medicine with a focus on preventive care and chronic disease management.',
      languages: ['English', 'Spanish'],
      location: 'New York, NY'
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      specialty: 'Cardiology',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
      experience: 12,
      rating: 4.9,
      price: 120,
      availability: ['10:00', '11:00', '15:00', '16:00'],
      bio: 'Experienced cardiologist specializing in heart disease prevention and treatment.',
      languages: ['English', 'Mandarin'],
      location: 'Los Angeles, CA'
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      specialty: 'Dermatology',
      image: 'https://images.unsplash.com/photo-1594824953513-8bb555cf2b3b?w=400',
      experience: 6,
      rating: 4.7,
      price: 90,
      availability: ['09:00', '10:00', '13:00', '14:00', '15:00'],
      bio: 'Dermatologist with expertise in skin cancer prevention and cosmetic procedures.',
      languages: ['English', 'Spanish'],
      location: 'Miami, FL'
    },
    {
      id: '4',
      name: 'Dr. James Wilson',
      specialty: 'Psychiatry',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400',
      experience: 15,
      rating: 4.6,
      price: 100,
      availability: ['11:00', '12:00', '14:00', '15:00', '16:00'],
      bio: 'Licensed psychiatrist specializing in anxiety, depression, and behavioral therapy.',
      languages: ['English'],
      location: 'Chicago, IL'
    },
    {
      id: '5',
      name: 'Dr. Priya Patel',
      specialty: 'Pediatrics',
      image: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400',
      experience: 10,
      rating: 4.9,
      price: 80,
      availability: ['08:00', '09:00', '10:00', '14:00', '15:00'],
      bio: 'Pediatric specialist with focus on child development and family health.',
      languages: ['English', 'Hindi', 'Gujarati'],
      location: 'Houston, TX'
    },
    {
      id: '6',
      name: 'Dr. Robert Taylor',
      specialty: 'Orthopedics',
      image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400',
      experience: 20,
      rating: 4.8,
      price: 130,
      availability: ['09:00', '11:00', '13:00', '15:00'],
      bio: 'Orthopedic surgeon specializing in sports medicine and joint replacement.',
      languages: ['English'],
      location: 'Denver, CO'
    }
  ] as Doctor[],

  appointments: [
    {
      id: '1',
      patientId: 'patient1',
      doctorId: '1',
      date: '2026-04-08',
      time: '10:00',
      type: 'video' as const,
      status: 'scheduled' as const,
      reason: 'Annual checkup',
      duration: 30,
      price: 75
    },
    {
      id: '2',
      patientId: 'patient1',
      doctorId: '2',
      date: '2026-04-10',
      time: '15:00',
      type: 'video' as const,
      status: 'scheduled' as const,
      reason: 'Heart palpitations follow-up',
      duration: 45,
      price: 120
    },
    {
      id: '3',
      patientId: 'patient1',
      doctorId: '3',
      date: '2026-04-05',
      time: '14:00',
      type: 'video' as const,
      status: 'completed' as const,
      reason: 'Skin examination',
      duration: 30,
      price: 90,
      notes: 'Recommend sunscreen SPF 50+. Follow-up in 6 months.'
    }
  ] as Appointment[],

  medicalRecords: [
    {
      id: '1',
      date: '2026-04-05',
      diagnosis: 'Mild acne',
      symptoms: ['facial breakouts', 'oily skin'],
      treatment: 'Topical retinoid cream, gentle cleanser',
      doctorId: '3',
      doctorName: 'Dr. Emily Rodriguez',
      followUpDate: '2026-10-05'
    },
    {
      id: '2',
      date: '2026-03-15',
      diagnosis: 'Hypertension',
      symptoms: ['elevated blood pressure', 'headaches'],
      treatment: 'ACE inhibitor medication, dietary changes',
      doctorId: '2',
      doctorName: 'Dr. Michael Chen',
      followUpDate: '2026-06-15'
    },
    {
      id: '3',
      date: '2026-02-20',
      diagnosis: 'Upper respiratory infection',
      symptoms: ['cough', 'congestion', 'sore throat'],
      treatment: 'Rest, fluids, over-the-counter decongestant',
      doctorId: '1',
      doctorName: 'Dr. Sarah Johnson'
    }
  ] as MedicalRecord[],

  patient: {
    id: 'patient1',
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1985-06-15',
    gender: 'male' as const,
    address: '123 Main Street, New York, NY 10001',
    emergencyContact: {
      name: 'Jane Doe',
      phone: '+1 (555) 987-6543',
      relationship: 'spouse'
    },
    medicalHistory: []
  } as Patient
};