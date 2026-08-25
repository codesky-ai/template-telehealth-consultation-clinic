# TeleHealth Backend API

A comprehensive Node.js/Express backend API for a telehealth consultation platform built with TypeScript and MySQL.

## Features

- **Doctor Management**: CRUD operations for doctor profiles, specialties, availability
- **Patient Management**: Patient registration, profile management, medical history
- **Appointment System**: Scheduling, booking, cancellation, status management
- **Medical Records**: Electronic health records management
- **Consultation System**: Video/audio/chat consultation management
- **Real-time Communication**: WebSocket support for live consultations
- **Security**: Rate limiting, CORS protection, input validation
- **Database**: MySQL with connection pooling

## Prerequisites

- Node.js 16+ and npm
- MySQL 8.0+
- Git

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd telehealth-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment setup:**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials and configuration
   ```

4. **Database setup:**
   - Create MySQL database: `CREATE DATABASE telehealth_db;`
   - Run the database schema from `../database/schema.sql`
   - Seed with sample data from `../database/seed.sql`

## Configuration

Edit `.env` file with your settings:

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=telehealth_db

# Server
PORT=3001
NODE_ENV=development

# Security
JWT_SECRET=your_secret_key
```

## Running the Application

### Development Mode
```bash
npm run dev
# or
npm run watch
```

### Production Build
```bash
npm run build
npm start
```

## API Endpoints

### Health Check
```
GET /health - Server health status
```

### Doctors
```
GET    /api/doctors              - Get all doctors
GET    /api/doctors/:id          - Get doctor by ID
GET    /api/doctors/search       - Search doctors
GET    /api/doctors/specialty/:specialty - Get doctors by specialty
GET    /api/doctors/specialties  - Get all specialties
```

### Patients
```
GET    /api/patients             - Get all patients
GET    /api/patients/:id         - Get patient by ID
POST   /api/patients             - Create new patient
PUT    /api/patients/:id         - Update patient
DELETE /api/patients/:id         - Delete patient
```

### Appointments
```
GET    /api/appointments         - Get all appointments
GET    /api/appointments/:id     - Get appointment by ID
POST   /api/appointments         - Create appointment
PUT    /api/appointments/:id     - Update appointment
PATCH  /api/appointments/:id/cancel   - Cancel appointment
PATCH  /api/appointments/:id/complete - Complete appointment
```

### Medical Records
```
GET    /api/medical-records      - Get all medical records
GET    /api/medical-records/:id  - Get medical record by ID
POST   /api/medical-records      - Create medical record
PUT    /api/medical-records/:id  - Update medical record
DELETE /api/medical-records/:id  - Delete medical record
```

### Consultations
```
GET    /api/consultations        - Get all consultations
GET    /api/consultations/:id    - Get consultation by ID
POST   /api/consultations        - Create consultation
PATCH  /api/consultations/:id/start - Start consultation
PATCH  /api/consultations/:id/end   - End consultation
```

## Database Schema

The application uses MySQL with the following main tables:
- `doctors` - Doctor profiles and information
- `patients` - Patient profiles and personal information
- `appointments` - Appointment scheduling and management
- `medical_records` - Patient medical history and records
- `consultations` - Live consultation sessions

## Error Handling

The API returns standardized error responses:

```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional error details (development only)"
}
```

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Configurable allowed origins
- **Helmet**: Security headers protection
- **Input Validation**: Request data validation
- **SQL Injection Protection**: Parameterized queries

## Development

### Code Structure
```
src/
├── config/
│   └── database.ts        # Database connection
├── controllers/           # Request handlers
├── models/               # TypeScript interfaces
├── routes/               # Express routes
└── server.ts             # Main application file
```

### Adding New Endpoints

1. Define TypeScript interfaces in `models/`
2. Create controller functions in `controllers/`
3. Define routes in `routes/`
4. Update main routes in `routes/index.ts`

### Database Migrations

For database changes:
1. Update schema in `../database/schema.sql`
2. Add migration scripts if needed
3. Update TypeScript interfaces in `models/`

## Testing

```bash
# Run tests (when implemented)
npm test

# Run with coverage
npm run test:coverage
```

## Deployment

### Production Checklist

1. **Environment Variables:**
   - Set `NODE_ENV=production`
   - Configure production database
   - Set strong JWT secret
   - Configure SMTP for emails

2. **Security:**
   - Enable HTTPS
   - Configure firewall
   - Set up database backups
   - Configure monitoring

3. **Performance:**
   - Enable connection pooling
   - Configure caching (Redis)
   - Set up load balancing
   - Monitor resource usage

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
EXPOSE 3001
CMD ["node", "dist/server.js"]
```

## Monitoring

- Health check endpoint: `/health`
- Database connection status in logs
- Request/response logging
- Error tracking and reporting

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push branch: `git push origin feature/new-feature`
5. Submit pull request

## Support

For questions and support:
- Check the API documentation
- Review the database schema
- Check server logs for errors
- Verify environment configuration

## License

This project is licensed under the ISC License.