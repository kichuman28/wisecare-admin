import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import Layout from '../components/layout/Layout';
import { UserGroupIcon, PlusIcon } from '@heroicons/react/24/outline';
import SearchFilter from '../components/user_management/search_filter';
import UserTabs from '../components/user_management/user_tabs';
import { 
  AddUserModal, 
  EditUserModal, 
  DeleteConfirmationModal 
} from '../components/modals/user_modals';

const UsersPage = () => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [responders, setResponders] = useState([]);
  const [deliveryStaff, setDeliveryStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    phone: '',
    email: '',
    role: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Fetch all users
    const usersQuery = query(collection(db, 'users'));
    const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastLoginAt: doc.data().lastLoginAt?.toDate?.() || new Date(doc.data().lastLoginAt)
      }));
      
      // Filter out admin users
      const filteredUsers = usersData.filter(user => user.role !== 'admin');
      
      // Categorize users based on roles
      const patientsArray = filteredUsers.filter(user => !user.role || user.role === 'patient');
      const doctorsArray = filteredUsers.filter(user => user.role === 'doctor');
      const respondersArray = filteredUsers.filter(user => user.role === 'responders');
      const deliveryArray = filteredUsers.filter(user => user.role === 'delivery');
      
      setPatients(patientsArray);
      setDoctors(doctorsArray);
      setResponders(respondersArray);
      setDeliveryStaff(deliveryArray);
      setLoading(false);
    });

    return () => {
      unsubscribeUsers();
    };
  }, []);

  const handleDeleteUser = async () => {
    try {
      await deleteDoc(doc(db, 'users', itemToDelete.id));
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. Please try again.');
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    setIsEditing(true);

    try {
      await updateDoc(doc(db, 'users', editingUser.id), {
        name: editingUser.name || editingUser.displayName,
        phone: editingUser.phone,
        email: editingUser.email,
        role: editingUser.role,
        updatedAt: new Date()
      });

      setIsEditModalOpen(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user. Please try again.');
    } finally {
      setIsEditing(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'users'), {
        name: newUser.name,
        phone: newUser.phone,
        email: newUser.email,
        role: newUser.role,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      setIsModalOpen(false);
      setNewUser({ name: '', phone: '', email: '', role: '' });
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Failed to add user. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-3 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div className="flex items-center">
            <UserGroupIcon className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">User Management</h1>
          </div>
          <button 
            onClick={() => {
              setNewUser({ name: '', phone: '', email: '', role: '' });
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors w-full sm:w-auto"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New User
          </button>
        </div>

        {/* Search Filter Component */}
        <SearchFilter 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
        />

        {/* User Tabs Component */}
        <UserTabs 
          patients={patients}
          doctors={doctors}
          responders={responders}
          deliveryStaff={deliveryStaff}
          searchTerm={searchTerm}
          onEditUser={(user) => {
            setEditingUser(user);
            setIsEditModalOpen(true);
          }}
          onDeleteUser={(item) => {
            setItemToDelete(item);
            setIsDeleteModalOpen(true);
          }}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />

        {/* Add User Modal */}
        <AddUserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          newUser={newUser}
          setNewUser={setNewUser}
          onSubmit={handleAddUser}
          isSubmitting={isSubmitting}
        />

        {/* Edit User Modal */}
        <EditUserModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          editingUser={editingUser}
          setEditingUser={setEditingUser}
          onSubmit={handleEditUser}
          isEditing={isEditing}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          itemToDelete={itemToDelete}
          onConfirm={handleDeleteUser}
        />
      </div>
    </Layout>
  );
};

export default UsersPage;