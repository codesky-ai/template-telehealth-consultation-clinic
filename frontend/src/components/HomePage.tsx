import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Video, Shield, Clock, Users } from 'lucide-react';
import { apiService } from '../services/apiService';
import { Doctor } from '../types';

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredDoctors, setFeaturedDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedDoctors = async () => {
      try {
        const doctors = await apiService.getDoctors();
        setFeaturedDoctors(doctors.slice(0, 3));
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedDoctors();
  }, []);

  const features = [
    {
      icon: Video,
      title: 'Video Consultations',
      description: 'Connect with doctors through secure video calls from anywhere.',
    },
    {
      icon: Calendar,
      title: 'Easy Scheduling',
      description: 'Book appointments with your preferred doctors in just a few clicks.',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your health data is protected with enterprise-grade security.',
    },
    {
      icon: Clock,
      title: '24/7 Access',
      description: 'Get healthcare support whenever you need it, day or night.',
    },
  ];

  const specialties = [
    'General Medicine',
    'Cardiology',
    'Dermatology',
    'Psychiatry',
    'Pediatrics',
    'Orthopedics',
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Healthcare at Your Fingertips
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Connect with qualified doctors through secure video consultations
            </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search doctors or specialties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                />
              </div>
            </div>

            <Link
              to="/doctors"
              className="inline-flex items-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Users className="w-5 h-5 mr-2" />
              Find a Doctor
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose TeleHealth?
            </h2>
            <p className="text-lg text-gray-600">
              Experience healthcare that's convenient, secure, and always accessible
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <Icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Medical Specialties
            </h2>
            <p className="text-lg text-gray-600">
              Find specialists for your specific health needs
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {specialties.map((specialty) => (
              <Link
                key={specialty}
                to={`/doctors?specialty=${encodeURIComponent(specialty)}`}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <h3 className="font-medium text-gray-900">{specialty}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Doctors */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Doctors
            </h2>
            <p className="text-lg text-gray-600">
              Meet some of our top-rated healthcare professionals
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card animate-pulse">
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredDoctors.map((doctor) => (
                <div key={doctor.id} className="card hover:shadow-lg transition-shadow">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {doctor.name}
                  </h3>
                  <p className="text-blue-600 font-medium mb-2">{doctor.specialty}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">
                      {doctor.experience} years experience
                    </span>
                    <span className="text-sm font-medium text-green-600">
                      ⭐ {doctor.rating}
                    </span>
                  </div>
                  <Link
                    to={`/book/${doctor.id}`}
                    className="w-full btn btn-primary text-center inline-block"
                  >
                    Book Appointment
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Healthcare Journey?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of patients who trust TeleHealth for their medical needs
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Link
              to="/doctors"
              className="btn bg-white text-blue-600 hover:bg-gray-100 inline-block w-full sm:w-auto"
            >
              Find a Doctor
            </Link>
            <Link
              to="/appointments"
              className="btn bg-blue-700 text-white hover:bg-blue-800 inline-block w-full sm:w-auto"
            >
              View Appointments
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;