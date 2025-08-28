import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import Login from './components/Login';
import UserLogin from './components/UserLogin';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import './App.css';

const ADMIN_UID = 'Q9OpmjSUiVTVm2eIEefiObD9K1r2';

function AppContent() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const location = useLocation();
  const isAdminRoute = location.pathname === '/admin';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          // Wait for the user to be fully authenticated
          await user.getIdToken();
          
          if (user.uid === ADMIN_UID) {
            setUser(user);
            setUserRole('admin');
            setAuthError('');
          } else {
            // Add retry logic for Firestore connection
            let retries = 3;
            let userData = null;
            
            while (retries > 0 && !userData) {
              try {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                
                if (userDoc.exists()) {
                  userData = userDoc.data();
                  break;
                } else {
                  throw new Error('User document not found');
                }
              } catch (error) {
                retries--;
                if (retries === 0) throw error;
                
                // Wait before retry
                await new Promise(resolve => setTimeout(resolve, 1000));
              }
            }

            if (userData) {
              // Check if user is active
              if (!userData.isActive) {
                await auth.signOut();
                setUser(null);
                setUserRole(null);
                setAuthError('Account is inactive. Please contact administrator.');
                setLoading(false);
                return;
              }

              setUser(user);
              setUserRole(userData.role || 'user');
              setAuthError('');
            } else {
              await auth.signOut();
              setUser(null);
              setUserRole(null);
              setAuthError('User account not found. Please contact administrator.');
              setLoading(false);
              return;
            }
          }
        } else {
          setUser(null);
          setUserRole(null);
          setAuthError('');
        }
      } catch (error) {
        console.error('Auth error:', error);
        
        if (error.code === 'permission-denied' || error.code === 'unauthenticated') {
          setAuthError('Authentication failed. Please try again.');
          if (user) await auth.signOut();
          setUser(null);
          setUserRole(null);
        } else if (error.code === 'unavailable' || error.message.includes('network')) {
          setAuthError('Network connection issue. Please check your internet connection.');
        } else {
          setAuthError('An error occurred. Please try again.');
        }
      } finally {
        setLoading(false);
      }
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

  // Show auth error if exists
  if (authError && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Error</h2>
          <p className="text-gray-600 mb-4">{authError}</p>
          <button
            onClick={() => {
              setAuthError('');
              window.location.reload();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
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
