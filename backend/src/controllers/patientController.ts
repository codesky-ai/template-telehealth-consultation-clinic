import { Request, Response } from 'express';
import { pool } from '../config/database';
import { Patient, ApiResponse } from '../models';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { v4 as uuidv4 } from 'uuid';

// Get all patients
export const getAllPatients = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const [patients] = await pool.query<RowDataPacket[]>(
      `SELECT
        id, name, email, phone, date_of_birth, gender, address,
        emergency_contact_name, emergency_contact_phone, emergency_contact_relationship,
        created_at, updated_at
      FROM patients
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    const [countResult] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as total FROM patients'
    );

    const total = countResult[0].total;

    const response: ApiResponse = {
      success: true,
      data: patients,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch patients'
    });
  }
};

// Get patient by ID
export const getPatientById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const [patients] = await pool.query<RowDataPacket[]>(
      `SELECT
        id, name, email, phone, date_of_birth, gender, address,
        emergency_contact_name, emergency_contact_phone, emergency_contact_relationship,
        created_at, updated_at
      FROM patients
      WHERE id = ?`,
      [id]
    );

    if (patients.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Patient not found'
      });
      return;
    }

    const response: ApiResponse<Patient> = {
      success: true,
      data: patients[0]
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch patient'
    });
  }
};

// Create new patient
export const createPatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      email,
      phone,
      date_of_birth,
      gender,
      address,
      emergency_contact_name,
      emergency_contact_phone,
      emergency_contact_relationship
    } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !date_of_birth || !gender) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
      return;
    }

    // Check if email already exists
    const [existingPatients] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM patients WHERE email = ?',
      [email]
    );

    if (existingPatients.length > 0) {
      res.status(409).json({
        success: false,
        error: 'Email already registered'
      });
      return;
    }

    const patientId = uuidv4();

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO patients
      (id, name, email, phone, date_of_birth, gender, address,
       emergency_contact_name, emergency_contact_phone, emergency_contact_relationship)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        patientId,
        name,
        email,
        phone,
        date_of_birth,
        gender,
        address,
        emergency_contact_name,
        emergency_contact_phone,
        emergency_contact_relationship
      ]
    );

    // Fetch the created patient
    const [newPatient] = await pool.query<RowDataPacket[]>(
      `SELECT
        id, name, email, phone, date_of_birth, gender, address,
        emergency_contact_name, emergency_contact_phone, emergency_contact_relationship,
        created_at, updated_at
      FROM patients
      WHERE id = ?`,
      [patientId]
    );

    const response: ApiResponse<Patient> = {
      success: true,
      data: newPatient[0],
      message: 'Patient created successfully'
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create patient'
    });
  }
};

// Update patient
export const updatePatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      date_of_birth,
      gender,
      address,
      emergency_contact_name,
      emergency_contact_phone,
      emergency_contact_relationship
    } = req.body;

    // Check if patient exists
    const [existingPatients] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM patients WHERE id = ?',
      [id]
    );

    if (existingPatients.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Patient not found'
      });
      return;
    }

    // Check if email is already used by another patient
    if (email) {
      const [emailCheck] = await pool.query<RowDataPacket[]>(
        'SELECT id FROM patients WHERE email = ? AND id != ?',
        [email, id]
      );

      if (emailCheck.length > 0) {
        res.status(409).json({
          success: false,
          error: 'Email already used by another patient'
        });
        return;
      }
    }

    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (name) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }

    if (email) {
      updateFields.push('email = ?');
      updateValues.push(email);
    }

    if (phone) {
      updateFields.push('phone = ?');
      updateValues.push(phone);
    }

    if (date_of_birth) {
      updateFields.push('date_of_birth = ?');
      updateValues.push(date_of_birth);
    }

    if (gender) {
      updateFields.push('gender = ?');
      updateValues.push(gender);
    }

    if (address !== undefined) {
      updateFields.push('address = ?');
      updateValues.push(address);
    }

    if (emergency_contact_name !== undefined) {
      updateFields.push('emergency_contact_name = ?');
      updateValues.push(emergency_contact_name);
    }

    if (emergency_contact_phone !== undefined) {
      updateFields.push('emergency_contact_phone = ?');
      updateValues.push(emergency_contact_phone);
    }

    if (emergency_contact_relationship !== undefined) {
      updateFields.push('emergency_contact_relationship = ?');
      updateValues.push(emergency_contact_relationship);
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
      `UPDATE patients SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    // Fetch the updated patient
    const [updatedPatient] = await pool.query<RowDataPacket[]>(
      `SELECT
        id, name, email, phone, date_of_birth, gender, address,
        emergency_contact_name, emergency_contact_phone, emergency_contact_relationship,
        created_at, updated_at
      FROM patients
      WHERE id = ?`,
      [id]
    );

    const response: ApiResponse<Patient> = {
      success: true,
      data: updatedPatient[0],
      message: 'Patient updated successfully'
    };

    res.json(response);
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update patient'
    });
  }
};

// Delete patient
export const deletePatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM patients WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({
        success: false,
        error: 'Patient not found'
      });
      return;
    }

    const response: ApiResponse = {
      success: true,
      message: 'Patient deleted successfully'
    };

    res.json(response);
  } catch (error) {
    console.error('Error deleting patient:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete patient'
    });
  }
};

// Get patient medical history
export const getPatientMedicalHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

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
      [id]
    );

    const response: ApiResponse = {
      success: true,
      data: records
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching patient medical history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch patient medical history'
    });
  }
};