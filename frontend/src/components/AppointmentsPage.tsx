import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Video, Phone, MessageSquare, X, CheckCircle } from 'lucide-react';
import { format, parseISO, isFuture, isPast } from 'date-fns';
import { apiService } from '../services/apiService';
import { Appointment, Doctor } from '../types';

const AppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'all'>('upcoming');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appointmentsData, doctorsData] = await Promise.all([
          apiService.getAppointments(),
          apiService.getDoctors(),
        ]);
        setAppointments(appointmentsData);
        setDoctors(doctorsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getDoctorById = (id: string) => {
    return doctors.find(doctor => doctor.id === id);
  };

  const getAppointmentIcon = (type: string) => {
    switch (type) {
      case 'video':
        return Video;
      case 'audio':
        return Phone;
      case 'chat':
        return MessageSquare;
      default:
        return Video;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'text-blue-600 bg-blue-100';
      case 'in-progress':
        return 'text-green-600 bg-green-100';
      case 'completed':
        return 'text-gray-600 bg-gray-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDateTime = parseISO(`${appointment.date}T${appointment.time}`);

    switch (activeTab) {
      case 'upcoming':
        return appointment.status === 'scheduled' && isFuture(appointmentDateTime);
      case 'completed':
        return appointment.status === 'completed' || (appointment.status === 'scheduled' && isPast(appointmentDateTime));
      case 'all':
      default:
        return true;
    }
  });

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      await apiService.cancelAppointment(appointmentId);
      setAppointments(appointments.map(apt =>
        apt.id === appointmentId ? { ...apt, status: 'cancelled' } : apt
      ));
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      alert('Failed to cancel appointment. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">My Appointments</h1>
        <p className="text-lg text-gray-600">
          Manage your healthcare appointments and consultations
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'upcoming', label: 'Upcoming', count: filteredAppointments.filter(apt => apt.status === 'scheduled').length },
              { id: 'completed', label: 'Completed', count: filteredAppointments.filter(apt => apt.status === 'completed').length },
              { id: 'all', label: 'All', count: appointments.length },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Appointments List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
          <p className="text-gray-600 mb-6">
            {activeTab === 'upcoming'
              ? "You don't have any upcoming appointments."
              : activeTab === 'completed'
              ? "You don't have any completed appointments yet."
              : "You haven't scheduled any appointments yet."
            }
          </p>
          <Link to="/doctors" className="btn btn-primary">
            Book an Appointment
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => {
            const doctor = getDoctorById(appointment.doctorId);
            const Icon = getAppointmentIcon(appointment.type);
            const appointmentDateTime = parseISO(`${appointment.date}T${appointment.time}`);
            const isUpcoming = isFuture(appointmentDateTime);

            return (
              <div key={appointment.id} className="card hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    {/* Doctor Image */}
                    <img
                      src={doctor?.image || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400'}
                      alt={doctor?.name || 'Doctor'}
                      className="w-16 h-16 rounded-full object-cover"
                    />

                    {/* Appointment Details */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {doctor?.name || 'Unknown Doctor'}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                          {appointment.status.replace('-', ' ')}
                        </span>
                      </div>

                      <p className="text-blue-600 font-medium mb-2">{doctor?.specialty}</p>

                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{format(appointmentDateTime, 'EEEE, MMMM d, yyyy')}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{format(appointmentDateTime, 'h:mm a')}</span>
                          <span>• {appointment.duration} minutes</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Icon className="w-4 h-4" />
                          <span className="capitalize">{appointment.type} consultation</span>
                        </div>

                        <p className="mt-2">
                          <span className="font-medium">Reason:</span> {appointment.reason}
                        </p>

                        {appointment.notes && (
                          <p className="mt-2">
                            <span className="font-medium">Notes:</span> {appointment.notes}
                          </p>
                        )}
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-lg font-bold text-green-600">${appointment.price}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-2">
                    {appointment.status === 'scheduled' && isUpcoming && (
                      <>
                        <Link
                          to={`/consultation/${appointment.id}`}
                          className="btn btn-primary text-sm"
                        >
                          <Video className="w-4 h-4 mr-1" />
                          Join
                        </Link>
                        <button
                          onClick={() => handleCancelAppointment(appointment.id)}
                          className="btn bg-red-100 text-red-700 hover:bg-red-200 text-sm"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </button>
                      </>
                    )}

                    {appointment.status === 'completed' && (
                      <div className="flex items-center text-green-600 text-sm">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Completed
                      </div>
                    )}

                    {appointment.status === 'cancelled' && (
                      <div className="flex items-center text-red-600 text-sm">
                        <X className="w-4 h-4 mr-1" />
                        Cancelled
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Action */}
      {filteredAppointments.length > 0 && (
        <div className="mt-8 text-center">
          <Link
            to="/doctors"
            className="btn btn-secondary"
          >
            Book Another Appointment
          </Link>
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;