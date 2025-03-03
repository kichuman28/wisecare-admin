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
  Timestamp 
} from 'firebase/firestore';
import { db } from '../../firebase';
import Layout from '../components/layout/Layout';
import { TruckIcon } from '@heroicons/react/24/outline';

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
  const [assignLoading, setAssignLoading] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [orderExpanded, setOrderExpanded] = useState({});
  const [deliveryStatus, setDeliveryStatus] = useState('');

  // Fetch initial data
  useEffect(() => {
    fetchData();
  }, []);

  // Apply filters when search term or status filter changes
  useEffect(() => {
    const filtered = filterOrders(orders, searchTerm, statusFilter, patientDetails);
    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders, patientDetails]);

  // Fetch all required data
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch orders
        const ordersQuery = query(
          collection(db, 'orders'), 
          orderBy('orderDate', 'desc')
        );
        const ordersSnapshot = await getDocs(ordersQuery);
        const ordersData = ordersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          orderDate: doc.data().orderDate?.toDate() || new Date()
        }));
        setOrders(ordersData);
        setFilteredOrders(ordersData);
        
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
        
        // Fetch user details for all orders
      await fetchPatientDetails(ordersData);
      
      // Fetch prescription details
      await fetchPrescriptionDetails(ordersData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

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
      
      // Update order in Firestore
      await updateDoc(doc(db, 'orders', selectedOrder.id), {
        deliveryStaffId: selectedStaff.id,
        deliveryStaffName: selectedStaff.name,
        status: 'processing',
        updatedAt: Timestamp.now()
      });
      
      // Update local state
      const updatedOrders = orders.map(order => {
        if (order.id === selectedOrder.id) {
          return {
            ...order,
            deliveryStaffId: selectedStaff.id,
            deliveryStaffName: selectedStaff.name,
            status: 'processing'
          };
        }
        return order;
      });
      
      setOrders(updatedOrders);
      setSelectedOrder({
        ...selectedOrder,
        deliveryStaffId: selectedStaff.id,
        deliveryStaffName: selectedStaff.name,
        status: 'processing'
      });
      
      setAssignModalOpen(false);
    } catch (error) {
      console.error('Error assigning delivery staff:', error);
    } finally {
      setAssignLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async () => {
    if (!selectedOrder || !deliveryStatus) return;
    
    try {
      setAssignLoading(true);
      
      // Update order in Firestore
      await updateDoc(doc(db, 'orders', selectedOrder.id), {
        status: deliveryStatus,
        updatedAt: Timestamp.now()
      });
      
      // Update local state
      const updatedOrders = orders.map(order => {
        if (order.id === selectedOrder.id) {
          return {
            ...order,
            status: deliveryStatus
          };
        }
        return order;
      });
      
      setOrders(updatedOrders);
      setSelectedOrder({
        ...selectedOrder,
        status: deliveryStatus
      });
      
      setDeliveryStatus('');
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setAssignLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 sm:p-6 bg-gray-50/50 min-h-screen">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center">
            <div className="p-2.5 bg-emerald-100 rounded-lg mr-4">
              <TruckIcon className="h-8 w-8 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Medication Delivery</h1>
              <p className="text-sm text-gray-600 mt-1">Manage medication orders and deliveries</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Orders Table */}
          <div className="lg:col-span-2">
            <OrdersTable
              orders={filteredOrders}
              selectedOrderId={selectedOrder?.id}
              patientDetails={patientDetails}
              orderExpanded={orderExpanded}
              formatDate={formatDate}
              handleOrderSelect={handleOrderSelect}
              toggleOrderExpanded={toggleOrderExpanded}
            />
          </div>

          {/* Order Details Panel */}
          <div className="lg:col-span-1">
            <OrderDetails
              order={selectedOrder}
              patientDetails={patientDetails}
              formatDate={formatDate}
              deliveryStatus={deliveryStatus}
              setDeliveryStatus={setDeliveryStatus}
              updateOrderStatus={updateOrderStatus}
              assignLoading={assignLoading}
              setAssignModalOpen={setAssignModalOpen}
            />
          </div>
        </div>
        
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