import { useState } from 'react';
import { collection, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { Send, AlertCircle, CheckCircle, Loader } from 'lucide-react';

const SendNotifications = () => {
    const [notification, setNotification] = useState({
        title: '',
        message: '',
        type: 'info', // info, warning, success, error
        targetUsers: 'all' // all, active, inactive
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleSendNotification = async (e) => {
        e.preventDefault();
        
        if (!notification.title.trim() || !notification.message.trim()) {
            setError('Please fill in both title and message');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Get all users
            const usersCollection = collection(db, 'users');
            const userSnapshot = await getDocs(usersCollection);
            
            let targetUsers = userSnapshot.docs;
            
            // Filter users based on target selection
            if (notification.targetUsers === 'active') {
                targetUsers = userSnapshot.docs.filter(doc => doc.data().isActive !== false);
            } else if (notification.targetUsers === 'inactive') {
                targetUsers = userSnapshot.docs.filter(doc => doc.data().isActive === false);
            }

            const notificationData = {
                id: Date.now().toString(),
                title: notification.title.trim(),
                message: notification.message.trim(),
                type: notification.type,
                timestamp: new Date(),
                read: false,
                createdBy: 'admin'
            };

            // Send notification to all target users
            const updatePromises = targetUsers.map(userDoc => 
                updateDoc(doc(db, 'users', userDoc.id), {
                    notifications: arrayUnion(notificationData)
                })
            );

            await Promise.all(updatePromises);

            setSuccess(`Notification sent successfully to ${targetUsers.length} users!`);
            setNotification({
                title: '',
                message: '',
                type: 'info',
                targetUsers: 'all'
            });

        } catch (error) {
            console.error('Error sending notification:', error);
            setError('Failed to send notification: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
            case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'error': return <AlertCircle className="w-5 h-5 text-red-600" />;
            default: return <AlertCircle className="w-5 h-5 text-blue-600" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-6">
                    <Send className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-semibold text-gray-800">Send Notifications</h2>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <p className="text-green-700 font-medium">{success}</p>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            <p className="text-red-700 font-medium">{error}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSendNotification} className="space-y-6">
                    {/* Notification Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Notification Type
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                                { value: 'info', label: 'Info', bgColor: 'bg-blue-50', textColor: 'text-blue-700', borderColor: 'border-blue-200' },
                                { value: 'success', label: 'Success', bgColor: 'bg-green-50', textColor: 'text-green-700', borderColor: 'border-green-200' },
                                { value: 'warning', label: 'Warning', bgColor: 'bg-yellow-50', textColor: 'text-yellow-700', borderColor: 'border-yellow-200' },
                                { value: 'error', label: 'Error', bgColor: 'bg-red-50', textColor: 'text-red-700', borderColor: 'border-red-200' }
                            ].map((type) => (
                                <label key={type.value} className="cursor-pointer">
                                    <input
                                        type="radio"
                                        name="type"
                                        value={type.value}
                                        checked={notification.type === type.value}
                                        onChange={(e) => setNotification(prev => ({ ...prev, type: e.target.value }))}
                                        className="sr-only"
                                    />
                                    <div className={`p-3 rounded-lg border-2 transition-all ${
                                        notification.type === type.value 
                                            ? `${type.bgColor} ${type.borderColor} ${type.textColor}` 
                                            : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                                    }`}>
                                        <div className="flex items-center space-x-2">
                                            {getTypeIcon(type.value)}
                                            <span className="font-medium">{type.label}</span>
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Target Users */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Send To
                        </label>
                        <select
                            value={notification.targetUsers}
                            onChange={(e) => setNotification(prev => ({ ...prev, targetUsers: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Users</option>
                            <option value="active">Active Users Only</option>
                            <option value="inactive">Inactive Users Only</option>
                        </select>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Notification Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={notification.title}
                            onChange={(e) => setNotification(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Enter notification title..."
                            maxLength={100}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={loading}
                        />
                        <p className="text-xs text-gray-500 mt-1">{notification.title.length}/100 characters</p>
                    </div>

                    {/* Message */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Message <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={notification.message}
                            onChange={(e) => setNotification(prev => ({ ...prev, message: e.target.value }))}
                            placeholder="Enter your notification message..."
                            rows={4}
                            maxLength={500}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            disabled={loading}
                        />
                        <p className="text-xs text-gray-500 mt-1">{notification.message.length}/500 characters</p>
                    </div>

                    {/* Preview */}
                    {(notification.title || notification.message) && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
                            <div className={`p-4 rounded-lg border-l-4 ${
                                notification.type === 'info' ? 'bg-blue-50 border-blue-400' :
                                notification.type === 'success' ? 'bg-green-50 border-green-400' :
                                notification.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                                'bg-red-50 border-red-400'
                            }`}>
                                <div className="flex items-start space-x-3">
                                    {getTypeIcon(notification.type)}
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900">
                                            {notification.title || 'Notification Title'}
                                        </h4>
                                        <p className="text-sm text-gray-700 mt-1">
                                            {notification.message || 'Your notification message will appear here...'}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-2">Just now</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Send Button */}
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => {
                                setNotification({
                                    title: '',
                                    message: '',
                                    type: 'info',
                                    targetUsers: 'all'
                                });
                                setError('');
                                setSuccess('');
                            }}
                            disabled={loading}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Clear
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !notification.title.trim() || !notification.message.trim()}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                            {loading ? (
                                <>
                                    <Loader className="w-4 h-4 animate-spin" />
                                    <span>Sending...</span>
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    <span>Send Notification</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SendNotifications;