import {
  UserGroupIcon,
  ComputerDesktopIcon,
  BellIcon,
  BoltIcon
} from '@heroicons/react/24/outline';

const StatsCard = ({ icon: Icon, title, value, iconBg }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center space-x-4">
        <div className={`${iconBg} p-3 rounded-full`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
      </div>
    </div>
  );
};

const StatsOverview = () => {
  const stats = [
    {
      title: 'Total Users',
      value: '1,234',
      icon: UserGroupIcon,
      iconBg: 'bg-blue-100',
    },
    {
      title: 'Active Devices',
      value: '987',
      icon: ComputerDesktopIcon,
      iconBg: 'bg-blue-100',
    },
    {
      title: 'Alerts (24h)',
      value: '15',
      icon: BellIcon,
      iconBg: 'bg-blue-100',
    },
    {
      title: 'SOS Activations',
      value: '3',
      icon: BoltIcon,
      iconBg: 'bg-blue-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <StatsCard key={stat.title} {...stat} />
      ))}
    </div>
  );
};

export default StatsOverview; 