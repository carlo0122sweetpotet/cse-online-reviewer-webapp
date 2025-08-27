import { useState, useEffect } from 'react';
import { Trophy, User } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const Leaderboards = ({ user }) => {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [leaderboardLoading, setLeaderboardLoading] = useState(false);
    const [error, setError] = useState(null);

    const formatDate = (timestamp) => {
        if (!timestamp) return 'Never';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const fetchLeaderboardData = async () => {
        setLeaderboardLoading(true);
        setError(null);

        try {
            // Check if user is authenticated first
            if (!user?.uid) {
                throw new Error('User not authenticated');
            }

            console.log('Fetching leaderboard data from users collection...');
            const usersRef = collection(db, 'users');
            const usersSnapshot = await getDocs(usersRef);

            console.log('Users snapshot size:', usersSnapshot.size);

            const allUsers = [];
            usersSnapshot.forEach((doc) => {
                const userData = doc.data();
                const examResults = userData.examResults || [];

                // Only include users who have taken at least one exam
                if (examResults.length > 0) {
                    // Calculate statistics from exam results
                    const totalExams = examResults.length;
                    const totalScore = examResults.reduce((sum, result) => sum + (result.score || 0), 0);
                    const averageScore = Math.round(totalScore / totalExams);
                    const bestScore = Math.max(...examResults.map(result => result.score || 0));

                    // Find most recent exam date
                    const lastExamDate = examResults.reduce((latest, result) => {
                        const resultDate = result.completedAt?.toDate ? result.completedAt.toDate() : new Date(result.completedAt || 0);
                        const latestDate = latest?.toDate ? latest.toDate() : new Date(latest || 0);
                        return resultDate > latestDate ? result.completedAt : latest;
                    }, null);

                    allUsers.push({
                        id: doc.id,
                        displayName: userData.displayName || 'Unknown User',
                        averageScore: averageScore,
                        bestScore: bestScore,
                        totalExams: totalExams,
                        lastExamDate: lastExamDate
                    });
                }
            });

            // Sort by average score (descending), then by best score, then by total exams
            allUsers.sort((a, b) => {
                if (b.averageScore !== a.averageScore) return b.averageScore - a.averageScore;
                if (b.bestScore !== a.bestScore) return b.bestScore - a.bestScore;
                return b.totalExams - a.totalExams;
            });

            console.log('Final leaderboard data:', allUsers);
            setLeaderboardData(allUsers);
        } catch (error) {
            console.error('Error fetching leaderboard data:', error);
            setError(error.message);
        } finally {
            setLeaderboardLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLeaderboardLoading(true);
            setError(null);

            try {
                // Check if user is authenticated first
                if (!user?.uid) {
                    throw new Error('User not authenticated');
                }

                console.log('Fetching leaderboard data from users collection...');
                const usersRef = collection(db, 'users');
                const usersSnapshot = await getDocs(usersRef);

                console.log('Users snapshot size:', usersSnapshot.size);

                const allUsers = [];
                usersSnapshot.forEach((doc) => {
                    const userData = doc.data();
                    const examResults = userData.examResults || [];

                    // Only include users who have taken at least one exam
                    if (examResults.length > 0) {
                        // Calculate statistics from exam results
                        const totalExams = examResults.length;
                        const totalScore = examResults.reduce((sum, result) => sum + (result.score || 0), 0);
                        const averageScore = Math.round(totalScore / totalExams);
                        const bestScore = Math.max(...examResults.map(result => result.score || 0));

                        // Find most recent exam date
                        const lastExamDate = examResults.reduce((latest, result) => {
                            const resultDate = result.completedAt?.toDate ? result.completedAt.toDate() : new Date(result.completedAt || 0);
                            const latestDate = latest?.toDate ? latest.toDate() : new Date(latest || 0);
                            return resultDate > latestDate ? result.completedAt : latest;
                        }, null);

                        allUsers.push({
                            id: doc.id,
                            displayName: userData.displayName || 'Unknown User',
                            averageScore: averageScore,
                            bestScore: bestScore,
                            totalExams: totalExams,
                            lastExamDate: lastExamDate
                        });
                    }
                });

                // Sort by average score (descending), then by best score, then by total exams
                allUsers.sort((a, b) => {
                    if (b.averageScore !== a.averageScore) return b.averageScore - a.averageScore;
                    if (b.bestScore !== a.bestScore) return b.bestScore - a.bestScore;
                    return b.totalExams - a.totalExams;
                });

                console.log('Final leaderboard data:', allUsers);
                setLeaderboardData(allUsers);
            } catch (error) {
                console.error('Error fetching leaderboard data:', error);
                setError(error.message);
            } finally {
                setLeaderboardLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const currentUserRank = leaderboardData.findIndex(userData => userData.id === user?.uid) + 1;
    const currentUserData = leaderboardData.find(userData => userData.id === user?.uid);

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-yellow-500 to-amber-600 rounded-xl p-6 text-white">
                <div className="flex items-center space-x-3">
                    <Trophy className="w-8 h-8" />
                    <div>
                        <h2 className="text-xl font-semibold mb-2">Leaderboards</h2>
                        <p className="opacity-90">See how you rank against other users</p>
                    </div>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="font-semibold text-red-800">Error</h3>
                    <p className="text-red-700 mt-2">{error}</p>
                    <button
                        onClick={fetchLeaderboardData}
                        className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Your Rank Card */}
            {currentUserData && (
                <div className="bg-white rounded-lg border-2 border-indigo-200 p-4 sm:p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Current Ranking</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="text-center">
                                    <div className="text-2xl sm:text-3xl font-bold text-indigo-600">#{currentUserRank}</div>
                                    <div className="text-xs sm:text-sm text-gray-600">Rank</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl sm:text-3xl font-bold text-green-600">{currentUserData.averageScore}%</div>
                                    <div className="text-xs sm:text-sm text-gray-600">Avg Score</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl sm:text-3xl font-bold text-yellow-600">{currentUserData.bestScore}%</div>
                                    <div className="text-xs sm:text-sm text-gray-600">Best Score</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl sm:text-3xl font-bold text-purple-600">{currentUserData.totalExams}</div>
                                    <div className="text-xs sm:text-sm text-gray-600">Total Exams</div>
                                </div>
                            </div>
                        </div>
                        <div className="text-center sm:text-right mt-4 sm:mt-0">
                            <Trophy className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto sm:mx-0 ${currentUserRank === 1 ? 'text-yellow-500' :
                                currentUserRank === 2 ? 'text-gray-400' :
                                    currentUserRank === 3 ? 'text-amber-600' :
                                        'text-gray-300'
                                }`} />
                        </div>
                    </div>
                </div>
            )}

            {/* Leaderboard Table */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Global Rankings</h3>
                        <button
                            onClick={fetchLeaderboardData}
                            disabled={leaderboardLoading}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 text-sm"
                        >
                            {leaderboardLoading ? 'Refreshing...' : 'Refresh'}
                        </button>
                    </div>
                </div>

                {leaderboardLoading ? (
                    <div className="p-12 text-center">
                        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading leaderboard data...</p>
                    </div>
                ) : leaderboardData.length > 0 ? (
                    <div className="block sm:hidden">
                        {/* Mobile Card View */}
                        <div className="space-y-4 p-4">
                            {leaderboardData.map((userEntry, index) => (
                                <div
                                    key={userEntry.id}
                                    className={`p-4 rounded-lg border ${userEntry.id === user?.uid ? 'bg-indigo-50 border-indigo-300' : 'bg-white border-gray-200'} shadow-sm`}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-3">
                                            {index < 3 ? (
                                                <Trophy className={`w-6 h-6 ${index === 0 ? 'text-yellow-500' :
                                                    index === 1 ? 'text-gray-400' :
                                                        'text-amber-600'
                                                    }`} />
                                            ) : (
                                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                                    <span className="text-sm font-bold text-gray-600">#{index + 1}</span>
                                                </div>
                                            )}
                                            <div>
                                                <div className={`font-medium ${userEntry.id === user?.uid ? 'text-indigo-900' : 'text-gray-900'}`}>
                                                    {userEntry.displayName}
                                                    {userEntry.id === user?.uid && <span className="ml-1 text-indigo-600 font-bold text-sm">(You)</span>}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {userEntry.lastExamDate ? formatDate(userEntry.lastExamDate) : 'N/A'}
                                                </div>
                                            </div>
                                        </div>
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${userEntry.averageScore >= 90 ? 'bg-green-100 text-green-800' :
                                            userEntry.averageScore >= 80 ? 'bg-blue-100 text-blue-800' :
                                                userEntry.averageScore >= 70 ? 'bg-yellow-100 text-yellow-800' :
                                                    userEntry.averageScore >= 60 ? 'bg-orange-100 text-orange-800' :
                                                        'bg-red-100 text-red-800'
                                            }`}>
                                            {userEntry.averageScore}%
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div>
                                            <div className="text-lg font-bold text-green-600">{userEntry.bestScore}%</div>
                                            <div className="text-xs text-gray-500">Best</div>
                                        </div>
                                        <div>
                                            <div className="text-lg font-bold text-gray-800">{userEntry.totalExams}</div>
                                            <div className="text-xs text-gray-500">Exams</div>
                                        </div>
                                        <div>
                                            <div className="text-lg font-bold text-indigo-600">#{index + 1}</div>
                                            <div className="text-xs text-gray-500">Rank</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : null}
            </div>

            {/* Desktop Table View - hide on mobile */}
            {!leaderboardLoading && leaderboardData.length > 0 && (
                <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Average Score</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Best Score</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total Exams</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Last Activity</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {leaderboardData.map((userEntry, index) => (
                                <tr
                                    key={userEntry.id}
                                    className={`hover:bg-gray-50 ${userEntry.id === user?.uid ? 'bg-indigo-50 border-l-4 border-indigo-500' : ''}`}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {index < 3 ? (
                                                <Trophy className={`w-6 h-6 mr-2 ${index === 0 ? 'text-yellow-500' :
                                                    index === 1 ? 'text-gray-400' :
                                                        'text-amber-600'
                                                    }`} />
                                            ) : (
                                                <div className="w-6 h-6 mr-2 flex items-center justify-center">
                                                    <span className="text-lg font-bold text-gray-600">#{index + 1}</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                                                <User className="w-5 h-5 text-gray-600" />
                                            </div>
                                            <div>
                                                <div className={`font-medium ${userEntry.id === user?.uid ? 'text-indigo-900' : 'text-gray-900'}`}>
                                                    {userEntry.displayName}
                                                    {userEntry.id === user?.uid && <span className="ml-2 text-indigo-600 font-bold">(You)</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className={`inline-flex px-2 py-1 text-sm font-semibold rounded-full ${userEntry.averageScore >= 90 ? 'bg-green-100 text-green-800' :
                                            userEntry.averageScore >= 80 ? 'bg-blue-100 text-blue-800' :
                                                userEntry.averageScore >= 70 ? 'bg-yellow-100 text-yellow-800' :
                                                    userEntry.averageScore >= 60 ? 'bg-orange-100 text-orange-800' :
                                                        'bg-red-100 text-red-800'
                                            }`}>
                                            {userEntry.averageScore}%
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className={`text-lg font-bold ${userEntry.bestScore >= 90 ? 'text-green-600' :
                                            userEntry.bestScore >= 80 ? 'text-blue-600' :
                                                userEntry.bestScore >= 70 ? 'text-yellow-600' :
                                                    'text-gray-600'
                                            }`}>
                                            {userEntry.bestScore}%
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className="text-sm font-medium text-gray-900">{userEntry.totalExams}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                        {userEntry.lastExamDate ? formatDate(userEntry.lastExamDate) : 'N/A'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Leaderboards;
