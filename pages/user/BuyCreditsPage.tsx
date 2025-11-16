import React, { useState, FormEvent } from 'react';
import toast from 'react-hot-toast';
import { useGlobalState } from '../../context/GlobalStateContext';
import { CreditPackage, PaymentRequest } from '../../types';

const PaymentModal: React.FC<{
    pkg: CreditPackage;
    onClose: () => void;
}> = ({ pkg, onClose }) => {
    const { currentUser, settings, dispatch } = useGlobalState();
    const [trxId, setTrxId] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!trxId.trim()) {
            toast.error('Transaction ID is required.');
            return;
        }

        if (!currentUser) {
            toast.error('You must be logged in to make a purchase.');
            return;
        }
        
        const newPaymentRequest: PaymentRequest = {
            id: Date.now().toString(),
            userId: currentUser.id,
            userEmail: currentUser.email,
            packageId: pkg.id,
            packageName: pkg.name,
            packagePrice: pkg.price,
            transactionId: trxId,
            status: 'pending',
            createdAt: new Date(),
        };

        dispatch({ type: 'ADD_PAYMENT_REQUEST', payload: newPaymentRequest });
        toast.success('Payment request submitted! Please wait for admin approval.');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg p-8 w-full max-w-md text-white" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-2">Buy: <span className="text-primary-400">{pkg.name}</span></h2>
                <p className="text-lg mb-4">Price: <span className="font-semibold">৳{pkg.price}</span></p>

                <div className="bg-gray-700 p-4 rounded-md text-center">
                    <p className="font-semibold">Pay with {settings.paymentDetails.methodName}</p>
                    <p className="text-lg my-1">{settings.paymentDetails.accountNumber}</p>
                    <img src={settings.paymentDetails.qrCodeUrl} alt="Payment QR Code" className="w-40 h-40 mx-auto my-4 rounded-lg bg-white p-1" />
                    <p className="text-sm text-gray-400">Scan the QR code or use the number above to pay.</p>
                </div>

                <form onSubmit={handleSubmit} className="mt-6">
                    <label htmlFor="trxId" className="block text-sm font-medium text-gray-300 mb-2">
                        Transaction ID (TrxID)
                    </label>
                    <input
                        id="trxId"
                        type="text"
                        value={trxId}
                        onChange={(e) => setTrxId(e.target.value)}
                        required
                        className="w-full bg-gray-700 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Enter the TrxID from your payment app"
                    />
                    <div className="flex justify-end space-x-3 mt-6">
                        <button type="button" onClick={onClose} className="px-5 py-2 rounded-md bg-gray-600 hover:bg-gray-500 transition-colors">Cancel</button>
                        <button type="submit" className="px-5 py-2 rounded-md bg-primary-600 hover:bg-primary-700 transition-colors">Submit Request</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const BuyCreditsPage: React.FC = () => {
    const { settings } = useGlobalState();
    const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null);

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-2">Buy Credits</h1>
            <p className="text-gray-400 mb-8">Choose a package that suits your needs. Your request will be approved by an admin.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {settings.creditPackages.map((pkg) => (
                    <div key={pkg.id} className="bg-gray-800 rounded-lg p-6 flex flex-col shadow-lg hover:shadow-primary-500/20 hover:scale-105 transition-all duration-300">
                        <h3 className="text-xl font-bold text-primary-400">{pkg.name}</h3>
                        <p className="text-4xl font-extrabold my-4">{pkg.credits.toLocaleString()} <span className="text-lg font-medium text-gray-400">Credits</span></p>
                        <p className="text-2xl font-semibold text-gray-200 mb-6">৳{pkg.price}</p>
                        <button
                            onClick={() => setSelectedPackage(pkg)}
                            className="mt-auto w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
                        >
                            Buy Now
                        </button>
                    </div>
                ))}
            </div>

            {selectedPackage && <PaymentModal pkg={selectedPackage} onClose={() => setSelectedPackage(null)} />}
        </div>
    );
};

export default BuyCreditsPage;
