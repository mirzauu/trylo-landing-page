import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Check, CreditCard, Shield } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const BACKEND_BASE_URL = 'https://api.trylo.space'; // Replace with your backend URL

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
  const navigate = useNavigate();

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

  // API call to create PhonePe order with Authorization header
  const createPhonePeOrder = async (
    amountPaise: number,
    plan: number,
    token: string,
    currency = 'INR',
    customerData: any
  ): Promise<{ tokenUrl: string; transactionId?: string }> => {
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
      throw new Error('Failed to create PhonePe order');
    }
    const data = await response.json();
    const tokenUrl = data.tokenUrl || data.token_url;
    const transactionId =
      data.transactionId ||
      data.transaction_id ||
      data.merchantTransactionId ||
      data.merchant_transaction_id;
    return { tokenUrl, transactionId };
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

  const phonePeCallback = useCallback(async (response: string) => {
    console.log('PhonePe callback response:', response);
    if (response === 'USER_CANCEL') {
      alert('Payment cancelled by user.');
    } else if (response === 'CONCLUDED') {
      alert('Payment completed successfully!');
      try {
        if (transactionId && accessToken) {
          const { status } = await getPaymentStatus(transactionId, accessToken);
          console.log('Payment status:', status);
        }
      } catch (e) {
        console.error('Failed to verify payment status:', e);
      } finally {
        window.location.href = 'https://app.trylo.space/';

      }
    }
  }, [transactionId, accessToken, navigate]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://mercury.phonepe.com/web/bundle/checkout.js';
    script.async = true;
    script.onload = () => {
      console.log('PhonePe Checkout script loaded');
    };
    document.head.appendChild(script);
    return () => {
      const existingScript = document.querySelector('script[src*="checkout.js"]');
      if (existingScript) existingScript.remove();
    };
  }, []);

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
      // Create PhonePe order with customer form data
      const { tokenUrl, transactionId } = await createPhonePeOrder(
        amountPaise,
        Number(planId),
        accessToken,
        'INR',
        formData
      );
      setTransactionId(transactionId);

      if ((window as any).PhonePeCheckout) {
        (window as any).PhonePeCheckout.transact({
          tokenUrl,
          callback: phonePeCallback,
          type: 'IFRAME',
        });
      } else {
        alert('PhonePe SDK not loaded yet. Please try again.');
      }
    } catch (error) {
      console.error('PhonePe payment initiation failed:', error);
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
      <span className="text-xs text-green-400">100% Secure payment gateway powered by PhonePe</span>
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

            {/* Submit button triggers PhonePe payment */}
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
