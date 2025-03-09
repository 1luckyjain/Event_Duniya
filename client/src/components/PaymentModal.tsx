import { useState, useEffect } from 'react';
import { X, RefreshCcw } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/auth-context';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string | undefined;
  onSuccess: (ticketTierId: string, quantity: number) => void;
  selectedTier?: { _id: string; name: string; price: number };
  quantity?: number;
}

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  eventId, 
  onSuccess, 
  selectedTier,
  quantity = 1
}: PaymentModalProps) => {
  const { user, token, refreshToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  
  // Debug info
  console.log('PaymentModal props:', { eventId, selectedTier, quantity });
  console.log('API URL:', API_URL);
  console.log('Razorpay Key:', import.meta.env.VITE_RAZORPAY_KEY_ID);

  // Load Razorpay script
  useEffect(() => {
    if (document.getElementById('razorpay-script')) {
      console.log('Razorpay script already exists');
      setScriptLoaded(true);
    } else {
      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.crossOrigin = 'anonymous'; // Ensure no CORS blocking
      script.onload = () => {
        console.log('Razorpay script loaded successfully');
        console.log('window.Razorpay:', window.Razorpay);
        setScriptLoaded(true);
      };
      script.onerror = () => {
        console.error('Failed to load Razorpay script. Check for blockers.');
        setError('Failed to load payment gateway');
      };
      document.body.appendChild(script);
    }
  }, []);

  if (!scriptLoaded) {
    console.log('Razorpay script not yet loaded. Check console for requests being blocked.');
  }

  const createAndOpenRazorpay = async () => {
    if (!selectedTier || !user || !eventId) {
      setError('Missing required information');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Refresh token before making the request
      if (retryCount > 0) {
        console.log('Refreshing token before retry...');
        await refreshToken();
      }
      
      console.log(`Creating order... (Attempt ${retryCount + 1})`);
      
      // Step 1: Create order
      const orderResponse = await axios.post(
        `${API_URL}/api/payment/create-order`, 
        {
          userId: user._id,
          eventId,
          email: user.email,
          ticketTierId: selectedTier._id,
          quantity
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000, // Increase axios timeout to 30 seconds
          withCredentials: true // Allow cookies
        }
      );
      
      console.log('Order response:', orderResponse.data);
      
      if (!orderResponse.data.success || !orderResponse.data.order) {
        throw new Error(orderResponse.data.message || 'Failed to create payment order');
      }
      
      const { order, key_id } = orderResponse.data;
      
      // Step 2: Configure Razorpay
      const options = {
        key: key_id || import.meta.env.VITE_RAZORPAY_KEY_ID, // Fallback to env variable
        amount: order.amount,
        currency: order.currency,
        name: "Event Booking",
        description: `Booking for ${quantity}x ${selectedTier.name}`,
        order_id: order.id,
        prefill: {
          name: user.username || '',
          email: user.email || '',
        },
        theme: {
          color: "#9333EA"
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        },
        handler: function(response: any) {
          console.log('Payment successful:', response);
          verifyPayment(response);
        }
      };
      
      console.log('Razorpay options:', options);

      // Step 3: Create Razorpay instance
      if (!window.Razorpay) {
        throw new Error("Razorpay SDK is not loaded yet");
      }
      
      const razorpay = new window.Razorpay(options);
      
      // Handle payment failure
      razorpay.on('payment.failed', function(response: any) {
        console.error('Payment failed:', response.error);
        setError(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });
      
      // Step 4: Open Razorpay
      console.log('Opening Razorpay...');
      razorpay.open();
      
    } catch (error: any) {
      console.error('Payment error:', error);
      setError(error.response?.data?.message || error.message || 'Payment initialization failed');
      setLoading(false);
      setRetryCount(prevCount => prevCount + 1);
    }
  };

  const verifyPayment = async (response: any) => {
    try {
      const verifyResponse = await axios.post(
        `${API_URL}/api/payment/verify-payment`,
        {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true // Allow cookies
        }
      );

      if (verifyResponse.data.success) {
        onSuccess(selectedTier!._id, quantity);
        setPaymentCompleted(true);
        setLoading(false);
      } else {
        setError('Payment verification failed');
        setLoading(false);
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      setError('Payment verification failed');
      setLoading(false);
    }
  };

  // Render UI
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Complete Payment</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
            {error}
            <button 
              onClick={() => {
                setError(null);
                createAndOpenRazorpay();
              }}
              className="ml-2 flex items-center text-sm underline hover:no-underline"
            >
              <RefreshCcw size={14} className="mr-1" />
              Retry
            </button>
          </div>
        )}

        {!scriptLoaded && (
          <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500 rounded-lg text-yellow-500">
            Loading payment gateway...
          </div>
        )}

        {selectedTier && (
          <div className="mb-6">
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-lg font-medium">{selectedTier.name}</p>
              <p className="text-gray-400">Quantity: {quantity}</p>
              <p className="text-xl font-semibold mt-2">
                Total: ₹{selectedTier.price * quantity}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={createAndOpenRazorpay}
          disabled={loading || !scriptLoaded || paymentCompleted}
          className="w-full py-3 rounded-lg font-medium bg-purple-500 hover:bg-purple-600 disabled:bg-gray-700 disabled:cursor-not-allowed"
        >
          {paymentCompleted ? (
            'Event Booked'
          ) : loading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-white/20 border-t-white"></div>
              <span className="ml-2">Processing...</span>
            </div>
          ) : (
            'Pay Now'
          )}
        </button>

        <div className="mt-4 text-center text-gray-500 text-xs">
          Secured by Razorpay
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
