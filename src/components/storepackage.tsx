import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Key, Package, Coins } from 'lucide-react'; // Coins icon import kiya

const PACKAGES = [
  { id: 1, name: 'VIP Rank', category: 'RANK', price: '4.99', icon: <Shield size={24} /> },
  { id: 2, name: 'Cosmic Key', category: 'KEY', price: '9.99', icon: <Key size={24} /> },
  { id: 3, name: 'Gladiator Kit', category: 'KIT', price: '0.00', icon: <Package size={24} /> },
  { id: 4, name: 'Lord Rank', category: 'RANK', price: '14.99', icon: <Shield size={24} /> },
  // Yahan Coins add kiye:
  { id: 5, name: '1000 Volex Coins', category: 'COINS', price: '5.00', icon: <Coins size={24} /> },
  { id: 6, name: '5000 Volex Coins', category: 'COINS', price: '20.00', icon: <Coins size={24} /> },
];

export const StorePackages = () => {
  const [filter, setFilter] = useState('ALL');

  const filteredPackages = filter === 'ALL' 
    ? PACKAGES 
    : PACKAGES.filter(p => p.category === filter);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h2 className="text-3xl font-black text-white mb-8">SERVER STORE</h2>
      
      {/* Filter Buttons - 'COINS' yahan add kiya */}
      <div className="flex gap-4 mb-8">
        {['ALL', 'RANK', 'KEY', 'KIT', 'COINS'].map(cat => (
          <button 
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${filter === cat ? 'bg-purple-600' : 'bg-white/5 hover:bg-white/10'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredPackages.map((pkg) => (
            <motion.div 
              key={pkg.id}
              layout
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="bg-[#0e0e0e] border border-purple-500/20 p-6 rounded-2xl"
            >
              <div className="text-purple-400 mb-4">{pkg.icon}</div>
              <h3 className="text-lg font-bold text-white">{pkg.name}</h3>
              <p className="text-[10px] font-black uppercase text-gray-500">{pkg.category}</p>
              <p className="text-2xl font-black text-white mt-4">${pkg.price}</p>
              <button className="w-full mt-6 bg-purple-600 py-2 rounded-lg font-bold hover:bg-purple-500 transition-colors">
                PURCHASE
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
