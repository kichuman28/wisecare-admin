import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../firebase';
import { format } from 'date-fns';

const MedicineRow = ({ medicine, onUpdate, onDelete }) => {
  return (
    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <input
          type="text"
          value={medicine.name}
          onChange={(e) => onUpdate({ ...medicine, name: e.target.value })}
          placeholder="Medicine name"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>
      <div className="w-32">
        <input
          type="text"
          value={medicine.dosage}
          onChange={(e) => onUpdate({ ...medicine, dosage: e.target.value })}
          placeholder="Dosage"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>
      <div className="w-40">
        <select
          value={medicine.frequency}
          onChange={(e) => onUpdate({ ...medicine, frequency: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          <option value="">Select frequency</option>
          <option value="Once daily">Once daily</option>
          <option value="Twice daily">Twice daily</option>
          <option value="Three times daily">Three times daily</option>
          <option value="Four times daily">Four times daily</option>
          <option value="As needed">As needed</option>
        </select>
      </div>
      <div className="w-32">
        <input
          type="number"
          value={medicine.duration}
          onChange={(e) => onUpdate({ ...medicine, duration: e.target.value })}
          placeholder="Days"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>
      <button
        onClick={onDelete}
        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
      >
        <TrashIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

const PrescriptionModal = ({ isOpen, onClose, patient, doctorId }) => {
  const [medicines, setMedicines] = useState([]);
  const [diagnosis, setDiagnosis] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [instructions, setInstructions] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddMedicine = () => {
    setMedicines([
      ...medicines,
      { id: Date.now(), name: '', dosage: '', frequency: '', duration: '' }
    ]);
  };

  const handleUpdateMedicine = (updatedMedicine) => {
    setMedicines(
      medicines.map((med) =>
        med.id === updatedMedicine.id ? updatedMedicine : med
      )
    );
  };

  const handleDeleteMedicine = (medicineId) => {
    setMedicines(medicines.filter((med) => med.id !== medicineId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const prescriptionData = {
        patientId: patient.id,
        doctorId,
        diagnosis,
        symptoms,
        medicines: medicines.map(({ id, ...rest }) => rest),
        instructions,
        followUpDate,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'prescriptions'), prescriptionData);
      onClose();
    } catch (error) {
      console.error('Error saving prescription:', error);
    } finally {
      setIsSubmitting(false);
    }
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
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-lg font-medium">
                    New Prescription for {patient.displayName}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Diagnosis
                      </label>
                      <textarea
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Symptoms
                      </label>
                      <textarea
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Medicines
                      </label>
                      <button
                        type="button"
                        onClick={handleAddMedicine}
                        className="flex items-center space-x-2 px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all text-sm"
                      >
                        <PlusIcon className="h-4 w-4" />
                        <span>Add Medicine</span>
                      </button>
                    </div>
                    <div className="space-y-4">
                      {medicines.map((medicine) => (
                        <MedicineRow
                          key={medicine.id}
                          medicine={medicine}
                          onUpdate={handleUpdateMedicine}
                          onDelete={() => handleDeleteMedicine(medicine.id)}
                        />
                      ))}
                      {medicines.length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-4">
                          No medicines added yet. Click the button above to add one.
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Instructions
                    </label>
                    <textarea
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Follow-up Date
                    </label>
                    <input
                      type="date"
                      value={followUpDate}
                      onChange={(e) => setFollowUpDate(e.target.value)}
                      min={format(new Date(), 'yyyy-MM-dd')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Saving...' : 'Save Prescription'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PrescriptionModal; 