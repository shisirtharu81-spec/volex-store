import React, { useState } from 'react';
import { ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem } from '../types';

interface CheckoutPageProps {
  cartItems: CartItem[];
  onClearCart: () => void;
  connectedUser: string | null;
  setActiveSection: (section: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  cartItems,
  onClearCart,
  connectedUser,
  setActiveSection
}) => {
  const [ignUsername, setIgnUsername] = useState(connectedUser || '');
  const [checkoutStep, setCheckoutStep] = useState<'form' | 'loading' | 'success'>('form');

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ignUsername.trim()) {
      alert("Please enter your IGN Username.");
      return;
    }
    setCheckoutStep('loading');
    await new Promise(resolve => setTimeout(resolve, 2000));
    setCheckoutStep('success');
    onClearCart();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 text-white">
      <button 
        onClick={() => setActiveSection('home')} 
        className="flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Shop
      </button>

      <AnimatePresence mode="wait">
        {checkoutStep === 'form' && (
          <motion.form 
            key="form" 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onSubmit={handleCheckoutSubmit} 
            className="space-y-6"
          >
            <div className="bg-black/40 border border-purple-500/20 p-6 rounded-2xl">
              <label className="block text-sm font-bold mb-2 uppercase text-gray-400">IGN Username</label>
              <input 
                value={ignUsername} 
                onChange={e => setIgnUsername(e.target.value)} 
                placeholder="Enter your Minecraft username" 
                className="w-full bg-[#0a0a0c] border border-purple-500/30 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500" 
              />
            </div>

            <div className="bg-black/40 border border-emerald-500/20 p-6 rounded-2xl text-center">
              <h3 className="text-sm font-black text-emerald-400 uppercase mb-4">SCAN TO PAY (FAMPAY)</h3>
              <div className="bg-white p-2 rounded-xl inline-block mb-4">
                <img src="/fampay-qr.png" alt="FamPay QR" className="w-40 h-40 object-contain" />
              </div>
            </div>

            <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 py-4 rounded-xl font-bold uppercase transition-all">
              Verify Payment
            </button>
          </motion.form>
        )}

        {checkoutStep === 'loading' && (
          <motion.div key="loading" className="text-center py-20">
            <Loader2 className="animate-spin text-purple-500 mx-auto mb-4" size={48} />
            <p className="text-lg font-bold">Verifying Transaction...</p>
          </motion.div>
        )}

        {/* Success State with Discord Button */}
        {checkoutStep === 'success' && (
          <motion.div 
            key="success" 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="text-center py-10 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-6"
          >
            <CheckCircle2 className="text-emerald-400 mx-auto mb-4" size={48} />
            <h3 className="text-2xl font-black mb-2">Payment Confirmed!</h3>
            <p className="text-gray-400 mb-6">Your items will be dispatched to {ignUsername} shortly.</p>
            
            {/* Yaha add kar diya Discord button */}
            <a 
              href="https://discord.gg/N23qcXWWTZ" 
              target="_blank" 
              rel="noreferrer"
              className="inline-block bg-[#5865F2] hover:bg-[#4752C4] px-8 py-3 rounded-xl font-bold uppercase text-sm transition-all"
            >
              Join Discord to Claim
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};