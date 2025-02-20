import React, { useState } from 'react';
import DoctorLayout from '../../components/layout/doctor_layout';
import { 
  MagnifyingGlassIcon, 
  ChevronDownIcon,
  HeartIcon,
  ClockIcon,
  DocumentTextIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

const DoctorPatients = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Sample patients data
  const patients = [
    {
      id: 1,
      name: "Sarah Johnson",
      age: 45,
      gender: "Female",
      lastVisit: "2024-02-15",
      condition: "Hypertension",
      phone: "+1 (555) 123-4567",
      email: "sarah.j@example.com",
      address: "123 Main St, New York, NY",
      bloodGroup: "A+",
      weight: "65 kg",
      height: "165 cm",
      allergies: ["Penicillin", "Pollen"],
      medications: ["Lisinopril 10mg", "Aspirin 81mg"],
      visits: [
        { date: "2024-02-15", reason: "Regular checkup", diagnosis: "Stable condition" },
        { date: "2024-01-10", reason: "Blood pressure review", diagnosis: "Adjusted medication" }
      ]
    },
    {
      id: 2,
      name: "Michael Brown",
      age: 32,
      gender: "Male",
      lastVisit: "2024-02-10",
      condition: "Diabetes Type 2",
      phone: "+1 (555) 987-6543",
      email: "michael.b@example.com",
      address: "456 Oak Ave, Boston, MA",
      bloodGroup: "O+",
      weight: "82 kg",
      height: "178 cm",
      allergies: ["Sulfa drugs"],
      medications: ["Metformin 500mg", "Glipizide 5mg"],
      visits: [
        { date: "2024-02-10", reason: "Diabetes follow-up", diagnosis: "Good progress" },
        { date: "2024-01-05", reason: "Annual checkup", diagnosis: "Stable condition" }
      ]
    }
  ];

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DoctorLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
              <p className="mt-1 text-gray-600">Manage and view your patient records</p>
            </div>
            <div className="mt-4 md:mt-0 relative">
              <input
                type="text"
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Patients List */}
          <div className="w-full md:w-1/3 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Patient List</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {filteredPatients.map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient)}
                  className={`w-full p-4 text-left hover:bg-gray-50 transition-all ${
                    selectedPatient?.id === patient.id ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-semibold">
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{patient.name}</h3>
                      <p className="text-sm text-gray-500">{patient.condition}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Patient Details */}
          {selectedPatient ? (
            <div className="w-full md:w-2/3 space-y-6">
              {/* Basic Info Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary text-xl font-semibold">
                        {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{selectedPatient.name}</h2>
                      <p className="text-gray-600">{selectedPatient.age} years • {selectedPatient.gender}</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all">
                    Edit Profile
                  </button>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <HeartIcon className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="text-sm text-gray-500">Blood Group</p>
                      <p className="font-medium text-gray-900">{selectedPatient.bloodGroup}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <ClockIcon className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">Last Visit</p>
                      <p className="font-medium text-gray-900">{selectedPatient.lastVisit}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <DocumentTextIcon className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-500">Condition</p>
                      <p className="font-medium text-gray-900">{selectedPatient.condition}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center space-x-2">
                    <PhoneIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">{selectedPatient.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">{selectedPatient.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPinIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">{selectedPatient.address}</span>
                  </div>
                </div>
              </div>

              {/* Medical History */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical History</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Current Medications</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPatient.medications.map((medication, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                        >
                          {medication}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Allergies</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPatient.allergies.map((allergy, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm"
                        >
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Recent Visits</h4>
                    <div className="space-y-3">
                      {selectedPatient.visits.map((visit, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-gray-900">{visit.reason}</p>
                              <p className="text-sm text-gray-600 mt-1">{visit.diagnosis}</p>
                            </div>
                            <span className="text-sm text-gray-500">{visit.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full md:w-2/3 bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-center">
              <p className="text-gray-500">Select a patient to view details</p>
            </div>
          )}
        </div>
      </div>
    </DoctorLayout>
  );
};

export default DoctorPatients; 