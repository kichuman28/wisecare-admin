import React from 'react';
import { 
  UserIcon, 
  ClipboardDocumentListIcon, 
  TruckIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  PlusIcon,
  CalendarIcon,
  ClockIcon,
  HomeIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  CurrencyRupeeIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import StatusBadge from './StatusBadge';

const OrderDetails = ({ 
  order, 
  patientDetails, 
  addressDetails,
  formatDate, 
  assignLoading, 
  setAssignModalOpen 
}) => {
  if (!order) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-100">
        <div className="bg-primary/5 rounded-full p-4 w-20 h-20 mx-auto flex items-center justify-center">
          <TruckIcon className="h-10 w-10 text-primary" />
        </div>
        <p className="mt-4 text-gray-500 font-medium">Select an order to view details</p>
      </div>
    );
  }
  
  const patient = patientDetails[order.userId] || {};
  
  // More careful address handling
  const hasAddressId = Boolean(order.addressId);
  const addressDataExists = hasAddressId && addressDetails[order.addressId];
  const address = addressDataExists ? addressDetails[order.addressId] : null;
  
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <h2 className="text-lg font-semibold text-primary">Order Details</h2>
        <StatusBadge status={order.status} size="lg" />
      </div>
      
      <div className="divide-y divide-gray-100">
        {/* Order ID & Date */}
        <div className="p-6 bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">Order ID</p>
              <p className="text-sm font-semibold text-gray-800 mt-1">{order.id}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">Order Date</p>
              <p className="text-sm font-semibold text-gray-800 mt-1">{formatDate(order.orderDate)}</p>
            </div>
          </div>
        </div>
        
        {/* Patient Information */}
        <div className="p-6">
          <h3 className="text-sm font-semibold text-primary flex items-center mb-4">
            <UserIcon className="h-4 w-4 mr-2" />
            Patient Information
          </h3>
          
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-start space-x-3">
              {patient.photoURL ? (
                <img 
                  src={patient.photoURL} 
                  alt={patient.name} 
                  className="h-14 w-14 rounded-xl object-cover shadow-sm border-2 border-white"
                />
              ) : (
                <div className="h-14 w-14 rounded-xl bg-primary-light flex items-center justify-center text-white font-medium text-lg shadow-sm">
                  {patient.name?.charAt(0).toUpperCase() || '?'}
                </div>
              )}
              
              <div className="flex-1">
                <h4 className="text-base font-semibold text-gray-900">{patient.name}</h4>
                <div className="mt-3 space-y-2">
                  <p className="flex items-center text-gray-700 text-sm">
                    <PhoneIcon className="h-4 w-4 mr-2 text-primary" />
                    {patient.phone || 'No phone number'}
                  </p>
                  <p className="flex items-center text-gray-700 text-sm">
                    <EnvelopeIcon className="h-4 w-4 mr-2 text-primary" />
                    {patient.email || 'No email'}
                  </p>
                </div>
              </div>
            </div>
            
            {(patient.createdAt || patient.lastLoginAt) && (
              <div className="mt-4 pt-3 border-t border-gray-200 grid grid-cols-2 gap-3 text-xs">
                {patient.createdAt && (
                  <div className="flex items-center text-gray-600">
                    <CalendarIcon className="h-3.5 w-3.5 mr-1.5 text-primary" />
                    <span>Joined: {formatDate(patient.createdAt)}</span>
                  </div>
                )}
                {patient.lastLoginAt && (
                  <div className="flex items-center text-gray-600">
                    <ClockIcon className="h-3.5 w-3.5 mr-1.5 text-primary" />
                    <span>Last active: {formatDate(patient.lastLoginAt)}</span>
                  </div>
                )}
              </div>
            )}
            
            {patient.provider && (
              <div className="mt-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                  {patient.provider}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Delivery Address */}
        <div className="p-6">
          <h3 className="text-sm font-semibold text-primary flex items-center mb-4">
            <MapPinIcon className="h-4 w-4 mr-2" />
            Delivery Address
          </h3>
          
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 shadow-sm">
            {!hasAddressId ? (
              <div className="flex items-center text-amber-600">
                <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                <p className="font-medium">No address ID provided for this order</p>
              </div>
            ) : !addressDataExists ? (
              <div className="flex items-center text-amber-600">
                <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                <p className="font-medium">Address data not loaded yet</p>
              </div>
            ) : address && address.address ? (
              <div className="space-y-3">
                <div className="flex items-start">
                  <HomeIcon className="h-5 w-5 mr-2 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {address.address}
                    </p>
                  </div>
                </div>
                
                {address.additionalInfo && (
                  <div className="flex items-start">
                    <InformationCircleIcon className="h-5 w-5 mr-2 text-primary mt-0.5" />
                    <p className="text-sm text-gray-600">{address.additionalInfo}</p>
                  </div>
                )}
                
                {(address.latitude && address.longitude) && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Location: {address.latitude.toFixed(6)}, {address.longitude.toFixed(6)}
                    </p>
                    <a 
                      href={`https://www.google.com/maps?q=${address.latitude},${address.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:text-primary-hover mt-1 inline-block font-medium"
                    >
                      View on Google Maps
                    </a>
                  </div>
                )}
                
                {address.isDefault && (
                  <div className="pt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                      <ShieldCheckIcon className="h-3.5 w-3.5 mr-1" />
                      Default Address
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center text-amber-600">
                <MapPinIcon className="h-5 w-5 mr-2" />
                <p className="font-medium">Address data is empty or invalid</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Medicine Details */}
        <div className="p-6">
          <h3 className="text-sm font-semibold text-primary flex items-center mb-4">
            <ClipboardDocumentListIcon className="h-4 w-4 mr-2" />
            Medicine Details
          </h3>
          <ul className="space-y-3">
            {order.medicines.map((medicine, index) => (
              <li key={index} className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-100 shadow-sm transition-all hover:shadow-md">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-semibold text-gray-900">{medicine.medicineName}</p>
                  <p className="flex items-center text-sm font-bold text-primary">
                    <CurrencyRupeeIcon className="h-3.5 w-3.5 mr-0.5" />
                    {medicine.totalPrice}
                  </p>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                  <p className="flex items-center text-gray-700">
                    <span className="text-gray-500 mr-2">Quantity:</span> 
                    <span className="font-semibold">{medicine.quantity} units</span>
                  </p>
                  <p className="flex items-center text-gray-700">
                    <span className="text-gray-500 mr-2">Price/Unit:</span> 
                    <span className="font-semibold">₹{medicine.pricePerUnit}</span>
                  </p>
                  <p className="flex items-center text-gray-700">
                    <span className="text-gray-500 mr-2">Dosage:</span> 
                    <span className="font-semibold">{medicine.dosage}</span>
                  </p>
                  <p className="flex items-center text-gray-700">
                    <span className="text-gray-500 mr-2">Frequency:</span> 
                    <span className="font-semibold">{medicine.frequency}</span>
                  </p>
                  <p className="col-span-2 flex items-center text-gray-700">
                    <span className="text-gray-500 mr-2">Days Supply:</span> 
                    <span className="font-semibold">{medicine.daysSupply} days</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between items-center border-t border-gray-100 pt-4">
            <p className="text-sm font-semibold text-gray-700">Total Amount</p>
            <p className="text-base font-bold text-primary flex items-center">
              <CurrencyRupeeIcon className="h-4 w-4 mr-0.5" />
              {order.totalAmount}
            </p>
          </div>
        </div>
        
        {/* Assignment Actions */}
        <div className="p-6">
          <h3 className="text-sm font-semibold text-primary flex items-center mb-4">
            <TruckIcon className="h-4 w-4 mr-2" />
            Delivery Information
          </h3>
          
          {order.deliveryStaffId ? (
            <div className="bg-gradient-to-r from-primary/5 to-gray-50 rounded-xl p-5 border border-primary/20 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white">
                  <TruckIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Assigned To</p>
                  <p className="text-base font-semibold text-gray-900">{order.deliveryStaffName}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-primary/5 to-white rounded-xl p-5 border border-primary/20 shadow-sm">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700 mb-4">This order needs to be assigned to a delivery staff member</p>
                <button
                  className="flex items-center justify-center mx-auto py-2.5 px-8 bg-primary text-white rounded-lg text-sm hover:bg-primary-hover transition-all shadow-sm font-medium"
                  onClick={() => setAssignModalOpen(true)}
                  disabled={assignLoading}
                >
                  {assignLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  ) : (
                    <PlusIcon className="h-4 w-4 mr-2" />
                  )}
                  Assign Delivery Staff
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails; 