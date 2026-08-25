import { Request, Response } from 'express';
import { pool } from '../config/database';
import { MedicalRecord, ApiResponse } from '../models';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { v4 as uuidv4 } from 'uuid';

// Get all medical records
export const getAllMedicalRecords = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const [records] = await pool.query<RowDataPacket[]>(
      `SELECT
        mr.id, mr.patient_id, mr.doctor_id, mr.appointment_id,
        mr.diagnosis, mr.symptoms, mr.treatment, mr.prescriptions,
        mr.follow_up_date, mr.created_at, mr.updated_at,
        p.name as patient_name,
        d.name as doctor_name, d.specialty as doctor_specialty
      FROM medical_records mr
      LEFT JOIN patients p ON mr.patient_id = p.id
      LEFT JOIN doctors d ON mr.doctor_id = d.id
      ORDER BY mr.created_at DESC
      LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    const [countResult] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as total FROM medical_records'
    );

    const total = countResult[0].total;

    const response: ApiResponse = {
      success: true,
      data: records,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching medical records:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch medical records'
    });
  }
};

// Get medical record by ID
export const getMedicalRecordById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const [records] = await pool.query<RowDataPacket[]>(
      `SELECT
        mr.id, mr.patient_id, mr.doctor_id, mr.appointment_id,
        mr.diagnosis, mr.symptoms, mr.treatment, mr.prescriptions,
        mr.follow_up_date, mr.created_at, mr.updated_at,
        p.name as patient_name, p.email as patient_email,
        d.name as doctor_name, d.specialty as doctor_specialty
      FROM medical_records mr
      LEFT JOIN patients p ON mr.patient_id = p.id
      LEFT JOIN doctors d ON mr.doctor_id = d.id
      WHERE mr.id = ?`,
      [id]
    );

    if (records.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Medical record not found'
      });
      return;
    }

    const response: ApiResponse<MedicalRecord> = {
      success: true,
      data: records[0]
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching medical record:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch medical record'
    });
  }
};

// Create new medical record
export const createMedicalRecord = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      patient_id,
      doctor_id,
      appointment_id,
      diagnosis,
      symptoms,
      treatment,
      prescriptions,
      follow_up_date
    } = req.body;

    // Validate required fields
    if (!patient_id || !doctor_id || !diagnosis || !symptoms || !treatment) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
      return;
    }

    // Verify patient and doctor exist
    const [patientCheck] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM patients WHERE id = ?',
      [patient_id]
    );

    const [doctorCheck] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM doctors WHERE id = ?',
      [doctor_id]
    );

    if (patientCheck.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Patient not found'
      });
      return;
    }

    if (doctorCheck.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Doctor not found'
      });
      return;
    }

    const recordId = uuidv4();

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO medical_records
      (id, patient_id, doctor_id, appointment_id, diagnosis, symptoms, treatment, prescriptions, follow_up_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        recordId,
        patient_id,
        doctor_id,
        appointment_id,
        diagnosis,
        symptoms,
        treatment,
        prescriptions,
        follow_up_date
      ]
    );

    // Fetch the created record
    const [newRecord] = await pool.query<RowDataPacket[]>(
      `SELECT
        mr.id, mr.patient_id, mr.doctor_id, mr.appointment_id,
        mr.diagnosis, mr.symptoms, mr.treatment, mr.prescriptions,
        mr.follow_up_date, mr.created_at, mr.updated_at
      FROM medical_records mr
      WHERE mr.id = ?`,
      [recordId]
    );

    const response: ApiResponse<MedicalRecord> = {
      success: true,
      data: newRecord[0],
      message: 'Medical record created successfully'
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating medical record:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create medical record'
    });
  }
};

// Update medical record
export const updateMedicalRecord = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      diagnosis,
      symptoms,
      treatment,
      prescriptions,
      follow_up_date
    } = req.body;

    // Check if record exists
    const [existingRecords] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM medical_records WHERE id = ?',
      [id]
    );

    if (existingRecords.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Medical record not found'
      });
      return;
    }

    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (diagnosis) {
      updateFields.push('diagnosis = ?');
      updateValues.push(diagnosis);
    }

    if (symptoms) {
      updateFields.push('symptoms = ?');
      updateValues.push(symptoms);
    }

    if (treatment) {
      updateFields.push('treatment = ?');
      updateValues.push(treatment);
    }

    if (prescriptions !== undefined) {
      updateFields.push('prescriptions = ?');
      updateValues.push(prescriptions);
    }

    if (follow_up_date !== undefined) {
      updateFields.push('follow_up_date = ?');
      updateValues.push(follow_up_date);
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
      `UPDATE medical_records SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    const response: ApiResponse = {
      success: true,
      message: 'Medical record updated successfully'
    };

    res.json(response);
  } catch (error) {
    console.error('Error updating medical record:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update medical record'
    });
  }
};

// Delete medical record
export const deleteMedicalRecord = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM medical_records WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({
        success: false,
        error: 'Medical record not found'
      });
      return;
    }

    const response: ApiResponse = {
      success: true,
      message: 'Medical record deleted successfully'
    };

    res.json(response);
  } catch (error) {
    console.error('Error deleting medical record:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete medical record'
    });
  }
};

// Get medical records by patient
export const getMedicalRecordsByPatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { patientId } = req.params;

    const [records] = await pool.query<RowDataPacket[]>(
      `SELECT
        mr.id, mr.patient_id, mr.doctor_id, mr.appointment_id,
        mr.diagnosis, mr.symptoms, mr.treatment, mr.prescriptions,
        mr.follow_up_date, mr.created_at, mr.updated_at,
        d.name as doctor_name, d.specialty as doctor_specialty
      FROM medical_records mr
      LEFT JOIN doctors d ON mr.doctor_id = d.id
      WHERE mr.patient_id = ?
      ORDER BY mr.created_at DESC`,
      [patientId]
    );

    const response: ApiResponse = {
      success: true,
      data: records
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching patient medical records:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch patient medical records'
    });
  }
};

// Get medical records by doctor
export const getMedicalRecordsByDoctor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { doctorId } = req.params;

    const [records] = await pool.query<RowDataPacket[]>(
      `SELECT
        mr.id, mr.patient_id, mr.doctor_id, mr.appointment_id,
        mr.diagnosis, mr.symptoms, mr.treatment, mr.prescriptions,
        mr.follow_up_date, mr.created_at, mr.updated_at,
        p.name as patient_name, p.email as patient_email
      FROM medical_records mr
      LEFT JOIN patients p ON mr.patient_id = p.id
      WHERE mr.doctor_id = ?
      ORDER BY mr.created_at DESC`,
      [doctorId]
    );

    const response: ApiResponse = {
      success: true,
      data: records
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching doctor medical records:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch doctor medical records'
    });
  }
};