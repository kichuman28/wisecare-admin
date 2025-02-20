import React, { useState, useEffect } from 'react';
import DoctorLayout from '../../components/layout/doctor_layout';
import { 
  MagnifyingGlassIcon,
  CalendarIcon,
  ClockIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserCircleIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useAuth } from '../../../context/AuthContext';
import { format } from 'date-fns';
import PrescriptionModal from '../../components/prescriptions/PrescriptionModal';
import { useNavigate } from 'react-router-dom';

const DoctorPatients = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const { user } = useAuth();
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [selectedPatientForPrescription, setSelectedPatientForPrescription] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const bookingsRef = collection(db, 'bookings');
        const q = query(
          bookingsRef,
          where('doctorId', '==', user.uid)
        );

        const querySnapshot = await getDocs(q);
        const patientIds = new Set();
        const bookingsByPatient = {};

        // Collect unique patient IDs and their bookings
        querySnapshot.docs.forEach(doc => {
          const booking = { id: doc.id, ...doc.data() };
          patientIds.add(booking.userId);
          
          if (!bookingsByPatient[booking.userId]) {
            bookingsByPatient[booking.userId] = [];
          }
          bookingsByPatient[booking.userId].push(booking);
        });

        // Fetch patient details
        const patientsData = [];
        for (const patientId of patientIds) {
          const patientDoc = await getDoc(doc(db, 'users', patientId));
          if (patientDoc.exists()) {
            const patientData = patientDoc.data();
            patientsData.push({
              id: patientId,
              ...patientData,
              bookings: bookingsByPatient[patientId],
              lastVisit: bookingsByPatient[patientId].reduce((latest, booking) => {
                const bookingDate = booking.appointmentDate.toDate();
                return !latest || bookingDate > latest ? bookingDate : latest;
              }, null),
              totalVisits: bookingsByPatient[patientId].length,
              completedVisits: bookingsByPatient[patientId].filter(b => b.status === 'completed').length,
              cancelledVisits: bookingsByPatient[patientId].filter(b => b.status === 'cancelled').length
            });
          }
        }

        setPatients(patientsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching patients:', error);
        setLoading(false);
      }
    };

    if (user) {
      fetchPatients();
    }
  }, [user]);

  const filteredPatients = patients.filter(patient =>
    patient.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePrescriptionClick = (patient) => {
    setSelectedPatientForPrescription(patient);
    setIsPrescriptionModalOpen(true);
  };

  const handleChatClick = (patient) => {
    navigate('/doctor/messages', { state: { selectedPatient: patient } });
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
              <h1 className="text-2xl font-bold text-gray-900">My Patients</h1>
              <p className="mt-1 text-gray-600">Manage and view your patient records</p>
            </div>
            <div className="mt-4 md:mt-0 relative">
              <input
                type="text"
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-64"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <UserCircleIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Patients</p>
                <h3 className="text-2xl font-bold text-gray-900">{patients.length}</h3>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Completed Appointments</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {patients.reduce((total, patient) => total + patient.completedVisits, 0)}
                </h3>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-red-50 rounded-lg">
                <XCircleIcon className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Cancelled Appointments</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {patients.reduce((total, patient) => total + patient.cancelledVisits, 0)}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Patients List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Patient List</h2>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredPatients.length === 0 ? (
              <div className="p-6 text-center">
                <UserCircleIcon className="h-12 w-12 text-gray-400 mx-auto" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No patients found</h3>
                <p className="mt-1 text-gray-500">No patients match your search criteria.</p>
              </div>
            ) : (
              filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="p-6 hover:bg-gray-50 transition-all"
                  onClick={() => setSelectedPatient(selectedPatient?.id === patient.id ? null : patient)}
                >
                  <div className="flex items-start justify-between">
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
                              {patient.displayName?.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{patient.displayName}</h3>
                        <div className="mt-1 flex items-center space-x-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <ClipboardDocumentListIcon className="h-4 w-4 mr-1" />
                            {patient.totalVisits} visits
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            Last visit: {patient.lastVisit ? format(patient.lastVisit, 'MMM d, yyyy') : 'N/A'}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePrescriptionClick(patient);
                            }}
                            className="flex items-center space-x-2 px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all text-sm"
                          >
                            <DocumentTextIcon className="h-4 w-4" />
                            <span>Add Prescription</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleChatClick(patient);
                            }}
                            className="flex items-center space-x-2 px-3 py-1.5 bg-primary-light/20 text-primary rounded-lg hover:bg-primary-light/40 transition-all text-sm"
                          >
                            <ChatBubbleLeftRightIcon className="h-4 w-4" />
                            <span>Chat</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Patient Details */}
                  {selectedPatient?.id === patient.id && (
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900">Contact Information</h4>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2 text-sm">
                              <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">{patient.email}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <UserCircleIcon className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">Patient ID: {patient.id}</span>
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
                          <h4 className="font-medium text-gray-900">Appointment History</h4>
                          <div className="space-y-3">
                            {patient.bookings.map((booking) => (
                              <div key={booking.id} className="bg-gray-50 rounded-lg p-3">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="flex items-center space-x-2">
                                      <CalendarIcon className="h-4 w-4 text-gray-400" />
                                      <span className="text-sm font-medium text-gray-900">
                                        {format(booking.appointmentDate.toDate(), 'MMM d, yyyy')}
                                      </span>
                                    </div>
                                    <div className="mt-1 flex items-center space-x-2">
                                      <ClockIcon className="h-4 w-4 text-gray-400" />
                                      <span className="text-sm text-gray-600">{booking.timeSlot}</span>
                                      <span className="text-sm text-gray-400">•</span>
                                      <span className="text-sm text-gray-600">₹{booking.consultationFee}</span>
                                    </div>
                                  </div>
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                    ${booking.status === 'completed' ? 'bg-green-50 text-green-700' :
                                      booking.status === 'cancelled' ? 'bg-red-50 text-red-700' :
                                      booking.status === 'confirmed' ? 'bg-blue-50 text-blue-700' :
                                      'bg-yellow-50 text-yellow-700'
                                    }`}
                                  >
                                    {booking.status}
                                  </span>
                                </div>
                                {booking.notes && (
                                  <p className="mt-2 text-sm text-gray-600">{booking.notes}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add the Prescription Modal */}
      {selectedPatientForPrescription && (
        <PrescriptionModal
          isOpen={isPrescriptionModalOpen}
          onClose={() => {
            setIsPrescriptionModalOpen(false);
            setSelectedPatientForPrescription(null);
          }}
          patient={selectedPatientForPrescription}
          doctorId={user.uid}
        />
      )}
    </DoctorLayout>
  );
};

export default DoctorPatients; 