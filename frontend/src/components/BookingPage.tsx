import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Video, Phone, MessageSquare, Star, MapPin, DollarSign, CheckCircle } from 'lucide-react';
import { format, addDays, startOfToday, isSameDay, parseISO } from 'date-fns';
import { apiService } from '../services/apiService';
import { Doctor, Appointment } from '../types';

const BookingPage: React.FC = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [consultationType, setConsultationType] = useState<'video' | 'audio' | 'chat'>('video');
  const [reason, setReason] = useState<string>('');
  const [isBooking, setIsBooking] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [newAppointment, setNewAppointment] = useState<Appointment | null>(null);

  // Generate available dates for the next 30 days
  const availableDates = Array.from({ length: 30 }, (_, i) => addDays(startOfToday(), i));

  const consultationTypes = [
    {
      type: 'video' as const,
      icon: Video,
      title: 'Video Call',
      description: 'Face-to-face consultation',
      duration: 30,
      additionalCost: 0,
    },
    {
      type: 'audio' as const,
      icon: Phone,
      title: 'Voice Call',
      description: 'Audio-only consultation',
      duration: 30,
      additionalCost: -10,
    },
    {
      type: 'chat' as const,
      icon: MessageSquare,
      title: 'Text Chat',
      description: 'Written consultation',
      duration: 45,
      additionalCost: -20,
    },
  ];

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!doctorId) {
        navigate('/doctors');
        return;
      }

      try {
        const data = await apiService.getDoctorById(doctorId);
        if (!data) {
          navigate('/doctors');
          return;
        }
        setDoctor(data);
      } catch (error) {
        console.error('Error fetching doctor:', error);
        navigate('/doctors');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [doctorId, navigate]);

  const handleBooking = async () => {
    if (!doctor || !selectedTime || !reason.trim()) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsBooking(true);

    const selectedConsultation = consultationTypes.find(c => c.type === consultationType);
    const appointmentData = {
      doctorId: doctor.id,
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: selectedTime,
      type: consultationType,
      reason: reason.trim(),
      duration: selectedConsultation?.duration || 30,
      price: doctor.price + (selectedConsultation?.additionalCost || 0),
    };

    try {
      const appointment = await apiService.bookAppointment(appointmentData);
      setNewAppointment(appointment);
      setBookingComplete(true);
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  const formatPrice = (basePrice: number, additionalCost: number = 0) => {
    return basePrice + additionalCost;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="card">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <div className="card">
                <div className="h-32 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Doctor Not Found</h2>
          <p className="text-gray-600 mb-6">The requested doctor could not be found.</p>
          <button onClick={() => navigate('/doctors')} className="btn btn-primary">
            Browse Doctors
          </button>
        </div>
      </div>
    );
  }

  if (bookingComplete && newAppointment) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
          <p className="text-gray-600 mb-8">
            Your appointment has been successfully booked. You'll receive a confirmation email shortly.
          </p>

          <div className="card text-left mb-8">
            <h3 className="text-lg font-semibold mb-4">Appointment Details</h3>
            <div className="space-y-2">
              <p><strong>Doctor:</strong> {doctor.name}</p>
              <p><strong>Date:</strong> {format(parseISO(`${newAppointment.date}T${newAppointment.time}`), 'EEEE, MMMM d, yyyy')}</p>
              <p><strong>Time:</strong> {format(parseISO(`${newAppointment.date}T${newAppointment.time}`), 'h:mm a')}</p>
              <p><strong>Type:</strong> {consultationType} consultation</p>
              <p><strong>Duration:</strong> {newAppointment.duration} minutes</p>
              <p><strong>Total:</strong> <span className="text-green-600 font-bold">${newAppointment.price}</span></p>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex">
            <button
              onClick={() => navigate('/appointments')}
              className="btn btn-primary w-full sm:w-auto"
            >
              View My Appointments
            </button>
            <button
              onClick={() => navigate('/doctors')}
              className="btn btn-secondary w-full sm:w-auto"
            >
              Book Another Appointment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Book an Appointment</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Consultation Type */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Select Consultation Type
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {consultationTypes.map(({ type, icon: Icon, title, description, additionalCost }) => (
                <button
                  key={type}
                  onClick={() => setConsultationType(type)}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    consultationType === type
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className={`w-8 h-8 mx-auto mb-2 ${
                    consultationType === type ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  <h3 className="font-medium text-gray-900">{title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{description}</p>
                  <p className="text-sm font-medium text-green-600">
                    ${formatPrice(doctor.price, additionalCost)}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Date Selection */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Select Date
            </h2>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {availableDates.slice(0, 14).map((date) => (
                <button
                  key={date.toISOString()}
                  onClick={() => setSelectedDate(date)}
                  className={`p-3 rounded-lg text-center transition-all ${
                    isSameDay(date, selectedDate)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="text-xs font-medium">
                    {format(date, 'EEE')}
                  </div>
                  <div className="text-sm font-bold">
                    {format(date, 'd')}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Time Selection */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Select Time
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {doctor.availability.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`p-3 rounded-lg text-center transition-all ${
                    selectedTime === time
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Reason for Visit */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Reason for Visit *
            </h2>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please describe your symptoms or reason for consultation..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        {/* Doctor Summary & Booking Summary */}
        <div className="space-y-6">
          {/* Doctor Card */}
          <div className="card">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-900 mb-1">{doctor.name}</h3>
            <p className="text-blue-600 font-medium mb-3">{doctor.specialty}</p>

            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>{doctor.rating} rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>{doctor.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>{doctor.experience} years experience</span>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">{doctor.bio}</p>

            <div className="flex flex-wrap gap-1">
              {doctor.languages.map((lang) => (
                <span
                  key={lang}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>

          {/* Booking Summary */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Booking Summary
            </h3>

            {selectedDate && selectedTime ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Date</span>
                  <span className="font-medium">
                    {format(selectedDate, 'MMM d, yyyy')}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Time</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Type</span>
                  <span className="font-medium capitalize">{consultationType}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">
                    {consultationTypes.find(c => c.type === consultationType)?.duration} min
                  </span>
                </div>

                <hr className="my-3" />

                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-green-600">
                    <DollarSign className="w-5 h-5 inline" />
                    {formatPrice(
                      doctor.price,
                      consultationTypes.find(c => c.type === consultationType)?.additionalCost || 0
                    )}
                  </span>
                </div>

                <button
                  onClick={handleBooking}
                  disabled={isBooking || !reason.trim()}
                  className="w-full btn btn-primary mt-4"
                >
                  {isBooking ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Please select a date and time to see the summary
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;