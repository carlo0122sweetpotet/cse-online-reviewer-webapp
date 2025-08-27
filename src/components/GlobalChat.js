import React, { useState, useEffect, useRef } from 'react';
import { Send, Users, Smile, MessageCircle, Trash2 } from 'lucide-react';
import {
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
    limit,
    writeBatch,
    getDocs
} from 'firebase/firestore';
import { getDatabase, ref, onDisconnect as rtdbOnDisconnect, set, onValue, serverTimestamp as rtdbServerTimestamp } from 'firebase/database';
import { db } from '../firebase';

const GlobalChat = ({ user, userData, isAdminView = false }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState(0);
    const messagesEndRef = useRef(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Add this useEffect after the online users useEffect in your GlobalChat.js:
    useEffect(() => {
        if (!user) return;

        let unsubscribe = null;

        const setupListener = async () => {
            try {
                // Set up real-time listener for messages
                const messagesRef = collection(db, 'globalChat');
                const q = query(messagesRef, orderBy('timestamp', 'desc'), limit(50));

                unsubscribe = onSnapshot(q,
                    (querySnapshot) => {
                        const messageList = [];
                        querySnapshot.forEach((doc) => {
                            const data = doc.data();
                            if (data.timestamp) { // Only include messages with timestamps
                                messageList.push({
                                    id: doc.id,
                                    ...data
                                });
                            }
                        });

                        // Reverse to show oldest first
                        setMessages(messageList.reverse());
                        setLoading(false);
                    },
                    (error) => {
                        console.error("Error listening to messages:", error);
                        setLoading(false);
                        // Fallback: set empty messages if there's an error
                        setMessages([]);
                    }
                );

            } catch (error) {
                console.error("Error setting up listener:", error);
                setLoading(false);
                setMessages([]);
            }
        };

        setupListener();

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [user]);

    useEffect(() => {
        if (!user) return;

        const rtdb = getDatabase();
        const userStatusRef = ref(rtdb, `onlineUsers/${user.uid}`);
        const allUsersRef = ref(rtdb, 'onlineUsers');

        // Set user as online
        const userInfo = {
            displayName: userData?.displayName || 'Anonymous',
            email: user.email,
            timestamp: rtdbServerTimestamp()
        };

        set(userStatusRef, userInfo);

        // Remove user when they disconnect
        rtdbOnDisconnect(userStatusRef).remove();

        // Listen to all online users
        const unsubscribeOnlineUsers = onValue(allUsersRef, (snapshot) => {
            const users = snapshot.val() || {};
            setOnlineUsers(Object.keys(users).length);
        });

        return () => {
            // Clean up
            unsubscribeOnlineUsers();
            set(userStatusRef, null); // Remove user immediately
        };
    }, [user, userData]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || sending || !user) return;

        setSending(true);
        try {
            const messageData = {
                text: newMessage.trim(),
                sender: {
                    uid: user.uid,
                    displayName: userData?.displayName || 'Anonymous',
                    email: user.email,
                    role: userData?.role || 'user'  // Add this line
                },
                timestamp: serverTimestamp()
            };

            await addDoc(collection(db, 'globalChat'), messageData);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please try again.');
        } finally {
            setSending(false);
        }
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
        }
    };

    const getInitials = (name) => {
        return name ? name.charAt(0).toUpperCase() : '?';
    };

    const getAvatarColor = (uid, role) => {
        // Admin users get red color
        if (role === 'admin') {
            return 'bg-red-500';
        }

        // Regular users get random colors
        const colors = [
            'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
            'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
        ];
        const index = uid ? uid.charCodeAt(0) % colors.length : 0;
        return colors[index];
    };

    const deleteAllMessages = async () => {
        setDeleteLoading(true);
        try {
            const messagesRef = collection(db, 'globalChat');
            const snapshot = await getDocs(messagesRef);

            const batch = writeBatch(db);
            snapshot.docs.forEach((doc) => {
                batch.delete(doc.ref);
            });

            await batch.commit();
            setMessages([]);
            setShowDeleteModal(false);
            console.log('All messages deleted successfully');
        } catch (error) {
            console.error('Error deleting messages:', error);
            alert('Failed to delete messages. Please try again.');
        } finally {
            setDeleteLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading chat...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <MessageCircle className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Global Chat</h2>
                            <p className="text-sm text-gray-500">Community Discussion</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Users className="w-4 h-4" />
                            <span>{onlineUsers} online</span>
                        </div>
                        {isAdminView && (
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="flex items-center space-x-2 px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                                title="Delete all messages"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span className="hidden sm:inline">Clear All</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Messages Container */}
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-8">
                        <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((message, index) => {
                        const showDate = index === 0 ||
                            formatDate(messages[index - 1]?.timestamp) !== formatDate(message.timestamp);
                        const isCurrentUser = message.sender?.uid === user.uid;

                        return (
                            <div key={message.id}>
                                {/* Date Separator */}
                                {showDate && (
                                    <div className="flex items-center justify-center my-4">
                                        <div className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                                            {formatDate(message.timestamp)}
                                        </div>
                                    </div>
                                )}

                                {/* Message */}
                                <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`flex items-start space-x-3 max-w-[85%] sm:max-w-[75%] lg:max-w-md ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                                        {/* Avatar - Only show for other users */}
                                        {!isCurrentUser && (
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0 mt-1 ${getAvatarColor(message.sender?.uid, message.sender?.role)}`}>
                                                {getInitials(message.sender?.displayName)}
                                            </div>
                                        )}

                                        {/* Message Bubble */}
                                        <div className={`rounded-lg px-4 py-2 flex-1 min-w-0 ${isCurrentUser
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-100 text-gray-900'
                                            }`}>
                                            {!isCurrentUser && (
                                                <p className={`text-xs font-medium mb-1 ${message.sender?.role === 'admin'
                                                    ? 'text-red-600'
                                                    : 'text-gray-600'
                                                    }`}>
                                                    {message.sender?.displayName || 'Anonymous'}
                                                    {message.sender?.role === 'admin' && (
                                                        <span className="ml-1 text-red-500 font-bold">⍟</span>
                                                    )}
                                                </p>
                                            )}
                                            <p className="text-sm break-words">{message.text}</p>
                                            <p className={`text-xs mt-1 ${isCurrentUser ? 'text-indigo-200' : 'text-gray-500'
                                                }`}>
                                                {formatTime(message.timestamp)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 p-4">
                <form onSubmit={sendMessage} className="flex space-x-2">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                            maxLength={500}
                            disabled={sending}
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <Smile className="w-4 h-4" />
                        </button>
                    </div>
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {sending ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                    </button>
                </form>
                <p className="text-xs text-gray-500 mt-2">
                    Press Enter to send • {newMessage.length}/500 characters
                </p>
            </div>
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                <Trash2 className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Delete All Messages</h3>
                                <p className="text-sm text-gray-500">This action cannot be undone</p>
                            </div>
                        </div>

                        <p className="text-gray-700 mb-6">
                            Are you sure you want to delete all messages from the global chat?
                            This will permanently remove all conversation history for all users.
                        </p>

                        <div className="flex space-x-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                disabled={deleteLoading}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={deleteAllMessages}
                                disabled={deleteLoading}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                            >
                                {deleteLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Deleting...</span>
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="w-4 h-4" />
                                        <span>Delete All</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GlobalChat;
