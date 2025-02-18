import './App.css'
import Layout from './components/layout/Layout';
import HealthStats from './components/dashboard/HealthStats';
import EmergencyAlerts from './components/dashboard/EmergencyAlerts';

function App() {
  return (
    <Layout>
      <div className="space-y-6">
        <HealthStats />
        <EmergencyAlerts />
      </div>
    </Layout>
  );
}

export default App
