import { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { getDeviceInfo, getIPAddress } from '../utils/deviceDetection';

const UserLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showInactiveModal, setShowInactiveModal] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [showDeviceMismatchModal, setShowDeviceMismatchModal] = useState(false);
    const [deviceMismatchInfo, setDeviceMismatchInfo] = useState(null);

    useEffect(() => {
        const savedEmail = localStorage.getItem('rememberedEmail');
        const isRemembered = localStorage.getItem('rememberMe') === 'true';

        if (savedEmail && isRemembered) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);

    const handleSubmit = async () => {
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Get current device info and IP
            const currentDeviceInfo = getDeviceInfo();
            const currentIP = await getIPAddress();

            // Save or remove email based on remember me checkbox
            if (rememberMe) {
                localStorage.setItem('rememberedEmail', email);
                localStorage.setItem('rememberMe', 'true');
            } else {
                localStorage.removeItem('rememberedEmail');
                localStorage.removeItem('rememberMe');
            }

            console.log('Current IP:', currentIP);
            console.log('Current Device:', currentDeviceInfo.deviceFingerprint);

            // Firebase authentication
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Check if user exists in Firestore and is active
            const userDoc = await getDoc(doc(db, 'users', user.uid));

            if (!userDoc.exists()) {
                setError('User account not found. Please contact administrator.');
                await user.delete(); // Clean up auth user
                return;
            }

            const userData = userDoc.data();

            // Check if user is active
            if (!userData.isActive) {
                await auth.signOut();
                setShowInactiveModal(true);
                return;
            }

            // Check device and IP for existing users (not first-time login)
            if (userData.registeredIP && userData.registeredDevice) {
                console.log('Registered IP:', userData.registeredIP);
                console.log('Registered Device:', userData.registeredDevice.deviceFingerprint);

                // Better IP comparison (handle null cases)
                const isIPDifferent = currentIP && userData.registeredIP &&
                    userData.registeredIP !== currentIP;

                // Better device comparison
                const isDeviceDifferent = userData.registeredDevice.deviceFingerprint !==
                    currentDeviceInfo.deviceFingerprint;

                console.log('IP Different:', isIPDifferent);
                console.log('Device Different:', isDeviceDifferent);

                if (isIPDifferent || isDeviceDifferent) {
                    console.log('BLOCKING LOGIN - Device/IP mismatch detected');

                    // Sign out the user immediately
                    await auth.signOut();

                    setDeviceMismatchInfo({
                        currentIP,
                        currentDevice: currentDeviceInfo,
                        registeredIP: userData.registeredIP,
                        registeredDevice: userData.registeredDevice
                    });
                    setShowDeviceMismatchModal(true);
                    return; // This prevents further execution
                }
            } else {
                // First time login - register the device and IP
                await updateDoc(doc(db, 'users', user.uid), {
                    registeredIP: currentIP,
                    registeredDevice: currentDeviceInfo,
                    registeredAt: serverTimestamp()
                });
            }

            // Update last login timestamp with current device info
            await updateDoc(doc(db, 'users', user.uid), {
                lastLogin: serverTimestamp(),
                lastLoginIP: currentIP,
                lastLoginDevice: currentDeviceInfo
            });

            console.log('User login successful:', user.email);
            // Navigation to user dashboard would happen here

        } catch (error) {
            console.error('Login error:', error);

            // Handle specific Firebase auth errors
            switch (error.code) {
                case 'auth/user-not-found':
                    setError('No account found with this email address');
                    break;
                case 'auth/wrong-password':
                    setError('Incorrect password');
                    break;
                case 'auth/invalid-email':
                    setError('Invalid email address');
                    break;
                case 'auth/too-many-requests':
                    setError('Too many failed attempts. Please try again later');
                    break;
                case 'auth/user-disabled':
                    setError('This account has been disabled');
                    break;
                case 'auth/invalid-credential':
                    setError('Invalid email or password');
                    break;
                default:
                    setError('Login failed. Please check your credentials and try again');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    const handleModalClose = () => {
        setShowInactiveModal(false);
        setEmail('');
        setPassword('');
        setError('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo/Header Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mb-4 shadow-lg">
                        <User className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-gray-600 text-sm md:text-base">
                        Sign in to access your account
                    </p>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
                    <div className="space-y-6">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-sm md:text-base"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    required
                                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-sm md:text-base"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-700 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                    Remember me
                                </label>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm md:text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Signing in...</span>
                                </div>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </div>

                    {/* Help Section */}
                    <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                        <p className="text-sm text-indigo-800 text-center">
                            <span className="font-medium">Need an account?</span><br />
                            Contact your administrator to get access
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-xs text-gray-500">
                        Secure user login • Protected by Firebase Authentication
                    </p>
                </div>
            </div>

            {/* Account Inactive Modal */}
            {showInactiveModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Deactivated</h3>
                            <p className="text-gray-600 mb-6">
                                Your account has been deactivated by an administrator. Please contact support for assistance.
                            </p>
                            <button
                                onClick={handleModalClose}
                                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Device Mismatch Modal */}
            {showDeviceMismatchModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                                <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Device/Location Mismatch Detected</h3>
                            <div className="text-left text-sm text-gray-600 mb-6 space-y-3">
                                <p className="text-center">
                                    This account is registered to a different device or IP address. For security reasons, access is restricted.
                                </p>

                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <h4 className="font-medium text-gray-800 mb-2">Registered Information:</h4>
                                    <p><strong>IP:</strong> {deviceMismatchInfo?.registeredIP}</p>
                                    <p><strong>Device:</strong> {deviceMismatchInfo?.registeredDevice?.deviceFingerprint}</p>
                                </div>

                                <div className="bg-red-50 p-3 rounded-lg">
                                    <h4 className="font-medium text-red-800 mb-2">Current Attempt:</h4>
                                    <p><strong>IP:</strong> {deviceMismatchInfo?.currentIP}</p>
                                    <p><strong>Device:</strong> {deviceMismatchInfo?.currentDevice?.deviceFingerprint}</p>
                                </div>

                                <p className="text-center font-medium text-gray-700">
                                    Please contact your administrator for assistance.
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowDeviceMismatchModal(false);
                                    setDeviceMismatchInfo(null);
                                    setEmail('');
                                    setPassword('');
                                    setError('');
                                }}
                                className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors font-medium"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserLogin;
