import React, { useState, useEffect } from 'react';
import DoctorLayout from '../../components/layout/doctor_layout';
import { 
  CalendarIcon, 
  ClockIcon, 
  VideoCameraIcon, 
  PhoneIcon,
  EnvelopeIcon,
  UserCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClipboardDocumentCheckIcon,
  ExclamationCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useAuth } from '../../../context/AuthContext';
import { format, parseISO, isSameDay } from 'date-fns';

const DoctorAppointments = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState({});
  const [expandedAppointment, setExpandedAppointment] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const appointmentsRef = collection(db, 'bookings');
        const q = query(
          appointmentsRef,
          where('doctorId', '==', user.uid),
          where('status', 'in', ['pending', 'confirmed', 'completed', 'cancelled'])
        );

        const querySnapshot = await getDocs(q);
        const appointmentsData = [];
        const patientIds = new Set();

        querySnapshot.docs.forEach(doc => {
          const data = doc.data();
          appointmentsData.push({
            id: doc.id,
            ...data,
            appointmentDate: data.appointmentDate.toDate()
          });
          patientIds.add(data.userId);
        });

        // Fetch patient details
        const patientsData = {};
        for (const patientId of patientIds) {
          const patientDoc = await getDoc(doc(db, 'users', patientId));
          if (patientDoc.exists()) {
            patientsData[patientId] = patientDoc.data();
          }
        }

        setAppointments(appointmentsData);
        setPatients(patientsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setLoading(false);
      }
    };

    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const generateCalendarDays = () => {
    const days = [];
    const today = new Date();
    for (let i = -15; i < 15; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const formatDate = (date) => {
    return format(date, 'EEE d');
  };

  const isToday = (date) => {
    return isSameDay(date, new Date());
  };

  const isSelected = (date) => {
    return isSameDay(date, selectedDate);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-50 text-green-700';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700';
      case 'cancelled':
        return 'bg-red-50 text-red-700';
      case 'completed':
        return 'bg-blue-50 text-blue-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <ExclamationCircleIcon className="h-5 w-5 text-yellow-500" />;
      case 'cancelled':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'completed':
        return <ClipboardDocumentCheckIcon className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      const appointmentRef = doc(db, 'bookings', appointmentId);
      await updateDoc(appointmentRef, {
        status: newStatus
      });

      // Update local state
      setAppointments(appointments.map(apt => 
        apt.id === appointmentId ? { ...apt, status: newStatus } : apt
      ));
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  const filteredAppointments = appointments.filter(appointment => 
    isSameDay(appointment.appointmentDate, selectedDate)
  );

  const toggleAppointmentExpansion = (appointmentId) => {
    if (expandedAppointment === appointmentId) {
      setExpandedAppointment(null);
    } else {
      setExpandedAppointment(appointmentId);
    }
  };

  if (loading) {
    return (
      <DoctorLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DoctorLayout>
    );
  }

  return (
    <DoctorLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
              <p className="mt-1 text-gray-600">Manage your upcoming appointments and schedule</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-lg">
                <CalendarIcon className="h-5 w-5 mr-2" />
                <span className="font-medium">
                  {format(selectedDate, 'MMMM d, yyyy')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Strip */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {generateCalendarDays().map((date, index) => (
              <button
                key={index}
                onClick={() => setSelectedDate(date)}
                className={`flex flex-col items-center min-w-[80px] p-3 rounded-xl transition-all ${
                  isSelected(date)
                    ? 'bg-primary text-white shadow-lg transform scale-105'
                    : isToday(date)
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-gray-50'
                }`}
              >
                <span className="text-sm font-medium">{format(date, 'EEE')}</span>
                <span className="text-lg font-bold mt-1">{format(date, 'd')}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </h2>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredAppointments.length === 0 ? (
              <div className="p-6 text-center">
                <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No appointments scheduled</h3>
                <p className="mt-1 text-gray-500">There are no appointments scheduled for this date.</p>
              </div>
            ) : (
              filteredAppointments.map((appointment) => {
                const patient = patients[appointment.userId] || {};
                const isExpanded = expandedAppointment === appointment.id;
                
                return (
                  <div 
                    key={appointment.id} 
                    className={`transition-all ${isExpanded ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            {patient.photoURL ? (
                              <img 
                                src={patient.photoURL} 
                                alt={patient.displayName}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-primary font-semibold">
                                  {patient.displayName ? patient.displayName.split(' ').map(n => n[0]).join('') : '??'}
                                </span>
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {patient.displayName || 'Loading...'}
                            </h3>
                            <div className="mt-1 flex items-center space-x-2">
                              <ClockIcon className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{appointment.timeSlot}</span>
                              <span className="text-sm text-gray-400">•</span>
                              <span className="text-sm text-gray-600">₹{appointment.consultationFee}</span>
                            </div>
                            <div className="mt-2 flex items-center space-x-4">
                              <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                                {getStatusIcon(appointment.status)}
                                <span className="capitalize">{appointment.status}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-2">
                            {appointment.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleStatusUpdate(appointment.id, 'confirmed')}
                                  className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all text-sm"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
                                  className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm"
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                            {appointment.status === 'confirmed' && (
                              <>
                                <button
                                  onClick={() => handleStatusUpdate(appointment.id, 'completed')}
                                  className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-sm"
                                >
                                  Complete
                                </button>
                                <button className="px-3 py-1 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all text-sm">
                                  Start Call
                                </button>
                              </>
                            )}
                          </div>
                          <button
                            onClick={() => toggleAppointmentExpansion(appointment.id)}
                            className="p-1 hover:bg-gray-100 rounded-full transition-all"
                          >
                            {isExpanded ? (
                              <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                            ) : (
                              <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Expanded Patient Details */}
                      {isExpanded && (
                        <div className="mt-6 pt-4 border-t border-gray-100">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h4 className="font-medium text-gray-900">Patient Information</h4>
                              <div className="space-y-3">
                                <div className="flex items-center space-x-2 text-sm">
                                  <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                                  <span className="text-gray-600">{patient.email}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm">
                                  <UserCircleIcon className="h-4 w-4 text-gray-400" />
                                  <span className="text-gray-600">Patient ID: {appointment.userId}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm">
                                  <CalendarIcon className="h-4 w-4 text-gray-400" />
                                  <span className="text-gray-600">
                                    Joined: {format(new Date(patient.createdAt), 'MMMM d, yyyy')}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <h4 className="font-medium text-gray-900">Appointment Details</h4>
                              <div className="space-y-3">
                                <div className="flex items-center space-x-2 text-sm">
                                  <CalendarIcon className="h-4 w-4 text-gray-400" />
                                  <span className="text-gray-600">
                                    Booked on: {format(new Date(appointment.createdAt), 'MMMM d, yyyy')}
                                  </span>
                                </div>
                                {appointment.notes && (
                                  <div className="bg-white rounded-lg p-3 border border-gray-100">
                                    <p className="text-sm text-gray-600">{appointment.notes}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </DoctorLayout>
  );
};

export default DoctorAppointments; 