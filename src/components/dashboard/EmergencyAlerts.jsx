import { BellAlertIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const EmergencyAlerts = () => {
  const alerts = [
    {
      id: 1,
      user: 'John Doe',
      type: 'Fall Detected',
      time: '2 minutes ago',
      status: 'urgent',
      location: 'Living Room',
    },
    {
      id: 2,
      user: 'Jane Smith',
      type: 'Abnormal Heart Rate',
      time: '15 minutes ago',
      status: 'warning',
      location: 'Bedroom',
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <BellAlertIcon className="h-6 w-6 text-red-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Emergency Alerts</h2>
        </div>
        <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">
          {alerts.length} Active
        </span>
      </div>
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100"
          >
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-red-900">{alert.type}</h3>
                <p className="text-sm text-red-700 mt-1">
                  {alert.user} • {alert.location} • {alert.time}
                </p>
              </div>
            </div>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
              Respond
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmergencyAlerts; 