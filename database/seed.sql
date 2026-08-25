-- TeleHealth Clinic Sample Data
-- Run after schema.sql: mysql -u root -p telehealth_db < seed.sql

USE telehealth_db;

-- Clear existing data
DELETE FROM payments;
DELETE FROM medical_records;
DELETE FROM consultations;
DELETE FROM appointments;
DELETE FROM patients;
DELETE FROM doctors;

-- Reset auto-increment counters (not applicable for UUID, but good practice)
-- ALTER TABLE doctors AUTO_INCREMENT = 1;

-- Insert sample doctors with real Unsplash images
INSERT INTO doctors (id, name, email, phone, specialty, license_number, experience, rating, price, bio, image, location, languages, availability, verified) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Dr. Sarah Johnson', 'sarah.johnson@telehealth.com', '+1-555-0101', 'General Medicine', 'MD123456', 8, 4.8, 75.00, 'Dr. Johnson specializes in general medicine with a focus on preventive care and chronic disease management. She believes in building long-term relationships with her patients to provide comprehensive healthcare.', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400', 'New York, NY', '["English", "Spanish"]', '["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]', true),

('550e8400-e29b-41d4-a716-446655440002', 'Dr. Michael Chen', 'michael.chen@telehealth.com', '+1-555-0102', 'Cardiology', 'MD234567', 12, 4.9, 120.00, 'Experienced cardiologist specializing in heart disease prevention and treatment. Dr. Chen has published numerous research papers on cardiovascular health and uses the latest evidence-based approaches.', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400', 'Los Angeles, CA', '["English", "Mandarin"]', '["10:00", "11:00", "15:00", "16:00"]', true),

('550e8400-e29b-41d4-a716-446655440003', 'Dr. Emily Rodriguez', 'emily.rodriguez@telehealth.com', '+1-555-0103', 'Dermatology', 'MD345678', 6, 4.7, 90.00, 'Dermatologist with expertise in skin cancer prevention and cosmetic procedures. Dr. Rodriguez is committed to helping patients achieve healthy, beautiful skin through both medical and aesthetic treatments.', 'https://images.unsplash.com/photo-1594824953513-8bb555cf2b3b?w=400', 'Miami, FL', '["English", "Spanish"]', '["09:00", "10:00", "13:00", "14:00", "15:00"]', true),

('550e8400-e29b-41d4-a716-446655440004', 'Dr. James Wilson', 'james.wilson@telehealth.com', '+1-555-0104', 'Psychiatry', 'MD456789', 15, 4.6, 100.00, 'Licensed psychiatrist specializing in anxiety, depression, and behavioral therapy. Dr. Wilson takes a holistic approach to mental health, combining medication management with therapeutic interventions.', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400', 'Chicago, IL', '["English"]', '["11:00", "12:00", "14:00", "15:00", "16:00"]', true),

('550e8400-e29b-41d4-a716-446655440005', 'Dr. Priya Patel', 'priya.patel@telehealth.com', '+1-555-0105', 'Pediatrics', 'MD567890', 10, 4.9, 80.00, 'Pediatric specialist with focus on child development and family health. Dr. Patel creates a comfortable environment for children and provides comprehensive care from infancy through adolescence.', 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400', 'Houston, TX', '["English", "Hindi", "Gujarati"]', '["08:00", "09:00", "10:00", "14:00", "15:00"]', true),

('550e8400-e29b-41d4-a716-446655440006', 'Dr. Robert Taylor', 'robert.taylor@telehealth.com', '+1-555-0106', 'Orthopedics', 'MD678901', 20, 4.8, 130.00, 'Orthopedic surgeon specializing in sports medicine and joint replacement. Dr. Taylor has extensive experience treating athletes and helping patients regain mobility and strength.', 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400', 'Denver, CO', '["English"]', '["09:00", "11:00", "13:00", "15:00"]', true),

('550e8400-e29b-41d4-a716-446655440007', 'Dr. Lisa Kim', 'lisa.kim@telehealth.com', '+1-555-0107', 'Obstetrics & Gynecology', 'MD789012', 9, 4.7, 95.00, 'OB/GYN specialist providing comprehensive womens health services. Dr. Kim is passionate about supporting women through all stages of life with compassionate, evidence-based care.', 'https://images.unsplash.com/photo-1594824953513-8bb555cf2b3b?w=400', 'Seattle, WA', '["English", "Korean"]', '["09:00", "10:00", "11:00", "14:00", "15:00"]', true),

('550e8400-e29b-41d4-a716-446655440008', 'Dr. David Martinez', 'david.martinez@telehealth.com', '+1-555-0108', 'Endocrinology', 'MD890123', 11, 4.8, 110.00, 'Endocrinologist specializing in diabetes management and hormone disorders. Dr. Martinez helps patients achieve optimal metabolic health through personalized treatment plans.', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400', 'Phoenix, AZ', '["English", "Spanish"]', '["10:00", "11:00", "14:00", "15:00", "16:00"]', true);

-- Insert sample patients
INSERT INTO patients (id, name, email, phone, date_of_birth, gender, address, emergency_contact_name, emergency_contact_phone, emergency_contact_relationship) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'John Doe', 'john.doe@email.com', '+1-555-1001', '1985-06-15', 'male', '123 Main Street, New York, NY 10001', 'Jane Doe', '+1-555-1002', 'spouse'),
('650e8400-e29b-41d4-a716-446655440002', 'Alice Smith', 'alice.smith@email.com', '+1-555-1003', '1992-03-22', 'female', '456 Oak Avenue, Los Angeles, CA 90210', 'Bob Smith', '+1-555-1004', 'spouse'),
('650e8400-e29b-41d4-a716-446655440003', 'Carlos Rodriguez', 'carlos.rodriguez@email.com', '+1-555-1005', '1978-11-08', 'male', '789 Pine Street, Miami, FL 33101', 'Maria Rodriguez', '+1-555-1006', 'spouse'),
('650e8400-e29b-41d4-a716-446655440004', 'Emma Johnson', 'emma.johnson@email.com', '+1-555-1007', '1988-09-14', 'female', '321 Elm Drive, Chicago, IL 60601', 'Michael Johnson', '+1-555-1008', 'spouse'),
('650e8400-e29b-41d4-a716-446655440005', 'Raj Patel', 'raj.patel@email.com', '+1-555-1009', '1995-12-03', 'male', '654 Maple Lane, Houston, TX 77001', 'Priya Patel', '+1-555-1010', 'sister');

-- Insert sample appointments
INSERT INTO appointments (id, patient_id, doctor_id, appointment_date, appointment_time, duration, type, status, reason, notes, price) VALUES
('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '2026-04-08', '10:00:00', 30, 'video', 'scheduled', 'Annual checkup', NULL, 75.00),
('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '2026-04-10', '15:00:00', 45, 'video', 'scheduled', 'Heart palpitations follow-up', NULL, 120.00),
('750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', '2026-04-05', '14:00:00', 30, 'video', 'completed', 'Skin examination', 'Recommend sunscreen SPF 50+. Follow-up in 6 months.', 90.00),
('750e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', '2026-04-12', '11:00:00', 60, 'video', 'scheduled', 'Anxiety consultation', NULL, 100.00),
('750e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440005', '2026-04-09', '09:00:00', 30, 'video', 'scheduled', 'Child wellness check', NULL, 80.00),
('750e8400-e29b-41d4-a716-446655440006', '650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440006', '2026-04-11', '13:00:00', 45, 'video', 'scheduled', 'Knee pain evaluation', NULL, 130.00),
('750e8400-e29b-41d4-a716-446655440007', '650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440008', '2026-04-07', '14:00:00', 30, 'video', 'completed', 'Diabetes management consultation', 'Continue current medication. Next A1C in 3 months.', 110.00);

-- Insert sample medical records
INSERT INTO medical_records (id, patient_id, doctor_id, appointment_id, diagnosis, symptoms, treatment, prescriptions, follow_up_date) VALUES
('850e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440003', 'Mild acne', 'Facial breakouts, oily skin', 'Topical retinoid cream, gentle cleanser', 'Tretinoin 0.025% cream - apply nightly', '2026-10-05'),
('850e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', NULL, 'Hypertension', 'Elevated blood pressure, headaches', 'ACE inhibitor medication, dietary changes', 'Lisinopril 10mg daily, low sodium diet', '2026-07-15'),
('850e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', NULL, 'Upper respiratory infection', 'Cough, congestion, sore throat', 'Rest, fluids, over-the-counter decongestant', 'Sudafed PE as needed, throat lozenges', NULL),
('850e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440008', '750e8400-e29b-41d4-a716-446655440007', 'Type 2 Diabetes', 'Elevated blood glucose, fatigue, increased thirst', 'Metformin, lifestyle modifications', 'Metformin 500mg twice daily, glucose monitoring', '2026-07-07');

-- Insert sample consultations
INSERT INTO consultations (id, appointment_id, start_time, end_time, status, recording_url) VALUES
('950e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440003', '2026-04-05 14:00:00', '2026-04-05 14:30:00', 'ended', NULL),
('950e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440007', '2026-04-07 14:00:00', '2026-04-07 14:30:00', 'ended', NULL);

-- Insert sample payments
INSERT INTO payments (id, appointment_id, patient_id, amount, currency, status, payment_method, transaction_id, payment_date) VALUES
('a50e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440001', 90.00, 'USD', 'completed', 'credit_card', 'txn_1234567890', '2026-04-05 13:45:00'),
('a50e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440007', '650e8400-e29b-41d4-a716-446655440005', 110.00, 'USD', 'completed', 'credit_card', 'txn_1234567891', '2026-04-07 13:30:00'),
('a50e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 75.00, 'USD', 'pending', 'credit_card', NULL, NULL),
('a50e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001', 120.00, 'USD', 'pending', 'credit_card', NULL, NULL);

-- Verify data insertion
SELECT 'Doctors' as Table_Name, COUNT(*) as Record_Count FROM doctors
UNION ALL
SELECT 'Patients', COUNT(*) FROM patients
UNION ALL
SELECT 'Appointments', COUNT(*) FROM appointments
UNION ALL
SELECT 'Medical Records', COUNT(*) FROM medical_records
UNION ALL
SELECT 'Consultations', COUNT(*) FROM consultations
UNION ALL
SELECT 'Payments', COUNT(*) FROM payments;

-- Show sample data from each table
SELECT 'Recent Doctors:' as Info;
SELECT name, specialty, rating, price, location FROM doctors ORDER BY created_at DESC LIMIT 3;

SELECT 'Recent Appointments:' as Info;
SELECT
    a.appointment_date,
    a.appointment_time,
    d.name as doctor_name,
    p.name as patient_name,
    a.status
FROM appointments a
JOIN doctors d ON a.doctor_id = d.id
JOIN patients p ON a.patient_id = p.id
ORDER BY a.created_at DESC
LIMIT 5;

SELECT 'Database setup completed successfully!' as Status;