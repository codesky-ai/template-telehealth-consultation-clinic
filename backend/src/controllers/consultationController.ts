import { Request, Response } from 'express';
import { pool } from '../config/database';
import { Consultation, ApiResponse } from '../models';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { v4 as uuidv4 } from 'uuid';

// Get all consultations
export const getAllConsultations = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const [consultations] = await pool.query<RowDataPacket[]>(
      `SELECT
        c.id, c.appointment_id, c.start_time, c.end_time, c.status, c.recording_url,
        c.created_at, c.updated_at,
        a.patient_id, a.doctor_id, a.appointment_date, a.appointment_time,
        p.name as patient_name,
        d.name as doctor_name, d.specialty as doctor_specialty
      FROM consultations c
      LEFT JOIN appointments a ON c.appointment_id = a.id
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN doctors d ON a.doctor_id = d.id
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    const [countResult] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as total FROM consultations'
    );

    const total = countResult[0].total;

    const response: ApiResponse = {
      success: true,
      data: consultations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching consultations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch consultations'
    });
  }
};

// Get consultation by ID
export const getConsultationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const [consultations] = await pool.query<RowDataPacket[]>(
      `SELECT
        c.id, c.appointment_id, c.start_time, c.end_time, c.status, c.recording_url,
        c.created_at, c.updated_at,
        a.patient_id, a.doctor_id, a.appointment_date, a.appointment_time, a.type as appointment_type,
        p.name as patient_name, p.email as patient_email,
        d.name as doctor_name, d.specialty as doctor_specialty, d.image as doctor_image
      FROM consultations c
      LEFT JOIN appointments a ON c.appointment_id = a.id
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN doctors d ON a.doctor_id = d.id
      WHERE c.id = ?`,
      [id]
    );

    if (consultations.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Consultation not found'
      });
      return;
    }

    const response: ApiResponse<Consultation> = {
      success: true,
      data: consultations[0]
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching consultation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch consultation'
    });
  }
};

// Create new consultation
export const createConsultation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { appointment_id } = req.body;

    // Validate required fields
    if (!appointment_id) {
      res.status(400).json({
        success: false,
        error: 'Appointment ID is required'
      });
      return;
    }

    // Verify appointment exists
    const [appointments] = await pool.query<RowDataPacket[]>(
      'SELECT id, status FROM appointments WHERE id = ?',
      [appointment_id]
    );

    if (appointments.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Appointment not found'
      });
      return;
    }

    const appointment = appointments[0];

    if (appointment.status !== 'scheduled') {
      res.status(400).json({
        success: false,
        error: 'Can only create consultation for scheduled appointments'
      });
      return;
    }

    // Check if consultation already exists for this appointment
    const [existingConsultations] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM consultations WHERE appointment_id = ?',
      [appointment_id]
    );

    if (existingConsultations.length > 0) {
      res.status(409).json({
        success: false,
        error: 'Consultation already exists for this appointment'
      });
      return;
    }

    const consultationId = uuidv4();

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO consultations (id, appointment_id, status)
      VALUES (?, ?, 'waiting')`,
      [consultationId, appointment_id]
    );

    // Fetch the created consultation
    const [newConsultation] = await pool.query<RowDataPacket[]>(
      `SELECT
        c.id, c.appointment_id, c.start_time, c.end_time, c.status, c.recording_url,
        c.created_at, c.updated_at
      FROM consultations c
      WHERE c.id = ?`,
      [consultationId]
    );

    const response: ApiResponse<Consultation> = {
      success: true,
      data: newConsultation[0],
      message: 'Consultation created successfully'
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating consultation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create consultation'
    });
  }
};

// Update consultation
export const updateConsultation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, recording_url } = req.body;

    // Check if consultation exists
    const [existingConsultations] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM consultations WHERE id = ?',
      [id]
    );

    if (existingConsultations.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Consultation not found'
      });
      return;
    }

    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (status) {
      updateFields.push('status = ?');
      updateValues.push(status);
    }

    if (recording_url !== undefined) {
      updateFields.push('recording_url = ?');
      updateValues.push(recording_url);
    }

    if (updateFields.length === 0) {
      res.status(400).json({
        success: false,
        error: 'No valid fields to update'
      });
      return;
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateValues.push(id);

    await pool.query(
      `UPDATE consultations SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    const response: ApiResponse = {
      success: true,
      message: 'Consultation updated successfully'
    };

    res.json(response);
  } catch (error) {
    console.error('Error updating consultation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update consultation'
    });
  }
};

// Start consultation
export const startConsultation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if consultation exists and is in waiting status
    const [consultations] = await pool.query<RowDataPacket[]>(
      'SELECT id, status, appointment_id FROM consultations WHERE id = ?',
      [id]
    );

    if (consultations.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Consultation not found'
      });
      return;
    }

    const consultation = consultations[0];

    if (consultation.status !== 'waiting') {
      res.status(400).json({
        success: false,
        error: 'Consultation is not in waiting status'
      });
      return;
    }

    await pool.query(
      `UPDATE consultations
      SET status = 'active', start_time = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [id]
    );

    // Update appointment status to in-progress
    await pool.query(
      'UPDATE appointments SET status = "in-progress" WHERE id = ?',
      [consultation.appointment_id]
    );

    const response: ApiResponse = {
      success: true,
      message: 'Consultation started successfully'
    };

    res.json(response);
  } catch (error) {
    console.error('Error starting consultation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to start consultation'
    });
  }
};

// End consultation
export const endConsultation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { recording_url, notes } = req.body;

    // Check if consultation exists and is active
    const [consultations] = await pool.query<RowDataPacket[]>(
      'SELECT id, status, appointment_id FROM consultations WHERE id = ?',
      [id]
    );

    if (consultations.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Consultation not found'
      });
      return;
    }

    const consultation = consultations[0];

    if (consultation.status !== 'active') {
      res.status(400).json({
        success: false,
        error: 'Consultation is not active'
      });
      return;
    }

    // Update consultation
    const updateFields = ['status = "ended"', 'end_time = CURRENT_TIMESTAMP', 'updated_at = CURRENT_TIMESTAMP'];
    const updateValues: any[] = [];

    if (recording_url) {
      updateFields.push('recording_url = ?');
      updateValues.push(recording_url);
    }

    updateValues.push(id);

    await pool.query(
      `UPDATE consultations SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    // Update appointment status to completed
    const appointmentUpdateFields = ['status = "completed"', 'updated_at = CURRENT_TIMESTAMP'];
    const appointmentUpdateValues: any[] = [];

    if (notes) {
      appointmentUpdateFields.push('notes = ?');
      appointmentUpdateValues.push(notes);
    }

    appointmentUpdateValues.push(consultation.appointment_id);

    await pool.query(
      `UPDATE appointments SET ${appointmentUpdateFields.join(', ')} WHERE id = ?`,
      appointmentUpdateValues
    );

    const response: ApiResponse = {
      success: true,
      message: 'Consultation ended successfully'
    };

    res.json(response);
  } catch (error) {
    console.error('Error ending consultation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to end consultation'
    });
  }
};

// Get consultation by appointment
export const getConsultationByAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { appointmentId } = req.params;

    const [consultations] = await pool.query<RowDataPacket[]>(
      `SELECT
        c.id, c.appointment_id, c.start_time, c.end_time, c.status, c.recording_url,
        c.created_at, c.updated_at,
        a.patient_id, a.doctor_id, a.appointment_date, a.appointment_time, a.type as appointment_type,
        p.name as patient_name, p.email as patient_email,
        d.name as doctor_name, d.specialty as doctor_specialty, d.image as doctor_image
      FROM consultations c
      LEFT JOIN appointments a ON c.appointment_id = a.id
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN doctors d ON a.doctor_id = d.id
      WHERE c.appointment_id = ?`,
      [appointmentId]
    );

    if (consultations.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Consultation not found for this appointment'
      });
      return;
    }

    const response: ApiResponse<Consultation> = {
      success: true,
      data: consultations[0]
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching consultation by appointment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch consultation by appointment'
    });
  }
};