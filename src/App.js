import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import Login from './components/Login'; // Admin login
import UserLogin from './components/UserLogin'; // User login
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import './App.css';

const ADMIN_UID = 'Q9OpmjSUiVTVm2eIEefiObD9K1r2';

function AppContent() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const isAdminRoute = location.pathname === '/admin';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (user.uid === ADMIN_UID) {
          setUser(user);
          setUserRole('admin');
        } else {
          try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
              const userData = userDoc.data();

              // Check if user is active before setting user state
              if (!userData.isActive) {
                // Sign out inactive user immediately
                await auth.signOut();
                setUser(null);
                setUserRole(null);
                setLoading(false);
                return;
              }

              setUser(user);
              setUserRole(userData.role || 'user');
            } else {
              setUser(user);
              setUserRole('user');
            }
          } catch (error) {
            console.error('Error fetching user role:', error);
            setUser(user);
            setUserRole('user');
          }
        }
      } else {
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated
  if (user) {
    if (userRole === 'admin' || user.uid === ADMIN_UID) {
      return <AdminDashboard user={user} />;
    } else {
      return <UserDashboard user={user} />;
    }
  }

  // If user is not authenticated, show appropriate login based on route
  return (
    <div className="App">
      {isAdminRoute ? <Login /> : <UserLogin />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route path="/admin" element={<AppContent />} />
      </Routes>
    </Router>
  );
}

export default App;