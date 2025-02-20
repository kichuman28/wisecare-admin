import { useState, useEffect } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { collection, query, where, onSnapshot, orderBy, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import { AuthProvider } from './context/AuthContext';
import SOSToast from './admin_panel/components/notifications/SOSToast';
import AppRoutes from './routes';

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
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const alertData = {
            id: change.doc.id,
            ...change.doc.data()
          };
          setCurrentAlert(alertData);
          setShowToast(true);
        }
      });
    });

    return () => {
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
          <AppRoutes />
        </ToastWrapper>
      </AuthProvider>
    </Router>
  );
}

export default App;
