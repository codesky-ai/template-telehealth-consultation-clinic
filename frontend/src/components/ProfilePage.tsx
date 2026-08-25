import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, MapPin, Calendar, Heart, FileText, Edit2, Save, X } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { apiService } from '../services/apiService';
import { Patient, MedicalRecord } from '../types';

const ProfilePage: React.FC = () => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Patient>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientData, recordsData] = await Promise.all([
          apiService.getPatient(),
          apiService.getMedicalRecords(),
        ]);
        setPatient(patientData);
        setMedicalRecords(recordsData);
        setEditForm(patientData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm(patient || {});
  };

  const handleSave = async () => {
    if (!editForm) return;

    try {
      const updatedPatient = await apiService.updatePatient(editForm);
      setPatient(updatedPatient);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleInputChange = (field: keyof Patient, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEmergencyContactChange = (field: keyof Patient['emergencyContact'], value: string) => {
    setEditForm(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact!,
        [field]: value,
      },
    }));
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
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
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-3">
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

  if (!patient) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Not Found</h2>
          <p className="text-gray-600">Unable to load your profile information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        {!isEditing ? (
          <button onClick={handleEdit} className="btn btn-secondary">
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Profile
          </button>
        ) : (
          <div className="flex space-x-2">
            <button onClick={handleSave} className="btn btn-primary">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </button>
            <button onClick={handleCancel} className="btn btn-secondary">
              <X className="w-4 h-4 mr-2" />
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Profile Information */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{patient.name}</h2>
                <p className="text-gray-600">Patient ID: {patient.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="input"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>{patient.name}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editForm.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="input"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{patient.email}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editForm.phone || ''}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="input"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{patient.phone}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editForm.dateOfBirth || ''}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        className="input"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{format(parseISO(patient.dateOfBirth), 'MMMM d, yyyy')}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    {isEditing ? (
                      <select
                        value={editForm.gender || ''}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        className="input"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    ) : (
                      <span className="capitalize">{patient.gender}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    {isEditing ? (
                      <textarea
                        value={editForm.address || ''}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        rows={3}
                        className="input"
                      />
                    ) : (
                      <div className="flex items-start space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                        <span>{patient.address}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="text-md font-medium text-gray-800 mb-2">Emergency Contact</h4>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.emergencyContact?.name || ''}
                            onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
                            className="input"
                          />
                        ) : (
                          <span>{patient.emergencyContact.name}</span>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Phone</label>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={editForm.emergencyContact?.phone || ''}
                            onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
                            className="input"
                          />
                        ) : (
                          <span>{patient.emergencyContact.phone}</span>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Relationship</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.emergencyContact?.relationship || ''}
                            onChange={(e) => handleEmergencyContactChange('relationship', e.target.value)}
                            className="input"
                          />
                        ) : (
                          <span className="capitalize">{patient.emergencyContact.relationship}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Medical Records */}
        <div>
          <div className="card">
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900">Recent Medical Records</h3>
            </div>

            {medicalRecords.length === 0 ? (
              <div className="text-center py-6">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No medical records yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {medicalRecords.slice(0, 3).map((record) => (
                  <div key={record.id} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{record.diagnosis}</h4>
                        <p className="text-sm text-gray-600">Dr. {record.doctorName}</p>
                        <p className="text-sm text-gray-500">
                          {format(parseISO(record.date), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2">
                      <p className="text-sm text-gray-700">{record.treatment}</p>
                      {record.followUpDate && (
                        <p className="text-xs text-blue-600 mt-1">
                          Follow-up: {format(parseISO(record.followUpDate), 'MMM d, yyyy')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                {medicalRecords.length > 3 && (
                  <div className="text-center pt-4">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View All Records ({medicalRecords.length})
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;