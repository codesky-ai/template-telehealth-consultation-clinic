import { Request, Response } from 'express';
import { pool } from '../config/database';
import { Doctor, ApiResponse } from '../models';
import { RowDataPacket } from 'mysql2';

// Get all doctors
export const getAllDoctors = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const [doctors] = await pool.query<RowDataPacket[]>(
      `SELECT
        id, name, email, phone, specialty, experience, rating, price, bio,
        image, location, languages, availability, verified, created_at, updated_at
      FROM doctors
      WHERE verified = true
      ORDER BY rating DESC, experience DESC
      LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    const [countResult] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as total FROM doctors WHERE verified = true'
    );

    const total = countResult[0].total;

    const response: ApiResponse = {
      success: true,
      data: doctors.map(doctor => ({
        ...doctor,
        languages: doctor.languages ? JSON.parse(doctor.languages) : [],
        availability: doctor.availability ? JSON.parse(doctor.availability) : []
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch doctors'
    });
  }
};

// Get doctor by ID
export const getDoctorById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const [doctors] = await pool.query<RowDataPacket[]>(
      `SELECT
        id, name, email, phone, specialty, experience, rating, price, bio,
        image, location, languages, availability, verified, created_at, updated_at
      FROM doctors
      WHERE id = ? AND verified = true`,
      [id]
    );

    if (doctors.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Doctor not found'
      });
      return;
    }

    const doctor = doctors[0];
    const response: ApiResponse<Doctor> = {
      success: true,
      data: {
        ...doctor,
        languages: doctor.languages ? JSON.parse(doctor.languages) : [],
        availability: doctor.availability ? JSON.parse(doctor.availability) : []
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching doctor:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch doctor'
    });
  }
};

// Search doctors
export const searchDoctors = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q } = req.query;
    const searchTerm = `%${q}%`;

    const [doctors] = await pool.query<RowDataPacket[]>(
      `SELECT
        id, name, email, phone, specialty, experience, rating, price, bio,
        image, location, languages, availability, verified, created_at, updated_at
      FROM doctors
      WHERE verified = true AND (
        name LIKE ? OR
        specialty LIKE ? OR
        location LIKE ? OR
        bio LIKE ?
      )
      ORDER BY
        CASE
          WHEN name LIKE ? THEN 1
          WHEN specialty LIKE ? THEN 2
          ELSE 3
        END, rating DESC`,
      [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm]
    );

    const response: ApiResponse = {
      success: true,
      data: doctors.map(doctor => ({
        ...doctor,
        languages: doctor.languages ? JSON.parse(doctor.languages) : [],
        availability: doctor.availability ? JSON.parse(doctor.availability) : []
      }))
    };

    res.json(response);
  } catch (error) {
    console.error('Error searching doctors:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search doctors'
    });
  }
};

// Get doctors by specialty
export const getDoctorsBySpecialty = async (req: Request, res: Response): Promise<void> => {
  try {
    const { specialty } = req.params;

    const [doctors] = await pool.query<RowDataPacket[]>(
      `SELECT
        id, name, email, phone, specialty, experience, rating, price, bio,
        image, location, languages, availability, verified, created_at, updated_at
      FROM doctors
      WHERE specialty = ? AND verified = true
      ORDER BY rating DESC, experience DESC`,
      [specialty]
    );

    const response: ApiResponse = {
      success: true,
      data: doctors.map(doctor => ({
        ...doctor,
        languages: doctor.languages ? JSON.parse(doctor.languages) : [],
        availability: doctor.availability ? JSON.parse(doctor.availability) : []
      }))
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching doctors by specialty:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch doctors by specialty'
    });
  }
};

// Get all specialties
export const getSpecialties = async (req: Request, res: Response): Promise<void> => {
  try {
    const [specialties] = await pool.query<RowDataPacket[]>(
      'SELECT DISTINCT specialty FROM doctors WHERE verified = true ORDER BY specialty'
    );

    const response: ApiResponse = {
      success: true,
      data: specialties.map(row => row.specialty)
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching specialties:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch specialties'
    });
  }
};

// Get doctor availability
export const getDoctorAvailability = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const [doctors] = await pool.query<RowDataPacket[]>(
      'SELECT availability FROM doctors WHERE id = ? AND verified = true',
      [id]
    );

    if (doctors.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Doctor not found'
      });
      return;
    }

    const availability = doctors[0].availability ? JSON.parse(doctors[0].availability) : [];

    const response: ApiResponse = {
      success: true,
      data: { availability }
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching doctor availability:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch doctor availability'
    });
  }
};

// Get doctor reviews (placeholder - would need reviews table)
export const getDoctorReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // This is a placeholder - in a real app you'd have a reviews table
    const response: ApiResponse = {
      success: true,
      data: [],
      message: 'Reviews feature not yet implemented'
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching doctor reviews:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch doctor reviews'
    });
  }
};