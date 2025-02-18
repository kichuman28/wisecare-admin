import { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, onSnapshot, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import Layout from '../components/layout/Layout';
import { Tab } from '@headlessui/react';
import { 
  BellIcon, 
  UserIcon, 
  PhoneIcon, 
  MapPinIcon,
  DevicePhoneMobileIcon,
  BoltIcon, // Changed from BatteryIcon to BoltIcon
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  BellAlertIcon
} from '@heroicons/react/24/outline';

const SOSAlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [responders, setResponders] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for alerts
    const alertsQuery = query(
      collection(db, 'sos_alerts'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribeAlerts = onSnapshot(alertsQuery, (snapshot) => {
      const alertsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAlerts(alertsData);
      setLoading(false);
    });

    // Listen for responders
    const respondersQuery = query(collection(db, 'responders'));
    const unsubscribeResponders = onSnapshot(respondersQuery, (snapshot) => {
      const respondersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setResponders(respondersData);
    });

    // Listen for users
    const usersQuery = query(collection(db, 'users'));
    const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
      const usersData = {};
      snapshot.docs.forEach(doc => {
        usersData[doc.id] = doc.data();
      });
      setUsers(usersData);
    });

    return () => {
      unsubscribeAlerts();
      unsubscribeResponders();
      unsubscribeUsers();
    };
  }, []);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown';
    try {
      if (timestamp.toDate) {
        return timestamp.toDate().toLocaleString();
      }
      return new Date(timestamp).toLocaleString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-red-600 bg-red-100';
      case 'assigned':
        return 'text-yellow-600 bg-yellow-100';
      case 'resolved':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const handleAssignResponder = async (alertId, responderId) => {
    const responder = responders.find(r => r.id === responderId);
    if (!responder) return;

    try {
      await updateDoc(doc(db, 'sos_alerts', alertId), {
        status: 'assigned',
        assignedTo: responderId,
        assignedAt: serverTimestamp(),
        responder: {
          id: responder.id,
          name: responder.name,
          phone: responder.phone,
          role: responder.role
        }
      });
    } catch (error) {
      console.error('Error assigning responder:', error);
    }
  };

  const handleResolveAlert = async (alertId) => {
    try {
      await updateDoc(doc(db, 'sos_alerts', alertId), {
        status: 'resolved',
        resolvedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error resolving alert:', error);
    }
  };

  const AlertCard = ({ alert }) => {
    const [selectedResponderId, setSelectedResponderId] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const user = users[alert.userId] || {};

    const filteredResponders = responders.filter(responder => 
      responder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      responder.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedResponder = responders.find(r => r.id === selectedResponderId);

    const handleSelectResponder = (responderId) => {
      setSelectedResponderId(responderId);
      setSearchQuery('');
      setIsOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
      <div className={`bg-white rounded-xl shadow-sm transition-all duration-200 hover:shadow-md mb-4 sm:mb-6 overflow-hidden
        ${alert.status === 'pending' ? 'border-l-4 border-red-500' : 
          alert.status === 'assigned' ? 'border-l-4 border-yellow-500' : 
          alert.status === 'resolved' ? 'border-l-4 border-green-500' : ''}`}>
        
        {/* Status Header */}
        <div className={`px-3 sm:px-6 py-2 sm:py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0
          ${alert.status === 'pending' ? 'bg-red-50' : 
            alert.status === 'assigned' ? 'bg-yellow-50' : 
            alert.status === 'resolved' ? 'bg-green-50' : 'bg-gray-50'}`}>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium
              ${getStatusColor(alert.status)}`}>
              {alert.status === 'pending' && <ExclamationTriangleIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />}
              {alert.status === 'assigned' && <BellAlertIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />}
              {alert.status === 'resolved' && <CheckCircleIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />}
              {alert.status.toUpperCase()}
            </span>
            <span className="text-xs sm:text-sm text-gray-600 flex items-center">
              <ClockIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
              {formatTimestamp(alert.timestamp)}
            </span>
          </div>
        </div>

        <div className="p-3 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* User Information */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start space-x-3 sm:space-x-4">
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || 'User'} 
                    className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover ring-2 ring-gray-200"
                  />
                ) : (
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary-light/20 flex items-center justify-center ring-2 ring-gray-200">
                    <UserIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 break-words">
                    {user.displayName || 'Unknown User'}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 break-words">{user.email}</p>
                  {user.phone && (
                    <a href={`tel:${user.phone}`} className="mt-1 text-xs sm:text-sm text-primary-hover hover:text-primary flex items-center">
                      <PhoneIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
                      {user.phone}
                    </a>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <div className="flex items-center mb-2">
                  <MapPinIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 mr-2" />
                  <span className="text-xs sm:text-sm font-medium text-gray-900">Emergency Location</span>
                </div>
                <div className="space-y-1 ml-6 sm:ml-7">
                  <p className="text-xs sm:text-sm text-gray-600">
                    Latitude: {alert.location?.latitude}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Longitude: {alert.location?.longitude}
                  </p>
                </div>
              </div>
            </div>

            {/* Device Information */}
            <div className="space-y-3 sm:space-y-4">
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <h4 className="text-xs sm:text-sm font-medium text-gray-900 mb-3">Device Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center text-xs sm:text-sm text-gray-600">
                    <DevicePhoneMobileIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 mr-3" />
                    <span>Model: {alert.deviceInfo?.model}</span>
                  </div>
                  <div className="flex items-center text-xs sm:text-sm text-gray-600">
                    <BoltIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 mr-3" />
                    <span>Battery: {alert.deviceInfo?.batteryLevel}%</span>
                  </div>
                  <div className="flex items-center text-xs sm:text-sm text-gray-600">
                    <div className="h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center mr-3">
                      <span className="text-2xs sm:text-xs font-medium text-gray-500">OS</span>
                    </div>
                    <span>Version: {alert.deviceInfo?.osVersion}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Responder Assignment Section */}
          {alert.status === 'pending' && (
            <div className="mt-4 sm:mt-6">
              <div className="bg-red-50 rounded-lg p-3 sm:p-6 border border-red-100">
                <div className="flex items-center mb-3 sm:mb-4">
                  <ExclamationTriangleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 mr-2" />
                  <h3 className="text-base sm:text-lg font-medium text-red-900">Emergency Response Required</h3>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div className="relative" ref={dropdownRef}>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Select Available Responder
                    </label>
                    <div className="relative">
                      <div
                        className="relative w-full bg-white rounded-lg border border-gray-300 shadow-sm pl-3 pr-10 py-2 cursor-text
                                 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500"
                        onClick={() => setIsOpen(true)}
                      >
                        <input
                          type="text"
                          className="w-full border-none p-0 focus:ring-0 text-xs sm:text-sm"
                          placeholder={selectedResponder ? '' : "Search and select a responder..."}
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setIsOpen(true);
                          }}
                          onFocus={() => setIsOpen(true)}
                        />
                        {selectedResponder && !searchQuery && (
                          <div className="absolute inset-0 flex items-center pointer-events-none pl-3">
                            <div className="flex items-center">
                              <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-red-100 flex items-center justify-center">
                                <UserIcon className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
                              </div>
                              <div className="ml-2">
                                <p className="text-xs sm:text-sm font-medium text-gray-900">{selectedResponder.name}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                          <button
                            type="button"
                            className="text-gray-400 hover:text-gray-500 focus:outline-none"
                            onClick={() => setIsOpen(!isOpen)}
                          >
                            <svg className={`h-5 w-5 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                      </button>
                            </div>
                          </div>
                          
                      {/* Dropdown Panel */}
                      {isOpen && (
                        <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                          <div className="max-h-48 sm:max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-50">
                            {filteredResponders.length === 0 ? (
                              <div className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-500">
                                No responders found
                              </div>
                            ) : (
                              filteredResponders.map(responder => (
                                <button
                                  key={responder.id}
                                  onClick={() => handleSelectResponder(responder.id)}
                                  className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 hover:bg-red-50 transition-colors duration-150
                                    ${selectedResponderId === responder.id ? 'bg-red-50' : ''}
                                    flex items-center justify-between`}
                                >
                                  <div className="flex items-center min-w-0">
                                    <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-red-100 flex items-center justify-center">
                                      <UserIcon className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                                    </div>
                                    <div className="ml-2 sm:ml-3 flex-1 min-w-0">
                                      <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{responder.name}</p>
                                      <div className="flex items-center space-x-2">
                                        <span className="text-2xs sm:text-xs text-gray-500">{responder.role}</span>
                                        {responder.phone && (
                                          <span className="text-2xs sm:text-xs text-gray-500 flex items-center">
                                            <PhoneIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                                            {responder.phone}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  {selectedResponderId === responder.id && (
                                    <CheckCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 flex-shrink-0" />
                                  )}
                                </button>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (selectedResponderId) {
                        handleAssignResponder(alert.id, selectedResponderId);
                      }
                    }}
                    disabled={!selectedResponderId}
                    className="w-full px-4 py-2.5 sm:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 
                             disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors
                             focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                             flex items-center justify-center space-x-2 text-xs sm:text-sm font-medium"
                  >
                    <UserIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Assign Selected Responder</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {alert.status === 'assigned' && (
            <div className="mt-4 sm:mt-6">
              <div className="bg-yellow-50 rounded-lg p-3 sm:p-6 border border-yellow-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                      <UserIcon className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-700" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-medium text-yellow-900">Assigned Responder</h4>
                      <p className="text-base sm:text-lg font-semibold text-gray-900 mt-0.5 sm:mt-1">{alert.responder?.name}</p>
                      <p className="text-xs sm:text-sm text-gray-600">{alert.responder?.role}</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:space-x-4">
                    {alert.responder?.phone && (
                      <a
                        href={`tel:${alert.responder.phone}`}
                        className="inline-flex items-center justify-center px-4 py-2 border border-yellow-300 rounded-lg
                                 text-xs sm:text-sm font-medium text-yellow-700 bg-yellow-50 hover:bg-yellow-100
                                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                      >
                        <PhoneIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                        Contact Responder
                      </a>
                    )}
                    <button
                      onClick={() => handleResolveAlert(alert.id)}
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg
                               text-xs sm:text-sm font-medium text-white bg-green-600 hover:bg-green-700
                               focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <CheckCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      Mark as Resolved
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {alert.status === 'resolved' && (
            <div className="mt-4 sm:mt-6">
              <div className="bg-green-50 rounded-lg p-3 sm:p-6 border border-green-100">
                <div>
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mr-2" />
                    <h4 className="text-base sm:text-lg font-medium text-green-900">
                      Alert Resolved
                    </h4>
                  </div>
                  <div className="mt-2 space-y-1">
                    <p className="text-xs sm:text-sm text-gray-600">
                      Resolved by: {alert.responder?.name}
                    </p>
                    {alert.resolvedAt && (
                      <p className="text-xs sm:text-sm text-gray-500">
                        Resolution Time: {formatTimestamp(alert.resolvedAt)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const filterAlerts = (status) => {
    return alerts.filter(alert => {
      if (status === 'active') {
        return alert.status === 'pending' || alert.status === 'assigned';
      }
      return alert.status === status;
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-3 sm:p-6">
        <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
          <BellIcon className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
          <h1 className="text-xl sm:text-2xl font-semibold">SOS Alerts Management</h1>
        </div>

        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1 mb-4 sm:mb-6">
            {['Active', 'Resolved', 'Cancelled', 'All'].map((category) => (
              <Tab
                key={category}
                className={({ selected }) =>
                  `w-full rounded-lg py-2 text-xs sm:text-sm font-medium leading-5
                  ${
                    selected
                      ? 'bg-white text-red-600 shadow'
                      : 'text-gray-600 hover:bg-white/[0.12] hover:text-red-600'
                  }`
                }
              >
                {category}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              {filterAlerts('active').length === 0 ? (
                <p className="text-gray-500 text-center py-8">No active alerts</p>
              ) : (
                filterAlerts('active').map(alert => (
                  <AlertCard key={alert.id} alert={alert} />
                ))
              )}
            </Tab.Panel>
            <Tab.Panel>
              {filterAlerts('resolved').length === 0 ? (
                <p className="text-gray-500 text-center py-8">No resolved alerts</p>
              ) : (
                filterAlerts('resolved').map(alert => (
                  <AlertCard key={alert.id} alert={alert} />
                ))
              )}
            </Tab.Panel>
            <Tab.Panel>
              {filterAlerts('cancelled').length === 0 ? (
                <p className="text-gray-500 text-center py-8">No cancelled alerts</p>
              ) : (
                filterAlerts('cancelled').map(alert => (
                  <AlertCard key={alert.id} alert={alert} />
                ))
              )}
            </Tab.Panel>
            <Tab.Panel>
              {alerts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No alerts found</p>
              ) : (
                alerts.map(alert => (
                  <AlertCard key={alert.id} alert={alert} />
                ))
              )}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </Layout>
  );
};

export default SOSAlertsPage; 