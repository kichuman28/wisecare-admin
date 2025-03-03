import React, { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  where, 
  orderBy, 
  Timestamp,
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../../firebase';
import Layout from '../components/layout/Layout';
import { TruckIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

// Import our components
import OrdersTable from '../components/medication_delivery/OrdersTable';
import OrderDetails from '../components/medication_delivery/OrderDetails';
import OrderFilters from '../components/medication_delivery/OrderFilters';
import AssignStaffModal from '../components/medication_delivery/AssignStaffModal';
import { formatDate, filterOrders } from '../components/medication_delivery/utils';

const MedicationDeliveryPage = () => {
  // State management
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deliveryStaff, setDeliveryStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patientDetails, setPatientDetails] = useState({});
  const [doctorDetails, setDoctorDetails] = useState({});
  const [addressDetails, setAddressDetails] = useState({});
  const [assignLoading, setAssignLoading] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [orderExpanded, setOrderExpanded] = useState({});
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // Fetch delivery staff
        const staffQuery = query(
          collection(db, 'delivery'),
          where('role', '==', 'delivery')
        );
        const staffSnapshot = await getDocs(staffQuery);
        const staffData = staffSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDeliveryStaff(staffData);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialData();
    
    // Set up the real-time listener for orders
    const ordersQuery = query(
      collection(db, 'orders'), 
      orderBy('orderDate', 'desc')
    );
    
    const unsubscribe = onSnapshot(ordersQuery, async (snapshot) => {
      try {
        const ordersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          orderDate: doc.data().orderDate?.toDate() || new Date()
        }));
        
        setOrders(ordersData);
        
        // Update selected order if it's in the updated data
        if (selectedOrder) {
          const updatedSelectedOrder = ordersData.find(order => order.id === selectedOrder.id);
          if (updatedSelectedOrder) {
            setSelectedOrder(prev => ({
              ...prev,
              ...updatedSelectedOrder
            }));
          }
        }
        
        // Fetch user details for all orders
        await fetchPatientDetails(ordersData);
        
        // Fetch addresses for all orders
        await fetchAddressDetails(ordersData);
        
        // Fetch prescription details
        await fetchPrescriptionDetails(ordersData);
      } catch (error) {
        console.error('Error processing order updates:', error);
      }
    }, (error) => {
      console.error('Error in order listener:', error);
    });
    
    // Clean up the listener when component unmounts
    return () => unsubscribe();
  }, []);

  // Apply filters when search term or status filter changes
  useEffect(() => {
    const filtered = filterOrders(orders, searchTerm, statusFilter, patientDetails, addressDetails);
    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders, patientDetails, addressDetails]);

  // Fetch patient details
  const fetchPatientDetails = async (ordersData) => {
    try {
      const userIds = [...new Set(ordersData.map(order => order.userId))];
      const patientData = {};
      
      for (const userId of userIds) {
        // First try to get from 'users' collection
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          patientData[userId] = {
            id: userId,
            name: userData.displayName || 'No Name',
            email: userData.email || 'No Email',
            phone: userData.phone || 'No phone number',
            photoURL: userData.photoURL || null,
            lastLoginAt: userData.lastLoginAt?.toDate() || null,
            createdAt: userData.createdAt?.toDate() || null,
            provider: userData.provider || 'unknown'
          };
        } else {
          // If not found, set default values
          patientData[userId] = {
            id: userId,
            name: 'Unknown Patient',
            email: 'No email available',
            phone: 'No phone number',
            photoURL: null
          };
        }
      }
      
      setPatientDetails(patientData);
    } catch (error) {
      console.error('Error fetching patient details:', error);
    }
  };

  // Fetch address details
  const fetchAddressDetails = async (ordersData) => {
    try {
      const addressIds = [...new Set(ordersData.map(order => order.addressId).filter(Boolean))];
      const addressData = {};
      
      for (const addressId of addressIds) {
        try {
          // The collection path should be users/{userId}/addresses/{addressId}
          // Get the order with this addressId to find the userId
          const orderWithAddress = ordersData.find(order => order.addressId === addressId);
          if (!orderWithAddress || !orderWithAddress.userId) {
            addressData[addressId] = {
              id: addressId,
              address: 'Address not found - no user ID',
              additionalInfo: '',
              latitude: null,
              longitude: null,
              isDefault: false
            };
            continue;
          }
          
          const userId = orderWithAddress.userId;
          
          // Correct path: users/{userId}/addresses/{addressId}
          const addressDoc = await getDoc(doc(db, 'users', userId, 'addresses', addressId));
          
          if (addressDoc.exists()) {
            const addressDataFromDoc = addressDoc.data();
            
            addressData[addressId] = {
              id: addressId,
              ...addressDataFromDoc
            };
          } else {
            // If not found, set default values matching actual structure
            addressData[addressId] = {
              id: addressId,
              address: 'Address not found',
              additionalInfo: '',
              latitude: null,
              longitude: null,
              isDefault: false
            };
          }
        } catch (addressError) {
          console.error('Error fetching specific address:', addressId, addressError);
          addressData[addressId] = {
            id: addressId,
            address: 'Error fetching address',
            additionalInfo: '',
            latitude: null,
            longitude: null,
            isDefault: false
          };
        }
      }
      
      setAddressDetails(addressData);
    } catch (error) {
      console.error('Error in address fetching process:', error);
    }
  };
        
  // Fetch prescription and doctor details
  const fetchPrescriptionDetails = async (ordersData) => {
    try {
      const prescriptionIds = [...new Set(ordersData.map(order => order.prescriptionId).filter(Boolean))];
      const doctorIds = new Set();
      
      for (const prescriptionId of prescriptionIds) {
        const prescriptionDoc = await getDoc(doc(db, 'prescriptions', prescriptionId));
        if (prescriptionDoc.exists() && prescriptionDoc.data().doctorId) {
          doctorIds.add(prescriptionDoc.data().doctorId);
        }
      }
      
      // Fetch doctor details
      const doctorData = {};
      for (const doctorId of doctorIds) {
        const doctorDoc = await getDoc(doc(db, 'users', doctorId));
        if (doctorDoc.exists()) {
          doctorData[doctorId] = doctorDoc.data();
        }
      }
      
      setDoctorDetails(doctorData);
    } catch (error) {
      console.error('Error fetching prescription details:', error);
    }
  };

  // Handle order selection
  const handleOrderSelect = async (order) => {
    setSelectedOrder(order);
    setOrderDetailsOpen(true);
    
    // Fetch address details if needed
    if (order.addressId && !addressDetails[order.addressId]) {
      try {
        // Use the correct path: users/{userId}/addresses/{addressId}
        const addressDoc = await getDoc(doc(db, 'users', order.userId, 'addresses', order.addressId));
        
        if (addressDoc.exists()) {
          const addressData = addressDoc.data();
          
          setAddressDetails(prev => ({
            ...prev,
            [order.addressId]: {
              id: order.addressId,
              ...addressData
            }
          }));
        } else {
          setAddressDetails(prev => ({
            ...prev,
            [order.addressId]: {
              id: order.addressId,
              address: 'Address not found',
              additionalInfo: '',
              latitude: null,
              longitude: null,
              isDefault: false
            }
          }));
        }
      } catch (error) {
        console.error('Error fetching address in handleOrderSelect:', error);
      }
    }
    
    // Fetch prescription details if needed
    if (order.prescriptionId) {
      try {
        const prescriptionDoc = await getDoc(doc(db, 'prescriptions', order.prescriptionId));
        if (prescriptionDoc.exists()) {
          const prescriptionData = prescriptionDoc.data();
          
          // Update selected order with prescription details
          setSelectedOrder(prev => ({
            ...prev,
            prescription: prescriptionData
          }));
          
          // Get doctor details if not already fetched
          if (prescriptionData.doctorId && !doctorDetails[prescriptionData.doctorId]) {
            const doctorDoc = await getDoc(doc(db, 'users', prescriptionData.doctorId));
            if (doctorDoc.exists()) {
              setDoctorDetails(prev => ({
                ...prev,
                [prescriptionData.doctorId]: doctorDoc.data()
              }));
            }
          }
        }
      } catch (error) {
        console.error('Error fetching prescription details:', error);
      }
    }
  };

  // Toggle order row expansion
  const toggleOrderExpanded = (orderId) => {
    setOrderExpanded(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  // Assign delivery staff to order
  const assignDeliveryStaff = async () => {
    if (!selectedOrder || !selectedStaff) return;
    
    try {
      setAssignLoading(true);
      
      // Create updated order data
      const updatedOrderData = {
        deliveryStaffId: selectedStaff.id,
        deliveryStaffName: selectedStaff.name,
        status: 'processing',
        updatedAt: Timestamp.now()
      };
      
      // Update order in Firestore
      await updateDoc(doc(db, 'orders', selectedOrder.id), updatedOrderData);
      
      // Immediately update the selected order in the local state
      setSelectedOrder(prevOrder => ({
        ...prevOrder,
        ...updatedOrderData
      }));
      
      // Close the assignment modal
      setAssignModalOpen(false);
      
      // Reset selected staff
      setSelectedStaff(null);
    } catch (error) {
      console.error('Error assigning delivery staff:', error);
    } finally {
      setAssignLoading(false);
    }
  };

  // Close order details modal
  const closeOrderDetails = () => {
    setOrderDetailsOpen(false);
  };

  // Loading state
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen bg-background-secondary">
          <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-gray-600 font-medium">Loading medication orders...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50/70">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center">
                <div className="p-3 bg-primary/10 rounded-lg mr-4">
                  <TruckIcon className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Medication Delivery</h1>
                  <p className="text-sm text-gray-600 mt-1">Track and manage medication deliveries</p>
                </div>
              </div>
              
              {/* Filters */}
              <OrderFilters 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
              />
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {filteredOrders.length > 0 ? (
            <OrdersTable
              orders={filteredOrders}
              selectedOrderId={selectedOrder?.id}
              patientDetails={patientDetails}
              addressDetails={addressDetails}
              orderExpanded={orderExpanded}
              formatDate={formatDate}
              handleOrderSelect={handleOrderSelect}
              toggleOrderExpanded={toggleOrderExpanded}
            />
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-100">
              <div className="bg-primary/5 rounded-full p-4 w-20 h-20 mx-auto flex items-center justify-center">
                <DocumentTextIcon className="h-10 w-10 text-primary" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-800">No Orders Found</h3>
              <p className="mt-2 text-gray-500">Try adjusting your filters to find what you're looking for.</p>
            </div>
          )}
        </div>
        
        {/* Order Details Modal */}
        <OrderDetails
          order={selectedOrder}
          patientDetails={patientDetails}
          addressDetails={addressDetails}
          formatDate={formatDate}
          assignLoading={assignLoading}
          setAssignModalOpen={setAssignModalOpen}
          isOpen={orderDetailsOpen}
          onClose={closeOrderDetails}
        />
        
        {/* Assign Delivery Staff Modal */}
        <AssignStaffModal
          isOpen={assignModalOpen && selectedOrder != null}
          onClose={() => setAssignModalOpen(false)}
          deliveryStaff={deliveryStaff}
          selectedStaff={selectedStaff}
          setSelectedStaff={setSelectedStaff}
          onAssign={assignDeliveryStaff}
          assignLoading={assignLoading}
        />
      </div>
    </Layout>
  );
};

export default MedicationDeliveryPage; 