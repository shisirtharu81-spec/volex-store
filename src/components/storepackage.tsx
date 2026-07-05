import React from 'react';
import { motion } from 'motion/react';
import { Shield, Key, Package, Sparkles } from 'lucide-react';

const PACKAGES = [
  { id: 1, name: 'VIP Rank', category: 'RANK', price: '4.99', icon: <Shield size={24} /> },
  { id: 2, name: 'Cosmic Key', category: 'KEY', price: '9.99', icon: <Key size={24} /> },
  { id: 3, name: 'Gladiator Kit', category: 'KIT', price: '0.00', icon: <Package size={24} /> },
  { id: 4, name: 'Lord Rank', category: 'RANK', price: '14.99', icon: <Sparkles size={24} /> },
];

export const StorePackages = () => {
  return (
    <div className="max-w-6xl mx-auto p-8 py-20">
      <h2 className="text-4xl font-black text-white mb-12 uppercase tracking-tighter">
        Store <span className="text-purple-500">Packages</span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PACKAGES.map((pkg) => (
          <motion.div 
            key={pkg.id}
            whileHover={{ y: -10 }}
            className="bg-[#0e0e0e] border border-purple-500/20 p-6 rounded-2xl hover:border-purple-500/50 transition-all cursor-pointer"
          >
            <div className="text-purple-400 mb-4">{pkg.icon}</div>
            <h3 className="text-lg font-bold text-white">{pkg.name}</h3>
            <p className="text-[10px] font-black uppercase text-gray-500 mt-1">{pkg.category}</p>
            <p className="text-2xl font-black text-white mt-4">${pkg.price}</p>
            <button className="w-full mt-6 bg-white/5 hover:bg-purple-600 py-3 rounded-xl font-bold transition-colors">
              PURCHASE
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
