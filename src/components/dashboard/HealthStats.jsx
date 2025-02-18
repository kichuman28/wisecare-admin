import { LineChart, Line, ResponsiveContainer } from 'recharts';

const HealthStats = () => {
  // Sample data for the mini charts
  const data = Array(10).fill().map((_, i) => ({
    value: Math.random() * 30 + 60
  }));

  const stats = [
    {
      name: 'Heart Rate',
      value: '72',
      unit: 'BPM',
      status: 'Normal',
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      data: data
    },
    {
      name: 'Blood Pressure',
      value: '120/80',
      unit: '',
      status: 'Normal',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      data: data
    },
    {
      name: 'Oxygen Level',
      value: '98',
      unit: '%',
      status: 'Normal',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      data: data
    },
    {
      name: 'Temperature',
      value: '98.6',
      unit: '°F',
      status: 'Normal',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      data: data
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className={`${stat.bgColor} rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200`}
        >
          <h3 className="text-gray-600 text-sm font-medium">{stat.name}</h3>
          <div className="mt-2 flex items-end justify-between">
            <div>
              <p className={`text-3xl font-bold ${stat.color}`}>
                {stat.value}
                <span className="text-lg ml-1">{stat.unit}</span>
              </p>
              <p className="text-emerald-600 text-sm font-medium mt-1">{stat.status}</p>
            </div>
            <div className="h-16 w-24">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stat.data}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={stat.color.replace('text-', 'rgb(').replace('-600', ')')}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HealthStats; 