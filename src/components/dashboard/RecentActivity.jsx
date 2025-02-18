const ActivityItem = ({ type, time, description }) => {
  return (
    <div className="flex items-start space-x-4 py-4">
      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
      <div>
        <div className="flex items-center">
          <h4 className="font-medium text-gray-900">{type}</h4>
          <span className="text-sm text-gray-500 ml-2">{time}</span>
        </div>
        <p className="text-gray-600 mt-1">{description}</p>
      </div>
    </div>
  );
};

const RecentActivity = () => {
  const activities = [
    {
      type: 'New User Registration',
      time: '2 minutes ago',
      description: 'John Doe (Family Member) registered a new account.',
    },
    {
      type: 'Device Activated',
      time: '15 minutes ago',
      description: 'Fall detector activated for user Jane Smith.',
    },
    {
      type: 'Alert Triggered',
      time: '1 hour ago',
      description: 'Abnormal heart rate detected for user Robert Johnson.',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
      <div className="divide-y">
        {activities.map((activity, index) => (
          <ActivityItem key={index} {...activity} />
        ))}
      </div>
    </div>
  );
};

export default RecentActivity; 