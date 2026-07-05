import React, { useState } from 'react';
import { 
  ShoppingBag, Sun, Moon
} from 'lucide-react';
import { motion } from 'motion/react';

export const Navbar: React.FC<any> = ({
  setActiveSection, cartCount, toggleCart, handleToggleTheme, themeMode, t
}) => {
  return (
    <nav id="volex-navbar" className="sticky top-0 z-50 w-full border-b border-purple-500/10 bg-black/45 backdrop-blur-xl">
      <div className={`h-1 w-full bg-gradient-to-r ${themeMode === 'emerald' ? 'from-emerald-500 to-teal-400' : 'from-[#bf5af2] to-cyan-500'}`} />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between">
          
          {/* Logo */}
          <div onClick={() => setActiveSection('home')} className="flex cursor-pointer items-center space-x-2.5 group">
            <div className="relative h-10 w-10 flex items-center justify-center rounded-xl border border-white/5 bg-[#0c0c0e]">
              <span className={`text-xl font-black ${themeMode === 'emerald' ? 'text-emerald-400' : 'text-[#bf5af2]'}`}>V</span>
            </div>
            <span className="text-xl font-black text-white">VOLEX</span>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center space-x-1.5">
            <button onClick={() => setActiveSection('home')} className="px-4 py-2.5 text-xs font-bold uppercase text-gray-400 hover:text-white transition-colors"> 
              {t.home} 
            </button>
            <button onClick={() => setActiveSection('shop')} className="px-4 py-2.5 text-xs font-bold uppercase text-gray-400 hover:text-white transition-colors"> 
              {t.store} 
            </button>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-3">
            <button onClick={handleToggleTheme} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
              {themeMode === 'amethyst' ? <Moon className="h-4 w-4 text-purple-400" /> : <Sun className="h-4 w-4 text-amber-400" />}
            </button>
            
            <button onClick={toggleCart} className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
              <ShoppingBag className="h-4 w-4 text-gray-400" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-cyan-500 text-[8px] flex items-center justify-center text-black font-black">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
