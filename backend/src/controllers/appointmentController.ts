import { Request, Response } from 'express';
import { pool } from '../config/database';
import { Appointment, ApiResponse } from '../models';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { v4 as uuidv4 } from 'uuid';

// Get all appointments
export const getAllAppointments = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const status = req.query.status as string;

    let query = `
      SELECT
        a.id, a.patient_id, a.doctor_id, a.appointment_date, a.appointment_time,
        a.duration, a.type, a.status, a.reason, a.notes, a.price,
        a.created_at, a.updated_at,
        d.name as doctor_name, d.specialty as doctor_specialty,
        p.name as patient_name
      FROM appointments a
      LEFT JOIN doctors d ON a.doctor_id = d.id
      LEFT JOIN patients p ON a.patient_id = p.id
    `;
    const queryParams: any[] = [];

    if (status) {
      query += ' WHERE a.status = ?';
      queryParams.push(status);
    }

    query += ' ORDER BY a.appointment_date DESC, a.appointment_time DESC LIMIT ? OFFSET ?';
    queryParams.push(limit, offset);

    const [appointments] = await pool.query<RowDataPacket[]>(query, queryParams);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM appointments a';
    const countParams: any[] = [];

    if (status) {
      countQuery += ' WHERE a.status = ?';
      countParams.push(status);
    }

    const [countResult] = await pool.query<RowDataPacket[]>(countQuery, countParams);
    const total = countResult[0].total;

    const response: ApiResponse = {
      success: true,
      data: appointments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch appointments'
    });
  }
};

// Get appointment by ID
export const getAppointmentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const [appointments] = await pool.query<RowDataPacket[]>(
      `SELECT
        a.id, a.patient_id, a.doctor_id, a.appointment_date, a.appointment_time,
        a.duration, a.type, a.status, a.reason, a.notes, a.price,
        a.created_at, a.updated_at,
        d.name as doctor_name, d.specialty as doctor_specialty, d.image as doctor_image,
        p.name as patient_name, p.email as patient_email
      FROM appointments a
      LEFT JOIN doctors d ON a.doctor_id = d.id
      LEFT JOIN patients p ON a.patient_id = p.id
      WHERE a.id = ?`,
      [id]
    );

    if (appointments.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Appointment not found'
      });
      return;
    }

    const response: ApiResponse<Appointment> = {
      success: true,
      data: appointments[0]
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch appointment'
    });
  }
};

// Create new appointment
export const createAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      patient_id,
      doctor_id,
      appointment_date,
      appointment_time,
      duration,
      type,
      reason,
      price
    } = req.body;

    // Validate required fields
    if (!patient_id || !doctor_id || !appointment_date || !appointment_time || !reason) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
      return;
    }

    // Check if doctor exists
    const [doctors] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM doctors WHERE id = ? AND verified = true',
      [doctor_id]
    );

    if (doctors.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Doctor not found'
      });
      return;
    }

    // Check for conflicting appointments
    const [conflicts] = await pool.query<RowDataPacket[]>(
      `SELECT id FROM appointments
      WHERE doctor_id = ? AND appointment_date = ? AND appointment_time = ?
      AND status NOT IN ('cancelled', 'completed')`,
      [doctor_id, appointment_date, appointment_time]
    );

    if (conflicts.length > 0) {
      res.status(409).json({
        success: false,
        error: 'Time slot is already booked'
      });
      return;
    }

    const appointmentId = uuidv4();

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO appointments
      (id, patient_id, doctor_id, appointment_date, appointment_time, duration, type, status, reason, price)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'scheduled', ?, ?)`,
      [
        appointmentId,
        patient_id,
        doctor_id,
        appointment_date,
        appointment_time,
        duration || 30,
        type || 'video',
        reason,
        price || 0
      ]
    );

    // Fetch the created appointment
    const [newAppointment] = await pool.query<RowDataPacket[]>(
      `SELECT
        a.id, a.patient_id, a.doctor_id, a.appointment_date, a.appointment_time,
        a.duration, a.type, a.status, a.reason, a.notes, a.price,
        a.created_at, a.updated_at
      FROM appointments a
      WHERE a.id = ?`,
      [appointmentId]
    );

    const response: ApiResponse<Appointment> = {
      success: true,
      data: newAppointment[0],
      message: 'Appointment created successfully'
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create appointment'
    });
  }
};

// Update appointment
export const updateAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      appointment_date,
      appointment_time,
      duration,
      type,
      reason,
      notes,
      price
    } = req.body;

    // Check if appointment exists
    const [existingAppointments] = await pool.query<RowDataPacket[]>(
      'SELECT id, status FROM appointments WHERE id = ?',
      [id]
    );

    if (existingAppointments.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Appointment not found'
      });
      return;
    }

    const appointment = existingAppointments[0];

    if (appointment.status === 'completed' || appointment.status === 'cancelled') {
      res.status(400).json({
        success: false,
        error: 'Cannot update completed or cancelled appointment'
      });
      return;
    }

    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (appointment_date) {
      updateFields.push('appointment_date = ?');
      updateValues.push(appointment_date);
    }

    if (appointment_time) {
      updateFields.push('appointment_time = ?');
      updateValues.push(appointment_time);
    }

    if (duration) {
      updateFields.push('duration = ?');
      updateValues.push(duration);
    }

    if (type) {
      updateFields.push('type = ?');
      updateValues.push(type);
    }

    if (reason) {
      updateFields.push('reason = ?');
      updateValues.push(reason);
    }

    if (notes !== undefined) {
      updateFields.push('notes = ?');
      updateValues.push(notes);
    }

    if (price) {
      updateFields.push('price = ?');
      updateValues.push(price);
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
      `UPDATE appointments SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    const response: ApiResponse = {
      success: true,
      message: 'Appointment updated successfully'
    };

    res.json(response);
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update appointment'
    });
  }
};

// Cancel appointment
export const cancelAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE appointments SET status = "cancelled", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({
        success: false,
        error: 'Appointment not found'
      });
      return;
    }

    const response: ApiResponse = {
      success: true,
      message: 'Appointment cancelled successfully'
    };

    res.json(response);
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel appointment'
    });
  }
};

// Complete appointment
export const completeAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const updateQuery = notes
      ? 'UPDATE appointments SET status = "completed", notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
      : 'UPDATE appointments SET status = "completed", updated_at = CURRENT_TIMESTAMP WHERE id = ?';

    const queryParams = notes ? [notes, id] : [id];

    const [result] = await pool.query<ResultSetHeader>(updateQuery, queryParams);

    if (result.affectedRows === 0) {
      res.status(404).json({
        success: false,
        error: 'Appointment not found'
      });
      return;
    }

    const response: ApiResponse = {
      success: true,
      message: 'Appointment completed successfully'
    };

    res.json(response);
  } catch (error) {
    console.error('Error completing appointment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to complete appointment'
    });
  }
};

// Get appointments by patient
export const getAppointmentsByPatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { patientId } = req.params;

    const [appointments] = await pool.query<RowDataPacket[]>(
      `SELECT
        a.id, a.patient_id, a.doctor_id, a.appointment_date, a.appointment_time,
        a.duration, a.type, a.status, a.reason, a.notes, a.price,
        a.created_at, a.updated_at,
        d.name as doctor_name, d.specialty as doctor_specialty
      FROM appointments a
      LEFT JOIN doctors d ON a.doctor_id = d.id
      WHERE a.patient_id = ?
      ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
      [patientId]
    );

    const response: ApiResponse = {
      success: true,
      data: appointments
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching patient appointments:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch patient appointments'
    });
  }
};

// Get appointments by doctor
export const getAppointmentsByDoctor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { doctorId } = req.params;

    const [appointments] = await pool.query<RowDataPacket[]>(
      `SELECT
        a.id, a.patient_id, a.doctor_id, a.appointment_date, a.appointment_time,
        a.duration, a.type, a.status, a.reason, a.notes, a.price,
        a.created_at, a.updated_at,
        p.name as patient_name, p.email as patient_email
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      WHERE a.doctor_id = ?
      ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
      [doctorId]
    );

    const response: ApiResponse = {
      success: true,
      data: appointments
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch doctor appointments'
    });
  }
};