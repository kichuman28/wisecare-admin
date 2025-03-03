import React from 'react';
import { 
  ClockIcon, 
  ArrowPathIcon, 
  TruckIcon, 
  CheckCircleIcon, 
  XMarkIcon 
} from '@heroicons/react/24/outline';

const statusConfig = {
  pending: {
    bgClass: 'bg-gradient-to-r from-amber-50 to-amber-100',
    textClass: 'text-amber-800',
    borderClass: 'border-amber-200',
    icon: <ClockIcon className="h-3.5 w-3.5" />
  },
  processing: {
    bgClass: 'bg-gradient-to-r from-blue-50 to-blue-100',
    textClass: 'text-blue-800',
    borderClass: 'border-blue-200',
    icon: <ArrowPathIcon className="h-3.5 w-3.5" />
  },
  dispatched: {
    bgClass: 'bg-gradient-to-r from-indigo-50 to-indigo-100',
    textClass: 'text-indigo-800',
    borderClass: 'border-indigo-200',
    icon: <TruckIcon className="h-3.5 w-3.5" />
  },
  delivered: {
    bgClass: 'bg-gradient-to-r from-emerald-50 to-emerald-100',
    textClass: 'text-emerald-800',
    borderClass: 'border-emerald-200',
    icon: <CheckCircleIcon className="h-3.5 w-3.5" />
  },
  cancelled: {
    bgClass: 'bg-gradient-to-r from-red-50 to-red-100',
    textClass: 'text-red-800',
    borderClass: 'border-red-200',
    icon: <XMarkIcon className="h-3.5 w-3.5" />
  }
};

const StatusBadge = ({ status, size = 'md' }) => {
  const config = statusConfig[status] || {
    bgClass: 'bg-gradient-to-r from-gray-50 to-gray-100',
    textClass: 'text-gray-800',
    borderClass: 'border-gray-200',
    icon: null
  };
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm'
  };

  return (
    <span 
      className={`inline-flex items-center rounded-full font-medium border shadow-sm ${sizeClasses[size]} ${config.bgClass} ${config.textClass} ${config.borderClass}`}
    >
      {config.icon}
      <span className="ml-1.5 capitalize">{status}</span>
    </span>
  );
};

export default StatusBadge; 