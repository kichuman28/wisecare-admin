import {
  PencilIcon,
  TrashIcon,
  BriefcaseIcon,
  TruckIcon,
  ShieldCheckIcon,
  PhoneIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';

// Helper function to get initials from name
const getInitials = (name) => {
  if (!name) return '??';
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

// Helper function to format date
const formatDate = (date) => {
  if (!date) return 'Never';
  return new Date(date).toLocaleString();
};

// PatientRow component
export const PatientRow = ({ patient, onEdit, onDelete }) => (
  <tr className="hover:bg-gray-50 transition-colors">
    <td className="px-3 sm:px-6 py-4 whitespace-normal sm:whitespace-nowrap">
      <div className="flex flex-col sm:flex-row sm:items-center">
        {patient.photoURL ? (
          <img 
            src={patient.photoURL} 
            alt={patient.displayName}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-indigo-600 font-medium">
              {getInitials(patient.displayName || patient.name)}
            </span>
          </div>
        )}
        <div className="mt-2 sm:mt-0 sm:ml-4">
          <div className="text-sm font-medium text-gray-900">{patient.displayName || patient.name}</div>
          <div className="text-sm text-gray-500 flex items-center">
            <EnvelopeIcon className="h-4 w-4 mr-1" />
            <span className="break-all">{patient.email}</span>
          </div>
        </div>
      </div>
    </td>
    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900">
        {formatDate(patient.lastLoginAt || patient.createdAt)}
      </div>
      <div className="text-xs text-gray-500">Last activity</div>
    </td>
    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
        {patient.provider || "Patient"}
      </span>
    </td>
    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <button 
        onClick={() => onEdit(patient)}
        className="text-[#7886C7] hover:text-[#2D336B] mr-4"
      >
        <PencilIcon className="h-5 w-5" />
      </button>
      <button 
        onClick={() => onDelete({ 
          id: patient.id, 
          type: 'user', 
          name: patient.displayName || patient.name 
        })}
        className="text-[#7886C7] hover:text-[#2D336B]"
      >
        <TrashIcon className="h-5 w-5" />
      </button>
    </td>
  </tr>
);

// DoctorRow component
export const DoctorRow = ({ doctor, onEdit, onDelete }) => (
  <tr className="hover:bg-gray-50 transition-colors">
    <td className="px-3 sm:px-6 py-4 whitespace-normal sm:whitespace-nowrap">
      <div className="flex flex-col sm:flex-row sm:items-center">
        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
          <BriefcaseIcon className="h-6 w-6 text-blue-600" />
        </div>
        <div className="mt-2 sm:mt-0 sm:ml-4">
          <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
          <div className="text-sm text-gray-500 flex items-center">
            <EnvelopeIcon className="h-4 w-4 mr-1" />
            <span className="break-all">{doctor.email}</span>
          </div>
        </div>
      </div>
    </td>
    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900">
        {formatDate(doctor.createdAt)}
      </div>
      <div className="text-xs text-gray-500">Registered</div>
    </td>
    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
        Doctor
      </span>
    </td>
    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <button 
        onClick={() => onEdit(doctor)}
        className="text-[#7886C7] hover:text-[#2D336B] mr-4"
      >
        <PencilIcon className="h-5 w-5" />
      </button>
      <button 
        onClick={() => onDelete({ id: doctor.id, type: 'user', name: doctor.name })}
        className="text-[#7886C7] hover:text-[#2D336B]"
      >
        <TrashIcon className="h-5 w-5" />
      </button>
    </td>
  </tr>
);

// ResponderRow component
export const ResponderRow = ({ responder, onEdit, onDelete }) => (
  <tr className="hover:bg-gray-50 transition-colors">
    <td className="px-3 sm:px-6 py-4 whitespace-normal sm:whitespace-nowrap">
      <div className="flex flex-col sm:flex-row sm:items-center">
        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
          <ShieldCheckIcon className="h-6 w-6 text-green-600" />
        </div>
        <div className="mt-2 sm:mt-0 sm:ml-4">
          <div className="text-sm font-medium text-gray-900">{responder.name}</div>
          <div className="text-sm text-gray-500 flex items-center">
            <PhoneIcon className="h-4 w-4 mr-1" />
            <span className="break-all">{responder.phone}</span>
          </div>
        </div>
      </div>
    </td>
    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
      <div className="flex flex-col">
        <span className="text-sm text-gray-900">{responder.address || 'N/A'}</span>
        <span className="text-xs text-gray-500">{responder.shift_timing || 'No shift'}</span>
      </div>
    </td>
    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
      <div className="flex flex-col">
        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
          Responder
        </span>
        <span className="text-xs text-gray-500 mt-1">
          {responder.experience ? `${responder.experience} years exp.` : 'New'}
        </span>
      </div>
    </td>
    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <button 
        onClick={() => onEdit(responder)}
        className="text-[#7886C7] hover:text-[#2D336B] mr-4"
      >
        <PencilIcon className="h-5 w-5" />
      </button>
      <button 
        onClick={() => onDelete({ id: responder.id, type: 'user', name: responder.name })}
        className="text-[#7886C7] hover:text-[#2D336B]"
      >
        <TrashIcon className="h-5 w-5" />
      </button>
    </td>
  </tr>
);

// DeliveryRow component
export const DeliveryRow = ({ delivery, onEdit, onDelete }) => (
  <tr className="hover:bg-gray-50 transition-colors">
    <td className="px-3 sm:px-6 py-4 whitespace-normal sm:whitespace-nowrap">
      <div className="flex flex-col sm:flex-row sm:items-center">
        <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
          <TruckIcon className="h-6 w-6 text-amber-600" />
        </div>
        <div className="mt-2 sm:mt-0 sm:ml-4">
          <div className="text-sm font-medium text-gray-900">{delivery.name}</div>
          <div className="text-sm text-gray-500 flex items-center">
            <PhoneIcon className="h-4 w-4 mr-1" />
            <span className="break-all">{delivery.phone}</span>
          </div>
        </div>
      </div>
    </td>
    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
      <div className="flex flex-col">
        <span className="text-sm text-gray-900">{delivery.address || 'N/A'}</span>
        <span className="text-xs text-gray-500">{delivery.shift_timing || 'No shift'}</span>
      </div>
    </td>
    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
      <div className="flex flex-col">
        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">
          Delivery
        </span>
        <span className="text-xs text-gray-500 mt-1">
          {delivery.preferred_shift ? `${delivery.preferred_shift} shift` : 'No preference'}
        </span>
      </div>
    </td>
    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <button 
        onClick={() => onEdit(delivery)}
        className="text-[#7886C7] hover:text-[#2D336B] mr-4"
      >
        <PencilIcon className="h-5 w-5" />
      </button>
      <button 
        onClick={() => onDelete({ id: delivery.id, type: 'user', name: delivery.name })}
        className="text-[#7886C7] hover:text-[#2D336B]"
      >
        <TrashIcon className="h-5 w-5" />
      </button>
    </td>
  </tr>
); 