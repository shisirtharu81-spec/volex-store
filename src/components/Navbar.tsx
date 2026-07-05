import React, { useState } from 'react';
import { 
  ShoppingBag, Terminal, Compass, Shield, User, LogOut, 
  Menu, X, Lock, UserPlus, Sun, Moon, Globe, ChevronDown, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Types definition
type Language = 'EN' | 'ES' | 'DE' | 'HI';

interface NavbarProps {
  serverStatus: any;
  activeSection: string;
  setActiveSection: (sec: string) => void;
  cartCount: number;
  toggleCart: () => void;
  currency: string;
  setCurrency: (curr: string) => void;
  connectedUser: string | null;
  onDisconnect: () => void;
  onConnectDirect?: (username: string) => void;
  onOpenAuth?: () => void;
}

const TRANSLATIONS: Record<Language, any> = {
  EN: { home: "Home", store: "Store Packages", login: "Link Character", register: "Register VIP", disconnect: "Disconnect", portal: "Server Portals", langName: "English" },
  ES: { home: "Inicio", store: "Paquetes", login: "Vincular Personaje", register: "Registrar VIP", disconnect: "Desconectar", portal: "Portales de Red", langName: "Español" },
  DE: { home: "Startseite", store: "Store-Pakete", login: "Spieler verbinden", register: "VIP Registrieren", disconnect: "Trennen", portal: "Server Portale", langName: "Deutsch" },
  HI: { home: "होम", store: "स्टोर पैकेजेस", login: "आईडी लिंक करें", register: "वीआईपी रजिस्टर", disconnect: "डिस्कनेक्ट", portal: "सर्वर पोर्टल", langName: "हिन्दी" }
};

export const Navbar: React.FC<NavbarProps> = ({
  activeSection, setActiveSection, cartCount, toggleCart, currency, 
  setCurrency, connectedUser, onDisconnect, onOpenAuth
}) => {
  const [lang, setLang] = useState<Language>('EN');
  const [themeMode, setThemeMode] = useState<'amethyst' | 'emerald'>('amethyst');
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  
  const t = TRANSLATIONS[lang];

  const handleToggleTheme = () => {
    const nextTheme = themeMode === 'amethyst' ? 'emerald' : 'amethyst';
    setThemeMode(nextTheme);
    const appEl = document.getElementById('app');
    if (appEl) {
      nextTheme === 'emerald' ? appEl.classList.add('theme-emerald') : appEl.classList.remove('theme-emerald');
    }
  };

  return (
    <nav id="volex-navbar" className="sticky top-0 z-50 w-full border-b border-purple-500/10 bg-black/45 backdrop-blur-xl">
      <div className={`h-1 w-full bg-gradient-to-r ${themeMode === 'amethyst' ? 'from-[#bf5af2] to-cyan-500' : 'from-emerald-500 to-teal-400'}`} />
      
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
            <button onClick={() => setActiveSection('home')} className="px-4 py-2.5 text-xs font-bold uppercase text-gray-400 hover:text-white"> {t.home} </button>
            <button onClick={() => setActiveSection('shop')} className="px-4 py-2.5 text-xs font-bold uppercase text-gray-400 hover:text-white"> {t.store} </butto

          {/* Action Controls */}
          <div className="flex items-center gap-3">
            <button onClick={handleToggleTheme} className="p-2 rounded-xl bg-white/5 hover:bg-white/10">
              {themeMode === 'amethyst' ? <Moon className="h-4 w-4 text-purple-400" /> : <Sun className="h-4 w-4 text-amber-400" />}
            </button>
            
            <button onClick={toggleCart} className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10">
              <ShoppingBag className="h-4 w-4 text-gray-400" />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-cyan-500 text-[8px] flex items-center justify-center text-black font-black">{cartCount}</span>}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
