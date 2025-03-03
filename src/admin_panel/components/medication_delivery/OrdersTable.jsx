import React from 'react';
import { 
  ChevronUpIcon, 
  ChevronDownIcon,
  ExclamationTriangleIcon,
  MapPinIcon 
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
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">Medication Orders</h2>
        <p className="text-xs text-gray-500 mt-1">Showing {orders.length} orders</p>
      </div>
      <div className="overflow-x-auto">
        {orders.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr 
                    className={`hover:bg-gray-50 cursor-pointer ${selectedOrderId === order.id ? 'bg-primary-light/10' : ''}`}
                    onClick={() => handleOrderSelect(order)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">{order.id.substring(0, 8)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {patientDetails[order.userId]?.name || 'Unknown Patient'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(order.orderDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      ₹{order.totalAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        className="text-gray-400 hover:text-gray-600"
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
                    <tr>
                      <td colSpan="6" className="px-6 py-4 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <h3 className="text-sm font-medium text-gray-500">Medicines</h3>
                            <ul className="space-y-2">
                              {order.medicines.map((medicine, idx) => (
                                <li key={idx} className="text-sm text-gray-700">
                                  {medicine.medicineName} - {medicine.quantity} units
                                  <span className="block text-xs text-gray-500">
                                    {medicine.dosage} {medicine.frequency}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-sm font-medium text-gray-500">Delivery Details</h3>
                            <div className="text-sm text-gray-700">
                              {order.deliveryStaffName ? (
                                <p>Assigned to: {order.deliveryStaffName}</p>
                              ) : (
                                <p className="text-amber-600">Not assigned yet</p>
                              )}
                              
                              {order.addressId ? (
                                <div className="mt-2 flex items-start">
                                  <MapPinIcon className="h-4 w-4 mt-0.5 mr-1.5 text-gray-500" />
                                  <p className="text-gray-600 break-words">{formatAddressPreview(order.addressId)}</p>
                                </div>
                              ) : (
                                <div className="mt-2 flex items-start">
                                  <ExclamationTriangleIcon className="h-4 w-4 mt-0.5 mr-1.5 text-amber-500" />
                                  <p className="text-amber-600">No address provided</p>
                                </div>
                              )}
                              
                              <p className="mt-2">
                                <button
                                  className="text-primary hover:text-primary-hover text-sm font-medium"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOrderSelect(order);
                                  }}
                                >
                                  View details →
                                </button>
                              </p>
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