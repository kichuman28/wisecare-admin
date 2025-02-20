import React, { useState, useEffect } from 'react';
import DoctorLayout from '../../components/layout/doctor_layout';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { 
  MagnifyingGlassIcon,
  DocumentIcon,
  DocumentTextIcon,
  DocumentArrowUpIcon,
  FolderIcon,
  CalendarIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  TrashIcon,
  UserCircleIcon,
  ClockIcon,
  XMarkIcon,
//   PillIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useAuth } from '../../../context/AuthContext';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const ViewPrescriptionModal = ({ isOpen, onClose, record, patient }) => {
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Prescription', 105, 20, { align: 'center' });
    
    // Add patient info
    doc.setFontSize(12);
    doc.text(`Patient: ${patient?.displayName}`, 20, 40);
    doc.text(`Patient ID: ${record.patientId}`, 20, 50);
    doc.text(`Date: ${format(record.createdAt, 'MMMM d, yyyy')}`, 20, 60);
    doc.text(`Follow-up: ${format(new Date(record.followUpDate), 'MMMM d, yyyy')}`, 20, 70);

    // Add diagnosis and symptoms
    doc.setFontSize(14);
    doc.text('Diagnosis:', 20, 90);
    doc.setFontSize(12);
    doc.text(record.diagnosis, 20, 100);

    doc.setFontSize(14);
    doc.text('Symptoms:', 20, 120);
    doc.setFontSize(12);
    doc.text(record.symptoms, 20, 130);

    // Add medicines table
    if (record.medicines && record.medicines.length > 0) {
      doc.setFontSize(14);
      doc.text('Prescribed Medicines:', 20, 150);
      
      const tableData = record.medicines.map(medicine => [
        medicine.name,
        medicine.dosage,
        medicine.frequency,
        `${medicine.duration} days`
      ]);

      doc.autoTable({
        startY: 160,
        head: [['Medicine', 'Dosage', 'Frequency', 'Duration']],
        body: tableData,
        margin: { top: 20 },
        styles: { fontSize: 12 }
      });
    }

    // Add instructions
    const finalY = doc.previousAutoTable ? doc.previousAutoTable.finalY + 20 : 200;
    doc.setFontSize(14);
    doc.text('Instructions:', 20, finalY);
    doc.setFontSize(12);
    doc.text(record.instructions, 20, finalY + 10);

    // Save the PDF
    doc.save(`prescription-${record.id}.pdf`);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-background-secondary p-6 shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-lg font-medium text-deep-blue">
                    Prescription Details
                  </Dialog.Title>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleDownloadPDF}
                      className="flex items-center space-x-2 px-4 py-2.5 bg-primary-light text-primary rounded-lg hover:bg-primary hover:text-white transition-all"
                    >
                      <ArrowDownTrayIcon className="h-5 w-5" />
                      <span>Download PDF</span>
                    </button>
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-primary/10 rounded-lg transition-all"
                    >
                      <XMarkIcon className="h-5 w-5 text-primary" />
                    </button>
                  </div>
                </div>

                <div id="prescription-content" className="space-y-6 bg-white rounded-xl p-6 shadow-sm">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-6 border-b border-primary-light/30">
                    <div>
                      <h2 className="text-2xl font-bold text-deep-blue">{patient?.displayName}</h2>
                      <p className="text-sm text-primary-hover">Patient ID: {record.patientId}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-primary-hover">Date: {format(record.createdAt, 'MMMM d, yyyy')}</p>
                      <p className="text-sm text-primary-hover">Follow-up: {format(new Date(record.followUpDate), 'MMMM d, yyyy')}</p>
                    </div>
                  </div>

                  {/* Diagnosis & Symptoms */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-primary/5 rounded-xl p-4">
                      <h3 className="text-sm font-medium text-primary mb-2">Diagnosis</h3>
                      <p className="text-deep-blue bg-white rounded-lg p-3 shadow-sm">{record.diagnosis}</p>
                    </div>
                    <div className="bg-primary/5 rounded-xl p-4">
                      <h3 className="text-sm font-medium text-primary mb-2">Symptoms</h3>
                      <p className="text-deep-blue bg-white rounded-lg p-3 shadow-sm">{record.symptoms}</p>
                    </div>
                  </div>

                  {/* Medicines */}
                  <div className="bg-primary/5 rounded-xl p-4">
                    <h3 className="text-sm font-medium text-primary mb-3">Prescribed Medicines</h3>
                    <div className="space-y-3">
                      {record.medicines?.map((medicine, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all">
                          <div className="grid grid-cols-4 gap-4">
                            <div>
                              <p className="text-sm text-primary-hover">Medicine</p>
                              <p className="font-medium text-deep-blue">{medicine.name}</p>
                            </div>
                            <div>
                              <p className="text-sm text-primary-hover">Dosage</p>
                              <p className="font-medium text-deep-blue">{medicine.dosage}</p>
                            </div>
                            <div>
                              <p className="text-sm text-primary-hover">Frequency</p>
                              <p className="font-medium text-deep-blue">{medicine.frequency}</p>
                            </div>
                            <div>
                              <p className="text-sm text-primary-hover">Duration</p>
                              <p className="font-medium text-deep-blue">{medicine.duration} days</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="bg-primary/5 rounded-xl p-4">
                    <h3 className="text-sm font-medium text-primary mb-2">Instructions</h3>
                    <p className="text-deep-blue bg-white rounded-lg p-3 shadow-sm">{record.instructions}</p>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

const DoctorRecords = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState({});
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const { user } = useAuth();

  const handleDownloadPDF = (record, patient) => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Prescription', 105, 20, { align: 'center' });
    
    // Add patient info
    doc.setFontSize(12);
    doc.text(`Patient: ${patient?.displayName}`, 20, 40);
    doc.text(`Patient ID: ${record.patientId}`, 20, 50);
    doc.text(`Date: ${format(record.createdAt, 'MMMM d, yyyy')}`, 20, 60);
    doc.text(`Follow-up: ${format(new Date(record.followUpDate), 'MMMM d, yyyy')}`, 20, 70);

    // Add diagnosis and symptoms
    doc.setFontSize(14);
    doc.text('Diagnosis:', 20, 90);
    doc.setFontSize(12);
    doc.text(record.diagnosis, 20, 100);

    doc.setFontSize(14);
    doc.text('Symptoms:', 20, 120);
    doc.setFontSize(12);
    doc.text(record.symptoms, 20, 130);

    // Add medicines table
    if (record.medicines && record.medicines.length > 0) {
      doc.setFontSize(14);
      doc.text('Prescribed Medicines:', 20, 150);
      
      const tableData = record.medicines.map(medicine => [
        medicine.name,
        medicine.dosage,
        medicine.frequency,
        `${medicine.duration} days`
      ]);

      doc.autoTable({
        startY: 160,
        head: [['Medicine', 'Dosage', 'Frequency', 'Duration']],
        body: tableData,
        margin: { top: 20 },
        styles: { fontSize: 12 }
      });
    }

    // Add instructions
    const finalY = doc.previousAutoTable ? doc.previousAutoTable.finalY + 20 : 200;
    doc.setFontSize(14);
    doc.text('Instructions:', 20, finalY);
    doc.setFontSize(12);
    doc.text(record.instructions, 20, finalY + 10);

    // Save the PDF
    doc.save(`prescription-${record.id}.pdf`);
  };

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        const prescriptionsRef = collection(db, 'prescriptions');
        const q = query(
          prescriptionsRef,
          where('doctorId', '==', user.uid)
        );

        const querySnapshot = await getDocs(q);
        const prescriptionsData = [];
        const patientIds = new Set();

        querySnapshot.docs.forEach(doc => {
          const data = doc.data();
          prescriptionsData.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate(),
            type: 'Prescription'
          });
          patientIds.add(data.patientId);
        });

        // Fetch patient details
        const patientsData = {};
        for (const patientId of patientIds) {
          const patientDoc = await getDoc(doc(db, 'users', patientId));
          if (patientDoc.exists()) {
            patientsData[patientId] = patientDoc.data();
          }
        }

        setRecords(prescriptionsData);
        setPatients(patientsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching records:', error);
        setLoading(false);
      }
    };

    if (user) {
      fetchRecords();
    }
  }, [user]);

  const categories = [
    { id: 'all', name: 'All Records', icon: DocumentIcon },
    { id: 'prescriptions', name: 'Prescriptions', icon: DocumentTextIcon },
    { id: 'reports', name: 'Lab Reports', icon: DocumentArrowUpIcon },
    { id: 'certificates', name: 'Certificates', icon: DocumentIcon }
  ];

  const filteredRecords = records.filter(record => {
    // First check if search query matches
    const searchMatches = 
      patients[record.patientId]?.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.diagnosis?.toLowerCase().includes(searchQuery.toLowerCase());

    // Then check category
    let categoryMatches = true;
    if (selectedCategory !== 'all') {
      switch (selectedCategory) {
        case 'prescriptions':
          categoryMatches = record.type === 'Prescription';
          break;
        case 'reports':
          categoryMatches = record.type === 'Lab Report';
          break;
        case 'certificates':
          categoryMatches = record.type === 'Certificate';
          break;
        default:
          categoryMatches = true;
      }
    }

    return searchMatches && categoryMatches;
  });

  const getStatusColor = (medicines) => {
    if (!medicines || medicines.length === 0) return 'bg-yellow-50 text-yellow-700';
    return 'bg-green-50 text-green-700';
  };

  const getFileSize = (medicines) => {
    // Calculate an estimated file size based on content
    const baseSize = 20; // Base size in KB
    const medicineSize = medicines ? medicines.length * 5 : 0;
    return `${baseSize + medicineSize} KB`;
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
        <div className="bg-primary-light/20 rounded-2xl p-6 shadow-sm border border-primary-light">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-deep-blue">Medical Records</h1>
              <p className="mt-1 text-primary-hover">Manage and access patient medical records</p>
            </div>
            <button className="mt-4 md:mt-0 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all flex items-center space-x-2">
              <DocumentArrowUpIcon className="h-5 w-5" />
              <span>Upload New Record</span>
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-xl p-6 border border-primary-light/30 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center space-x-3">
                <div className={`p-3 ${
                  category.id === 'all' ? 'bg-primary-light text-primary' :
                  category.id === 'prescriptions' ? 'bg-pastel-green/30 text-teal-600' :
                  category.id === 'reports' ? 'bg-primary/10 text-primary-hover' :
                  'bg-beige text-deep-blue'
                } rounded-lg`}>
                  <category.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-primary-hover">{category.name}</h3>
                  <p className="text-2xl font-bold text-deep-blue">
                    {category.id === 'all' ? records.length :
                     category.id === 'prescriptions' ? records.filter(r => r.type === 'Prescription').length :
                     0}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Categories Sidebar */}
          <div className="lg:w-64 bg-white rounded-xl shadow-sm border border-primary-light/30 h-fit">
            <div className="p-4 border-b border-primary-light/30">
              <h2 className="font-semibold text-deep-blue">Categories</h2>
            </div>
            <div className="p-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                    selectedCategory === category.id
                      ? 'bg-primary text-white'
                      : 'hover:bg-primary-light/20 text-primary-hover'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <category.icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{category.name}</span>
                  </div>
                  <span className={`text-sm ${
                    selectedCategory === category.id ? 'bg-white/20' : 'bg-primary-light/30'
                  } px-2 py-0.5 rounded-full`}>
                    {category.id === 'all' ? records.length :
                     category.id === 'prescriptions' ? records.filter(r => r.type === 'Prescription').length :
                     0}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Records List */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-primary-light/30 overflow-hidden">
              <div className="p-4 border-b border-primary-light/30">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search records..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-primary-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-primary-light/10"
                  />
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                </div>
              </div>

              <div className="divide-y divide-primary-light/30">
                {filteredRecords.length === 0 ? (
                  <div className="p-6 text-center">
                    <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No records found</h3>
                    <p className="mt-1 text-gray-500">No medical records match your search criteria.</p>
                  </div>
                ) : (
                  filteredRecords.map((record) => {
                    const patient = patients[record.patientId];
                    return (
                      <div key={record.id} className="p-4 hover:bg-primary-light/10 transition-all">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="p-2 bg-primary/5 rounded-lg">
                              <DocumentTextIcon className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="font-medium text-gray-900">{patient?.displayName}</h3>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(record.medicines)}`}>
                                  {record.medicines?.length ? `${record.medicines.length} Medicines` : 'No Medicines'}
                                </span>
                              </div>
                              <p className="mt-1 text-sm text-gray-600">{record.diagnosis}</p>
                              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                                <div className="flex items-center">
                                  <ClockIcon className="h-4 w-4 mr-1" />
                                  {format(record.createdAt, 'MMM d, yyyy')}
                                </div>
                                <div className="flex items-center">
                                  <CalendarIcon className="h-4 w-4 mr-1" />
                                  Follow-up: {format(new Date(record.followUpDate), 'MMM d, yyyy')}
                                </div>
                                <span>{getFileSize(record.medicines)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button 
                              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-primary-light/10 transition-all"
                              onClick={() => {
                                setSelectedRecord(record);
                                setIsViewModalOpen(true);
                              }}
                            >
                              <EyeIcon className="h-5 w-5" />
                            </button>
                            <button 
                              onClick={() => handleDownloadPDF(record, patients[record.patientId])}
                              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-primary-light/10 transition-all"
                            >
                              <ArrowDownTrayIcon className="h-5 w-5" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all">
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View Prescription Modal */}
      {selectedRecord && (
        <ViewPrescriptionModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedRecord(null);
          }}
          record={selectedRecord}
          patient={patients[selectedRecord.patientId]}
        />
      )}
    </DoctorLayout>
  );
};

export default DoctorRecords; 