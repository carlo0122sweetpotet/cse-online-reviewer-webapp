import {
    User,
    CheckCircle,
} from 'lucide-react';

const About = () => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
                <h2 className="text-xl font-semibold mb-2">About Reviewer WebApp</h2>
                <p className="opacity-90">Application information and system details</p>
            </div>

            {/* App Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 bg-indigo-600 rounded-xl flex items-center justify-center">
                        <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900">Reviewer WebApp</h3>
                        <p className="text-gray-600">Online Examination & Learning Platform</p>
                    </div>
                </div>

                {/* Version Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-600 mb-1">Version</h4>
                        <p className="text-xl font-bold text-indigo-600">1.0.0</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-600 mb-1">Release Date</h4>
                        <p className="text-lg font-semibold text-gray-900">TBA (Development Phase)</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-600 mb-1">Build</h4>
                        <p className="text-lg font-semibold text-gray-900">2025.01.30</p>
                    </div>
                </div>

                {/* Features */}
                <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-gray-800">Interactive Examinations</span>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-gray-800">Real-time Performance Tracking</span>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-gray-800">Global Chat System</span>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-gray-800">Comprehensive Leaderboards</span>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-gray-800">User Profile Management</span>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-gray-800">Secure Authentication</span>
                        </div>
                    </div>
                </div>

                {/* Technical Information */}
                <div className="border-t border-gray-200 pt-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Technical Stack</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 border border-gray-200 rounded-lg">
                            <h5 className="font-medium text-gray-800">Frontend</h5>
                            <p className="text-sm text-gray-600 mt-1">React 18</p>
                        </div>
                        <div className="text-center p-3 border border-gray-200 rounded-lg">
                            <h5 className="font-medium text-gray-800">Styling</h5>
                            <p className="text-sm text-gray-600 mt-1">Tailwind CSS</p>
                        </div>
                        <div className="text-center p-3 border border-gray-200 rounded-lg">
                            <h5 className="font-medium text-gray-800">Backend</h5>
                            <p className="text-sm text-gray-600 mt-1">Firebase</p>
                        </div>
                        <div className="text-center p-3 border border-gray-200 rounded-lg">
                            <h5 className="font-medium text-gray-800">Icons</h5>
                            <p className="text-sm text-gray-600 mt-1">Lucide React</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="font-medium text-gray-800">Authentication Service</span>
                        </div>
                        <span className="text-sm text-green-600 font-medium">Operational</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="font-medium text-gray-800">Database Connection</span>
                        </div>
                        <span className="text-sm text-green-600 font-medium">Operational</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="font-medium text-gray-800">Chat System</span>
                        </div>
                        <span className="text-sm text-green-600 font-medium">Operational</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="font-medium text-gray-800">Examination Engine</span>
                        </div>
                        <span className="text-sm text-green-600 font-medium">Operational</span>
                    </div>
                </div>
            </div>

            {/* Contact & Support */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Support & Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => alert('Documentation is currently being prepared. Please contact support for assistance.')}
                        className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors opacity-75"
                    >
                        <h4 className="font-medium text-gray-800">Documentation</h4>
                        <p className="text-sm text-gray-600 mt-1">Coming soon - User guides and API docs</p>
                    </button>
                    <button onClick={() => window.open('https://www.facebook.com/camzkiecabale.amparo', '_blank')}
                        className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <h4 className="font-medium text-gray-800">Report Issues</h4>
                        <p className="text-sm text-gray-600 mt-1">Submit bug reports or feedback</p>
                    </button>
                    <button
                        onClick={() => window.open('https://www.facebook.com/camzkiecabale.amparo', '_blank')}
                        className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <h4 className="font-medium text-gray-800">Contact Support</h4>
                        <p className="text-sm text-gray-600 mt-1">Get help from our team</p>
                    </button>
                </div>
            </div>

            {/* Copyright */}
            <div className="text-center py-6 text-sm text-gray-500">
                <p>© {new Date().getFullYear()} Reviewer WebApp. Built with React & Firebase.</p>
                <p className="mt-1">All rights reserved.</p>
            </div>
        </div>
    );
};

export default About;