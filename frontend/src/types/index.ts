export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
  experience: number;
  rating: number;
  price: number;
  availability: string[];
  bio: string;
  languages: string[];
  location: string;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalHistory: MedicalRecord[];
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  type: 'video' | 'audio' | 'chat';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  reason: string;
  notes?: string;
  prescription?: Prescription[];
  duration: number;
  price: number;
}

export interface MedicalRecord {
  id: string;
  date: string;
  diagnosis: string;
  symptoms: string[];
  treatment: string;
  doctorId: string;
  doctorName: string;
  followUpDate?: string;
}

export interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface Consultation {
  id: string;
  appointmentId: string;
  startTime: string;
  endTime?: string;
  status: 'waiting' | 'active' | 'ended';
  participantCount: number;
  recordingUrl?: string;
  chatHistory: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
}

export interface Payment {
  id: string;
  appointmentId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionId: string;
  date: string;
}