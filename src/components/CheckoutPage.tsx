import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  ShoppingBag, 
  Tag, 
  Trash2, 
  Plus, 
  Minus, 
  Percent, 
  ShieldCheck, 
  Sparkles, 
  ArrowLeft, 
  Globe, 
  Coins, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  Terminal, 
  Copy, 
  ChevronRight, 
  FileText, 
  RefreshCw, 
  HelpCircle,
  QrCode,
  DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, StoreItem } from '../types';

interface CheckoutPageProps {
  cartItems: CartItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, qty: number) => void;
  onClearCart: () => void;
  formatPrice: (price: number) => string;
  connectedUser: string | null;
  onConnectUser: (username: string) => void;
  setActiveSection: (section: string) => void;
}

type PaymentMethodType = 'upi | fampay';
type CheckoutStepType = 'form' | 'loading' | 'success' | 'failed';

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  cartItems,
  onRemoveItem,
  onUpdateQuantity,
  onClearCart,
  formatPrice,
  connectedUser,
  onConnectUser,
  setActiveSection
}) => {
  // Input fields
  const [username, setUsername] = useState(connectedUser || '');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateRegion, setStateRegion] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('United States');

  // Coupon handling
  const [coupon, setCoupon] = useState('');
  const [activeCoupon, setActiveCoupon] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');

  // Payment methods
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('stripe');
  
  // State engine
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStepType>('form');
  const [loadingMessage, setLoadingMessage] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [failedReason, setFailedReason] = useState('');

  // Simulated results
  const [invoice, setInvoice] = useState<{
    id: string;
    username: string;
    email: string;
    total: number;
    discount: number;
    taxes: number;
    paymentMethod: string;
    date: string;
    transactionHash: string;
    commandsExecuted: string[];
  } | null>(null);

  const [copiedWallet, setCopiedWallet] = useState(false);

  // Sync state if connected user shifts
  useEffect(() => {
    if (connectedUser) {
      setUsername(connectedUser);
    }
  }, [connectedUser]);

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = parseFloat((subtotal * discountPercent).toFixed(2));
  const taxRate = 0.08; // 8% Regional GST/VAT Tax
  const taxAmount = parseFloat(((subtotal - discountAmount) * taxRate).toFixed(2));
  const finalPrice = Math.max(0, parseFloat((subtotal - discountAmount + taxAmount).toFixed(2)));

  // Coupon handling
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

  // Run secure checkout process with animations & sequences
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      alert("Please provide your Minecraft Character Username.");
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      alert("Please provide a valid contact Email address.");
      return;
    }

    // Set connection context if not connected
    if (!connectedUser) {
      onConnectUser(username.trim());
    }

    setCheckoutStep('loading');
    setLoadingProgress(0);

    // Dynamic sequence based on paymentMethod
    const sequence = [
      { text: 'Securing point-to-point SSL nodes...', delay: 500, prog: 15 },
      { text: `Querying Mojang UUID API registers for player: "${username}"...`, delay: 700, prog: 35 },
      { text: 'Verifying LuckPerms permissions compatibility levels...', delay: 500, prog: 50 },
      { text: `Initiating gateway handshake via secure ${paymentMethod.toUpperCase()} pipeline...`, delay: 600, prog: 70 },
      { text: 'Generating transaction hash block and ledger payload...', delay: 500, prog: 85 },
      { text: 'Awaiting webhook authorization confirm from secure backend servers...', delay: 800, prog: 100 }
    ];

    for (const step of sequence) {
      setLoadingMessage(step.text);
      setLoadingProgress(step.prog);
      await new Promise(resolve => setTimeout(resolve, step.delay));
    }

    // Introduce a random failure rate to showcase the Failed Payment state (e.g. 15% rate if username is 'fail' or just small chance)
    const isMockFailure = username.toLowerCase() === 'fail' || username.toLowerCase() === 'error';
    
    if (isMockFailure) {
      setFailedReason(
        paymentMethod === 'stripe' ? 'The credit card session was declined by the bank network (3D-Secure Code: 402).' :
        paymentMethod === 'paypal' ? 'PayPal Express authorization token has expired or user terminated session.' :
        paymentMethod === 'crypto' ? 'Gas threshold limit fell below block confirmation boundaries (Gas out error).' :
        'Server integration endpoint responded with error 502 Bad Gateway.'
      );
      setCheckoutStep('failed');
      return;
    }

    // Generate simulated in-game commands
    const cmds: string[] = [];
    cartItems.forEach(item => {
      const qty = item.quantity;
      if (item.id.includes('rank')) {
        const tier = item.id.split('-')[1] || 'vip';
        cmds.push(`/lp user ${username} parent add ${tier}`);
      } else if (item.id.includes('key')) {
        const type = item.id.split('-')[1] || 'mythic';
        cmds.push(`/crate give physical ${type} ${qty} ${username}`);
      } else if (item.id.includes('coin')) {
        cmds.push(`/coins add ${username} 5000`);
      } else {
        cmds.push(`/lp user ${username} parent add custom`);
      }
      cmds.push(`/broadcast &d&lVOLEX STORE &7Thank you &b&l${username} &7for purchasing &f&l${item.name} &7x${qty}!`);
    });

    // Create Invoice state
    const generatedTxId = `${paymentMethod.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 9)}`;
    const txHash = '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('');

    setInvoice({
      id: generatedTxId,
      username,
      email,
      total: finalPrice,
      discount: discountAmount,
      taxes: taxAmount,
      paymentMethod: paymentMethod,
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      transactionHash: txHash,
      commandsExecuted: cmds
    });

    // Clear cart in main component state
    onClearCart();
    setCheckoutStep('success');
  };

  const copyToClipboard = (text: string, isWallet: boolean = false) => {
    navigator.clipboard.writeText(text);
    if (isWallet) {
      setCopiedWallet(true);
      setTimeout(() => setCopiedWallet(false), 2000);
    } else {
      alert("Copied to clipboard!");
    }
  };

  return (
    <div id="premium-checkout-panel" className="space-y-8 animate-fade-in relative z-10 text-white">
      
      {/* 1. TOP HEADER SUMMARY */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-purple-500/10 pb-6">
        <div>
          <button 
            onClick={() => setActiveSection('home')}
            className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-mono font-bold uppercase mb-2 cursor-pointer transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Home Shop
          </button>
          <h2 className="text-3xl font-black text-white font-sans tracking-tight flex items-center gap-2">
            SECURE PREMIUM CHECKOUT
            <span className="text-[9px] font-mono font-bold text-[#bf5af2] bg-[#bf5af2]/10 border border-[#bf5af2]/30 px-2.5 py-0.5 rounded-full uppercase">
              SSL Verified
            </span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Complete your server rewards purchase securely. Selected items will be immediately dispatched in-game.
          </p>
        </div>

        {/* Stepper info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className={`h-2.5 w-2.5 rounded-full ${checkoutStep === 'form' ? 'bg-[#bf5af2]' : 'bg-gray-700'}`}></span>
            <span className="text-gray-400">1. Details</span>
            <span className="text-gray-600">/</span>
            <span className={`h-2.5 w-2.5 rounded-full ${checkoutStep === 'loading' ? 'bg-[#bf5af2] animate-pulse' : 'bg-gray-700'}`}></span>
            <span className="text-gray-400">2. Authorization</span>
            <span className="text-gray-600">/</span>
            <span className={`h-2.5 w-2.5 rounded-full ${checkoutStep === 'success' ? 'bg-emerald-400' : checkoutStep === 'failed' ? 'bg-rose-500' : 'bg-gray-700'}`}></span>
            <span className="text-gray-400">3. Finish</span>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        
{/* VIEW 1: CHECKOUT FORM AND SUMMARY */}
        {checkoutStep === 'form' && (
          <motion.div 
            key="checkout-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* LEFT COLUMN: Simplified Checkout */}
            <form onSubmit={handleCheckoutSubmit} className="lg:col-span-7 space-y-6">
              
              <div className="rounded-2xl border border-purple-500/10 bg-black/40 p-6 space-y-4 backdrop-blur-md">
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Character Identity</h3>
                <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Minecraft Username *</label>
                <input
                  type="text"
                  required
                  placeholder="Enter your exact username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-purple-500/10 text-white rounded-xl px-4 py-3 text-xs focus:outline-none font-mono"
                />
              </div>

              {/* FamPay & Discord Section */}
              <div className="rounded-2xl border border-emerald-500/20 bg-black/40 p-6 text-center space-y-4">
                <h3 className="text-sm font-black text-emerald-400 uppercase">Payment & Claim</h3>
                <div className="bg-white p-2 rounded-xl inline-block">
                  <img src="YOUR_FAMPAY_QR_LINK_HERE" alt="FamPay QR" className="w-40 h-40" />
                </div>
                <p className="text-xs text-gray-400">Scan to pay. Then join Discord to create a ticket with your transaction ID.</p>
                
                <a 
                  href="https://discord.gg/N23qcXWWTZ" 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full py-4 bg-indigo-600 rounded-xl flex items-center justify-center gap-2 font-bold text-sm hover:bg-indigo-500 transition-all"
                >
                  Join Discord to Claim Item
                </a>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-sm uppercase tracking-wider"
              >
                Verify Payment & Complete
              </button>
            </form>

            {/* RIGHT COLUMN: Keep your existing Summary logic here */}
            <div className="lg:col-span-5">
              {/* Apka purana summary box code yahan rahega */}
            </div>
          </motion.div>
        )}

            </form>

            {/* RIGHT COLUMN: Order Summary Box */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="rounded-2xl border border-purple-500/10 bg-black/40 p-6 space-y-4 backdrop-blur-md relative overflow-hidden">
                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-purple-500/5 blur-2xl"></div>

                <div className="flex items-center justify-between border-b border-purple-500/5 pb-3">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-[#bf5af2]" />
                    <h3 className="text-sm font-black font-sans uppercase tracking-wider text-white">Order Summary</h3>
                  </div>
                  <span className="text-[10px] font-mono text-gray-400 font-bold bg-white/5 border border-white/5 px-2 py-0.5 rounded-full">
                    {cartItems.reduce((sum, i) => sum + i.quantity, 0)} Items
                  </span>
                </div>

                {/* Cart Items List */}
                {cartItems.length === 0 ? (
                  <div className="text-center py-10 space-y-3">
                    <p className="text-xs text-gray-500 font-mono">Your shopping cart is currently empty.</p>
                    <button
                      onClick={() => setActiveSection('shop')}
                      className="text-xs text-[#bf5af2] hover:underline cursor-pointer"
                    >
                      Browse Store Packages
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2 divide-y divide-purple-500/5">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center pt-3 first:pt-0 gap-4">
                        <div className="space-y-1">
                          <h4 className="text-xs font-black text-white">{item.name}</h4>
                          <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono">
                            <span className="text-purple-400 uppercase font-bold text-[8px] border border-purple-500/20 px-1 py-0.2 rounded bg-[#bf5af2]/5">
                              {item.category}
                            </span>
                            <span>{formatPrice(item.price)} each</span>
                          </div>
                        </div>

                        {/* Quantity and Actions */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border border-purple-500/10 bg-black/50 rounded-lg">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="p-1 hover:text-white text-gray-500 cursor-pointer"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-2 text-[10px] font-mono text-cyan-400 font-bold">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:text-white text-gray-500 cursor-pointer"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.id)}
                            className="text-gray-500 hover:text-rose-400 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Coupon Input */}
                {cartItems.length > 0 && (
                  <form onSubmit={handleApplyCoupon} className="border-t border-purple-500/10 pt-4">
                    {activeCoupon ? (
                      <div className="flex items-center justify-between rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-2.5 text-xs text-emerald-400 font-mono">
                        <span className="flex items-center gap-1.5 font-bold">
                          <Tag className="h-3.5 w-3.5" />
                          COUPON "{activeCoupon}" ACTIVATED
                        </span>
                        <button 
                          type="button"
                          onClick={handleRemoveCoupon}
                          className="hover:text-white font-bold cursor-pointer text-[10px] bg-emerald-500/20 px-2.5 py-0.5 rounded"
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
                            className="flex-grow bg-[#0a0a0c] border border-purple-500/10 focus:border-purple-500/30 text-white placeholder-gray-500 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none"
                          />
                          <button
                            type="submit"
                            disabled={!coupon.trim()}
                            className="bg-[#bf5af2] hover:bg-purple-500 text-black text-[10px] font-extrabold uppercase px-4 rounded-xl cursor-pointer transition-colors disabled:opacity-50"
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

                {/* Sub-total Breakdown */}
                {cartItems.length > 0 && (
                  <div className="border-t border-purple-500/10 pt-4 space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between text-gray-400">
                      <span>Subtotal:</span>
                      <span className="text-white font-bold">{formatPrice(subtotal)}</span>
                    </div>

                    {discountPercent > 0 && (
                      <div className="flex justify-between text-emerald-400">
                        <span className="flex items-center gap-1 text-[11px]">
                          <Percent className="h-3 w-3" />
                          Promo Discount ({discountPercent * 100}%):
                        </span>
                        <span className="font-extrabold">-{formatPrice(discountAmount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-gray-400">
                      <span>Regional VAT Tax (8%):</span>
                      <span className="text-white">{formatPrice(taxAmount)}</span>
                    </div>

                    {discountPercent > 0 && (
                      <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-2.5 text-center text-[10px] text-emerald-400 font-bold flex items-center justify-center gap-1.5">
                        <Sparkles className="h-3 w-3 animate-pulse" />
                        <span>You saved {formatPrice(discountAmount)} on this order!</span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm font-black border-t border-purple-500/15 pt-2.5">
                      <span className="text-white uppercase tracking-tight">Total Payment:</span>
                      <span className="text-cyan-400 text-base font-black tracking-tight">{formatPrice(finalPrice)}</span>
                    </div>
                  </div>
                )}

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-1.5 text-[9px] font-mono text-gray-500 uppercase border-t border-purple-500/10 pt-3">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  <span>256-Bit SSL Secured Server Ledger</span>
                </div>

              </div>

            </div>
          </motion.div>
        )}

        {/* VIEW 2: LOADING AND AUTHORIZATION PROGRESS ANIMATION */}
        {checkoutStep === 'loading' && (
          <motion.div 
            key="checkout-loading"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-xl mx-auto rounded-2xl border border-purple-500/20 bg-black/60 p-8 text-center space-y-6 backdrop-blur-xl relative overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500"></div>
            
            {/* Elegant glowing loader */}
            <div className="relative h-20 w-20 mx-auto flex items-center justify-center">
              <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-purple-600 to-cyan-400 opacity-60 blur-md animate-pulse"></div>
              <div className="relative h-16 w-16 rounded-full bg-[#0a0a0c] flex items-center justify-center border border-white/10">
                <Loader2 className="h-8 w-8 text-[#bf5af2] animate-spin" />
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono font-black text-[#bf5af2] uppercase tracking-widest block animate-pulse">
                GATEWAY PROCESS ACTIVE
              </span>
              <h3 className="text-xl font-black font-sans text-white tracking-tight">
                Authorizing Transaction...
              </h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                Please do not close this browser node or exit the session frame. Contacting banking ledger networks.
              </p>
            </div>

            {/* Dynamic Status Text and progress bar */}
            <div className="space-y-2.5">
              <div className="bg-black/60 rounded-xl p-3 border border-purple-500/5 text-left flex items-center gap-2.5">
                <Terminal className="h-3.5 w-3.5 text-cyan-400 flex-shrink-0 animate-pulse" />
                <span className="font-mono text-[10px] text-cyan-400 leading-snug">{loadingMessage}</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full rounded-full"
                  animate={{ width: `${loadingProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW 3: PAYMENT SUCCESS PAGE */}
        {checkoutStep === 'success' && invoice && (
          <motion.div 
            key="checkout-success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-2xl mx-auto space-y-6"
          >
            {/* Visual celebration block */}
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/5 p-8 text-center space-y-4 backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-400"></div>
              <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-emerald-500/5 blur-3xl"></div>

              <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <CheckCircle2 className="h-8 w-8 animate-bounce" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono font-black text-emerald-400 uppercase tracking-widest block">ORDER DISPATCH CONFIRMED</span>
                <h3 className="text-2xl font-black font-sans text-white tracking-tight">Payment Completed Successfully!</h3>
                <p className="text-xs text-gray-400 max-w-lg mx-auto leading-relaxed">
                  Excellent! Your digital goods have been validated. The VOLEX Server Core has automatically received the callback webhooks and started permission dispatch queues.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setActiveSection('home')}
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-xl font-bold text-xs uppercase cursor-pointer transition-all"
                >
                  Return to Lobby
                </button>
                <button
                  onClick={() => setActiveSection('dashboard')}
                  className="px-5 py-2.5 bg-[#bf5af2] hover:bg-purple-500 text-black font-black text-xs uppercase rounded-xl cursor-pointer transition-all shadow-[0_0_15px_rgba(191,90,242,0.2)]"
                >
                  Open User Dashboard
                </button>
              </div>
            </div>

            {/* Complete Invoice details receipt */}
            <div className="rounded-2xl border border-purple-500/10 bg-black/40 p-6 space-y-4 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-purple-500/5 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4.5 w-4.5 text-cyan-400" />
                  <h4 className="text-xs font-black font-sans uppercase tracking-wider text-white">Digital Receipt Ledger</h4>
                </div>
                <span className="text-[9px] font-mono text-gray-500 font-bold select-all">
                  REF: {invoice.id}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono text-gray-400">
                <div>
                  <span className="text-[9px] text-gray-500 block uppercase mb-0.5">MC USERNAME</span>
                  <span className="text-white font-bold">{invoice.username}</span>
                </div>
                <div>
                  <span className="text-[9px] text-gray-500 block uppercase mb-0.5">EMAIL ID</span>
                  <span className="text-white font-bold truncate block" title={invoice.email}>{invoice.email}</span>
                </div>
                <div>
                  <span className="text-[9px] text-gray-500 block uppercase mb-0.5">DATE OF ORDER</span>
                  <span className="text-white font-bold">{invoice.date}</span>
                </div>
                <div>
                  <span className="text-[9px] text-gray-500 block uppercase mb-0.5">PAY CHANNEL</span>
                  <span className="text-[#bf5af2] font-black uppercase">{invoice.paymentMethod}</span>
                </div>
              </div>

              {/* Server Execution Outputs console block */}
              <div className="bg-black/80 border border-purple-500/10 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-[9px] font-mono font-black text-purple-400 uppercase">
                    <Terminal className="h-3 w-3 animate-pulse" />
                    <span>In-Game Console Dispatch Stream</span>
                  </div>
                  <span className="text-[8px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                    COMPLETED SYNC
                  </span>
                </div>

                <div className="font-mono text-[10px] leading-relaxed text-gray-300 bg-black/40 p-2.5 rounded border border-purple-500/5 space-y-1">
                  {invoice.commandsExecuted.map((cmd, idx) => (
                    <div key={idx} className="flex gap-2 text-cyan-300 font-bold">
                      <span className="text-gray-500 font-normal">[{idx + 1}]</span>
                      <span>{cmd}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transaction Hash */}
              <div className="bg-white/2 rounded-xl p-3 border border-white/5 flex items-center justify-between text-[10px] font-mono">
                <div className="truncate pr-4">
                  <span className="text-gray-500 block uppercase text-[8px] mb-0.5">BLOCKCHAIN TRANSACTION HASH</span>
                  <span className="text-gray-400 truncate select-all block">{invoice.transactionHash}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(invoice.transactionHash)}
                  className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-white font-bold uppercase tracking-wider text-[8px] cursor-pointer transition-colors"
                >
                  Copy hash
                </button>
              </div>

            </div>
          </motion.div>
        )}

        {/* VIEW 4: PAYMENT FAILED PAGE */}
        {checkoutStep === 'failed' && (
          <motion.div 
            key="checkout-failed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-xl mx-auto rounded-2xl border border-rose-500/20 bg-rose-950/5 p-8 text-center space-y-6 backdrop-blur-xl relative overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-1.5 bg-rose-500"></div>
            
            <div className="h-16 w-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
              <XCircle className="h-8 w-8 animate-pulse" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono font-black text-rose-400 uppercase tracking-widest block">PAYMENT SESSION TERMINATED</span>
              <h3 className="text-2xl font-black font-sans text-white tracking-tight">Transaction Declined</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                The banking network or gateway provider failed to clear the balance request. Please check funds and details.
              </p>
            </div>

            {/* Error Detail description */}
            <div className="bg-black/40 border border-rose-500/15 rounded-xl p-4 text-left space-y-1.5">
              <span className="text-[8px] font-mono font-black text-rose-400 uppercase tracking-widest block">TERMINAL LOG OUTPUT:</span>
              <p className="font-mono text-[10px] text-gray-300 leading-normal">
                {failedReason}
              </p>
            </div>

            {/* Quick Actions to retry */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setCheckoutStep('form')}
                className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs uppercase rounded-xl cursor-pointer transition-all shadow-[0_0_15px_rgba(239,68,68,0.2)]"
              >
                Change details &amp; Retry
              </button>
              <button
                onClick={() => {
                  setPaymentMethod('stripe');
                  setUsername(connectedUser || '');
                  setCheckoutStep('form');
                }}
                className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-xl font-bold text-xs uppercase cursor-pointer transition-all"
              >
                Reset Checkout Method
              </button>
            </div>

          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
};
