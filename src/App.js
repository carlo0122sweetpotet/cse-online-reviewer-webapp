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
import { getDeviceInfo, getIPAddress } from './utils/deviceDetection';

const ADMIN_UID = 'Q9OpmjSUiVTVm2eIEefiObD9K1r2';

function AppContent() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const location = useLocation();
  const isAdminRoute = location.pathname === '/admin';
  const [deviceMismatchError, setDeviceMismatchError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          // Wait for the user to be fully authenticated
          await user.getIdToken(true); // Force refresh the token

          if (user.uid === ADMIN_UID) {
            setUser(user);
            setUserRole('admin');
            setAuthError('');
            setDeviceMismatchError('');
          } else {
            // Enhanced retry logic with exponential backoff
            let retries = 5;
            let userData = null;
            let lastError = null;

            while (retries > 0 && !userData) {
              try {
                // Add timeout to getDoc
                const userDocPromise = getDoc(doc(db, 'users', user.uid));
                const timeoutPromise = new Promise((_, reject) =>
                  setTimeout(() => reject(new Error('Firestore timeout')), 10000)
                );

                const userDoc = await Promise.race([userDocPromise, timeoutPromise]);

                if (userDoc.exists()) {
                  userData = userDoc.data();
                  break;
                } else {
                  throw new Error('User document not found');
                }
              } catch (error) {
                lastError = error;
                retries--;
                console.warn(`Firestore retry ${5 - retries}/5 failed:`, error);

                if (retries === 0) {
                  // If all retries failed, check if it's a connection issue
                  if (error.code === 'unavailable' ||
                    error.code === 'deadline-exceeded' ||
                    error.message.includes('timeout') ||
                    error.message.includes('network')) {
                    throw new Error('connection-failed');
                  }
                  throw error;
                }

                // Exponential backoff: 1s, 2s, 4s, 8s
                const delay = Math.pow(2, 5 - retries) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
              }
            }

            if (userData) {
              // Check if user is active
              if (!userData.isActive) {
                await auth.signOut();
                setUser(null);
                setUserRole(null);
                setAuthError('Account is inactive. Please contact administrator.');
                setDeviceMismatchError('');
                setLoading(false);
                return;
              }

              // NEW: Check device and IP for existing users (not first-time login)
              if (userData.registeredIP && userData.registeredDevice) {
                try {
                  // Get current device info and IP
                  const currentDeviceInfo = getDeviceInfo();
                  const currentIP = await getIPAddress();

                  console.log('Current IP:', currentIP);
                  console.log('Current Device:', currentDeviceInfo.deviceFingerprint);

                  // IP comparison
                  const isIPDifferent = currentIP && userData.registeredIP &&
                    userData.registeredIP !== currentIP;

                  // Device comparison  
                  const isDeviceDifferent = userData.registeredDevice?.deviceFingerprint &&
                    currentDeviceInfo?.deviceFingerprint &&
                    userData.registeredDevice.deviceFingerprint !== currentDeviceInfo.deviceFingerprint;

                  console.log('IP Different:', isIPDifferent);
                  console.log('Device Different:', isDeviceDifferent);

                  // Block if either IP or device is different
                  if (isIPDifferent || isDeviceDifferent) {
                    console.log('Device/IP mismatch detected');
                    setDeviceMismatchError('Login detected from a different device or location. Please contact your administrator for access.');
                    setAuthError('');
                    // Sign out immediately
                    await auth.signOut();
                    setUser(null);
                    setUserRole(null);
                    setLoading(false);
                    return;
                  }
                } catch (deviceCheckError) {
                  console.error('Device check error:', deviceCheckError);
                  // Continue with normal login if device check fails
                }
              }

              setUser(user);
              setUserRole(userData.role || 'user');
              setAuthError('');
              setDeviceMismatchError('');
            } else {
              await auth.signOut();
              setUser(null);
              setUserRole(null);
              setAuthError('User account not found. Please contact administrator.');
              setDeviceMismatchError('');
              setLoading(false);
              return;
            }
          }
        } else {
          setUser(null);
          setUserRole(null);
          setAuthError('');
          // Don't clear device mismatch error when user is null - this preserves the message
        }
      } catch (error) {
        console.error('Auth error:', error);

        // Enhanced error handling
        if (error.message === 'connection-failed') {
          setAuthError('Unable to connect to the server. Please check your internet connection and try again.');
        } else if (error.code === 'permission-denied') {
          setAuthError('Access denied. Your account may not have proper permissions.');
          if (user) await auth.signOut();
        } else if (error.code === 'unauthenticated') {
          setAuthError('Authentication expired. Please sign in again.');
          if (user) await auth.signOut();
        } else if (error.code === 'unavailable') {
          setAuthError('Service temporarily unavailable. Please try again in a few moments.');
        } else if (error.code === 'deadline-exceeded') {
          setAuthError('Request timeout. Please check your connection and try again.');
        } else if (error.message.includes('network') || error.message.includes('timeout')) {
          setAuthError('Network connection issue. Please check your internet connection.');
        } else {
          setAuthError('An unexpected error occurred. Please try again.');
        }

        setUser(null);
        setUserRole(null);
        setDeviceMismatchError('');
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
      {isAdminRoute ?
        <Login /> :
        <UserLogin deviceMismatchError={deviceMismatchError} />
      }
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
