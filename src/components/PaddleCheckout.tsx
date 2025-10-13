import React, { useEffect } from "react";
import { initializePaddle } from '@paddle/paddle-js';

interface PaddleCheckoutProps {
  customerEmail?: string;
  onCheckoutOpen?: () => void;
  children: React.ReactNode;
}

const PaddleCheckout: React.FC<PaddleCheckoutProps> = ({ 
  customerEmail = "sam@example.com", 
  onCheckoutOpen,
  children 
}) => {
  useEffect(() => {
    initializePaddle({
      token: "test_1bfc72fb0d760e25abd16392579", // replace with your client token
      environment: "sandbox",
    });
  }, []);

  const itemsList = [
    {
      priceId: "pri_01k3n22vd29zpkj5k7b0hae0fc",
      quantity: 1,
    }
  ];

  const customerInfo = {
    email: customerEmail,
  };

  const openCheckout = () => {
    if (window.Paddle) {
      window.Paddle.Checkout.open({
        items: itemsList,
        customer: customerInfo,
      });
      onCheckoutOpen?.();
    } else {
      alert("Paddle SDK not loaded yet.");
    }
  };

  return (
    <div onClick={openCheckout} style={{ cursor: 'pointer' }}>
      {children}
    </div>
  );
};

export default PaddleCheckout;