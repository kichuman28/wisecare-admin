import { useState, useEffect, Fragment } from 'react';
import { collection, query, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import Layout from '../components/layout/Layout';
import { Tab } from '@headlessui/react';
import { Dialog, Transition } from '@headlessui/react';
import {
  UserGroupIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  PhoneIcon,
  ClockIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
  XMarkIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [responders, setResponders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newResponder, setNewResponder] = useState({
    name: '',
    phone: '',
    role: 'hero'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingResponder, setEditingResponder] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Fetch users
    const usersQuery = query(collection(db, 'users'));
    const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastLoginAt: doc.data().lastLoginAt?.toDate?.() || new Date(doc.data().lastLoginAt)
      }));
      setUsers(usersData);
      setLoading(false);
    });

    // Fetch responders
    const respondersQuery = query(collection(db, 'responders'));
    const unsubscribeResponders = onSnapshot(respondersQuery, (snapshot) => {
      const respondersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setResponders(respondersData);
    });

    return () => {
      unsubscribeUsers();
      unsubscribeResponders();
    };
  }, []);

  const formatDate = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleString();
  };

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const filterData = (data, type) => {
    return data.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter === '' || 
        (type === 'responder' ? item.role === roleFilter : true);

      return matchesSearch && matchesRole;
    });
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. Please try again.');
    }
  };

  const handleDeleteResponder = async (responderId) => {
    try {
      await deleteDoc(doc(db, 'responders', responderId));
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Error deleting responder:', error);
      alert('Failed to delete responder. Please try again.');
    }
  };

  const handleEditResponder = async (e) => {
    e.preventDefault();
    setIsEditing(true);

    try {
      await updateDoc(doc(db, 'responders', editingResponder.id), {
        name: editingResponder.name,
        phone: editingResponder.phone,
        role: editingResponder.role
      });

      setIsEditModalOpen(false);
      setEditingResponder(null);
    } catch (error) {
      console.error('Error updating responder:', error);
      alert('Failed to update responder. Please try again.');
    } finally {
      setIsEditing(false);
    }
  };

  const UserRow = ({ user }) => (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-3 sm:px-6 py-4 whitespace-normal sm:whitespace-nowrap">
        <div className="flex flex-col sm:flex-row sm:items-center">
          {user.photoURL ? (
            <img 
              src={user.photoURL} 
              alt={user.displayName}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-medium">
                {getInitials(user.displayName)}
              </span>
            </div>
          )}
          <div className="mt-2 sm:mt-0 sm:ml-4">
            <div className="text-sm font-medium text-gray-900">{user.displayName}</div>
            <div className="text-sm text-gray-500 flex items-center">
              <EnvelopeIcon className="h-4 w-4 mr-1" />
              <span className="break-all">{user.email}</span>
            </div>
          </div>
        </div>
      </td>
      <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {formatDate(user.lastLoginAt)}
        </div>
        <div className="text-xs text-gray-500">Last login</div>
      </td>
      <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
          ${user.provider === 'google' ? 'bg-[#A9B5DF] text-[#2D336B]' : 'bg-gray-100 text-gray-800'}`}>
          {user.provider || 'email'}
        </span>
      </td>
      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button 
          onClick={() => {
            setItemToDelete({ id: user.id, type: 'user', name: user.displayName });
            setIsDeleteModalOpen(true);
          }}
          className="text-[#7886C7] hover:text-[#2D336B]"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </td>
    </tr>
  );

  const ResponderRow = ({ responder }) => (
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
        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#A9B5DF] text-[#2D336B]">
          {responder.role}
        </span>
      </td>
      <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-500">ID: {responder.id}</span>
      </td>
      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button 
          onClick={() => {
            setEditingResponder(responder);
            setIsEditModalOpen(true);
          }}
          className="text-[#7886C7] hover:text-[#2D336B] mr-4"
        >
          <PencilIcon className="h-5 w-5" />
        </button>
        <button 
          onClick={() => {
            setItemToDelete({ id: responder.id, type: 'responder', name: responder.name });
            setIsDeleteModalOpen(true);
          }}
          className="text-[#7886C7] hover:text-[#2D336B]"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </td>
    </tr>
  );

  const handleAddResponder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'responders'), {
        name: newResponder.name,
        phone: newResponder.phone,
        role: newResponder.role
      });

      setIsModalOpen(false);
      setNewResponder({ name: '', phone: '', role: 'hero' });
    } catch (error) {
      console.error('Error adding responder:', error);
      alert('Failed to add responder. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
          {selectedTab === 1 && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors w-full sm:w-auto"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add New Responder
            </button>
          )}
        </div>

        <Tab.Group onChange={setSelectedTab}>
          <Tab.List className="flex space-x-1 rounded-xl bg-primary-light/20 p-1 mb-6">
            <Tab className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5
              ${selected 
                ? 'bg-white shadow text-primary'
                : 'text-primary-hover hover:bg-white/[0.12] hover:text-primary'}`
            }>
              Users
            </Tab>
            <Tab className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5
              ${selected 
                ? 'bg-white shadow text-primary'
                : 'text-primary-hover hover:bg-white/[0.12] hover:text-primary'}`
            }>
              Responders
            </Tab>
          </Tab.List>

          {/* Filters */}
          <div className="bg-background-secondary p-4 rounded-lg shadow-sm mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-hover"
              />
              <select 
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-hover"
              >
                <option value="">All Roles</option>
                <option value="hero">Hero</option>
                <option value="admin">Admin</option>
                <option value="responder">Responder</option>
              </select>
            </div>
          </div>

          {/* Add Responder Modal */}
          <Transition appear show={isModalOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={() => setIsModalOpen(false)}>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
              </Transition.Child>

              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center"
                      >
                        Add New Responder
                        <button
                          onClick={() => setIsModalOpen(false)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <XMarkIcon className="h-6 w-6" />
                        </button>
                      </Dialog.Title>

                      <form onSubmit={handleAddResponder} className="mt-4 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Name
                          </label>
                          <input
                            type="text"
                            required
                            value={newResponder.name}
                            onChange={(e) => setNewResponder(prev => ({ ...prev, name: e.target.value }))}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Enter responder name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            required
                            value={newResponder.phone}
                            onChange={(e) => setNewResponder(prev => ({ ...prev, phone: e.target.value }))}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Enter phone number"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Role
                          </label>
                          <select
                            value={newResponder.role}
                            onChange={(e) => setNewResponder(prev => ({ ...prev, role: e.target.value }))}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="hero">Hero</option>
                            <option value="admin">Admin</option>
                            <option value="responder">Responder</option>
                          </select>
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                          <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-offset-2 disabled:bg-primary-light"
                          >
                            {isSubmitting ? 'Adding...' : 'Add Responder'}
                          </button>
                        </div>
                      </form>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>

          {/* Delete Confirmation Modal */}
          <Transition appear show={isDeleteModalOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={() => setIsDeleteModalOpen(false)}>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
              </Transition.Child>

              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900 flex items-center"
                      >
                        <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-2" />
                        Confirm Delete
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to delete {itemToDelete?.type === 'user' ? 'user' : 'responder'}{' '}
                          <span className="font-medium text-gray-900">{itemToDelete?.name}</span>? 
                          This action cannot be undone.
                        </p>
                      </div>

                      <div className="mt-6 flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setIsDeleteModalOpen(false)}
                          className="inline-flex justify-center rounded-md border border-[#A9B5DF] px-4 py-2 text-sm font-medium text-[#2D336B] hover:bg-[#FFF2F2] focus:outline-none focus:ring-2 focus:ring-[#7886C7] focus:ring-offset-2"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (itemToDelete?.type === 'user') {
                              handleDeleteUser(itemToDelete.id);
                            } else {
                              handleDeleteResponder(itemToDelete.id);
                            }
                          }}
                          className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                          Delete
                        </button>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>

          {/* Edit Responder Modal */}
          <Transition appear show={isEditModalOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={() => setIsEditModalOpen(false)}>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
              </Transition.Child>

              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center"
                      >
                        Edit Responder
                        <button
                          onClick={() => setIsEditModalOpen(false)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <XMarkIcon className="h-6 w-6" />
                        </button>
                      </Dialog.Title>

                      <form onSubmit={handleEditResponder} className="mt-4 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Name
                          </label>
                          <input
                            type="text"
                            required
                            value={editingResponder?.name || ''}
                            onChange={(e) => setEditingResponder(prev => ({ ...prev, name: e.target.value }))}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Enter responder name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            required
                            value={editingResponder?.phone || ''}
                            onChange={(e) => setEditingResponder(prev => ({ ...prev, phone: e.target.value }))}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Enter phone number"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Role
                          </label>
                          <select
                            value={editingResponder?.role || 'hero'}
                            onChange={(e) => setEditingResponder(prev => ({ ...prev, role: e.target.value }))}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="hero">Hero</option>
                            <option value="admin">Admin</option>
                            <option value="responder">Responder</option>
                          </select>
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                          <button
                            type="button"
                            onClick={() => setIsEditModalOpen(false)}
                            className="inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isEditing}
                            className="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-offset-2 disabled:bg-primary-light"
                          >
                            {isEditing ? 'Saving...' : 'Save Changes'}
                          </button>
                        </div>
                      </form>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>

          <Tab.Panels>
            <Tab.Panel>
              <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User Details
                      </th>
                      <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Active
                      </th>
                      <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Provider
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filterData(users, 'user').map((user) => (
                      <UserRow key={user.id} user={user} />
                    ))}
                  </tbody>
                </table>
              </div>
            </Tab.Panel>

            <Tab.Panel>
              <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Responder Details
                      </th>
                      <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filterData(responders, 'responder').map((responder) => (
                      <ResponderRow key={responder.id} responder={responder} />
                    ))}
                  </tbody>
                </table>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </Layout>
  );
};

export default UsersPage; 