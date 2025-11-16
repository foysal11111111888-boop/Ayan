import React, { useState, ChangeEvent, FormEvent } from 'react';
import toast from 'react-hot-toast';
import { useGlobalState } from '../../context/GlobalStateContext';
import { CreditPackage, PaymentDetails } from '../../types';

const SettingsPage: React.FC = () => {
    const { settings, dispatch } = useGlobalState();
    const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>(settings.paymentDetails);
    const [packages, setPackages] = useState<CreditPackage[]>(settings.creditPackages);
    const [editingPackage, setEditingPackage] = useState<CreditPackage | null>(null);

    const handlePaymentDetailsChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value });
    };

    const handlePaymentDetailsSave = (e: FormEvent) => {
        e.preventDefault();
        dispatch({ type: 'UPDATE_SETTINGS', payload: { paymentDetails } });
        toast.success('Payment details updated!');
    };

    const handleQrCodeUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setPaymentDetails({ ...paymentDetails, qrCodeUrl: base64String });
                dispatch({ type: 'UPDATE_SETTINGS', payload: { paymentDetails: { ...paymentDetails, qrCodeUrl: base64String } } });
                toast.success('QR Code updated!');
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handlePackageChange = (e: ChangeEvent<HTMLInputElement>, id: string) => {
        const { name, value } = e.target;
        setPackages(packages.map(p => p.id === id ? { ...p, [name]: name === 'name' ? value : Number(value) } : p));
    };

    const handleSavePackage = (pkg: CreditPackage) => {
        if(packages.find(p => p.id === pkg.id)) {
            dispatch({ type: 'UPDATE_PACKAGE', payload: pkg });
            toast.success(`Package "${pkg.name}" updated.`);
        } else {
            dispatch({ type: 'ADD_PACKAGE', payload: pkg });
            toast.success(`Package "${pkg.name}" added.`);
        }
        setEditingPackage(null);
    }
    
    const handleAddNewPackage = () => {
        const newPackage: CreditPackage = { id: `new_${Date.now()}`, name: 'New Package', credits: 0, price: 0 };
        setPackages([...packages, newPackage]);
        setEditingPackage(newPackage);
    }

    const handleDeletePackage = (id: string) => {
        if (window.confirm('Are you sure you want to delete this package?')) {
            dispatch({ type: 'DELETE_PACKAGE', payload: id });
            setPackages(packages.filter(p => p.id !== id));
            toast.success('Package deleted.');
        }
    };


    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-8">Application Settings</h1>

            {/* Payment Settings */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
                <h2 className="text-xl font-bold text-white mb-4">Payment Settings</h2>
                <form onSubmit={handlePaymentDetailsSave} className="space-y-4">
                    <div>
                        <label htmlFor="methodName" className="block text-sm font-medium text-gray-300">Method Name</label>
                        <input type="text" name="methodName" id="methodName" value={paymentDetails.methodName} onChange={handlePaymentDetailsChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-300">Account Number</label>
                        <input type="text" name="accountNumber" id="accountNumber" value={paymentDetails.accountNumber} onChange={handlePaymentDetailsChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">QR Code</label>
                        <div className="mt-2 flex items-center space-x-4">
                            <img src={paymentDetails.qrCodeUrl} alt="Payment QR Code" className="h-24 w-24 rounded-md bg-white p-1" />
                            <label htmlFor="qr-upload" className="cursor-pointer bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md transition duration-300">
                                Upload New QR
                            </label>
                            <input id="qr-upload" name="qr-upload" type="file" className="sr-only" accept="image/*" onChange={handleQrCodeUpload} />
                        </div>
                    </div>
                    <div className="text-right">
                        <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-md transition duration-300">Save Payment Settings</button>
                    </div>
                </form>
            </div>

            {/* Credit Packages */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">Credit Packages</h2>
                    <button onClick={handleAddNewPackage} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-300">Add New Package</button>
                </div>
                <div className="space-y-3">
                    {packages.map(pkg => (
                        <div key={pkg.id} className="bg-gray-700 p-4 rounded-md flex items-center justify-between">
                            <div className="flex items-center space-x-4 flex-1">
                                <input type="text" name="name" value={pkg.name} onChange={e => handlePackageChange(e, pkg.id)} className="w-1/3 bg-gray-600 border-gray-500 rounded-md text-white sm:text-sm" placeholder="Package Name" />
                                <input type="number" name="credits" value={pkg.credits} onChange={e => handlePackageChange(e, pkg.id)} className="w-1/4 bg-gray-600 border-gray-500 rounded-md text-white sm:text-sm" placeholder="Credits"/>
                                <input type="number" name="price" value={pkg.price} onChange={e => handlePackageChange(e, pkg.id)} className="w-1/4 bg-gray-600 border-gray-500 rounded-md text-white sm:text-sm" placeholder="Price (৳)"/>
                            </div>
                            <div className="space-x-2">
                                <button onClick={() => handleSavePackage(pkg)} className="text-primary-400 hover:text-primary-300 font-semibold">Save</button>
                                <button onClick={() => handleDeletePackage(pkg.id)} className="text-red-400 hover:text-red-300 font-semibold">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
