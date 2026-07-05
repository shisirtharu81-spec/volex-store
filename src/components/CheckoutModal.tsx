import React, { useState } from 'react';
import { X, Trash2, ShieldCheck, Terminal, CheckCircle, ShoppingBag, Plus, Minus, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem } from '../types';

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
  onUpdateQuantity
}) => {
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<string>('');
  const [invoice, setInvoice] = useState<any | null>(null);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const taxRate = 0.08;
  const taxAmount = parseFloat((subtotal * taxRate).toFixed(2));
  const finalPrice = parseFloat((subtotal + taxAmount).toFixed(2));

  const handleCheckout = async () => {
    if (!connectedUser) {
      onConnectPrompt();
      return;
    }

    setCheckingOut(true);
    
    const steps = [
      'Establishing SSL Connection...',
      'Verifying UUID...',
      'Securing one-time token...',
      'Processing Stripe Payment...',
      'Finalizing...'
    ];

    for (const step of steps) {
      setCheckoutStep(step);
      await new Promise((resolve) => setTimeout(resolve, 400));
    }

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: connectedUser,
          items: cartItems,
          paymentMethod: 'stripe'
        })
      });
      const data = await response.json();

      if (data.success) {
        if (data.redirectUrl) {
          window.location.href = data.redirectUrl;
          return;
        }
        setInvoice({ id: data.transaction.id, amount: finalPrice });
        onClearCart();
      }
    } catch (err) {
      console.error(err);
      alert('Checkout failed.');
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={onClose} />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="relative w-full max-w-md h-full bg-[#07070a] border-l border-purple-500/15 p-6 flex flex-col">
            
            <div className="flex items-center justify-between border-b border-purple-500/10 pb-4">
              <h2 className="text-lg font-black text-white">Your Cart</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="h-5 w-5" /></button>
            </div>

            {invoice ? (
              <div className="flex-grow flex flex-col items-center justify-center">
                <CheckCircle className="h-16 w-16 text-emerald-500" />
                <h3 className="text-xl font-bold mt-4">Payment Successful!</h3>
                <button onClick={onClose} className="mt-6 bg-emerald-600 px-6 py-2 rounded-lg">Continue</button>
              </div>
            ) : checkingOut ? (
              <div className="flex-grow flex flex-col items-center justify-center">
                <div className="h-12 w-12 border-4 border-purple-500 border-t-transparent animate-spin rounded-full"></div>
                <p className="mt-4 text-sm text-purple-400">{checkoutStep}</p>
              </div>
            ) : (
              <div className="flex-grow overflow-y-auto py-4 space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-black/40 border border-purple-500/10 rounded-xl">
                    <div>
                      <h4 className="text-sm font-bold">{item.name}</h4>
                      <p className="text-xs text-gray-400">{formatPrice(item.price)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => onUpdateQuantity?.(item.id, item.quantity - 1)} className="p-1"><Minus className="h-3 w-3" /></button>
                      <span className="text-xs">{item.quantity}</span>
                      <button onClick={() => onUpdateQuantity?.(item.id, item.quantity + 1)} className="p-1"><Plus className="h-3 w-3" /></button>
                      <button onClick={() => onRemoveItem(item.id)} className="ml-2 text-rose-500"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                ))}
                
                <div className="pt-4 border-t border-purple-500/10 mt-auto">
                  <div className="flex justify-between text-sm font-bold">
                    <span>Total</span>
                    <span>{formatPrice(finalPrice)}</span>
                  </div>
                  <button onClick={handleCheckout} className="w-full mt-4 bg-purple-600 hover:bg-purple-500 py-3 rounded-xl font-bold transition-all">
                    Pay Now
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
