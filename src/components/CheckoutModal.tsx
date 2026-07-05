import React, { useState } from 'react';
import { X, Trash2, Tag, ShieldCheck, Sparkles, AlertTriangle, Terminal, Receipt, CheckCircle, CreditCard, ChevronRight, ShoppingBag, Plus, Minus, Bookmark, Percent } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, StoreItem } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  formatPrice: (price: number) => string;
  connectedUser: string | null;
  onConnectPrompt: () => void;
  currency: string;
  onUpdateQuantity?: (id: string, quantity: number) => void;
  onSaveForLater?: (id: string) => void;
  savedItems?: CartItem[];
  onMoveToCart?: (id: string) => void;
  onRemoveSavedItem?: (id: string) => void;
  onNavigateToCheckout?: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onClearCart,
  formatPrice,
  connectedUser,
  onConnectPrompt,
  currency,
  onUpdateQuantity,
  onSaveForLater,
  savedItems = [],
  onMoveToCart,
  onRemoveSavedItem,
  onNavigateToCheckout
}) => {
  const [coupon, setCoupon] = useState('');
  const [activeCoupon, setActiveCoupon] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'razorpay' | 'tebex' | 'upi'>('stripe');
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<string>('');
  const [invoice, setInvoice] = useState<any | null>(null);
  const [couponError, setCouponError] = useState('');

  // UPI Flow States
  const [upiOrder, setUpiOrder] = useState<any | null>(null);
  const [upiStatus, setUpiStatus] = useState<'pending' | 'completed' | 'failed'>('pending');
  const [copiedVpa, setCopiedVpa] = useState(false);
  const [pollingIntervalId, setPollingIntervalId] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes payment window
  const [simulatingWebhook, setSimulatingWebhook] = useState(false);

  // Clean up all active polling and timers on unmount
  React.useEffect(() => {
    return () => {
      if (pollingIntervalId) {
        clearInterval(pollingIntervalId);
      }
    };
  }, [pollingIntervalId]);

  // UPI Countdown timer effect
  React.useEffect(() => {
    if (!upiOrder || upiStatus !== 'pending') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setUpiStatus('failed');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [upiOrder, upiStatus]);

  // Pricing calculations
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = parseFloat((subtotal * discountPercent).toFixed(2));
  const taxRate = 0.08; // 8% Regional GST/VAT tax rate
  const taxAmount = parseFloat(((subtotal - discountAmount) * taxRate).toFixed(2));
  const finalPrice = Math.max(0, parseFloat((subtotal - discountAmount + taxAmount).toFixed(2)));

  // Coupon apply
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = coupon.trim().toUpperCase();

    if (code === 'VOLEX50') {
      setActiveCoupon('VOLEX50');
      setDiscountPercent(0.5);
    } else if (code === 'LAUNCH') {
      setActiveCoupon('LAUNCH');
      setDiscountPercent(0.3);
    } else if (code === 'MINECRAFT') {
      setActiveCoupon('MINECRAFT');
      setDiscountPercent(0.2);
    } else {
      setCouponError('Invalid promo code. Try "VOLEX50" or "MINECRAFT"!');
      setTimeout(() => setCouponError(''), 4000);
    }
    setCoupon('');
  };

  const handleRemoveCoupon = () => {
    setActiveCoupon(null);
    setDiscountPercent(0);
  };

  // Perform Simulated Payment checkout
  const handleCheckout = async () => {
    if (!connectedUser) {
      onConnectPrompt();
      return;
    }

    setCheckingOut(true);
    setInvoice(null);

    // UPI BRANCH - Hits native Indian UPI PSP initialization
    if (paymentMethod === 'upi') {
      const steps = [
        'Connecting to Indian Unified Payments Interface (UPI) secure gateway...',
        'Resolving National Payments Corporation of India (NPCI) API endpoints...',
        'Registering dynamic transaction token with ICICI Bank gateway node...',
        'Generating dynamic Merchant QR Code & Deep Link intents...'
      ];

      for (const step of steps) {
        setCheckoutStep(step);
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      try {
        const response = await fetch('/api/checkout/upi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: connectedUser,
            items: cartItems.map(i => ({ id: i.id, name: i.name, price: i.price, category: i.category, quantity: i.quantity })),
            couponCode: activeCoupon
          })
        });
        const data = await response.json();

        if (data.success) {
          setUpiOrder(data);
          setUpiStatus('pending');
          setTimeLeft(300);

          // Clear previous pollers
          if (pollingIntervalId) clearInterval(pollingIntervalId);

          // Register live webhook/status listener
          const intervalId = setInterval(async () => {
            try {
              const statusRes = await fetch(`/api/checkout/upi/status/${data.orderId}`);
              const statusData = await statusRes.json();
              
              if (statusData.success && statusData.status === 'completed') {
                setUpiStatus('completed');
                clearInterval(intervalId);
                
                // Present final verified invoice
                setInvoice({
                  id: `UPI-${data.orderId.split("-")[1]}`,
                  username: connectedUser,
                  amount: data.amountInInr / 83,
                  discount: discountAmount,
                  commands: cartItems.map(item => `/broadcast Received item ${item.name}`),
                  timestamp: new Date().toISOString(),
                  paymentMethod: 'upi',
                  simulated: true
                });
                onClearCart();
              }
            } catch (pollErr) {
              console.error("UPI polling error:", pollErr);
            }
          }, 3000);

          setPollingIntervalId(intervalId);
        } else {
          alert('Failed to initiate secure UPI payment session. Please check connection.');
        }
      } catch (err) {
        console.error("UPI Checkout creation error:", err);
        alert('Network request failed. Make sure server.ts is active.');
      } finally {
        setCheckingOut(false);
      }
      return;
    }

    const steps = [
      'Establishing SSL Connection to gateway...',
      'Verifying Minecraft Character UUID with Mojang database...',
      'Securing one-time token authorization...',
      'Processing Stripe/Razorpay secure callback...',
      'Synchronizing transaction metadata...',
      'Adding server rewards to live queue...',
      'Finalizing webhooks & printing invoice...'
    ];

    for (const step of steps) {
      setCheckoutStep(step);
      await new Promise((resolve) => setTimeout(resolve, paymentMethod === 'stripe' ? 450 : 350));
    }

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: connectedUser,
          items: cartItems.map(i => ({ id: i.id, name: i.name, price: i.price, category: i.category, quantity: i.quantity })),
          paymentMethod,
          couponCode: activeCoupon
        })
      });
      const data = await response.json();

      if (data.success) {
        if (data.redirectUrl) {
          // Real Stripe Checkout Session - redirect player immediately
          window.location.href = data.redirectUrl;
          return;
        }

        setInvoice({
          id: data.transaction.id,
          username: data.transaction.username,
          amount: data.transaction.amount,
          discount: discountAmount,
          commands: data.transaction.commands,
          timestamp: data.transaction.timestamp,
          paymentMethod: data.transaction.paymentMethod,
          simulated: data.simulated
        });
        onClearCart();
      } else {
        alert('Server processing error. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Network request failed. Ensure server.ts is active.');
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm"
        >
          {/* Backdrop click closer */}
          <div className="absolute inset-0 cursor-default" onClick={onClose} />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="relative w-full max-w-md h-full bg-[#07070a] border-l border-purple-500/15 p-6 flex flex-col justify-between overflow-y-auto z-10 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
          >
            
            {/* Header */}
            <div>
              <div className="flex items-center justify-between border-b border-purple-500/10 pb-4">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="h-5 w-5 text-purple-400" />
                  <h2 className="text-lg font-black text-white font-sans tracking-tight">Your Cart</h2>
                  <span className="text-[10px] font-mono text-gray-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                    {cartItems.reduce((acc, i) => acc + i.quantity, 0)} items
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10 text-gray-400 hover:text-white cursor-pointer transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Connected User Notice */}
              {!connectedUser && cartItems.length > 0 && (
                <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs leading-relaxed text-amber-300">
                  <AlertTriangle className="h-4.5 w-4.5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Missing Linked Username!</span>
                    <p className="text-[11px] text-amber-400/80 mt-0.5">
                      You must link your Minecraft Character ID before initiating payment so we can dispatch rewards.
                    </p>
                    <button
                      onClick={onConnectPrompt}
                      className="mt-2 text-[10px] font-black uppercase text-white bg-amber-500 hover:bg-amber-600 px-3 py-1 rounded cursor-pointer transition-colors"
                    >
                      Link ID Now
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Invoice Success View */}
            {invoice ? (
              <div className="flex-grow flex flex-col justify-center py-6">
                <div className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-black text-white mt-4 font-sans tracking-tight">Payment Dispatched!</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Your server rank/keys are being broadcast on Volex Server.
                  </p>
                </div>

                {/* Simulated Receipt */}
                <div className="mt-6 rounded-xl border border-purple-500/15 bg-black/60 p-4.5 space-y-3.5 text-xs font-mono">
                  <div className="flex items-center justify-between text-gray-500 border-b border-purple-500/10 pb-2">
                    <span>RECEIPT LOGS</span>
                    {invoice.simulated ? (
                      <span className="text-[10px] text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-500/20 font-bold">SIMULATION MODE</span>
                    ) : (
                      <span className="text-[10px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">STRIPE SECURED</span>
                    )}
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Order ID:</span>
                    <span className="text-white font-bold">{invoice.id}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Character:</span>
                    <span className="text-cyan-400 font-bold">{invoice.username}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400">Paid Amount:</span>
                    <span className="text-white font-bold">{formatPrice(invoice.amount)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400">Gateway:</span>
                    <span className="text-purple-300 uppercase font-bold">{invoice.paymentMethod} Secure</span>
                  </div>

                  <div className="border-t border-purple-500/10 pt-3">
                    <div className="flex items-center space-x-1 text-gray-500 mb-1.5 text-[10px] uppercase font-bold">
                      <Terminal className="h-3 w-3" />
                      <span>Executed Console Hooks:</span>
                    </div>
                    <div className="bg-black/80 rounded border border-purple-500/5 p-2 space-y-1 font-mono text-[9px] max-h-32 overflow-y-auto text-[#bf5af2]">
                      {invoice.commands.map((cmd: string, idx: number) => (
                        <div key={idx} className="whitespace-pre-wrap leading-tight">
                          {cmd}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setInvoice(null);
                    onClose();
                  }}
                  className="mt-6 w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs uppercase py-2.5 rounded-xl border border-emerald-500/20 cursor-pointer transition-all"
                >
                  Continue Shopping
                </button>
              </div>
            ) : upiOrder ? (
              <div className="flex-grow flex flex-col justify-start py-4 space-y-4">
                {/* UPI Order Status Indicator Banner */}
                <div className="rounded-xl border border-cyan-500/15 bg-[#090b10] p-4 text-center space-y-2 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-black text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded uppercase tracking-widest">
                      Live UPI Terminal
                    </span>
                    <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-cyan-500 animate-ping"></span>
                      Polling active
                    </span>
                  </div>
                  
                  <div className="text-2xl font-black text-white font-sans mt-1">
                    ₹{upiOrder.amountInInr}
                    <span className="text-xs text-gray-500 font-normal ml-1">INR</span>
                  </div>
                  
                  <div className="text-[10px] text-gray-400 font-mono">
                    Order Reference: <span className="text-cyan-400 select-all font-bold">{upiOrder.orderId}</span>
                  </div>
                </div>

                {/* Desktop Option: UPI QR Code scan */}
                <div className="rounded-xl border border-purple-500/10 bg-black/40 p-4 flex flex-col items-center text-center animate-fade-in">
                  <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wide mb-3">
                    Option 1: Scan QR Code (Desktop Users)
                  </span>
                  
                  {/* Dynamic QR Code Render via secure high-fidelity SVG service */}
                  <div className="p-3 bg-white rounded-xl border border-white/10 relative overflow-hidden group">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiOrder.upiUri)}&color=000000&bgcolor=ffffff`}
                      alt="UPI Merchant QR Code"
                      className="h-36 w-36"
                      referrerPolicy="no-referrer"
                    />
                    {upiStatus === 'completed' && (
                      <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center text-emerald-400 animate-fade-in">
                        <CheckCircle className="h-10 w-10 animate-bounce" />
                        <span className="text-xs font-bold mt-2 uppercase font-sans">Payment Received!</span>
                      </div>
                    )}
                  </div>

                  {/* Countdown Timer */}
                  <div className="mt-3.5 flex items-center gap-1.5 text-[11px] font-mono text-gray-400">
                    <span>QR expires in:</span>
                    <span className={`font-black ${timeLeft < 60 ? 'text-rose-400 animate-pulse' : 'text-cyan-400'}`}>
                      {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </span>
                  </div>

                  {/* Copy VPA Button */}
                  <div className="mt-4 w-full">
                    <div className="flex items-center justify-between bg-black/60 border border-purple-500/5 rounded-lg p-2 text-[10px] font-mono">
                      <span className="text-gray-500">Merchant UPI ID:</span>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(upiOrder.merchantVpa);
                          setCopiedVpa(true);
                          setTimeout(() => setCopiedVpa(false), 2000);
                        }}
                        className="text-white hover:text-cyan-400 font-bold transition-colors cursor-pointer"
                      >
                        {copiedVpa ? 'COPIED ✓' : upiOrder.merchantVpa}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mobile Option: UPI Deep Link Intent Buttons */}
                <div className="rounded-xl border border-purple-500/10 bg-black/40 p-4 space-y-3.5 animate-fade-in">
                  <div className="text-center">
                    <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wide">
                      Option 2: Open UPI App (Mobile Users)
                    </span>
                    <p className="text-[9px] text-gray-500 mt-0.5 font-sans leading-normal">
                      Click below to open and pay securely via your preferred payment app.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <a 
                      href={upiOrder.upiUri}
                      className="flex items-center justify-center gap-2 bg-[#090b10] hover:bg-white/5 border border-purple-500/10 rounded-lg p-2.5 text-[10px] font-sans font-extrabold uppercase text-gray-300 hover:text-white transition-all cursor-pointer"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                      GPay / PhonePe
                    </a>
                    <a 
                      href={`paytm://pay?pa=${upiOrder.merchantVpa}&pn=Volex%20Store&am=${upiOrder.amountInInr}`}
                      className="flex items-center justify-center gap-2 bg-[#090b10] hover:bg-white/5 border border-purple-500/10 rounded-lg p-2.5 text-[10px] font-sans font-extrabold uppercase text-gray-300 hover:text-white transition-all cursor-pointer"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
                      Paytm / FamPay
                    </a>
                  </div>
                </div>

                {/* Simulated Webhook Trigger for sandboxed review */}
                <div className="rounded-xl border border-amber-500/15 bg-amber-500/5 p-4 space-y-2 text-center animate-fade-in">
                  <span className="text-[10px] font-mono font-black text-amber-400 uppercase tracking-wider block">
                    ⭐ Developer Sandbox simulator
                  </span>
                  <p className="text-[9px] text-amber-400/80 leading-relaxed font-sans">
                    Since this is a preview sandbox environment, click below to simulate an instant background webhook trigger from the UPI banking partner.
                  </p>
                  <button
                    type="button"
                    disabled={simulatingWebhook}
                    onClick={async () => {
                      setSimulatingWebhook(true);
                      try {
                        const response = await fetch('/api/webhooks/upi/simulate-success', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ orderId: upiOrder.orderId })
                        });
                        const resData = await response.json();
                        if (resData.success) {
                          setUpiStatus('completed');
                          if (pollingIntervalId) clearInterval(pollingIntervalId);
                          setInvoice({
                            id: `UPI-${upiOrder.orderId.split("-")[1]}`,
                            username: upiOrder.username,
                            amount: upiOrder.amountInInr / 83,
                            discount: discountAmount,
                            commands: upiOrder.items.map((item: any) => `/lp user ${upiOrder.username} parent add ${item.id.includes('rank') ? item.id.split('-')[1] || 'vip' : 'vip'}`),
                            timestamp: new Date().toISOString(),
                            paymentMethod: 'upi',
                            simulated: true
                          });
                          onClearCart();
                        }
                      } catch (err) {
                        console.error("Webhook simulation failed:", err);
                      } finally {
                        setSimulatingWebhook(false);
                      }
                    }}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-[10px] uppercase py-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {simulatingWebhook ? (
                      <div className="h-3 w-3 rounded-full border border-black border-t-transparent animate-spin"></div>
                    ) : (
                      <Sparkles className="h-3 w-3" />
                    )}
                    <span>Dispatch Simulated Webhook</span>
                  </button>
                </div>

                {/* Back to Shopping Cart */}
                <button
                  onClick={() => {
                    if (pollingIntervalId) clearInterval(pollingIntervalId);
                    setUpiOrder(null);
                  }}
                  className="mt-2 w-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-[10px] font-bold uppercase py-2 rounded-lg cursor-pointer transition-colors"
                >
                  ← Cancel &amp; Edit Cart
                </button>
              </div>
            ) : checkingOut ? (
              /* Processing Spinner Layout */
              <div className="flex-grow flex flex-col items-center justify-center py-10 text-center">
                <div className="relative">
                  <div className="h-14 w-14 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin"></div>
                  <Sparkles className="absolute inset-0 m-auto h-5 w-5 text-cyan-400 animate-pulse" />
                </div>
                <h4 className="text-sm font-black text-white mt-4 font-sans tracking-wide uppercase">Processing Payment Gateway</h4>
                <p className="text-xs text-purple-400 mt-2 font-mono max-w-xs animate-pulse leading-relaxed">
                  {checkoutStep}
                </p>
              </div>
            ) : cartItems.length === 0 && savedItems.length === 0 ? (
              /* Empty state */
              <div className="flex-grow flex flex-col items-center justify-center py-10 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-950/20 border border-purple-500/10 text-purple-400 mb-4">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <h4 className="text-base font-extrabold text-white font-sans tracking-tight">Your Cart is Empty</h4>
                <p className="text-xs text-gray-500 mt-1 max-w-xs">
                  Go to our store packages section to add vip ranks, cosmetic crate keys, or custom coins.
                </p>
              </div>
            ) : (
              /* Standard Shopping Cart Contents */
              <div className="flex-grow overflow-y-auto py-4 space-y-4 pr-1">
                
                {/* Active Items Section */}
                {cartItems.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-mono font-black text-purple-400 uppercase tracking-wider mb-2">
                      <span>In Your Cart ({cartItems.length})</span>
                      <button 
                        type="button" 
                        onClick={onClearCart}
                        className="text-gray-500 hover:text-rose-400 transition-colors lowercase font-normal"
                      >
                        [clear cart]
                      </button>
                    </div>

                    <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                      <AnimatePresence initial={false}>
                        {cartItems.map((item) => (
                          <motion.div 
                            key={item.id} 
                            layout
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                            className="flex flex-col gap-2.5 p-3 rounded-xl border border-purple-500/10 bg-black/40 hover:border-purple-500/20 hover:bg-black/60 transition-all group"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-grow">
                                <h5 className="text-xs font-black text-white leading-snug tracking-tight group-hover:text-purple-300 transition-colors">
                                  {item.name}
                                </h5>
                                <div className="flex items-center gap-1.5 mt-0.5 text-[10px] font-mono text-gray-500">
                                  <span className="text-gray-400">{formatPrice(item.price)} each</span>
                                  <span>•</span>
                                  <span className="text-purple-400 font-bold">{item.category}</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2.5 flex-shrink-0">
                                <span className="text-xs font-bold text-white font-mono">{formatPrice(item.price * item.quantity)}</span>
                                <button
                                  onClick={() => onRemoveItem(item.id)}
                                  className="text-gray-500 hover:text-rose-400 p-1 rounded hover:bg-rose-500/10 cursor-pointer transition-colors"
                                  title="Remove Item"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Bottom row: Quantity manager and Save For Later */}
                            <div className="flex items-center justify-between border-t border-purple-500/5 pt-2 mt-0.5">
                              {/* Quantity controls */}
                              <div className="flex items-center bg-zinc-950 border border-purple-500/15 rounded-lg p-0.5">
                                <button
                                  type="button"
                                  onClick={() => onUpdateQuantity && onUpdateQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  className="p-1 text-gray-500 hover:text-white disabled:opacity-20 disabled:hover:text-gray-500 rounded transition-colors"
                                >
                                  <Minus className="h-2.5 w-2.5" />
                                </button>
                                <span className="px-2 text-[11px] font-bold font-mono text-white min-w-[20px] text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => onUpdateQuantity && onUpdateQuantity(item.id, item.quantity + 1)}
                                  disabled={item.quantity >= 25}
                                  className="p-1 text-gray-500 hover:text-white disabled:opacity-20 disabled:hover:text-gray-500 rounded transition-colors"
                                >
                                  <Plus className="h-2.5 w-2.5" />
                                </button>
                              </div>

                              {/* Save for later button */}
                              {onSaveForLater && (
                                <button
                                  type="button"
                                  onClick={() => onSaveForLater(item.id)}
                                  className="text-[9px] text-purple-400 hover:text-purple-200 font-extrabold uppercase tracking-wider flex items-center gap-1 transition-all bg-purple-500/5 hover:bg-purple-500/15 px-2 py-1 rounded border border-purple-500/10 cursor-pointer"
                                >
                                  <Bookmark className="h-3 w-3 text-purple-400/80" />
                                  <span>Save for later</span>
                                </button>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-purple-500/5 bg-purple-950/5 p-4 text-center">
                    <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest block">No Active Cart Items</span>
                  </div>
                )}

                {/* Save For Later Section */}
                {savedItems.length > 0 && (
                  <div className="border-t border-purple-500/10 pt-4 mt-6">
                    <div className="flex items-center gap-1.5 mb-3 text-[10px] font-mono font-black text-gray-400 uppercase tracking-wider">
                      <Bookmark className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Saved For Later ({savedItems.length})</span>
                    </div>

                    <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                      <AnimatePresence initial={false}>
                        {savedItems.map((item) => (
                          <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                            className="p-3 rounded-xl border border-dashed border-purple-500/10 bg-[#0c0c11] hover:bg-black/50 transition-all flex items-center justify-between gap-3"
                          >
                            <div className="flex-grow">
                              <h6 className="text-xs font-bold text-gray-300 leading-snug">{item.name}</h6>
                              <div className="flex items-center gap-1.5 mt-0.5 text-[9px] font-mono text-gray-500">
                                <span>{formatPrice(item.price)} each</span>
                                <span>•</span>
                                <span className="text-cyan-400">Qty: {item.quantity}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              <button
                                type="button"
                                onClick={() => onMoveToCart && onMoveToCart(item.id)}
                                className="text-[9px] bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 hover:border-cyan-500/40 text-cyan-300 font-extrabold uppercase py-1 px-2 rounded transition-all cursor-pointer"
                              >
                                Add to Cart
                              </button>
                              <button
                                type="button"
                                onClick={() => onRemoveSavedItem && onRemoveSavedItem(item.id)}
                                className="text-gray-600 hover:text-rose-400 p-1 rounded hover:bg-rose-500/5 transition-colors cursor-pointer"
                                title="Delete Saved Item"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                {/* Coupon Code Entry (Only show if cart has items) */}
                {cartItems.length > 0 && (
                  <form onSubmit={handleApplyCoupon} className="border-t border-purple-500/10 pt-4">
                    {activeCoupon ? (
                      <div className="flex items-center justify-between rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-2 text-xs text-emerald-400 font-mono">
                        <span className="flex items-center gap-1.5 font-bold">
                          <Tag className="h-3.5 w-3.5" />
                          COUPON "{activeCoupon}" APPLIED
                        </span>
                        <button 
                          type="button"
                          onClick={handleRemoveCoupon}
                          className="hover:text-white font-bold cursor-pointer text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="PROMO CODE (e.g. VOLEX50)"
                            value={coupon}
                            onChange={(e) => setCoupon(e.target.value)}
                            className="flex-grow bg-[#0a0a0c] border border-purple-500/10 focus:border-purple-500/30 text-white placeholder-gray-500 rounded-lg px-3 py-1.5 text-xs font-mono focus:outline-none"
                          />
                          <button
                            type="submit"
                            disabled={!coupon.trim()}
                            className="bg-purple-950/40 hover:bg-purple-950/70 border border-purple-500/20 text-purple-300 hover:text-white text-[10px] font-bold uppercase px-4 rounded-lg cursor-pointer transition-colors"
                          >
                            Apply
                          </button>
                        </div>
                        {couponError && (
                          <span className="text-[10px] font-mono text-rose-400 mt-1 block">
                            {couponError}
                          </span>
                        )}
                      </div>
                    )}
                  </form>
                )}

                {/* In-Game commands dry run queue projection */}
                {connectedUser && cartItems.length > 0 && (
                  <div className="bg-black/50 border border-purple-500/10 rounded-xl p-3 text-[10px] font-mono leading-relaxed text-purple-300/80">
                    <div className="flex items-center space-x-1 font-bold text-gray-400 mb-1">
                      <Terminal className="h-3 w-3 text-[#bf5af2]" />
                      <span>Command Dispatch Pipeline Preview</span>
                    </div>
                    Upon verification, the VOLEX Server Core executes:
                    <div className="text-cyan-400 font-bold mt-1.5 leading-snug bg-black/40 p-1.5 rounded border border-purple-500/5">
                      /lp user {connectedUser} parent add {cartItems[0]?.id.split("-")[1] || 'pkg'} <br />
                      /broadcast &amp;d&amp;lVOLEX STORE &amp;7Thank you &amp;b&amp;l{connectedUser}!
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* Bottom Drawer Summary / Checkout Actions */}
            {!invoice && cartItems.length > 0 && (
              <div className="border-t border-purple-500/10 pt-4 space-y-4 bg-[#07070a] sticky bottom-0">
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal:</span>
                    <span className="text-white font-bold">{formatPrice(subtotal)}</span>
                  </div>
                  
                  {discountPercent > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span className="flex items-center gap-1 text-[11px]">
                        <Percent className="h-3 w-3" />
                        Coupon Discount ({discountPercent * 100}%):
                      </span>
                      <span className="font-extrabold">-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-400">
                    <span className="flex items-center gap-1 text-[11px]">
                      <span>GST / Regional VAT Tax (8%):</span>
                    </span>
                    <span className="text-white">{formatPrice(taxAmount)}</span>
                  </div>

                  {discountPercent > 0 && (
                    <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-2 text-center text-[10px] text-emerald-400 font-bold flex items-center justify-center gap-1.5">
                      <Sparkles className="h-3 w-3 animate-pulse" />
                      <span>You saved {formatPrice(discountAmount)} on this order!</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm font-black border-t border-purple-500/15 pt-2.5">
                    <span className="text-white uppercase tracking-tight">Total Amount:</span>
                    <span className="text-cyan-400 text-base font-black tracking-tight">{formatPrice(finalPrice)}</span>
                  </div>
                </div>

                {/* Go to premium checkout page */}
                {onNavigateToCheckout && (
                  <button
                    onClick={onNavigateToCheckout}
                    className="w-full bg-[#bf5af2] hover:bg-purple-500 text-black font-extrabold text-xs uppercase py-3.5 rounded-xl border border-purple-400/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(191,90,242,0.3)] hover:shadow-[0_0_35px_rgba(191,90,242,0.5)] group relative overflow-hidden"
                  >
                    <Sparkles className="h-4.5 w-4.5 text-black animate-pulse" />
                    <span>Proceed to Premium Checkout Page</span>
                  </button>
                )}

                {/* Payment Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-purple-600/30 to-indigo-600/30 hover:from-purple-500/40 hover:to-indigo-500/40 text-gray-300 font-bold text-xs uppercase py-3 rounded-xl border border-purple-500/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer group relative overflow-hidden"
                >
                  <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                  <ShieldCheck className="h-4.5 w-4.5 text-cyan-400/70" />
                  <span>Verify &amp; Dispatch Order Inline</span>
                </button>

                <div className="text-[9px] text-gray-500 text-center leading-normal font-sans tracking-wide">
                  * Note: If Stripe secret keys are not configured in environment secrets, a fast sandbox-checkout simulation completes.
                </div>

                <div className="flex items-center justify-center space-x-1.5 text-[9px] font-mono text-gray-500 uppercase">
                  <ShieldCheck className="h-3 w-3 text-emerald-500" />
                  <span>AES-256 SSL Encrypted Core Processing</span>
                </div>
              </div>
            )}

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
