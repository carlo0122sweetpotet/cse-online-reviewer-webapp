import { useCallback } from 'react';
import { Download } from 'lucide-react';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';

const Downloadables = ({ user, userData }) => {
    // Downloadable files from src/downloads folder
    const downloadableFiles = [
        {
            id: 1,
            name: "CSE Complete Reviewer",
            description: "Civil Service Reviewer",
            fileSize: "1,3 MB",
            category: "Reviewer",
            downloadUrl: "/downloads/CSE-Complete-Reviewer.pdf",
            uploadDate: new Date(),
            fileType: "PDF"
        },
        {
            id: 2,
            name: "Civil-Service-Mock-Exam-2024",
            description: "CSE Mock Exam",
            fileSize: "1,2 MB",
            category: "Reviewer",
            downloadUrl: "/downloads/Civil-Service-Mock-Exam-2024.pdf",
            uploadDate: new Date(),
            fileType: "PDF"
        }
        // Add more files here as you add them to src/downloads folder
    ];

    const addToRecentActivity = useCallback(async (action, description) => {
        if (!user) return;

        try {
            await user.getIdToken(true);
            await new Promise(resolve => setTimeout(resolve, 200));

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
        } catch (error) {
            console.error('Error updating recent activity:', error);
        }
    }, [user]);

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleDownload = async (file) => {
        try {
            // Add to recent activity
            await addToRecentActivity('download', `Downloaded ${file.name}`);

            // Create download link and trigger download
            const link = document.createElement('a');
            link.href = file.downloadUrl;
            link.download = file.name;
            link.target = '_blank'; // Open in new tab as fallback
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading file:', error);
            // Fallback: open file in new tab
            window.open(file.downloadUrl, '_blank');
        }
    };

    const getFileIcon = (fileType) => {
        switch (fileType.toUpperCase()) {
            case 'PDF':
                return '📄';
            case 'DOCX':
            case 'DOC':
                return '📝';
            case 'XLSX':
            case 'XLS':
                return '📊';
            case 'PPTX':
            case 'PPT':
                return '📈';
            default:
                return '📎';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-4 sm:p-6 text-white">
                <h2 className="text-lg sm:text-xl font-semibold mb-2">Downloadable Resources</h2>
                <p className="text-sm sm:text-base opacity-90">Access study materials, guides, and templates to enhance your learning</p>
            </div>

            {/* Files List */}
            <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-4 sm:p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Available Downloads
                    </h3>
                </div>

                <div className="divide-y divide-gray-200">
                    {downloadableFiles.map((file) => (
                        <div key={file.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                                <div className="flex-1">
                                    <div className="flex items-start space-x-3 sm:space-x-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center text-lg sm:text-xl">
                                                {getFileIcon(file.fileType)}
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2">
                                                <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-0">
                                                    {file.name}
                                                </h4>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 w-fit">
                                                    {file.category}
                                                </span>
                                            </div>

                                            <p className="text-gray-600 text-sm mb-3">{file.description}</p>

                                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                                                <span className="flex items-center space-x-1">
                                                    <span>📁</span>
                                                    <span>{file.fileType}</span>
                                                </span>
                                                <span>Size: {file.fileSize}</span>
                                                <span className="hidden sm:inline">📅 Added {formatDate(file.uploadDate)}</span>
                                            </div>

                                            {/* Mobile-only additional info */}
                                            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mt-2 sm:hidden">
                                                <span>📅 {formatDate(file.uploadDate)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-shrink-0 sm:ml-4">
                                    <button
                                        onClick={() => handleDownload(file)}
                                        className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                    >
                                        <Download className="w-4 h-4" />
                                        <span>Download</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {downloadableFiles.length === 0 && (
                        <div className="p-8 sm:p-12 text-center">
                            <Download className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No files available
                            </h3>
                            <p className="text-gray-600">
                                Check back later for downloadable resources
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Downloadables;