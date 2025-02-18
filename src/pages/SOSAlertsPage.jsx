import { useState, useEffect } from 'react';
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
  CheckCircleIcon
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
    const user = users[alert.userId] || {};

    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
        {/* Status and Timestamp Header */}
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(alert.status)}`}>
            {alert.status.toUpperCase()}
          </span>
          <span className="text-sm text-gray-500 flex items-center">
            <ClockIcon className="h-4 w-4 mr-1" />
            {formatTimestamp(alert.timestamp)}
          </span>
        </div>

        {/* Alert Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">User Information</h3>
              <div className="flex items-center space-x-4">
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || 'User'} 
                    className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <UserIcon className="h-7 w-7 text-gray-600" />
                  </div>
                )}
                <div>
                  <p className="text-gray-900 font-medium text-lg">
                    {user.displayName || 'Unknown User'}
                  </p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <p className="text-xs text-gray-400">ID: {alert.userId}</p>
                </div>
              </div>
              {user.phone && (
                <p className="text-gray-600 mt-3 flex items-center">
                  <PhoneIcon className="h-4 w-4 mr-2" />
                  {user.phone}
                </p>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Location</h3>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center mb-2">
                  <MapPinIcon className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-gray-700 font-medium">Emergency Location</span>
                </div>
                <p className="text-gray-600 text-sm">
                  Latitude: {alert.location?.latitude}<br />
                  Longitude: {alert.location?.longitude}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Device Information</h3>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <DevicePhoneMobileIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-gray-700">Model: {alert.deviceInfo?.model}</span>
                  </div>
                  <div className="flex items-center">
                    <BoltIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-gray-700">Battery: {alert.deviceInfo?.batteryLevel}%</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-5 w-5 flex items-center justify-center mr-2">
                      <span className="text-xs font-medium text-gray-500">OS</span>
                    </div>
                    <span className="text-gray-700">Version: {alert.deviceInfo?.osVersion}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Responder Assignment Section */}
        <div className="border-t pt-4">
          {alert.status === 'pending' ? (
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-red-900 mb-3">Emergency Response Required</h3>
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <label htmlFor={`responder-${alert.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Select Responder
                  </label>
                  <select
                    id={`responder-${alert.id}`}
                    value={selectedResponderId}
                    onChange={(e) => setSelectedResponderId(e.target.value)}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  >
                    <option value="">Choose a responder...</option>
                    {responders.map(responder => (
                      <option key={responder.id} value={responder.id}>
                        {responder.name} - {responder.role}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => {
                    if (selectedResponderId) {
                      handleAssignResponder(alert.id, selectedResponderId);
                    }
                  }}
                  disabled={!selectedResponderId}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 
                           disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Assign Responder
                </button>
              </div>
            </div>
          ) : alert.status === 'assigned' ? (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-900 mb-3">Assigned Responder</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <UserIcon className="h-8 w-8 text-yellow-600" />
                  <div>
                    <p className="font-medium text-gray-900">{alert.responder?.name}</p>
                    <p className="text-sm text-gray-600">{alert.responder?.role}</p>
                  </div>
                  {alert.responder?.phone && (
                    <a
                      href={`tel:${alert.responder.phone}`}
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <PhoneIcon className="h-5 w-5 mr-1" />
                      {alert.responder.phone}
                    </a>
                  )}
                </div>
                <button
                  onClick={() => handleResolveAlert(alert.id)}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg 
                           hover:bg-green-700 transition-colors"
                >
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  Mark as Resolved
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {alert.status === 'resolved' ? 'Resolved by' : 'Status'}
                  </h3>
                  <p className="text-gray-600">{alert.responder?.name || alert.status}</p>
                  {alert.resolvedAt && (
                    <p className="text-sm text-gray-500 mt-1">
                      Resolved at: {formatTimestamp(alert.resolvedAt)}
                    </p>
                  )}
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
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-6">
          <BellIcon className="h-8 w-8 text-red-600" />
          <h1 className="text-2xl font-semibold">SOS Alerts Management</h1>
        </div>

        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1 mb-6">
            {['Active', 'Resolved', 'Cancelled', 'All'].map((category) => (
              <Tab
                key={category}
                className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5
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