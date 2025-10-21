// ...existing code...
import React, { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, Shield } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const BACKEND_BASE_URL = 'http://127.0.0.1:8000'; // Replace with your backend URL

const PaymentPage: React.FC = () => {
  const [selectedPackage, setSelectedPackage] = useState<'monthly' | 'custom'>('monthly');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    requirements: ''
  });

  const location = useLocation();

  const [planId, setPlanId] = useState<string | null>(null);
  const [amount, setAmount] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null); // decoded access token
  const [isLoading, setIsLoading] = useState(false);
  const [transactionId, setTransactionId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setPlanId(params.get('planId'));
    setAmount(params.get('amount'));
    const tokenParam = params.get('token');
    if (tokenParam) {
      try {
        const decodedToken = atob(tokenParam);
        setAccessToken(decodedToken);
      } catch {
        setAccessToken(null);
      }
    }
  }, [location.search]);

  // Load Cashfree SDK
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.async = true;
    script.onload = () => {
      console.log('Cashfree SDK loaded');
    };
    document.head.appendChild(script);
    return () => {
      const existingScript = document.querySelector('script[src*="cashfree.js"]');
      if (existingScript) existingScript.remove();
    };
  }, []);

  // API call to create Cashfree order with Authorization header
  const createCashfreeOrder = async (
    amountPaise: number,
    plan: number,
    token: string,
    currency = 'INR',
    customerData: any
  ): Promise<{ paymentSessionId: string; transactionId?: string }> => {
    const response = await fetch(`${BACKEND_BASE_URL}/api/payments/create-phonepe-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        amount: amountPaise,
        plan,
        currency,
        customerData,
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to create Cashfree order');
    }
    const data = await response.json();
    const paymentSessionId = data.payment_session_id || data.paymentSessionId || data.payment_session || data.sessionId;
    const transactionId =
      data.transactionId ||
      data.transaction_id ||
      data.merchantTransactionId ||
      data.merchant_transaction_id;
    if (!paymentSessionId) {
      throw new Error('No payment session id returned from backend');
    }
    return { paymentSessionId, transactionId };
  };

  // API call to get payment status
  const getPaymentStatus = async (transactionId: string, token: string): Promise<{ status: string }> => {
    const response = await fetch(`${BACKEND_BASE_URL}/api/payments/phonepe-order-status/${transactionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to get payment status');
    }
    const data = await response.json();
    return {
      status: data.status || data.payment_status,
    };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePackageSelect = (pkg: 'monthly' | 'custom') => {
    setSelectedPackage(pkg);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !planId || !accessToken) {
      alert('Missing payment credentials. Please retry.');
      return;
    }
    setIsLoading(true);
    try {
      const amountPaise = parseInt(amount);

      // Create Cashfree order with customer form data
      const { paymentSessionId, transactionId } = await createCashfreeOrder(
        amountPaise,
        Number(planId),
        accessToken,
        'USD',
        formData
      );
      setTransactionId(transactionId);

      // Initiate Cashfree checkout
      const CashfreeCtor = (window as any).Cashfree;
      if (CashfreeCtor) {
        const cashfree = CashfreeCtor({
          mode: 'sandbox', // or 'TEST' depending on environment
        });
        const checkoutOptions = {
          paymentSessionId,
          redirectTarget: '_blank', // opens in same tab
        };
        cashfree.checkout(checkoutOptions);
        // Note: Cashfree will redirect to the payment/response page.
        // After redirect you can use transactionId + backend verification to confirm status.
      } else {
        alert('Cashfree SDK not loaded yet. Please try again.');
      }
    } catch (error) {
      console.error('Cashfree payment initiation failed:', error);
      alert('Unable to initiate payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const planDetails: Record<string, { name: string; description: string }> = {
    '1': {
      name: 'Basic',
      description: 'This is for 1 month validity, and the remaining tokens will roll back to the next month.'
    },
    '2': {
      name: 'Pro',
      description: 'This is for 1 month validity, and the remaining tokens will roll back to the next month.'
    },
    '3': {
      name: 'Elite',
      description: 'This is for 1 month validity, and the remaining tokens will roll back to the next month.'
    }
  };

  const planName = planId && planDetails[planId] ? planDetails[planId].name : 'Plan';
  const planDescription = planId && planDetails[planId] ? planDetails[planId].description : '';

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        {/* Left column: Amount info */}
        <div className="md:w-1/2 w-full bg-gray-900 text-white flex flex-col justify-center items-center p-10">
          <h1 className="text-2xl font-bold mb-4">Subscribe to  - {planName}</h1>
          <div className="text-4xl font-bold mb-2">
            ₹{amount ? (parseInt(amount) / 100).toFixed(2) : '39.00'}
          </div>
          <span className="text-lg text-gray-300 mb-4">per month</span>
          <p className="text-sm text-gray-300 mb-10 text-center">{planDescription}</p>
          <div className="flex items-center gap-3 mt-auto">
            <Shield size={18} className="text-green-400" />
            <span className="text-xs text-green-400">100% Secure payment gateway powered by Cashfree</span>
          </div>
        </div>

        {/* Right column: Payment form */}
        <div className="md:w-1/2 w-full p-8 flex flex-col justify-center items-center bg-white">
          <Link to="/" className="self-start mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition">
            <ArrowLeft size={22} />
            Back to plans
          </Link>

          <form className="w-full space-y-4" onSubmit={handlePayment}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              autoComplete="name"
              className="w-full px-4 py-3 rounded bg-gray-100 text-gray-900 outline-none focus:ring-2 focus:ring-amber-500"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              autoComplete="email"
              className="w-full px-4 py-3 rounded bg-gray-100 text-gray-900 outline-none focus:ring-2 focus:ring-amber-500"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              className="w-full px-4 py-3 rounded bg-gray-100 text-gray-900 outline-none focus:ring-2 focus:ring-amber-500"
              value={formData.phone}
              onChange={handleInputChange}
            />

            <textarea
              name="requirements"
              placeholder=""
              rows={3}
              className="w-full px-4 py-3 rounded bg-gray-100 text-gray-900 outline-none resize-none focus:ring-2 focus:ring-amber-500"
              value={formData.requirements}
              onChange={handleInputChange}
            />

            {/* Submit button triggers Cashfree payment */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-amber-600 hover:bg-amber-700 transition-colors py-3 rounded font-semibold flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <CreditCard size={20} />
              {isLoading ? 'Processing...' : `Pay ₹${amount ? (parseInt(amount) / 100).toFixed(2) : '0.00'}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
// ...existing code...