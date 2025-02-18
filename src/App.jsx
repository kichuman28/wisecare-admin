import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { collection, query, where, onSnapshot, orderBy, Timestamp } from 'firebase/firestore';
import { db } from './config/firebase';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SOSAlertsPage from './pages/SOSAlertsPage';
import SOSToast from './components/notifications/SOSToast';
import UsersPage from './pages/UsersPage';
import DevicesPage from './pages/DevicesPage';
import ContentPage from './pages/ContentPage';
import ServicesPage from './pages/ServicesPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';

// Wrapper component to handle location-aware toast display
const ToastWrapper = ({ children }) => {
  const [showToast, setShowToast] = useState(false);
  const [currentAlert, setCurrentAlert] = useState(null);
  const [users, setUsers] = useState({});
  const location = useLocation();

  useEffect(() => {
    // Listen for users
    const unsubscribeUsers = onSnapshot(
      collection(db, 'users'),
      (snapshot) => {
        const usersData = {};
        snapshot.docs.forEach(doc => {
          usersData[doc.id] = doc.data();
        });
        setUsers(usersData);
      }
    );

    // Listen for new SOS alerts
    const oneMinuteAgo = new Date();
    oneMinuteAgo.setMinutes(oneMinuteAgo.getMinutes() - 1);

    const q = query(
      collection(db, 'sos_alerts'),
      where('status', '==', 'pending'),
      where('timestamp', '>=', Timestamp.fromDate(oneMinuteAgo)),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log('Received snapshot with', snapshot.docs.length, 'documents');
      
      snapshot.docChanges().forEach((change) => {
        console.log('Document change type:', change.type);
        
        if (change.type === 'added') {
          const alertData = {
            id: change.doc.id,
            ...change.doc.data()
          };
          console.log('New alert received:', alertData);
          
          // Show toast for all new pending alerts
          setCurrentAlert(alertData);
          setShowToast(true);
        }
      });
    }, 
    (error) => {
      console.error('Error in Firestore listener:', error);
    });

    return () => {
      console.log('Cleaning up Firestore listeners');
      unsubscribe();
      unsubscribeUsers();
    };
  }, []);

  // Reset toast when navigating to SOS Alerts page
  useEffect(() => {
    if (location.pathname === '/sos-alerts') {
      setShowToast(false);
    }
  }, [location.pathname]);

  return (
    <>
      {children}
      <SOSToast
        show={showToast}
        onClose={() => setShowToast(false)}
        alert={currentAlert}
        user={currentAlert ? users[currentAlert.userId] : null}
      />
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastWrapper>
          <Routes>
            {/* Public route */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/sos-alerts"
              element={
                <ProtectedRoute>
                  <SOSAlertsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <UsersPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/devices"
              element={
                <ProtectedRoute>
                  <DevicesPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/content"
              element={
                <ProtectedRoute>
                  <ContentPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/services"
              element={
                <ProtectedRoute>
                  <ServicesPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <ReportsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            
            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Catch all other routes and redirect to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </ToastWrapper>
      </AuthProvider>
    </Router>
  );
}

export default App;
