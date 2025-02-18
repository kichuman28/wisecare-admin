const QuickActions = () => {
  const actions = [
    'Add New User',
    'Register New Device',
    'View Pending Alerts'
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="space-y-3">
        {actions.map((action) => (
          <button
            key={action}
            className="w-full py-2.5 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions; 