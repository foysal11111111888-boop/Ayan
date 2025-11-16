import React from 'react';
import toast from 'react-hot-toast';
import { useGlobalState } from '../../context/GlobalStateContext';

const PaymentVerificationPage: React.FC = () => {
    const { payments, creditPackages, dispatch } = useGlobalState();

    const pendingPayments = payments.filter(p => p.status === 'pending');

    const handleApprove = (paymentId: string, userId: string, packageId: string) => {
        const creditPackage = creditPackages.find(p => p.id === packageId);
        if (!creditPackage) {
            toast.error('Could not find the credit package.');
            return;
        }

        dispatch({ type: 'UPDATE_PAYMENT_STATUS', payload: { paymentId, status: 'approved' } });
        dispatch({ type: 'UPDATE_USER_CREDITS', payload: { userId, credits: creditPackage.credits } });
        toast.success('Payment approved and credits added!');
    };

    const handleReject = (paymentId: string) => {
        dispatch({ type: 'UPDATE_PAYMENT_STATUS', payload: { paymentId, status: 'rejected' } });
        toast.error('Payment has been rejected.');
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-6">Payment Verification</h1>
            <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3">Date</th>
                                <th scope="col" className="px-6 py-3">User Email</th>
                                <th scope="col" className="px-6 py-3">Package</th>
                                <th scope="col" className="px-6 py-3">Price</th>
                                <th scope="col" className="px-6 py-3">Transaction ID</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingPayments.length > 0 ? (
                                pendingPayments.map((payment) => (
                                    <tr key={payment.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50">
                                        <td className="px-6 py-4">{new Date(payment.createdAt).toLocaleString()}</td>
                                        <td className="px-6 py-4 font-medium text-white">{payment.userEmail}</td>
                                        <td className="px-6 py-4">{payment.packageName}</td>
                                        <td className="px-6 py-4">৳{payment.packagePrice}</td>
                                        <td className="px-6 py-4">{payment.transactionId}</td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button
                                                onClick={() => handleApprove(payment.id, payment.userId, payment.packageId)}
                                                className="font-medium text-green-400 hover:underline"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleReject(payment.id)}
                                                className="font-medium text-red-400 hover:underline"
                                            >
                                                Reject
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-gray-400">
                                        No pending payment requests.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PaymentVerificationPage;
