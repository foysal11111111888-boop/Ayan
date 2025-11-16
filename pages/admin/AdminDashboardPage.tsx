import React from 'react';
import { useGlobalState } from '../../context/GlobalStateContext';
import { UsersIcon, CreditCardIcon, WalletIcon } from '../../components/icons';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ElementType }> = ({ title, value, icon: Icon }) => (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex items-center space-x-4">
        <div className="bg-primary-500/20 p-3 rounded-full">
            <Icon className="w-8 h-8 text-primary-400" />
        </div>
        <div>
            <p className="text-gray-400 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const AdminDashboardPage: React.FC = () => {
    const { users, payments } = useGlobalState();

    const totalUsers = users.length;
    const pendingApprovals = payments.filter(p => p.status === 'pending').length;
    const sessionRevenue = payments
        .filter(p => p.status === 'approved')
        .reduce((sum, p) => sum + p.packagePrice, 0);

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-6">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Session Users" value={totalUsers} icon={UsersIcon} />
                <StatCard title="Pending Approvals" value={pendingApprovals} icon={CreditCardIcon} />
                <StatCard title="Session Revenue" value={`৳${sessionRevenue.toLocaleString()}`} icon={WalletIcon} />
            </div>

            <div className="mt-10 bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold text-white mb-4">Quick Overview</h2>
                <p className="text-gray-400">
                    Welcome to the admin command center. From here, you can manage users, verify payments, and configure application settings.
                    Use the navigation on the left to access different sections.
                </p>
                <ul className="list-disc list-inside mt-4 text-gray-300 space-y-2">
                    <li><strong className="text-primary-400">User Management:</strong> Add or remove credits and block or unblock users.</li>
                    <li><strong className="text-primary-400">Payment Verification:</strong> Approve or reject credit purchase requests submitted by users.</li>
                    <li><strong className="text-primary-400">Settings:</strong> Update payment information and manage credit packages.</li>
                </ul>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
