# TeleHealth Consultation Clinic

A comprehensive full-stack telehealth application built with React, Node.js, Express, TypeScript, and MySQL.

## 🏥 Features

### Patient Features
- **User Registration & Profile Management** - Complete patient profiles with medical history
- **Doctor Discovery** - Search and filter doctors by specialty, location, rating, and availability
- **Appointment Booking** - Schedule video, audio, or chat consultations with preferred doctors
- **Virtual Consultations** - Secure video calls with real-time chat functionality
- **Medical Records** - Access to complete medical history and consultation notes
- **Payment Integration** - Secure payment processing for consultations

### Doctor Features
- **Professional Profiles** - Detailed doctor profiles with specialties, experience, and ratings
- **Availability Management** - Flexible scheduling and availability settings
- **Patient Management** - Access to patient information and medical histories
- **Consultation Platform** - Integrated video/audio consultation interface
- **Medical Records** - Create and manage patient medical records and prescriptions

### System Features
- **Real-time Communication** - WebRTC-based video/audio consultations
- **Responsive Design** - Mobile-friendly interface across all devices
- **Secure Authentication** - JWT-based authentication and authorization
- **API Integration** - RESTful API with fallback to mock data
- **Database Management** - MySQL with comprehensive relational schema

## 🏗️ Architecture

```
📁 TeleHealth Clinic/
├── 📁 frontend/          # React + TypeScript + Vite
├── 📁 backend/           # Node.js + Express + TypeScript
└── 📁 database/          # MySQL schema and sample data
```

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **Styling**: Tailwind CSS for responsive design
- **Routing**: React Router for single-page application navigation
- **API Client**: Axios with automatic fallback to mock data
- **Icons**: Lucide React for consistent iconography
- **Date Handling**: date-fns for date manipulation and formatting

### Backend (Node.js + Express)
- **Runtime**: Node.js with Express framework
- **Language**: TypeScript for type safety
- **Database**: MySQL with mysql2 driver
- **Security**: Helmet, CORS, rate limiting
- **API**: RESTful endpoints with standardized responses
- **Real-time**: Socket.IO ready for real-time features

### Database (MySQL)
- **Engine**: MySQL 8.0+ with InnoDB tables
- **Schema**: Fully normalized relational design
- **Features**: UUID primary keys, JSON fields, full-text search
- **Sample Data**: Complete dataset with realistic medical scenarios

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- MySQL 8.0+
- Git

### Installation

1. **Clone and setup the project:**
   ```bash
   git clone <repository-url>
   cd telehealth-clinic
   ```

2. **Setup Database:**
   ```bash
   # Create database and tables
   mysql -u root -p < database/schema.sql
   
   # Insert sample data
   mysql -u root -p telehealth_db < database/seed.sql
   ```

3. **Setup Backend:**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your database credentials
   npm install
   npm run dev
   ```

4. **Setup Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - Health Check: http://localhost:3001/health

## 📱 Application Screenshots

### Homepage
The landing page showcases featured doctors, specialties, and easy appointment booking.

### Doctor Discovery
Advanced search and filtering by specialty, location, rating, and availability.

### Appointment Booking
Streamlined booking process with consultation type selection and real-time availability.

### Virtual Consultation
Secure video consultation interface with chat and medical recording capabilities.

### Patient Dashboard
Comprehensive view of appointments, medical history, and profile management.

## 🔧 Configuration

### Frontend Configuration
- **Vite Config**: Optimized for development and production
- **API Integration**: Automatic fallback from API to mock data
- **Tailwind CSS**: Utility-first styling with responsive design
- **TypeScript**: Strict type checking for reliability

### Backend Configuration
- **Environment Variables**: Comprehensive configuration via .env
- **Database Connection**: MySQL connection pooling
- **Security**: CORS, rate limiting, and security headers
- **API Documentation**: Standardized REST endpoints

### Database Configuration
- **Character Set**: UTF-8 support for international content
- **Indexes**: Optimized for common query patterns
- **Relationships**: Proper foreign key constraints
- **Sample Data**: Realistic healthcare scenarios with Unsplash images

## 🔒 Security Features

- **Data Protection**: HIPAA-compliant data handling practices
- **Authentication**: JWT-based secure authentication
- **API Security**: Rate limiting and request validation
- **Database Security**: Parameterized queries and input sanitization
- **HTTPS Ready**: Production-ready security configuration

## 🎨 Design System

- **Color Scheme**: Medical-friendly blue and green palette
- **Typography**: Clean, readable fonts optimized for healthcare
- **Components**: Reusable UI components for consistency
- **Responsive**: Mobile-first design approach
- **Accessibility**: WCAG-compliant design practices

## 📚 API Documentation

### Core Endpoints
- **Doctors**: `/api/doctors` - Doctor management and search
- **Patients**: `/api/patients` - Patient profile management
- **Appointments**: `/api/appointments` - Appointment scheduling
- **Medical Records**: `/api/medical-records` - Medical history
- **Consultations**: `/api/consultations` - Video consultation management

### Response Format
```json
{
  "success": true,
  "data": {...},
  "message": "Operation completed successfully",
  "pagination": {...}
}
```

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm run test

# Backend tests
cd backend
npm run test

# End-to-end tests
npm run test:e2e
```

## 📦 Deployment

### Production Build
```bash
# Frontend production build
cd frontend
npm run build

# Backend production build
cd backend
npm run build
npm start
```

### Environment Setup
1. Configure production database
2. Set environment variables
3. Enable HTTPS
4. Configure domain and CORS
5. Set up monitoring and logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Unsplash**: High-quality images for doctor profiles
- **Lucide Icons**: Beautiful icon set for UI elements
- **Tailwind CSS**: Utility-first CSS framework
- **React Ecosystem**: Amazing tools and libraries
- **MySQL**: Reliable and scalable database solution

## 📞 Support

For support and questions:
- Check the README files in each module
- Review the API documentation
- Check the database schema documentation
- Submit issues through GitHub

---

Built with ❤️ for better healthcare accessibility