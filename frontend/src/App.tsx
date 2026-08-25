import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './components/HomePage';
import DoctorsPage from './components/DoctorsPage';
import AppointmentsPage from './components/AppointmentsPage';
import ProfilePage from './components/ProfilePage';
import BookingPage from './components/BookingPage';
import ConsultationPage from './components/ConsultationPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/book/:doctorId" element={<BookingPage />} />
            <Route path="/consultation/:appointmentId" element={<ConsultationPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;