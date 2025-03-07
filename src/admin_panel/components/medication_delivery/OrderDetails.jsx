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
  ShieldCheckIcon,
  XMarkIcon,
  PhotoIcon,
  PencilSquareIcon,
  ChatBubbleLeftIcon,
  MapIcon
} from '@heroicons/react/24/outline';
import StatusBadge from './StatusBadge';

const OrderDetails = ({ 
  order, 
  patientDetails, 
  addressDetails,
  formatDate, 
  assignLoading, 
  setAssignModalOpen,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  if (!order) {
    return null;
  }
  
  const patient = patientDetails[order.userId] || {};
  
  // More careful address handling
  const hasAddressId = Boolean(order.addressId);
  const addressDataExists = hasAddressId && addressDetails[order.addressId];
  const address = addressDataExists ? addressDetails[order.addressId] : null;
  
  // Check if proof of delivery exists
  const hasDeliveryProof = Boolean(order.proofImageUrl || order.signatureUrl);
  
  // Format coordinates for display if they exist
  const formatCoordinates = (geopoint) => {
    if (!geopoint) return null;
    const latitude = geopoint._lat || geopoint.latitude;
    const longitude = geopoint._long || geopoint.longitude;
    
    if (typeof latitude !== 'number' || typeof longitude !== 'number') return null;
    
    return {
      lat: latitude.toFixed(6),
      lng: longitude.toFixed(6),
      url: `https://www.google.com/maps?q=${latitude},${longitude}`
    };
  };
  
  const coordinates = order.statusUpdateLocation ? formatCoordinates(order.statusUpdateLocation) : null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-100 animate-fadeIn">
        <div className="sticky top-0 z-10 px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
          <div className="flex items-center">
            <h2 className="text-lg font-semibold text-primary">Order Details</h2>
            <div className="ml-3">
              <StatusBadge status={order.status} size="lg" />
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-primary transition-colors p-1.5 rounded-full hover:bg-gray-100"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
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
        
          {/* Proof of Delivery (only shown for delivered orders) */}
          {(order.status === "delivered" || hasDeliveryProof) && (
            <div className="p-6">
              <h3 className="text-sm font-semibold text-primary flex items-center mb-4">
                <PhotoIcon className="h-4 w-4 mr-2" />
                Proof of Delivery
              </h3>

              <div className="bg-gradient-to-r from-emerald-50 to-white rounded-xl p-4 border border-emerald-100 shadow-sm">
                {!hasDeliveryProof ? (
                  <div className="flex items-center justify-center py-6">
                    <p className="text-gray-500">No delivery proof available</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Delivery Images */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {order.proofImageUrl && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700 flex items-center">
                            <PhotoIcon className="h-4 w-4 mr-1.5 text-primary" />
                            Delivery Photo
                          </p>
                          <div className="relative rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-white">
                            <img 
                              src={order.proofImageUrl} 
                              alt="Proof of Delivery" 
                              className="w-full object-cover h-48"
                            />
                            <a 
                              href={order.proofImageUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="absolute bottom-2 right-2 bg-white text-primary text-xs font-medium px-2 py-1 rounded-md shadow hover:bg-primary hover:text-white transition-colors"
                            >
                              View Full Image
                            </a>
                          </div>
                        </div>
                      )}

                      {order.signatureUrl && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700 flex items-center">
                            <PencilSquareIcon className="h-4 w-4 mr-1.5 text-primary" />
                            Customer Signature
                          </p>
                          <div className="relative rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-white">
                            <img 
                              src={order.signatureUrl} 
                              alt="Customer Signature" 
                              className="w-full object-contain h-48 bg-white"
                            />
                            <a 
                              href={order.signatureUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="absolute bottom-2 right-2 bg-white text-primary text-xs font-medium px-2 py-1 rounded-md shadow hover:bg-primary hover:text-white transition-colors"
                            >
                              View Full Image
                            </a>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Delivery Notes */}
                    {order.deliveryNotes && (
                      <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                        <p className="text-sm font-medium text-gray-700 flex items-center mb-2">
                          <ChatBubbleLeftIcon className="h-4 w-4 mr-1.5 text-primary" />
                          Delivery Notes
                        </p>
                        <p className="text-sm text-gray-600 italic">"{order.deliveryNotes}"</p>
                      </div>
                    )}

                    {/* Delivery Location */}
                    {coordinates && (
                      <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                        <p className="text-sm font-medium text-gray-700 flex items-center mb-2">
                          <MapIcon className="h-4 w-4 mr-1.5 text-primary" />
                          Delivery Location
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                          Coordinates: {coordinates.lat}, {coordinates.lng}
                        </p>
                        <a 
                          href={coordinates.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:text-primary-hover font-medium inline-flex items-center"
                        >
                          <MapPinIcon className="h-3.5 w-3.5 mr-1" />
                          View on Google Maps
                        </a>
                      </div>
                    )}

                    {/* Delivery Timestamp */}
                    {order.updatedAt && order.status === "delivered" && (
                      <div className="text-xs text-gray-500 flex items-center mt-2">
                        <ClockIcon className="h-3.5 w-3.5 mr-1.5" />
                        <span>Delivered on: {formatDate(order.updatedAt.toDate ? order.updatedAt.toDate() : order.updatedAt)}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        
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
              <div 
                key={`staff-${order.deliveryStaffId}`} 
                className="bg-gradient-to-r from-primary/5 to-gray-50 rounded-xl p-5 border border-primary/20 shadow-sm"
              >
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
              <div 
                key="staff-unassigned" 
                className="bg-gradient-to-r from-primary/5 to-white rounded-xl p-5 border border-primary/20 shadow-sm"
              >
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
    </div>
  );
};

export default OrderDetails; 