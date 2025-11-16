
export interface User {
  id: string;
  name: string;
  email: string;
  credits: number;
  role: 'user' | 'admin';
  status: 'active' | 'blocked';
  password?: string; // Only used during session, not persisted in a real DB
}

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
}

export interface PaymentRequest {
  id: string;
  userId: string;
  userEmail: string;
  packageId: string;
  packageName: string;
  packagePrice: number;
  transactionId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

export interface PaymentDetails {
  methodName: string;
  accountNumber: string;
  qrCodeUrl: string;
}

export interface AppSettings {
  paymentDetails: PaymentDetails;
  creditPackages: CreditPackage[];
}
