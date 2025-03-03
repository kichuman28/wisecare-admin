import React from 'react';
import { 
  ClockIcon, 
  ArrowPathIcon, 
  TruckIcon, 
  CheckCircleIcon, 
  XMarkIcon 
} from '@heroicons/react/24/outline';

const statusColors = {
  pending: 'bg-amber-100 text-amber-800',
  processing: 'bg-blue-100 text-blue-800',
  dispatched: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

const statusIcons = {
  pending: <ClockIcon className="h-5 w-5" />,
  processing: <ArrowPathIcon className="h-5 w-5" />,
  dispatched: <TruckIcon className="h-5 w-5" />,
  delivered: <CheckCircleIcon className="h-5 w-5" />,
  cancelled: <XMarkIcon className="h-5 w-5" />
};

const StatusBadge = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm'
  };

  return (
    <span 
      className={`inline-flex items-center rounded-full font-medium ${sizeClasses[size]} ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}
    >
      {statusIcons[status]}
      <span className="ml-1.5 capitalize">{status}</span>
    </span>
  );
};

export default StatusBadge; 