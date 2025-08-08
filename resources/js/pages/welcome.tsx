import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="AttendanceTracker - Modern Attendance Management">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 to-white p-6 text-gray-900 lg:p-8">
                <header className="mb-8 w-full">
                    <nav className="flex items-center justify-between max-w-6xl mx-auto">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">📊</span>
                            </div>
                            <span className="font-semibold text-xl text-gray-900">AttendanceTracker</span>
                        </div>
                        <div className="flex items-center gap-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="inline-flex items-center px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                >
                                    Go to Dashboard →
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="inline-flex items-center px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors duration-200"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="inline-flex items-center px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                <main className="flex-1 flex items-center justify-center">
                    <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                        {/* Hero Content */}
                        <div className="text-center lg:text-left">
                            <div className="mb-6">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                    ⚡ Modern & Efficient
                                </span>
                            </div>
                            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                                📊 Smart Attendance
                                <span className="text-blue-600"> Management</span>
                            </h1>
                            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                Streamline employee attendance tracking with QR codes, comprehensive reports, 
                                and role-based management. Perfect for organizations of all sizes.
                            </p>
                            
                            {!auth.user && (
                                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                    <Link
                                        href={route('register')}
                                        className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
                                    >
                                        Start Free Trial 🚀
                                    </Link>
                                    <Link
                                        href={route('login')}
                                        className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                                    >
                                        Sign In
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Features Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                                    <span className="text-2xl">📱</span>
                                </div>
                                <h3 className="font-semibold text-lg text-gray-900 mb-2">QR Code Clock-In</h3>
                                <p className="text-gray-600">Quick and contactless attendance tracking using secure QR codes</p>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                                    <span className="text-2xl">👥</span>
                                </div>
                                <h3 className="font-semibold text-lg text-gray-900 mb-2">User Management</h3>
                                <p className="text-gray-600">Complete user lifecycle management for Admin and Staff roles</p>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                                    <span className="text-2xl">📈</span>
                                </div>
                                <h3 className="font-semibold text-lg text-gray-900 mb-2">Smart Reports</h3>
                                <p className="text-gray-600">Comprehensive attendance analytics and detailed reporting</p>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
                                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                                    <span className="text-2xl">⚙️</span>
                                </div>
                                <h3 className="font-semibold text-lg text-gray-900 mb-2">Schedule Config</h3>
                                <p className="text-gray-600">Flexible scheduling system with customizable working hours</p>
                            </div>
                        </div>
                    </div>
                </main>

                {/* User Roles Section */}
                <section className="mt-20 max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                            🎯 Perfect for Every Role
                        </h2>
                        <p className="text-xl text-gray-600">Tailored features for administrators, staff, and employees</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-2xl border border-red-200">
                            <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mb-6">
                                <span className="text-white text-2xl font-bold">👑</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Admin</h3>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✅</span>
                                    Complete user management
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✅</span>
                                    Advanced analytics & reports
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✅</span>
                                    Schedule configuration
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✅</span>
                                    System-wide settings
                                </li>
                            </ul>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border border-blue-200">
                            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6">
                                <span className="text-white text-2xl font-bold">👨‍💼</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Staff</h3>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✅</span>
                                    Employee management
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✅</span>
                                    Attendance monitoring
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✅</span>
                                    Generate reports
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✅</span>
                                    Department oversight
                                </li>
                            </ul>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl border border-green-200">
                            <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mb-6">
                                <span className="text-white text-2xl font-bold">👤</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Employee</h3>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✅</span>
                                    QR code clock-in/out
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✅</span>
                                    Personal attendance history
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✅</span>
                                    Real-time status updates
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✅</span>
                                    Mobile-friendly interface
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                <footer className="mt-20 text-center">
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                🚀 Ready to Transform Your Attendance Management?
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Join thousands of organizations already using AttendanceTracker to streamline their workforce management.
                            </p>
                            {!auth.user && (
                                <Link
                                    href={route('register')}
                                    className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
                                >
                                    Get Started Today - Free Trial ✨
                                </Link>
                            )}
                        </div>
                        <p className="mt-8 text-sm text-gray-500">
                            Built with ❤️ using Laravel & React • 
                            <a href="https://app.build" target="_blank" className="font-medium text-blue-600 hover:underline ml-1">
                                Powered by app.build
                            </a>
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}