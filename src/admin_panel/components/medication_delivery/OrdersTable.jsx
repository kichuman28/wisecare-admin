import React from 'react';
import { 
  ChevronUpIcon, 
  ChevronDownIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  CurrencyRupeeIcon,
  UserCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import StatusBadge from './StatusBadge';

const OrdersTable = ({ 
  orders, 
  selectedOrderId, 
  patientDetails, 
  addressDetails,
  orderExpanded, 
  formatDate, 
  handleOrderSelect, 
  toggleOrderExpanded 
}) => {
  // Helper function to format address for display
  const formatAddressPreview = (addressId) => {
    if (!addressId) return 'No address ID';
    if (!addressDetails || !addressDetails[addressId]) return 'Address data not loaded';
    
    const address = addressDetails[addressId];
    
    // Check if address has the address field
    if (!address.address) return 'Address details missing';
    
    // Truncate if too long
    const fullAddress = address.address;
    return fullAddress.length > 40 ? `${fullAddress.substring(0, 37)}...` : fullAddress;
  };
  
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
        <h2 className="text-lg font-semibold text-primary">Medication Orders</h2>
        <p className="text-xs text-gray-500 mt-1">Showing {orders.length} orders</p>
      </div>
      <div className="overflow-x-auto">
        {orders.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {orders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr 
                    className={`hover:bg-primary/5 cursor-pointer transition-colors ${selectedOrderId === order.id ? 'bg-primary/10' : ''}`}
                    onClick={() => handleOrderSelect(order)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-primary">{order.id.substring(0, 8)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 mr-3">
                          {patientDetails[order.userId]?.photoURL ? (
                            <img 
                              className="h-8 w-8 rounded-md object-cover" 
                              src={patientDetails[order.userId].photoURL} 
                              alt=""
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-md bg-primary-light flex items-center justify-center text-white">
                              <UserCircleIcon className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {patientDetails[order.userId]?.name || 'Unknown Patient'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-600">
                        <ClockIcon className="h-4 w-4 mr-1.5 text-gray-400" />
                        {formatDate(order.orderDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm font-medium text-gray-900">
                        <CurrencyRupeeIcon className="h-4 w-4 mr-0.5 text-primary" />
                        {order.totalAmount}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        className="text-gray-400 hover:text-primary transition-colors p-1 rounded-full hover:bg-gray-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleOrderExpanded(order.id);
                        }}
                      >
                        {orderExpanded[order.id] ? 
                          <ChevronUpIcon className="h-5 w-5" /> : 
                          <ChevronDownIcon className="h-5 w-5" />
                        }
                      </button>
                    </td>
                  </tr>
                  {orderExpanded[order.id] && (
                    <tr className="bg-gray-50/70">
                      <td colSpan="6" className="px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-primary">Medicines</h3>
                            <ul className="space-y-2">
                              {order.medicines.map((medicine, idx) => (
                                <li key={idx} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                                  <div className="flex justify-between">
                                    <p className="text-sm font-medium text-gray-800">
                                      {medicine.medicineName}
                                    </p>
                                    <p className="text-sm font-semibold text-primary flex items-center">
                                      <CurrencyRupeeIcon className="h-3.5 w-3.5 mr-0.5" />
                                      {medicine.totalPrice}
                                    </p>
                                  </div>
                                  <div className="mt-1 text-xs text-gray-500 flex items-center">
                                    <span className="font-medium">{medicine.quantity} units</span>
                                    <span className="mx-1.5">•</span>
                                    <span>{medicine.dosage} {medicine.frequency}</span>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-primary">Delivery Details</h3>
                            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                              {order.deliveryStaffId ? (
                                <div className="flex items-center text-sm mb-3">
                                  <div className="h-7 w-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mr-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                      <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
                                    </svg>
                                  </div>
                                  <span className="font-medium">Assigned to: {order.deliveryStaffName}</span>
                                </div>
                              ) : (
                                <p className="flex items-center text-sm text-amber-600 mb-3">
                                  <ExclamationTriangleIcon className="h-4 w-4 mr-1.5" />
                                  Not assigned yet
                                </p>
                              )}
                              
                              {order.addressId ? (
                                <div className="flex items-start">
                                  <MapPinIcon className="h-4 w-4 mt-0.5 mr-1.5 text-primary" />
                                  <p className="text-sm text-gray-700 break-words">{formatAddressPreview(order.addressId)}</p>
                                </div>
                              ) : (
                                <div className="flex items-start">
                                  <ExclamationTriangleIcon className="h-4 w-4 mt-0.5 mr-1.5 text-amber-500" />
                                  <p className="text-sm text-amber-600">No address provided</p>
                                </div>
                              )}
                              
                              <div className="mt-3 pt-2 border-t border-gray-100">
                                <button
                                  className="text-primary hover:text-primary-hover text-sm font-medium flex items-center"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOrderSelect(order);
                                  }}
                                >
                                  View full details
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-12 text-center">
            <ExclamationTriangleIcon className="h-12 w-12 text-gray-300 mx-auto" />
            <p className="mt-2 text-gray-500">No orders found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersTable; 