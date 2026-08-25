import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  MessageSquare,
  Send,
  Settings,
  MoreVertical,
  Clock,
  User
} from 'lucide-react';
import { format, parseISO, differenceInSeconds } from 'date-fns';
import { apiService } from '../services/apiService';
import { Appointment, Doctor, ChatMessage } from '../types';

const ConsultationPage: React.FC = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

  // Video/Audio Controls
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isCallActive, setIsCallActive] = useState(false);

  // Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showChat, setShowChat] = useState(false);

  // Timer
  const [consultationTime, setConsultationTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!appointmentId) {
        navigate('/appointments');
        return;
      }

      try {
        // In a real app, we'd fetch the appointment by ID
        const appointments = await apiService.getAppointments();
        const apt = appointments.find(a => a.id === appointmentId);

        if (!apt) {
          navigate('/appointments');
          return;
        }

        setAppointment(apt);

        const doctorData = await apiService.getDoctorById(apt.doctorId);
        setDoctor(doctorData);

        // Initialize mock chat messages
        setChatMessages([
          {
            id: '1',
            senderId: apt.doctorId,
            senderName: doctorData?.name || 'Doctor',
            message: 'Hello! I'm ready to begin our consultation. How are you feeling today?',
            timestamp: new Date().toISOString(),
            type: 'text'
          }
        ]);

      } catch (error) {
        console.error('Error fetching data:', error);
        navigate('/appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [appointmentId, navigate]);

  const startConsultation = () => {
    setIsCallActive(true);
    const interval = setInterval(() => {
      setConsultationTime(prev => prev + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  const endConsultation = () => {
    setIsCallActive(false);
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }

    // In a real app, we'd update the appointment status
    alert('Consultation ended. You will be redirected to your appointments.');
    navigate('/appointments');
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'patient1',
      senderName: 'You',
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    setChatMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate doctor response after a delay
    setTimeout(() => {
      const doctorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: doctor?.id || 'doctor',
        senderName: doctor?.name || 'Doctor',
        message: 'Thank you for sharing that information. Let me review what you've told me.',
        timestamp: new Date().toISOString(),
        type: 'text'
      };
      setChatMessages(prev => [...prev, doctorResponse]);
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading consultation...</p>
        </div>
      </div>
    );
  }

  if (!appointment || !doctor) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-xl font-semibold mb-4">Consultation Not Found</h2>
          <button
            onClick={() => navigate('/appointments')}
            className="btn btn-primary"
          >
            Back to Appointments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src={doctor.image}
            alt={doctor.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h3 className="font-semibold">{doctor.name}</h3>
            <p className="text-sm text-gray-400">{doctor.specialty}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {isCallActive && (
            <div className="flex items-center space-x-2 bg-red-600 px-3 py-1 rounded">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-mono">{formatTime(consultationTime)}</span>
            </div>
          )}

          <button className="p-2 hover:bg-gray-700 rounded">
            <Settings className="w-5 h-5" />
          </button>

          <button className="p-2 hover:bg-gray-700 rounded">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex h-screen">
        {/* Main Video Area */}
        <div className="flex-1 relative">
          {/* Doctor Video (Large) */}
          <div className="w-full h-full bg-gray-800 relative">
            {isCallActive ? (
              <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-16 h-16" />
                  </div>
                  <h3 className="text-xl font-semibold">{doctor.name}</h3>
                  <p className="text-blue-100">Video consultation in progress</p>
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                <div className="text-center">
                  <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">Ready to start consultation</h3>
                  <p className="text-gray-400 mb-6">
                    Scheduled for {format(parseISO(`${appointment.date}T${appointment.time}`), 'h:mm a')}
                  </p>
                  <button
                    onClick={startConsultation}
                    className="btn bg-green-600 text-white hover:bg-green-700"
                  >
                    Start Consultation
                  </button>
                </div>
              </div>
            )}

            {/* Patient Video (Small, Picture-in-Picture) */}
            {isCallActive && (
              <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-700 rounded-lg overflow-hidden">
                {isVideoEnabled ? (
                  <div className="w-full h-full bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center">
                    <div className="text-center">
                      <User className="w-8 h-8 mx-auto mb-1" />
                      <p className="text-xs">You</p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                    <VideoOff className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Controls */}
          {isCallActive && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <div className="flex items-center space-x-4 bg-gray-800 bg-opacity-80 backdrop-blur-sm rounded-full px-6 py-3">
                <button
                  onClick={toggleAudio}
                  className={`p-3 rounded-full transition-colors ${
                    isAudioEnabled
                      ? 'bg-gray-600 hover:bg-gray-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>

                <button
                  onClick={toggleVideo}
                  className={`p-3 rounded-full transition-colors ${
                    isVideoEnabled
                      ? 'bg-gray-600 hover:bg-gray-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </button>

                <button
                  onClick={() => setShowChat(!showChat)}
                  className="p-3 rounded-full bg-gray-600 hover:bg-gray-700 transition-colors"
                >
                  <MessageSquare className="w-5 h-5" />
                </button>

                <button
                  onClick={endConsultation}
                  className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
                >
                  <PhoneOff className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <div className="w-80 bg-gray-800 flex flex-col">
            {/* Chat Header */}
            <div className="px-4 py-3 border-b border-gray-700">
              <h4 className="font-semibold">Chat</h4>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === 'patient1' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg ${
                      message.senderId === 'patient1'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-white'
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                    <p className="text-xs opacity-75 mt-1">
                      {format(parseISO(message.timestamp), 'h:mm a')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="px-4 py-3 border-t border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 bg-gray-700 rounded text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  onClick={sendMessage}
                  className="p-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultationPage;