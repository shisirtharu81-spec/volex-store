import React, { useState } from 'react';
import { 
  ShoppingBag, Terminal, ExternalLink, Activity, Sparkles, Sliders, Sun, Moon, 
  Globe, ChevronDown, BookOpen, Compass, HelpCircle, Shield, Key, User, 
  Users, LogOut, ChevronRight, UserPlus, Menu, X, Lock, Check, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ServerStatus } from '../types';

interface NavbarProps {
  serverStatus: ServerStatus | null;
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

type Language = 'EN' | 'ES' | 'DE' | 'HI';

const TRANSLATIONS: Record<Language, any> = {
  EN: { home: "Home", store: "Store Packages", compare: "Rank Comparison", console: "Console Dashboard", login: "Link Character", register: "Register VIP", disconnect: "Disconnect", portal: "Server Portals", gamemodes: "Game Modes", commands: "Useful Commands", langName: "English" },
  ES: { home: "Inicio", store: "Paquetes", compare: "Comparar Rangos", console: "Panel de Control", login: "Vincular Personaje", register: "Registrar VIP", disconnect: "Desconectar", portal: "Portales de Red", gamemodes: "Modos de Juego", commands: "Comandos Útiles", langName: "Español" },
  DE: { home: "Startseite", store: "Store-Pakete", compare: "Rang-Vergleich", console: "Konsolen-Dashboard", login: "Spieler verbinden", register: "VIP Registrieren", disconnect: "Trennen", portal: "Server Portale", gamemodes: "Spielmodi", commands: "Befehle", langName: "Deutsch" },
  HI: { home: "होम", store: "स्टोर पैकेजेस", compare: "रैंक तुलना", console: "कंसोल डैशबोर्ड", login: "आईडी लिंक करें", register: "वीआईपी रजिस्टर", disconnect: "डिस्कनेक्ट", portal: "सर्वर पोर्टल", gamemodes: "गेम मोड्स", commands: "उपयोगी कमांड्स", langName: "हिन्दी" }
};

export const Navbar: React.FC<NavbarProps> = ({
  activeSection, setActiveSection, cartCount, toggleCart, currency, 
  setCurrency, connectedUser, onDisconnect, onConnectDirect, onOpenAuth
}) => {
  const [lang, setLang] = useState<Language>('EN');
  const [themeMode, setThemeMode] = useState<'amethyst' | 'emerald'>('amethyst');
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

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

          {/* Main Nav */}
          <div className="hidden lg:flex items-center space-x-1">
            <button onClick={() => setActiveSection('home')} className="px-4 py-2 text-xs font-bold uppercase text-gray-400 hover:text-white"> {t.home} </button>
            <button onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)} className="flex items-center gap-1 px-4 py-2 text-xs font-bold uppercase text-gray-400 hover:text-white">
              <Compass className="h-3.5 w-3.5" /> {t.portal}
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button onClick={handleToggleTheme} className="p-2 rounded-xl bg-white/5 hover:bg-white/10">
              {themeMode === 'amethyst' ? <Moon className="h-4 w-4 text-purple-400" /> : <Sun className="h-4 w-4 text-amber-400" />}
            </button>
            
            <button onClick={toggleCart} className="relative p-2.5 rounded-xl bg-white/5">
              <ShoppingBag className="h-4 w-4 text-gray-400" />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-cyan-500 text-[8px] flex items-center justify-center text-black font-bold">{cartCount}</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Mega Menu */}
      <AnimatePresence>
        {isMegaMenuOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-purple-500/10 overflow-hidden hidden lg:block">
            <div className="mx-auto max-w-7xl p-8 grid grid-cols-3 gap-8">
              {/* Menu content simplified */}
              <div className="text-gray-400 text-xs">Mega Menu Content here...</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
