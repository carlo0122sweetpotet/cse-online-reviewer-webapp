import { useState, useEffect } from 'react';
import {
    Users,
    Settings,
    Shield,
    Search,
    Plus,
    Trash2,
    Eye,
    EyeOff,
    LogOut,
    Activity,
    UserCheck,
    UserX,
    Menu,
    MessageCircle,
    X,
    Bell
} from 'lucide-react';
import SendNotifications from './SendNotifications';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { collection, getDocs, getDoc, doc, deleteDoc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import GlobalChat from './GlobalChat';

const AdminDashboard = ({ user }) => {
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [showAddUser, setShowAddUser] = useState(false);
    const [newUser, setNewUser] = useState({ email: '', displayName: '', password: '', role: 'user' });
    const [addUserLoading, setAddUserLoading] = useState(false);
    const [error, setError] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [adminUserData, setAdminUserData] = useState(null);
    const [showClearDeviceModal, setShowClearDeviceModal] = useState(false);
    const [userToClearDevice, setUserToClearDevice] = useState(null);
    const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchAdminData = async () => {
            if (!user) return;

            try {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    setAdminUserData(userDoc.data());
                }
            } catch (error) {
                console.error('Error fetching admin data:', error);
            }
        };

        fetchAdminData();
    }, [user]);

    // Fetch users from Firebase
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const usersCollection = collection(db, 'users');
                const userSnapshot = await getDocs(usersCollection);
                const usersList = userSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt?.toDate() || new Date(),
                    lastLogin: doc.data().lastLogin?.toDate() || null,
                    registeredAt: doc.data().registeredAt?.toDate() || null  // Add this line
                }));
                setUsers(usersList);
            } catch (error) {
                console.error('Error fetching users:', error);
                setError('Failed to fetch users');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                // Only delete the Firestore document
                await deleteDoc(doc(db, 'users', userId));

                // Update local state to remove the deleted user
                setUsers(users.filter(user => user.id !== userId));
                console.log('User deleted successfully:', userId);
            } catch (error) {
                console.error('Error deleting user:', error);
                setError('Failed to delete user');
            }
        }
    };

    const handleToggleUserStatus = async (userId, currentStatus) => {
        try {
            await updateDoc(doc(db, 'users', userId), {
                isActive: !currentStatus,
                updatedAt: serverTimestamp()
            });
            setUsers(users.map(user =>
                user.id === userId ? { ...user, isActive: !currentStatus } : user
            ));
            console.log('User status updated successfully:', userId);
        } catch (error) {
            console.error('Error updating user status:', error);
            setError('Failed to update user status');
        }
    };

    const handleAddUser = async () => {
        if (!newUser.email || !newUser.displayName || !newUser.password) {
            setError('Please fill in all required fields');
            return;
        }

        if (newUser.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setAddUserLoading(true);
        setError('');

        try {
            // Store current user
            const currentUser = auth.currentUser;

            // Firebase Authentication account
            const userCredential = await createUserWithEmailAndPassword(auth, newUser.email, newUser.password);
            const firebaseUser = userCredential.user;

            // user document in Firestore
            const userDoc = {
                email: newUser.email,
                displayName: newUser.displayName,
                role: newUser.role,
                isActive: true,
                createdAt: serverTimestamp(),
                lastLogin: null,
                uid: firebaseUser.uid,
                // Initialize device fields as null - will be set on first login
                registeredIP: null,
                registeredDevice: null,
                registeredAt: null,
                lastLoginIP: null,
                lastLoginDevice: null
            };

            // Use the Firebase Auth UID as the document ID
            await setDoc(doc(db, 'users', firebaseUser.uid), userDoc);

            // Sign out the newly created user and sign back in the admin
            await signOut(auth);
            await auth.updateCurrentUser(currentUser);

            // Add to local state with current timestamp
            const newUserWithId = {
                id: firebaseUser.uid,
                ...userDoc,
                createdAt: new Date(),
                lastLogin: null
            };

            setUsers([...users, newUserWithId]);
            setNewUser({ email: '', displayName: '', password: '', role: 'user' });
            setShowAddUser(false);

            console.log('User created successfully:', newUserWithId);

        } catch (error) {
            console.error('Error creating user:', error);

            // Handle specific Firebase errors
            switch (error.code) {
                case 'auth/email-already-in-use':
                    setError('An account with this email already exists');
                    break;
                case 'auth/invalid-email':
                    setError('Invalid email address');
                    break;
                case 'auth/weak-password':
                    setError('Password is too weak');
                    break;
                default:
                    setError('Failed to create user: ' + error.message);
            }
        } finally {
            setAddUserLoading(false);
        }
    };

    const styles = `
  @keyframes slide-in-right {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes progress-bar {
    from {
      width: 100%;
    }
    to {
      width: 0%;
    }
  }
  
  .animate-slide-in-right {
    animation: slide-in-right 0.3s ease-out;
  }
  
  .animate-progress-bar {
    animation: progress-bar 3s linear;
  }
`;

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.displayName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        totalUsers: users.length,
        activeUsers: users.filter(u => u.isActive).length,
        inactiveUsers: users.filter(u => !u.isActive).length,
        recentLogins: users.filter(u => u.lastLogin &&
            new Date() - new Date(u.lastLogin) < 7 * 24 * 60 * 60 * 1000).length
    };

    const renderGlobalChat = () => (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Global Chat - Admin View</h2>
            <GlobalChat
                user={user}
                userData={adminUserData || {
                    displayName: user?.email?.split('@')[0] || 'Admin',
                    role: 'admin',
                    email: user?.email
                }}
                isAdminView={true}
            />
        </div>
    );

    const handleClearDeviceRegistration = async () => {
        try {
            await updateDoc(doc(db, 'users', userToClearDevice.id), {
                registeredIP: null,
                registeredDevice: null,
                registeredAt: null,
                updatedAt: serverTimestamp()
            });

            // Update local state
            setUsers(users.map(user =>
                user.id === userToClearDevice.id ? {
                    ...user,
                    registeredIP: null,
                    registeredDevice: null,
                    registeredAt: null
                } : user
            ));

            setShowClearDeviceModal(false);

            // Show success animation
            setSuccessMessage(`Device registration cleared for ${userToClearDevice.displayName}`);
            setShowSuccessAnimation(true);

            // Auto-hide after 3 seconds
            setTimeout(() => {
                setShowSuccessAnimation(false);
                setSuccessMessage('');
            }, 3000);

            setUserToClearDevice(null);
            console.log('Device registration cleared successfully:', userToClearDevice.id);
        } catch (error) {
            console.error('Error clearing device registration:', error);
            setError('Failed to clear device registration');
            setShowClearDeviceModal(false);
            setUserToClearDevice(null);
        }
    };

    const openClearDeviceModal = (user) => {
        setUserToClearDevice(user);
        setShowClearDeviceModal(true);
    };

    const renderUserManagement = () => (
        <div className="space-y-6">
            {/* Global Error Message */}
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">{error}</p>
                    <button
                        onClick={() => setError('')}
                        className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
                    >
                        Dismiss
                    </button>
                </div>
            )}

            {/* Loading State */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading users...</p>
                    </div>
                </div>
            ) : (
                <>
                    {/* Stats Cards - Improved mobile layout */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200">
                            <div className="flex items-center space-x-2">
                                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                                <span className="text-xs sm:text-sm font-medium text-blue-600">Total</span>
                            </div>
                            <p className="text-xl sm:text-2xl font-bold text-blue-800 mt-1">{stats.totalUsers}</p>
                        </div>

                        <div className="bg-green-50 p-3 sm:p-4 rounded-lg border border-green-200">
                            <div className="flex items-center space-x-2">
                                <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                                <span className="text-xs sm:text-sm font-medium text-green-600">Active</span>
                            </div>
                            <p className="text-xl sm:text-2xl font-bold text-green-800 mt-1">{stats.activeUsers}</p>
                        </div>

                        <div className="bg-red-50 p-3 sm:p-4 rounded-lg border border-red-200">
                            <div className="flex items-center space-x-2">
                                <UserX className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                                <span className="text-xs sm:text-sm font-medium text-red-600">Inactive</span>
                            </div>
                            <p className="text-xl sm:text-2xl font-bold text-red-800 mt-1">{stats.inactiveUsers}</p>
                        </div>

                        <div className="bg-purple-50 p-3 sm:p-4 rounded-lg border border-purple-200">
                            <div className="flex items-center space-x-2">
                                <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                                <span className="text-xs sm:text-sm font-medium text-purple-600">Recent</span>
                            </div>
                            <p className="text-xl sm:text-2xl font-bold text-purple-800 mt-1">{stats.recentLogins}</p>
                        </div>
                    </div>

                    {/* Controls - Improved mobile stacking */}
                    <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:gap-4 sm:items-center sm:justify-between">
                        <div className="relative flex-1 max-w-full sm:max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                        </div>

                        <button
                            onClick={() => setShowAddUser(true)}
                            className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium w-full sm:w-auto"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add User</span>
                        </button>
                    </div>

                    {/* Users Table - Mobile card view for small screens */}
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        {/* Mobile Card View - Show on screens smaller than md */}
                        <div className="block md:hidden">
                            <div className="divide-y divide-gray-200">
                                {filteredUsers.map((user) => (
                                    <div key={user.id} className="p-4 space-y-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium text-gray-900 truncate">{user.displayName}</div>
                                                <div className="text-sm text-gray-500 truncate">{user.email}</div>
                                                <div className="text-xs text-gray-400">{user.role}</div>
                                            </div>
                                            <div className="ml-2 flex-shrink-0">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.isActive
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {user.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-2 text-xs text-gray-500">
                                            <div><strong>Created:</strong> {user.createdAt.toLocaleDateString()}</div>
                                            <div>
                                                <strong>Last Login:</strong>{' '}
                                                {user.lastLogin ? (
                                                    <span>
                                                        {user.lastLogin.toLocaleDateString()}
                                                        {user.lastLoginIP && (
                                                            <span className="text-gray-400"> (IP: {user.lastLoginIP})</span>
                                                        )}
                                                    </span>
                                                ) : (
                                                    'Never'
                                                )}
                                            </div>
                                            {user.registeredIP && user.registeredDevice ? (
                                                <div>
                                                    <strong>Registered:</strong> {user.registeredDevice.browser} on {user.registeredDevice.os}, IP: {user.registeredIP}
                                                    {user.registeredAt && (
                                                        <span className="text-gray-400"> on {user.registeredAt.toLocaleDateString()}</span>
                                                    )}
                                                </div>
                                            ) : (
                                                <div><strong>Device:</strong> <span className="italic">Not registered yet</span></div>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-100">
                                            <button
                                                onClick={() => handleToggleUserStatus(user.id, user.isActive)}
                                                className="flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-md border transition-colors"
                                                title={user.isActive ? 'Deactivate user' : 'Activate user'}
                                            >
                                                {user.isActive ? (
                                                    <>
                                                        <EyeOff className="w-3 h-3" />
                                                        <span>Deactivate</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Eye className="w-3 h-3" />
                                                        <span>Activate</span>
                                                    </>
                                                )}
                                            </button>
                                            {user.registeredDevice && (
                                                <button
                                                    onClick={() => openClearDeviceModal(user)}
                                                    className="flex items-center space-x-1 px-2 py-1 text-xs font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded-md hover:bg-orange-100 transition-colors"
                                                    title="Clear device registration"
                                                >
                                                    <Shield className="w-3 h-3" />
                                                    <span>Clear Device</span>
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="flex items-center space-x-1 px-2 py-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
                                                title="Delete user"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                                <span>Delete</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Desktop Table View - Show on md screens and larger */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                                            Registered Device/IP
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                                            Created
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Last Login
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{user.displayName}</div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                    <div className="text-xs text-gray-400">{user.role}</div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-xs text-gray-500 hidden xl:table-cell">
                                                {user.registeredIP && user.registeredDevice ? (
                                                    <div className="space-y-1">
                                                        <div><strong>IP:</strong> {user.registeredIP}</div>
                                                        <div><strong>Device:</strong> {user.registeredDevice.browser} on {user.registeredDevice.os}</div>
                                                        <div><strong>Type:</strong> {user.registeredDevice.deviceType}</div>
                                                        {user.registeredAt && (
                                                            <div className="text-gray-400">
                                                                <strong>Registered:</strong> {user.registeredAt.toLocaleDateString()}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 italic">Not registered yet</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-500 hidden lg:table-cell">
                                                {user.createdAt.toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-500">
                                                {user.lastLogin ? (
                                                    <div>
                                                        <div>{user.lastLogin.toLocaleDateString()}</div>
                                                        {user.lastLoginIP && (
                                                            <div className="text-xs text-gray-400">
                                                                IP: {user.lastLoginIP}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    'Never'
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.isActive
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {user.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => handleToggleUserStatus(user.id, user.isActive)}
                                                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                                                        title={user.isActive ? 'Deactivate user' : 'Activate user'}
                                                    >
                                                        {user.isActive ?
                                                            <EyeOff className="w-4 h-4 text-gray-600" /> :
                                                            <Eye className="w-4 h-4 text-gray-600" />
                                                        }
                                                    </button>
                                                    {user.registeredDevice && (
                                                        <button
                                                            onClick={() => openClearDeviceModal(user)}
                                                            className="p-1 hover:bg-orange-100 rounded transition-colors"
                                                            title="Clear device registration"
                                                        >
                                                            <Shield className="w-4 h-4 text-orange-600" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className="p-1 hover:bg-red-100 rounded transition-colors"
                                                        title="Delete user"
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-600" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* User Modal - Improved mobile responsiveness */}
            {showAddUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold mb-4">Add New User</h3>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    disabled={addUserLoading}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                                    placeholder="user@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Display Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={newUser.displayName}
                                    onChange={(e) => setNewUser({ ...newUser, displayName: e.target.value })}
                                    disabled={addUserLoading}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    disabled={addUserLoading}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                                    placeholder="Minimum 6 characters"
                                />
                                <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <select
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                    disabled={addUserLoading}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row sm:justify-end space-y-reverse space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowAddUser(false);
                                    setError('');
                                    setNewUser({ email: '', displayName: '', password: '', role: 'user' });
                                }}
                                disabled={addUserLoading}
                                className="w-full sm:w-auto px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddUser}
                                disabled={addUserLoading}
                                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm"
                            >
                                {addUserLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Creating...</span>
                                    </>
                                ) : (
                                    <span>Add User</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Clear Device Modal */}
            {showClearDeviceModal && userToClearDevice && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                <Shield className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Clear Device Registration</h3>
                                <p className="text-sm text-gray-500">This action will reset device registration</p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <p className="text-sm text-gray-700 mb-4">
                                Are you sure you want to clear device registration for{' '}
                                <span className="font-medium">{userToClearDevice.displayName}</span>?
                            </p>

                            {userToClearDevice.registeredDevice && (
                                <div className="bg-gray-50 p-3 rounded-lg text-xs space-y-1">
                                    <div><strong>Current Device:</strong> {userToClearDevice.registeredDevice.browser} on {userToClearDevice.registeredDevice.os}</div>
                                    <div><strong>Device Type:</strong> {userToClearDevice.registeredDevice.deviceType}</div>
                                    <div><strong>IP Address:</strong> {userToClearDevice.registeredIP}</div>
                                    {userToClearDevice.registeredAt && (
                                        <div><strong>Registered:</strong> {userToClearDevice.registeredAt.toLocaleDateString()}</div>
                                    )}
                                </div>
                            )}

                            <p className="text-sm text-orange-600 mt-3">
                                The user will need to re-register their device on their next login.
                            </p>
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row sm:justify-end space-y-reverse space-y-3 sm:space-y-0 sm:space-x-3">
                            <button
                                onClick={() => {
                                    setShowClearDeviceModal(false);
                                    setUserToClearDevice(null);
                                }}
                                className="w-full sm:w-auto px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleClearDeviceRegistration}
                                className="w-full sm:w-auto px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                            >
                                Clear Device Registration
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Success Animation */}
            {showSuccessAnimation && (
                <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
                    <div className="bg-white rounded-lg shadow-lg border border-green-200 p-4 max-w-sm">
                        <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">Success!</p>
                                <p className="text-xs text-gray-500 mt-1">{successMessage}</p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowSuccessAnimation(false);
                                    setSuccessMessage('');
                                }}
                                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
                            <div className="bg-green-600 h-1 rounded-full animate-progress-bar"></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    const renderSettings = () => (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">System Settings</h2>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium mb-4">Application Configuration</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                        <div>
                            <h4 className="font-medium">User Registration</h4>
                            <p className="text-sm text-gray-500">Allow new users to register</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                        <div>
                            <h4 className="font-medium">Email Notifications</h4>
                            <p className="text-sm text-gray-500">Send system notifications via email</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <style>{styles}</style>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    {isMobileMenuOpen ? (
                                        <X className="w-6 h-6 text-gray-600" />
                                    ) : (
                                        <Menu className="w-6 h-6 text-gray-600" />
                                    )}
                                </button>
                                <div className="flex items-center space-x-2">
                                    <Shield className="w-8 h-8 text-blue-600" />
                                    <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="hidden sm:block text-sm text-gray-600">
                                    Welcome, {user?.email}
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-red-600 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setIsMobileMenuOpen(false)}>
                        <div
                            className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
                                    <button
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <X className="w-5 h-5 text-gray-600" />
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    <button
                                        onClick={() => {
                                            setActiveTab('users');
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === 'users'
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        <Users className="w-5 h-5" />
                                        <span>User Management</span>
                                    </button>

                                    <button
                                        onClick={() => {
                                            setActiveTab('globalchat');
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === 'globalchat'
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        <MessageCircle className="w-5 h-5" />
                                        <span>Global Chat</span>
                                    </button>

                                    <button
                                        onClick={() => {
                                            setActiveTab('notifications');
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === 'notifications'
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        <Bell className="w-5 h-5" />
                                        <span>Send Notifications</span>
                                    </button>

                                    <button
                                        onClick={() => {
                                            setActiveTab('settings');
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === 'settings'
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        <Settings className="w-5 h-5" />
                                        <span>Settings</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                )}

                {/* Main Content */}
                <main className="flex-1 py-4 lg:py-8">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        {activeTab === 'users' && renderUserManagement()}
                        {activeTab === 'settings' && renderSettings()}
                        {activeTab === 'globalchat' && renderGlobalChat()}
                        {activeTab === 'notifications' && <SendNotifications />}
                    </div>
                </main>
            </div>
        </>
    );
};

export default AdminDashboard;