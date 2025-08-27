import { useState, useEffect, useCallback } from 'react';
import GlobalChat from './GlobalChat';
import Examinations from './Examinations';
import Leaderboards from './Leaderboards';
import {
  User,
  Settings,
  Home,
  Bell,
  LogOut,
  Calendar,
  Clock,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  MessageCircle,
  Lock,
  BookOpen,
  Award,
  Trophy
} from 'lucide-react';
import { signOut, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';

const UserDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [recentActivity, setRecentActivity] = useState([]);
  const [activityPage, setActivityPage] = useState(0);
  const [activitiesPerPage] = useState(3);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [examResults, setExamResults] = useState([]);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [sortBy, setSortBy] = useState('date'); // 'date', 'score', 'title', 'category'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const userDoc = await getDoc(doc(db, 'users', user.uid));

        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);

          // Filter duplicates from exam results
          const results = data.examResults || [];
          const uniqueResults = results.filter((result, index, self) =>
            index === self.findIndex(r => r.id === result.id)
          );

          const sortedResults = uniqueResults.sort((a, b) => {
            const timeA = a.completedAt?.toDate ? a.completedAt.toDate() : new Date(a.completedAt || 0);
            const timeB = b.completedAt?.toDate ? b.completedAt.toDate() : new Date(b.completedAt || 0);
            return timeB - timeA;
          });
          setExamResults(sortedResults);

          // Filter duplicates from recent activity
          const activities = data.recentActivity || [];
          const uniqueActivities = activities.filter((activity, index, self) =>
            index === self.findIndex(a => a.id === activity.id)
          );

          const sortedActivities = uniqueActivities
            .sort((a, b) => {
              const timeA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp || 0);
              const timeB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp || 0);
              return timeB - timeA;
            })
            .slice(0, 5);

          setRecentActivity(sortedActivities);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  useEffect(() => {
    // Ensure current page is valid when activities change
    const maxPage = Math.max(0, Math.ceil(recentActivity.length / activitiesPerPage) - 1);
    if (activityPage > maxPage) {
      setActivityPage(maxPage);
    }
  }, [recentActivity.length, activitiesPerPage, activityPage]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userNotifications = userDoc.data().notifications || [];
          const sortedNotifications = userNotifications.sort((a, b) => {
            const timeA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp || 0);
            const timeB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp || 0);
            return timeB - timeA;
          });

          setNotifications(sortedNotifications);
          setUnreadCount(sortedNotifications.filter(n => !n.read).length);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [user]);

  const totalPages = Math.ceil(recentActivity.length / activitiesPerPage);
  const paginatedActivities = recentActivity.slice(
    activityPage * activitiesPerPage,
    (activityPage + 1) * activitiesPerPage
  );

  const handleNextPage = () => {
    if (activityPage < totalPages - 1) {
      setActivityPage(activityPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (activityPage > 0) {
      setActivityPage(activityPage - 1);
    }
  };

  const sortExamResults = (results) => {
    const sorted = [...results].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'date':
          const dateA = a.completedAt?.toDate ? a.completedAt.toDate() : new Date(a.completedAt || 0);
          const dateB = b.completedAt?.toDate ? b.completedAt.toDate() : new Date(b.completedAt || 0);
          comparison = dateB - dateA;
          break;
        case 'score':
          comparison = b.score - a.score;
          break;
        case 'title':
          comparison = a.examTitle.localeCompare(b.examTitle);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          comparison = 0;
      }

      return sortOrder === 'desc' ? comparison : -comparison;
    });

    // Apply category filter
    if (filterCategory !== 'all') {
      return sorted.filter(result => result.category === filterCategory);
    }

    return sorted;
  };

  const getUniqueCategories = () => {
    const categories = [...new Set(examResults.map(result => result.category))];
    return categories.sort();
  };

  const refreshRecentActivity = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const activities = userDoc.data().recentActivity || [];
        const sortedActivities = activities.sort((a, b) => {
          const timeA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp || 0);
          const timeB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp || 0);
          return timeB - timeA;
        });
        setRecentActivity(sortedActivities);
        // Reset pagination when refreshing activities
        setActivityPage(0);
        console.log('Refreshed activities:', sortedActivities);
      }
    } catch (error) {
      console.error('Error refreshing recent activity:', error);
    }
  };

  // Replace your addToRecentActivity function with this improved version:
  const addToRecentActivity = useCallback(async (action, description) => {
    if (!user) return;

    try {
      const now = new Date();
      const activityItem = {
        action,
        description,
        timestamp: now,
        id: Date.now().toString()
      };

      await updateDoc(doc(db, 'users', user.uid), {
        recentActivity: arrayUnion(activityItem)
      });

      setRecentActivity(prev => [activityItem, ...prev.slice(0, 4)]);
      // Reset pagination to first page when new activity is added
      setActivityPage(0);
    } catch (error) {
      console.error('Error updating recent activity:', error);
    }
  }, [user]);

  useEffect(() => {
    const handleLoginActivity = async () => {
      if (!user || loading) return;

      try {
        // Add login activity and update last login
        await addToRecentActivity('login', 'Successfully logged in');
        const newLastLogin = new Date();

        await updateDoc(doc(db, 'users', user.uid), {
          lastLogin: newLastLogin
        });

        // Update the local userData state to reflect the new lastLogin
        setUserData(prev => ({
          ...prev,
          lastLogin: newLastLogin
        }));

      } catch (error) {
        console.error('Error adding login activity:', error);
      }
    };

    // Only run once when user is available and loading is done
    if (user && !loading) {
      handleLoginActivity();
    }
  }, [user, loading, addToRecentActivity]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError('');

    try {
      // Validate passwords
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error('New passwords do not match');
      }

      if (passwordData.newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      console.log('Starting password change process...'); // Debug log

      // Re-authenticate user
      const credential = EmailAuthProvider.credential(user.email, passwordData.currentPassword);
      await reauthenticateWithCredential(user, credential);
      console.log('Re-authentication successful'); // Debug log

      // Update password
      await updatePassword(user, passwordData.newPassword);
      console.log('Password updated successfully'); // Debug log

      // Add to recent activity - wait for this to complete
      await addToRecentActivity('password_change', 'Password updated successfully');
      console.log('Recent activity updated'); // Debug log

      // Reset form and close modal
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordModal(false);

      setShowSuccessModal(true);
    } catch (error) {
      console.error('Password change error:', error);
      setPasswordError(error.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      // A small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      setIsLoggingOut(false); // Reset on error
    }
  };

  const refreshDashboardData = async () => {
    if (!user) return;

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));

      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData(data);

        // Filter duplicates and update exam results
        const results = data.examResults || [];
        const uniqueResults = results.filter((result, index, self) =>
          index === self.findIndex(r => r.id === result.id)
        );

        const sortedResults = uniqueResults.sort((a, b) => {
          const timeA = a.completedAt?.toDate ? a.completedAt.toDate() : new Date(a.completedAt || 0);
          const timeB = b.completedAt?.toDate ? b.completedAt.toDate() : new Date(b.completedAt || 0);
          return timeB - timeA;
        });
        setExamResults(sortedResults);

        // Filter duplicates and update recent activity
        const activities = data.recentActivity || [];
        const uniqueActivities = activities.filter((activity, index, self) =>
          index === self.findIndex(a => a.id === activity.id)
        );

        const sortedActivities = uniqueActivities
          .sort((a, b) => {
            const timeA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp || 0);
            const timeB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp || 0);
            return timeB - timeA;
          })
          .slice(0, 5);

        setRecentActivity(sortedActivities);
      }
    } catch (error) {
      console.error('Error refreshing dashboard data:', error);
    }
  };

  const formatDate = useCallback((timestamp) => {
    if (!timestamp) return 'Never';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  const markNotificationAsRead = async (notificationId) => {
    try {
      const updatedNotifications = notifications.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      );

      await updateDoc(doc(db, 'users', user.uid), {
        notifications: updatedNotifications
      });

      setNotifications(updatedNotifications);
      setUnreadCount(updatedNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'warning': return '⚠️';
      case 'success': return '✅';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  };

  const deleteAllNotifications = async () => {
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        notifications: []
      });

      setNotifications([]);
      setUnreadCount(0);
      setShowNotifications(false); // Close dropdown after clearing
    } catch (error) {
      console.error('Error deleting all notifications:', error);
    }
  };

  const renderHome = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
        <h2 className="text-xl font-semibold mb-2">Welcome back, {userData?.displayName || 'User'}!</h2>
        <p className="opacity-90">Here's what's happening with your account today.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Member Since</span>
          </div>
          <p className="text-lg font-semibold text-gray-800 mt-1">
            {userData?.createdAt ? formatDate(userData.createdAt).split(',')[0] : 'Unknown'}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Last Login</span>
          </div>
          <p className="text-lg font-semibold text-gray-800 mt-1">
            {userData?.lastLogin ? formatDate(userData.lastLogin).split(',')[0] : 'First time'}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-yellow-600" />
            <span className="text-sm font-medium text-gray-600">Exams Taken</span>
          </div>
          <p className="text-lg font-semibold text-gray-800 mt-1">
            {examResults.length}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-medium text-gray-600">Role</span>
          </div>
          <p className="text-lg font-semibold text-gray-800 mt-1 capitalize">
            {userData?.role || 'User'}
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          {/* Temporary debug button - remove after testing */}
          <button
            onClick={refreshRecentActivity}
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            Refresh
          </button>
        </div>

        <div className="space-y-3">
          {paginatedActivities.length > 0 ? (
            paginatedActivities.map((activity, index) => (
              <div key={activity.id || index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${activity.action === 'password_change' ? 'bg-orange-500' :
                  activity.action === 'login' ? 'bg-green-500' :
                    'bg-blue-500'
                  }`}></div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{activity.description}</p>
                  <p className="text-xs text-gray-500">
                    {activity.timestamp ? formatDate(activity.timestamp) : 'Just now'}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500 text-center py-4">
              No recent activity found
            </div>
          )}

          {/* Keep the account created as static since it's a one-time event */}
          {activityPage === totalPages - 1 && (
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-800">Account created</p>
                <p className="text-xs text-gray-500">
                  {userData?.createdAt ? formatDate(userData.createdAt) : 'Unknown date'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {recentActivity.length > activitiesPerPage && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={handlePrevPage}
              disabled={activityPage === 0}
              className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <span className="text-sm text-gray-700">
              Page {activityPage + 1} of {totalPages}
            </span>

            <button
              onClick={handleNextPage}
              disabled={activityPage >= totalPages - 1}
              className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      {/* Exam Results */}
      {/* Exam Results */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Exam Results</h3>

        <div className="max-h-80 overflow-y-auto pr-2">
          <div className="space-y-3">
            {examResults.length > 0 ? (
              examResults.slice(0, 10).map((result, index) => (
                <div key={result.id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">{result.examTitle}</h4>
                        <p className="text-sm text-gray-600 capitalize">{result.category} Category</p>
                        <p className="text-xs text-gray-500">
                          {result.completedAt ? formatDate(result.completedAt) : 'Unknown date'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${result.score >= 80 ? 'text-green-600' :
                      result.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                      {result.score}%
                    </div>
                    <p className="text-xs text-gray-500">
                      {result.correctAnswers}/{result.totalQuestions}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500 text-center py-4">
                No exam results yet. Take your first exam!
              </div>
            )}
          </div>
        </div>

        {examResults.length > 10 && (
          <div className="mt-4 pt-4 border-t border-gray-200 text-center">
            <button
              onClick={() => setActiveTab('results')}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              View all results ({examResults.length})
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderResults = () => {
    const sortedAndFilteredResults = sortExamResults(examResults);
    const categories = getUniqueCategories();

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl p-6 text-white">
          <h2 className="text-xl font-semibold mb-2">Exam Results</h2>
          <p className="opacity-90">View your examination performance history</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-2 mb-2">
              <Award className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Total Exams</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{examResults.length}</p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Average Score</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {examResults.length > 0
                ? Math.round(examResults.reduce((sum, result) => sum + result.score, 0) / examResults.length)
                : 0}%
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-2 mb-2">
              <Award className="w-5 h-5 text-yellow-600" />
              <span className="text-sm font-medium text-gray-600">Best Score</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600">
              {examResults.length > 0 ? Math.max(...examResults.map(r => r.score)) : 0}%
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-2 mb-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-600">Categories</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">{categories.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          {/* Header with Controls */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h3 className="text-lg font-semibold text-gray-900">All Exam Results</h3>

              <div className="flex flex-col sm:flex-row gap-3">
                {/* Category Filter */}
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category} className="capitalize">
                      {category}
                    </option>
                  ))}
                </select>

                {/* Sort Controls */}
                <div className="flex gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="score">Sort by Score</option>
                    <option value="title">Sort by Title</option>
                    <option value="category">Sort by Category</option>
                  </select>

                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                    title={`Currently ${sortOrder === 'desc' ? 'Descending' : 'Ascending'}`}
                  >
                    {sortOrder === 'desc' ? '↓' : '↑'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            <div className="divide-y divide-gray-200">
              {sortedAndFilteredResults.map((result, index) => (
                <div key={result.id || index} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Header Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <BookOpen className="w-5 h-5 text-blue-600 flex-shrink-0" />
                          <h4 className="text-lg font-semibold text-gray-900">{result.examTitle}</h4>
                        </div>

                        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${result.score >= 80 ? 'bg-green-100 text-green-800' :
                            result.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                            {result.score >= 80 ? 'Excellent' : result.score >= 60 ? 'Good' : 'Needs Improvement'}
                          </span>

                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                            {result.category}
                          </span>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Score</p>
                          <p className={`text-lg font-bold ${result.score >= 80 ? 'text-green-600' :
                            result.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                            {result.score}%
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Correct Answers</p>
                          <p className="text-lg font-bold text-gray-800">
                            {result.correctAnswers}/{result.totalQuestions}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Time Spent</p>
                          <p className="text-lg font-bold text-gray-800">
                            {result.timeSpent ? `${Math.floor(result.timeSpent / 60)}m ${result.timeSpent % 60}s` : 'N/A'}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Difficulty</p>
                          <p className="text-lg font-bold text-gray-800 capitalize">
                            {result.difficulty || 'Standard'}
                          </p>
                        </div>
                      </div>

                      {/* Additional Details */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Completed: {result.completedAt ? formatDate(result.completedAt) : 'Unknown'}</span>
                          </span>

                          {result.attempts && (
                            <span>Attempt #{result.attempts}</span>
                          )}
                        </div>

                        {result.passed !== undefined && (
                          <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                            <span className={`inline-flex items-center space-x-1 ${result.passed ? 'text-green-600' : 'text-red-600'
                              }`}>
                              {result.passed ? <CheckCircle className="w-4 h-4" /> : <X className="w-4 h-4" />}
                              <span className="font-medium">{result.passed ? 'Passed' : 'Failed'}</span>
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Performance Bar */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="font-medium text-gray-700">Performance</span>
                          <span className="text-gray-600">{result.score}% of {result.totalQuestions} questions</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${result.score >= 80 ? 'bg-green-500' :
                              result.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                            style={{ width: `${result.score}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Topics/Tags if available */}
                      {result.topics && result.topics.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-medium text-gray-500 mb-2">Topics Covered</p>
                          <div className="flex flex-wrap gap-1">
                            {result.topics.map((topic, topicIndex) => (
                              <span
                                key={topicIndex}
                                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {sortedAndFilteredResults.length === 0 && (
                <div className="p-12 text-center">
                  <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {filterCategory !== 'all' ? `No results found for "${filterCategory}" category` : 'No exam results yet'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {filterCategory !== 'all'
                      ? 'Try selecting a different category or clear the filter'
                      : 'Take your first exam to see results here'
                    }
                  </p>
                  {filterCategory !== 'all' ? (
                    <button
                      onClick={() => setFilterCategory('all')}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Clear Filter
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveTab('examinations')}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Start an Exam
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Results Summary Footer */}
          {sortedAndFilteredResults.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>
                  Showing {sortedAndFilteredResults.length} of {examResults.length} results
                  {filterCategory !== 'all' && ` in "${filterCategory}" category`}
                </span>
                <span>
                  Average: {Math.round(sortedAndFilteredResults.reduce((sum, result) => sum + result.score, 0) / sortedAndFilteredResults.length)}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderProfile = () => (
    <div className="space-y-6">
      {/* Chess.com Style Profile Header */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {userData?.displayName || 'User'}
                  </h1>
                  <p className="text-gray-600 mt-1">{userData?.email}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-gray-500">
                      Joined {userData?.createdAt ? formatDate(userData.createdAt).split(',')[0] : 'Unknown'}
                    </span>
                    <span className="text-sm font-medium text-green-600">● Online</span>
                  </div>
                </div>

                {/* Rating Badge */}
                <div className="mt-3 sm:mt-0">
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {userData?.role || 'User'} Member
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                <div className="text-gray-900 font-medium">{userData?.displayName || 'Not set'}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="text-gray-900 font-medium">{userData?.email}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Member Type</label>
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                  {userData?.role || 'User'}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Status</label>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-green-700 font-medium">Active</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                <div className="text-gray-900 font-medium">
                  {userData?.createdAt ? formatDate(userData.createdAt) : 'Unknown'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Activity</label>
                <div className="text-gray-900 font-medium">
                  {userData?.lastLogin ? formatDate(userData.lastLogin) : 'First time'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Account Settings</h2>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium mb-4">Security</h3>
        <div className="space-y-4">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors w-full text-left"
          >
            <Lock className="w-5 h-5 text-gray-600" />
            <div>
              <h4 className="font-medium">Change Password</h4>
              <p className="text-sm text-gray-500">Update your password</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              {/* Hamburger Menu Button */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-indigo-600 transition-colors"
              >
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <div className="flex items-center space-x-2">
                <User className="w-8 h-8 text-indigo-600" />
                <h1 className="text-xl font-bold text-gray-800">Civil Service WebApp</h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-sm text-gray-600">
                Hello, {userData?.displayName || 'User'}
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-gray-600 hover:text-indigo-600 transition-colors relative"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-800">Notifications</h3>
                        {unreadCount > 0 && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {notifications.length > 0 && (
                        <button
                          onClick={deleteAllNotifications}
                          className="text-xs text-red-600 hover:text-red-800 font-medium"
                        >
                          Clear all notifications
                        </button>
                      )}
                    </div>

                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.slice(0, 10).map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''
                              }`}
                            onClick={() => {
                              setShowNotifications(false);  // <-- ADD THIS LINE
                              setSelectedNotification(notification);
                              if (!notification.read) {
                                markNotificationAsRead(notification.id);
                              }
                            }}
                          >
                            <div className="flex items-start space-x-3">
                              <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h4 className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                                    {notification.title}
                                  </h4>
                                  {!notification.read && (
                                    <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                                  )}
                                </div>
                                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-2">
                                  {notification.timestamp ? formatDate(notification.timestamp) : 'Just now'}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm">No notifications yet</p>
                        </div>
                      )}
                    </div>

                    {notifications.length > 10 && (
                      <div className="p-4 text-center border-t border-gray-200">
                        <button className="text-sm text-indigo-600 hover:text-indigo-800">
                          View all notifications
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50"
              >
                {isLoggingOut ? (
                  <>
                    <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="hidden sm:inline">Logging out...</span>
                  </>
                ) : (
                  <>
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* Sidebar */}
        <nav className={`fixed inset-y-0 left-0 z-50 lg:z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}>
          <div className="p-4 space-y-2 pt-20"> {/* Changed: Always use pt-20 for both mobile and desktop */}
            <button
              onClick={() => {
                setActiveTab('home');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === 'home'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <Home className="w-5 h-5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('profile');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === 'profile'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <User className="w-5 h-5" />
              <span>Profile</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('globalchat');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === 'globalchat'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <MessageCircle className="w-5 h-5" />
              <span>Global Chat</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('examinations');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === 'examinations'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <BookOpen className="w-5 h-5" />
              <span>Examinations</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('results');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === 'results'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <Award className="w-5 h-5" />
              <span>Exam Results</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('leaderboards');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === 'leaderboards'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <Trophy className="w-5 h-5" />
              <span>Leaderboards</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('settings');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === 'settings'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 py-4 lg:py-8 lg:ml-64">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {activeTab === 'home' && renderHome()}
            {activeTab === 'profile' && renderProfile()}
            {activeTab === 'settings' && renderSettings()}
            {activeTab === 'globalchat' && <GlobalChat user={user} userData={userData} isAdminView={false} />}
            {activeTab === 'leaderboards' && <Leaderboards user={user} />}
            {activeTab === 'examinations' && (
              <Examinations
                user={user}
                userData={userData}
                onExamCompleted={refreshDashboardData}
              />
            )}
            {activeTab === 'results' && renderResults()}
          </div>
        </main>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Change Password</h3>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordError('');
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              {passwordError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{passwordError}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  minLength="6"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  minLength="6"
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordError('');
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {passwordLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-6 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>

            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Password Updated Successfully!
            </h3>

            <p className="text-sm text-gray-500 mb-6">
              Your password has been changed successfully. You can now use your new password to log in.
            </p>

            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getNotificationIcon(selectedNotification.type)}</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedNotification.title}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${selectedNotification.type === 'info' ? 'bg-blue-100 text-blue-800' :
                      selectedNotification.type === 'success' ? 'bg-green-100 text-green-800' :
                        selectedNotification.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                      }`}>
                      {selectedNotification.type}
                    </span>
                    {!selectedNotification.read && (
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                        New
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedNotification(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Message</h4>
                <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                  {selectedNotification.message}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>From: Admin</span>
                  <span>
                    {selectedNotification.timestamp
                      ? formatDate(selectedNotification.timestamp)
                      : 'Just now'
                    }
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isLoggingOut && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 text-center max-w-sm mx-4 animate-pulse">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Signing out...</h3>
            <p className="text-gray-600">Please wait while we log you out safely.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
