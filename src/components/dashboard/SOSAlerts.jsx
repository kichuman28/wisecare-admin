import { useState, useEffect } from 'react';
import { collection, onSnapshot, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { BellAlertIcon, UserIcon, PhoneIcon } from '@heroicons/react/24/outline';

const AlertCard = ({ alert, responders, onAssign }) => {
  // Format the timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown';
    try {
      if (timestamp.toDate) {
        return timestamp.toDate().toLocaleString();
      }
      return new Date(timestamp).toLocaleString();
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return 'Invalid Date';
    }
  };

  // Format coordinates into a readable location string
  const formatLocation = (location) => {
    if (!location) return 'Unknown';
    return `Lat: ${location.latitude}, Long: ${location.longitude}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-4 border-l-4 border-red-500">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <BellAlertIcon className="h-5 w-5 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              SOS Alert from User {alert.userId}
            </h3>
            <span className={`px-2 py-1 rounded-full text-sm font-medium ${
              alert.status === 'pending' ? 'bg-red-100 text-red-600' : 
              alert.status === 'assigned' ? 'bg-yellow-100 text-yellow-600' : 
              'bg-gray-100 text-gray-600'
            }`}>
              {alert.status}
            </span>
          </div>

          <div className="mt-2 text-sm text-gray-600 space-y-2">
            <p>Location: {formatLocation(alert.location)}</p>
            <p>Time: {formatTimestamp(alert.timestamp)}</p>
            
            {/* Device Information */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-1">Device Info:</h4>
              <p>Model: {alert.deviceInfo?.model}</p>
              <p>Battery: {alert.deviceInfo?.batteryLevel}%</p>
              <p>OS Version: {alert.deviceInfo?.osVersion}</p>
            </div>

            {/* Priority Level */}
            {alert.priority && (
              <p>
                Priority: <span className={`font-medium ${
                  alert.priority === 'high' ? 'text-red-600' : 'text-yellow-600'
                }`}>{alert.priority}</span>
              </p>
            )}
          </div>
        </div>
        
        <div className="ml-4">
          {!alert.assignedTo ? (
            <div className="w-64">
              <select 
                onChange={(e) => onAssign(alert.id, e.target.value)}
                defaultValue=""
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="" disabled>Assign Responder</option>
                {responders.map(responder => (
                  <option key={responder.id} value={responder.id}>
                    {responder.name} - {responder.role}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg w-64">
              <div className="flex items-center space-x-2 mb-2">
                <UserIcon className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="font-medium">{alert.responder?.name}</p>
                  <p className="text-sm text-gray-500">{alert.responder?.role}</p>
                </div>
              </div>
              {alert.responder?.phone && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <PhoneIcon className="h-4 w-4" />
                  <p>{alert.responder.phone}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SOSAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [responders, setResponders] = useState([]);

  useEffect(() => {
    console.log('Setting up Firestore listeners...');
    
    // Listen to SOS alerts
    const unsubscribeAlerts = onSnapshot(
      collection(db, 'sos_alerts'),
      (snapshot) => {
        console.log('Received alerts update:', snapshot.docs.length, 'documents');
        const alertsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        // Filter out resolved alerts
        setAlerts(alertsData.filter(alert => alert.status !== 'resolved'));
      },
      (error) => {
        console.error('Alerts listener error:', error);
      }
    );

    // Listen to responders
    const unsubscribeResponders = onSnapshot(
      collection(db, 'responders'),
      (snapshot) => {
        console.log('Received responders update:', snapshot.docs.length, 'documents');
        const respondersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setResponders(respondersData);
      },
      (error) => {
        console.error('Responders listener error:', error);
      }
    );

    return () => {
      console.log('Cleaning up Firestore listeners...');
      unsubscribeAlerts();
      unsubscribeResponders();
    };
  }, []);

  const assignResponder = async (alertId, responderId) => {
    const responder = responders.find(r => r.id === responderId);
    if (!responder) {
      console.error('Responder not found:', responderId);
      return;
    }

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
      console.log('Successfully assigned responder:', responder.name);
    } catch (error) {
      console.error('Error assigning responder:', error);
    }
  };

  // Filter alerts by status
  const pendingAlerts = alerts.filter(alert => alert.status === 'pending');
  const assignedAlerts = alerts.filter(alert => alert.status === 'assigned');

  return (
    <div className="space-y-6">
      {/* Pending Alerts Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Active SOS Alerts</h2>
          {pendingAlerts.length > 0 && (
            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
              {pendingAlerts.length} Pending
            </span>
          )}
        </div>
        {pendingAlerts.length === 0 ? (
          <p className="text-gray-500">No pending alerts</p>
        ) : (
          pendingAlerts.map(alert => (
            <AlertCard
              key={alert.id}
              alert={alert}
              responders={responders}
              onAssign={assignResponder}
            />
          ))
        )}
      </div>

      {/* Assigned Alerts Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">In Progress</h2>
        {assignedAlerts.length === 0 ? (
          <p className="text-gray-500">No alerts in progress</p>
        ) : (
          assignedAlerts.map(alert => (
            <AlertCard
              key={alert.id}
              alert={alert}
              responders={responders}
              onAssign={assignResponder}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default SOSAlerts; 