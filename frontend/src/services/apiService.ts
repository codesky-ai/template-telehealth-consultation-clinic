import { apiClient } from '../api/client';
import { mockData } from '../api/mockData';
import { Doctor, Appointment, Patient, MedicalRecord } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';
const USE_MOCK_DATA = false; // Toggle for development

export const apiService = {
  // Doctors
  async getDoctors(): Promise<Doctor[]> {
    if (USE_MOCK_DATA) return mockData.doctors;
    try {
      const response = await apiClient.get('/doctors', { timeout: 3000 });
      return response.data;
    } catch (error) {
      console.warn('API failed, using mock data:', error);
      return mockData.doctors;
    }
  },

  async getDoctorById(id: string): Promise<Doctor | null> {
    if (USE_MOCK_DATA) {
      return mockData.doctors.find(doc => doc.id === id) || null;
    }
    try {
      const response = await apiClient.get(`/doctors/${id}`, { timeout: 3000 });
      return response.data;
    } catch (error) {
      console.warn('API failed, using mock data:', error);
      return mockData.doctors.find(doc => doc.id === id) || null;
    }
  },

  async getDoctorsBySpecialty(specialty: string): Promise<Doctor[]> {
    if (USE_MOCK_DATA) {
      return mockData.doctors.filter(doc => doc.specialty === specialty);
    }
    try {
      const response = await apiClient.get(`/doctors/specialty/${specialty}`, { timeout: 3000 });
      return response.data;
    } catch (error) {
      console.warn('API failed, using mock data:', error);
      return mockData.doctors.filter(doc => doc.specialty === specialty);
    }
  },

  // Appointments
  async getAppointments(): Promise<Appointment[]> {
    if (USE_MOCK_DATA) return mockData.appointments;
    try {
      const response = await apiClient.get('/appointments', { timeout: 3000 });
      return response.data;
    } catch (error) {
      console.warn('API failed, using mock data:', error);
      return mockData.appointments;
    }
  },

  async bookAppointment(appointmentData: Partial<Appointment>): Promise<Appointment> {
    if (USE_MOCK_DATA) {
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        patientId: 'patient1',
        doctorId: appointmentData.doctorId!,
        date: appointmentData.date!,
        time: appointmentData.time!,
        type: appointmentData.type || 'video',
        status: 'scheduled',
        reason: appointmentData.reason!,
        duration: appointmentData.duration || 30,
        price: appointmentData.price || 75
      };
      mockData.appointments.push(newAppointment);
      return newAppointment;
    }
    try {
      const response = await apiClient.post('/appointments', appointmentData, { timeout: 3000 });
      return response.data;
    } catch (error) {
      console.warn('API failed, using mock data:', error);
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        patientId: 'patient1',
        doctorId: appointmentData.doctorId!,
        date: appointmentData.date!,
        time: appointmentData.time!,
        type: appointmentData.type || 'video',
        status: 'scheduled',
        reason: appointmentData.reason!,
        duration: appointmentData.duration || 30,
        price: appointmentData.price || 75
      };
      return newAppointment;
    }
  },

  async cancelAppointment(id: string): Promise<void> {
    if (USE_MOCK_DATA) {
      const index = mockData.appointments.findIndex(apt => apt.id === id);
      if (index !== -1) {
        mockData.appointments[index].status = 'cancelled';
      }
      return;
    }
    try {
      await apiClient.patch(`/appointments/${id}/cancel`, {}, { timeout: 3000 });
    } catch (error) {
      console.warn('API failed, using mock data:', error);
      const index = mockData.appointments.findIndex(apt => apt.id === id);
      if (index !== -1) {
        mockData.appointments[index].status = 'cancelled';
      }
    }
  },

  // Patient
  async getPatient(): Promise<Patient> {
    if (USE_MOCK_DATA) return mockData.patient;
    try {
      const response = await apiClient.get('/patient/profile', { timeout: 3000 });
      return response.data;
    } catch (error) {
      console.warn('API failed, using mock data:', error);
      return mockData.patient;
    }
  },

  async updatePatient(patientData: Partial<Patient>): Promise<Patient> {
    if (USE_MOCK_DATA) {
      Object.assign(mockData.patient, patientData);
      return mockData.patient;
    }
    try {
      const response = await apiClient.put('/patient/profile', patientData, { timeout: 3000 });
      return response.data;
    } catch (error) {
      console.warn('API failed, using mock data:', error);
      Object.assign(mockData.patient, patientData);
      return mockData.patient;
    }
  },

  // Medical Records
  async getMedicalRecords(): Promise<MedicalRecord[]> {
    if (USE_MOCK_DATA) return mockData.medicalRecords;
    try {
      const response = await apiClient.get('/medical-records', { timeout: 3000 });
      return response.data;
    } catch (error) {
      console.warn('API failed, using mock data:', error);
      return mockData.medicalRecords;
    }
  },

  // Search
  async searchDoctors(query: string): Promise<Doctor[]> {
    if (USE_MOCK_DATA) {
      return mockData.doctors.filter(doc =>
        doc.name.toLowerCase().includes(query.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(query.toLowerCase())
      );
    }
    try {
      const response = await apiClient.get(`/doctors/search?q=${encodeURIComponent(query)}`, { timeout: 3000 });
      return response.data;
    } catch (error) {
      console.warn('API failed, using mock data:', error);
      return mockData.doctors.filter(doc =>
        doc.name.toLowerCase().includes(query.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(query.toLowerCase())
      );
    }
  }
};