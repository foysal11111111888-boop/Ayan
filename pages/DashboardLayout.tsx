import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useGlobalState } from '../context/GlobalStateContext';
import { APP_NAME } from '../config';
import { DashboardIcon, UsersIcon, CreditCardIcon, SettingsIcon, LogoutIcon, ImageIcon, WalletIcon } from '../components/icons';

const DashboardLayout: React.FC = () => {
    const { currentUser, dispatch } = useGlobalState();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch({ type: 'LOGOUT' });
        navigate('/auth');
    };

    const userNav = [
        { name: 'Image Generator', href: '/', icon: ImageIcon },
        { name: 'Buy Credits', href: '/buy-credits', icon: WalletIcon },
    ];

    const adminNav = [
        { name: 'Dashboard', href: '/', icon: DashboardIcon },
        { name: 'User Management', href: '/user-management', icon: UsersIcon },
        { name: 'Payment Verification', href: '/payment-verification', icon: CreditCardIcon },
        { name: 'Settings', href: '/settings', icon: SettingsIcon },
    ];

    const navigation = currentUser?.role === 'admin' ? adminNav : userNav;

    return (
        <div className="h-screen flex bg-gray-900 text-gray-100">
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0 bg-gray-800 flex flex-col">
                <div className="h-16 flex items-center justify-center px-4 border-b border-gray-700">
                    <h1 className="text-2xl font-bold text-primary-400">{APP_NAME}</h1>
                </div>
                <nav className="flex-1 px-2 py-4 space-y-2">
                    {navigation.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.href}
                            end={item.href === '/'}
                            className={({ isActive }) =>
                                `flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                                isActive ? 'bg-primary-500 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`
                            }
                        >
                            <item.icon className="w-5 h-5 mr-3" />
                            {item.name}
                        </NavLink>
                    ))}
                </nav>
                <div className="px-2 py-4 border-t border-gray-700">
                     <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                    >
                        <LogoutIcon className="w-5 h-5 mr-3" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-end px-6">
                    <div className="text-right">
                        <p className="font-semibold">{currentUser?.name}</p>
                        <p className="text-xs text-primary-400">{currentUser?.role === 'user' ? `Credits: ${currentUser?.credits}` : 'Administrator'}</p>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                    {currentUser?.status === 'blocked' && (
                        <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6" role="alert">
                            <strong className="font-bold">Account Blocked! </strong>
                            <span className="block sm:inline">Your account is currently blocked. You have limited access. Please contact support.</span>
                        </div>
                    )}
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
