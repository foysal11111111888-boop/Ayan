import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useGlobalState } from '../../context/GlobalStateContext';
import { User } from '../../types';

const ManageCreditsModal: React.FC<{ user: User; onClose: () => void }> = ({ user, onClose }) => {
    const { dispatch } = useGlobalState();
    const [amount, setAmount] = useState(0);

    const handleUpdateCredits = () => {
        if (amount === 0) {
            toast.error('Please enter a non-zero amount.');
            return;
        }
        dispatch({ type: 'UPDATE_USER_CREDITS', payload: { userId: user.id, credits: amount } });
        toast.success(`${Math.abs(amount)} credits ${amount > 0 ? 'added to' : 'removed from'} ${user.name}.`);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-sm">
                <h3 className="text-lg font-bold mb-4">Manage Credits for {user.name}</h3>
                <p className="mb-2 text-gray-400">Current Credits: {user.credits}</p>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(parseInt(e.target.value, 10))}
                    className="w-full bg-gray-700 text-white rounded-md py-2 px-3 mb-4"
                    placeholder="Enter amount (e.g., 100 or -50)"
                />
                <div className="flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500">Cancel</button>
                    <button onClick={handleUpdateCredits} className="px-4 py-2 rounded bg-primary-600 hover:bg-primary-700">Update</button>
                </div>
            </div>
        </div>
    );
};


const UserManagementPage: React.FC = () => {
    const { users, dispatch } = useGlobalState();
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const toggleStatus = (userId: string) => {
        dispatch({ type: 'TOGGLE_USER_STATUS', payload: { userId } });
        toast.success("User status updated.");
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-6">User Management</h1>
            <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3">Name</th>
                                <th scope="col" className="px-6 py-3">Email</th>
                                <th scope="col" className="px-6 py-3">Credits</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50">
                                    <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">{user.name}</th>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">{user.credits}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-4">
                                        <button onClick={() => setSelectedUser(user)} className="font-medium text-primary-400 hover:underline">Manage Credits</button>
                                        <button onClick={() => toggleStatus(user.id)} className="font-medium text-yellow-400 hover:underline">
                                            {user.status === 'active' ? 'Block' : 'Unblock'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {selectedUser && <ManageCreditsModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
        </div>
    );
};

export default UserManagementPage;
