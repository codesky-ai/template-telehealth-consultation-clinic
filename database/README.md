# TeleHealth Database

MySQL database schema and sample data for the TeleHealth consultation clinic application.

## Overview

This database supports a comprehensive telehealth platform with:
- Doctor profiles and availability management
- Patient registration and medical history
- Appointment scheduling and management  
- Medical records and consultation tracking
- Payment processing and transaction history

## Prerequisites

- MySQL Server 8.0 or higher
- MySQL client or MySQL Workbench
- Administrative access to create databases

## Database Setup

### 1. Create Database and Tables

Run the schema script to create the database structure:

```bash
mysql -u root -p < schema.sql
```

This will:
- Create the `telehealth_db` database
- Set up proper UTF-8 character encoding
- Create all required tables with relationships
- Add performance indexes
- Enable full-text search capabilities

### 2. Insert Sample Data

Populate the database with sample data:

```bash
mysql -u root -p telehealth_db < seed.sql
```

This adds:
- 8 sample doctors across different specialties
- 5 sample patients with complete profiles
- 7 sample appointments with various statuses
- 4 medical records with diagnoses and treatments
- 2 completed consultations
- 4 payment records

### 3. Verify Installation

Connect to verify the setup:

```sql
mysql -u root -p telehealth_db

-- Check all tables exist
SHOW TABLES;

-- Verify sample data
SELECT COUNT(*) FROM doctors;
SELECT COUNT(*) FROM patients;  
SELECT COUNT(*) FROM appointments;
```

## Database Schema

### Core Tables

**doctors**
- Doctor profiles, specialties, availability, pricing
- Includes verification status and ratings
- Stores availability as JSON array

**patients** 
- Patient demographics and contact information
- Emergency contact details
- Medical history references

**appointments**
- Scheduling with date/time, duration, type
- Links patients and doctors
- Status tracking (scheduled, in-progress, completed, cancelled)

**medical_records**
- Patient diagnoses, symptoms, treatments
- Links to appointments and doctors
- Prescription and follow-up tracking

**consultations**
- Live consultation session management
- Start/end times and recording URLs
- Status tracking for active sessions

**payments**
- Payment processing and transaction history
- Multiple payment method support
- Status tracking and refund management

### Key Features

**UUID Primary Keys**: All tables use UUID primary keys for security and scalability

**JSON Storage**: Doctor availability and languages stored as JSON for flexibility

**Full-Text Search**: Enabled on doctor names, specialties, and bios for fast searching

**Proper Relationships**: Foreign key constraints ensure data integrity

**Timestamps**: All tables have created_at and updated_at tracking

**Indexes**: Optimized indexes for common query patterns

## Sample Data Details

### Doctors
- 8 doctors across major specialties
- Real Unsplash profile images
- Varied experience levels (6-20 years)
- Different pricing ($75-$130 per consultation)
- Multiple languages and locations
- Realistic availability schedules

### Patients  
- 5 diverse patient profiles
- Complete demographic information
- Emergency contact details
- Various ages and genders

### Appointments
- Mix of scheduled, completed, and cancelled appointments
- Different consultation types (video, audio, chat)
- Realistic scheduling across multiple days
- Proper patient-doctor assignments

### Medical Records
- Varied diagnoses and treatments
- Prescription details
- Follow-up scheduling
- Links to completed appointments

## Configuration for Backend

Update your backend `.env` file:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=telehealth_db
```

## Performance Optimization

### Indexes Created
- Specialty, location, rating for doctor searches
- Date, status for appointment queries  
- Patient and doctor IDs for relationship lookups
- Full-text indexes for search functionality

### Query Optimization Tips
- Use LIMIT for pagination
- Filter by indexes (specialty, status, date)
- Use JOIN instead of subqueries where possible
- Consider caching for frequently accessed data

## Data Management

### Backup
```bash
# Create backup
mysqldump -u root -p telehealth_db > telehealth_backup.sql

# Restore from backup
mysql -u root -p telehealth_db < telehealth_backup.sql
```

### Reset Database
```bash
# Drop and recreate (WARNING: destroys all data)
mysql -u root -p -e "DROP DATABASE telehealth_db;"
mysql -u root -p < schema.sql
mysql -u root -p telehealth_db < seed.sql
```

### Add New Sample Data
```sql
-- Add new doctor
INSERT INTO doctors (id, name, email, specialty, ...) VALUES
('new-uuid', 'Dr. New Doctor', 'email@example.com', 'Specialty', ...);

-- Add new patient  
INSERT INTO patients (id, name, email, ...) VALUES
('new-uuid', 'New Patient', 'patient@example.com', ...);
```

## Production Considerations

### Security
- Use strong database passwords
- Limit database user permissions
- Enable SSL connections
- Regularly update MySQL version

### Performance  
- Configure proper buffer sizes
- Enable query cache
- Monitor slow query log
- Consider read replicas for scaling

### Monitoring
- Set up database monitoring
- Configure automated backups
- Monitor disk space usage
- Track connection pool usage

### Compliance
- Implement data encryption at rest
- Set up audit logging
- Configure data retention policies
- Ensure HIPAA compliance for health data

## Troubleshooting

### Common Issues

**Connection Failed**
- Verify MySQL service is running
- Check host/port configuration
- Confirm user credentials
- Test network connectivity

**Character Encoding Issues**
- Ensure utf8mb4 charset is used
- Check client connection charset
- Verify column definitions

**Slow Queries**
- Check EXPLAIN output
- Verify indexes are being used
- Consider query optimization
- Monitor server resources

### Useful Commands

```sql
-- Show database status
SHOW STATUS LIKE 'Connections%';
SHOW STATUS LIKE 'Threads%';

-- Check table sizes
SELECT 
  TABLE_NAME,
  ROUND(((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024), 2) AS 'Size (MB)'
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = 'telehealth_db';

-- Show running processes
SHOW PROCESSLIST;

-- Check for locks
SHOW ENGINE INNODB STATUS;
```

## Support

For database issues:
1. Check MySQL error log
2. Verify table structure matches schema
3. Confirm sample data loaded correctly
4. Test basic queries manually
5. Check backend database connection settings