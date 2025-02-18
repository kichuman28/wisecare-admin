import Layout from '../components/layout/Layout';
import StatsOverview from '../components/dashboard/StatsOverview';
import RecentActivity from '../components/dashboard/RecentActivity';
import QuickActions from '../components/dashboard/QuickActions';

const Dashboard = () => {
  return (
    <Layout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
        <StatsOverview />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>
          <div>
            <QuickActions />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard; 