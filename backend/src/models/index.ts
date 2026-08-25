export interface Doctor {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  license_number: string;
  experience: number;
  rating: number;
  price: number;
  bio: string;
  image?: string;
  location: string;
  languages: string;
  availability: string;
  verified: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  date_of_birth: Date;
  gender: 'male' | 'female' | 'other';
  address: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relationship: string;
  created_at: Date;
  updated_at: Date;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: Date;
  appointment_time: string;
  duration: number;
  type: 'video' | 'audio' | 'chat';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  reason: string;
  notes?: string;
  price: number;
  created_at: Date;
  updated_at: Date;
}

export interface MedicalRecord {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_id?: string;
  diagnosis: string;
  symptoms: string;
  treatment: string;
  prescriptions?: string;
  follow_up_date?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Consultation {
  id: string;
  appointment_id: string;
  start_time: Date;
  end_time?: Date;
  status: 'waiting' | 'active' | 'ended';
  recording_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Payment {
  id: string;
  appointment_id: string;
  patient_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method: string;
  transaction_id?: string;
  payment_date: Date;
  created_at: Date;
  updated_at: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}