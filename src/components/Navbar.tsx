import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Terminal, 
  ExternalLink, 
  Activity, 
  Sparkles, 
  Sliders, 
  Sun, 
  Moon, 
  Globe, 
  ChevronDown, 
  BookOpen, 
  Compass, 
  HelpCircle, 
  Shield, 
  Key, 
  User,
  Users, 
  LogOut, 
  ChevronRight, 
  UserPlus, 
  Menu, 
  X,
  Lock,
  Copy,
  Check,
  Award
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
  // Dynamic linking helper to connect directly from the navbar login popover
  onConnectDirect?: (username: string) => void;
  onOpenAuth?: () => void;
}

type Language = 'EN' | 'ES' | 'DE' | 'HI';

const TRANSLATIONS = {
  EN: {
    home: "Home",
    store: "Store Packages",
    compare: "Rank Comparison",
    console: "Console Dashboard",
    login: "Link Character",
    register: "Register VIP",
    online: "ONLINE",
    currency: "Currency",
    cart: "Cart",
    wiki: "Wiki Portal",
    gamemodes: "Game Modes",
    commands: "Useful Commands",
    help: "Help Desk",
    connectedAs: "Connected as",
    disconnect: "Disconnect",
    portal: "Server Portals",
    explore: "Explore Wiki",
    characterName: "Character Name",
    connectButton: "Connect Character",
    placeholderUser: "e.g. Notch",
    registerTitle: "Register VIP Account",
    registerDesc: "Simulate a VIP registration to unlock server flight privileges and monthly cosmic crates.",
    registerAction: "Generate VIP Pass",
    langName: "English"
  },
  ES: {
    home: "Inicio",
    store: "Paquetes",
    compare: "Comparar Rangos",
    console: "Panel de Control",
    login: "Vincular Personaje",
    register: "Registrar VIP",
    online: "EN LÍNEA",
    currency: "Moneda",
    cart: "Carrito",
    wiki: "Portal Wiki",
    gamemodes: "Modos de Juego",
    commands: "Comandos Útiles",
    help: "Soporte Técnico",
    connectedAs: "Conectado como",
    disconnect: "Desconectar",
    portal: "Portales de Red",
    explore: "Explorar Wiki",
    characterName: "Nombre de Personaje",
    connectButton: "Vincular Personaje",
    placeholderUser: "ej. Notch",
    registerTitle: "Registrar Cuenta VIP",
    registerDesc: "Simula un registro VIP para desbloquear privilegios de vuelo y cajas cósmicas mensuales.",
    registerAction: "Generar Pase VIP",
    langName: "Español"
  },
  DE: {
    home: "Startseite",
    store: "Store-Pakete",
    compare: "Rang-Vergleich",
    console: "Konsolen-Dashboard",
    login: "Spieler verbinden",
    register: "VIP Registrieren",
    online: "ONLINE",
    currency: "Währung",
    cart: "Warenkorb",
    wiki: "Wiki-Portal",
    gamemodes: "Spielmodi",
    commands: "Befehle",
    help: "Hilfe-Center",
    connectedAs: "Verbunden als",
    disconnect: "Trennen",
    portal: "Server Portale",
    explore: "Wiki erkunden",
    characterName: "Spielername",
    connectButton: "Spieler Verbinden",
    placeholderUser: "z.B. Notch",
    registerTitle: "VIP-Konto registrieren",
    registerDesc: "Simuliere eine VIP-Registrierung, um Flugrechte und monatliche Kosmische Kisten freizuschalten.",
    registerAction: "VIP-Pass generieren",
    langName: "Deutsch"
  },
  HI: {
    home: "होम",
    store: "स्टोर पैकेजेस",
    compare: "रैंक तुलना",
    console: "कंसोल डैशबोर्ड",
    login: "आईडी लिंक करें",
    register: "वीआईपी रजिस्टर",
    online: "ऑनलाइन",
    currency: "मुद्रा",
    cart: "कार्ट",
    wiki: "विकिपीडिया",
    gamemodes: "गेम मोड्स",
    commands: "उपयोगी कमांड्स",
    help: "सहायता डेस्क",
    connectedAs: "कनेक्टेड हैं",
    disconnect: "डिस्कनेक्ट",
    portal: "सर्वर पोर्टल",
    explore: "विकी अन्वेषण",
    characterName: "पात्र का नाम",
    connectButton: "आईडी जोड़ें",
    placeholderUser: "जैसे Notch",
    registerTitle: "वीआईपी खाता पंजीकरण",
    registerDesc: "सर्वर उड़ान विशेषाधिकारों और मासिक ब्रह्मांडीय क्रेटों को अनलॉक करने के लिए एक वीआईपी पंजीकरण का अनुकरण करें।",
    registerAction: "वीआईपी पास बनाएं",
    langName: "हिन्दी"
  }
};

export const Navbar: React.FC<NavbarProps> = ({
  serverStatus,
  activeSection,
  setActiveSection,
  cartCount,
  toggleCart,
  currency,
  setCurrency,
  connectedUser,
  onDisconnect,
  onConnectDirect,
  onOpenAuth
}) => {
  // Navigation states
  const [lang, setLang] = useState<Language>('EN');
  const [themeMode, setThemeMode] = useState<'amethyst' | 'emerald'>('amethyst');
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Quick form state inside navbar
  const [quickUsername, setQuickUsername] = useState('');
  const [registerInput, setRegisterInput] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [themeChangeNotify, setThemeChangeNotify] = useState<string | null>(null);

  const t = TRANSLATIONS[lang];

  // Sync theme changes with body tags for a real immersive shift!
  const handleToggleTheme = () => {
    const nextTheme = themeMode === 'amethyst' ? 'emerald' : 'amethyst';
    setThemeMode(nextTheme);
    
    // Apply dynamic body highlights or dataset styling
    const appEl = document.getElementById('app');
    if (appEl) {
      if (nextTheme === 'emerald') {
        appEl.classList.add('theme-emerald');
        appEl.style.setProperty('--primary-glow', '#10b981');
        setThemeChangeNotify('CYBERPUNK EMERALD ACTIVATED');
      } else {
        appEl.classList.remove('theme-emerald');
        appEl.style.setProperty('--primary-glow', '#bf5af2');
        setThemeChangeNotify('ABYSSAL AMETHYST ACTIVATED');
      }
    }
    setTimeout(() => setThemeChangeNotify(null), 3000);
  };

  // Perform quick account link from navbar
  const handleQuickLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickUsername.trim()) return;
    
    // Trigger either direct connector or general mock dispatch
    if (onConnectDirect) {
      onConnectDirect(quickUsername.trim());
    } else {
      // Dispatch event to allow App.tsx level listener or simulate direct login hook
      const lookupBtn = document.querySelector('#lookup-username-input') as HTMLInputElement;
      if (lookupBtn) {
        lookupBtn.value = quickUsername.trim();
        const lookupForm = document.querySelector('#lookup-gateway-form') as HTMLFormElement;
        if (lookupForm) {
          lookupForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
      }
    }
    
    setIsLoginDropdownOpen(false);
    setQuickUsername('');
  };

  // Perform mock VIP registration
  const handleSimulateRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerInput.trim()) return;
    setRegisterSuccess(true);
    setTimeout(() => {
      setRegisterSuccess(false);
      setIsRegisterModalOpen(false);
      setRegisterInput('');
      if (onConnectDirect) {
        onConnectDirect(registerInput.trim());
      }
    }, 1500);
  };

  return (
    <>
      <nav id="volex-navbar" className="sticky top-0 z-50 w-full border-b border-purple-500/10 bg-black/45 backdrop-blur-xl transition-all duration-300">
        
        {/* Decorative dynamic top bar */}
        <div className={`h-1 w-full bg-gradient-to-r transition-all duration-500 ${
          themeMode === 'amethyst' 
            ? 'from-[#bf5af2] via-purple-600 to-cyan-500' 
            : 'from-emerald-500 via-teal-600 to-cyan-400'
        }`} />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-18 items-center justify-between">
            
            {/* 1. BRAND LOGO - With customized spin/scale layout hover animations */}
            <div 
              onClick={() => {
                setActiveSection('home');
                setIsMegaMenuOpen(false);
              }} 
              className="flex cursor-pointer items-center space-x-2.5 group"
            >
              <motion.div 
                whileHover={{ rotate: 12, scale: 1.08 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className={`relative flex h-10 w-10 items-center justify-center rounded-xl p-[1px] transition-all`}
              >
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-br opacity-40 blur-sm group-hover:opacity-85 transition-opacity ${
                  themeMode === 'amethyst' ? 'from-purple-600 to-cyan-500' : 'from-emerald-500 to-teal-400'
                }`} />
                <div className="relative flex h-full w-full items-center justify-center rounded-[11px] bg-[#0c0c0e] border border-white/5">
                  <span className={`text-xl font-black tracking-tighter text-white transition-colors duration-300 ${
                    themeMode === 'emerald' ? 'text-emerald-400' : 'text-[#bf5af2]'
                  }`}>
                    V
                  </span>
                </div>
              </motion.div>

              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-black tracking-widest text-white font-sans">
                  VOLEX
                  <span className={`bg-gradient-to-r bg-clip-text text-transparent transition-all duration-500 ${
                    themeMode === 'amethyst' ? 'from-purple-400 to-cyan-400' : 'from-emerald-400 to-teal-400'
                  }`}>
                    STORE
                  </span>
                </span>
                <span className="text-[8px] font-mono tracking-widest text-gray-500 -mt-1 uppercase">
                  Enterprise network hub
                </span>
              </div>
            </div>

            {/* 2. MAIN NAV ITEMS (Desktop) with Animate Underline Tracking */}
            <div className="hidden lg:flex items-center space-x-1.5 relative">
              <button
                onClick={() => {
                  setActiveSection('home');
                  setIsMegaMenuOpen(false);
                }}
                className={`relative px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                  activeSection === 'home' ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <span>{t.home}</span>
                {activeSection === 'home' && (
                  <motion.div 
                    layoutId="activeNavIndicator" 
                    className={`absolute bottom-1 left-4 right-4 h-[2px] rounded-full ${
                      themeMode === 'amethyst' ? 'bg-purple-500' : 'bg-emerald-500'
                    }`} 
                  />
                )}
              </button>

              <button
                onClick={() => {
                  setActiveSection('shop');
                  setIsMegaMenuOpen(false);
                }}
                className={`relative px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                  activeSection === 'shop' ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <span>{t.store}</span>
                {activeSection === 'shop' && (
                  <motion.div 
                    layoutId="activeNavIndicator" 
                    className={`absolute bottom-1 left-4 right-4 h-[2px] rounded-full ${
                      themeMode === 'amethyst' ? 'bg-purple-500' : 'bg-emerald-500'
                    }`} 
                  />
                )}
              </button>

              <button
                onClick={() => {
                  setActiveSection('perks');
                  setIsMegaMenuOpen(false);
                }}
                className={`relative px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                  activeSection === 'perks' ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <span>{t.compare}</span>
                {activeSection === 'perks' && (
                  <motion.div 
                    layoutId="activeNavIndicator" 
                    className={`absolute bottom-1 left-4 right-4 h-[2px] rounded-full ${
                      themeMode === 'amethyst' ? 'bg-purple-500' : 'bg-emerald-500'
                    }`} 
                  />
                )}
              </button>

              {/* Mega Menu Toggle */}
              <button
                onClick={() => {
                  setIsMegaMenuOpen(!isMegaMenuOpen);
                  setIsLangDropdownOpen(false);
                  setIsLoginDropdownOpen(false);
                }}
                className={`flex items-center gap-1 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                  isMegaMenuOpen 
                    ? 'text-cyan-400 bg-white/5 border border-white/5' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Compass className="h-3.5 w-3.5" />
                <span>{t.portal}</span>
                <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${isMegaMenuOpen ? 'rotate-180 text-cyan-400' : ''}`} />
              </button>

              {/* Dev Console Toggle */}
              <button
                onClick={() => {
                  setActiveSection('admin');
                  setIsMegaMenuOpen(false);
                }}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all ${
                  activeSection === 'admin'
                    ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'
                    : 'text-gray-500 border-transparent hover:text-cyan-300 hover:bg-cyan-500/5'
                }`}
              >
                <Terminal className="h-3.5 w-3.5" />
                <span>{t.console}</span>
              </button>

              {/* User Dashboard Tab */}
              <button
                onClick={() => {
                  setActiveSection('dashboard');
                  setIsMegaMenuOpen(false);
                }}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all ${
                  activeSection === 'dashboard'
                    ? 'text-purple-400 bg-purple-500/10 border-purple-500/30'
                    : 'text-gray-500 border-transparent hover:text-purple-300 hover:bg-purple-500/5'
                }`}
              >
                <User className="h-3.5 w-3.5" />
                <span>Dashboard</span>
              </button>
            </div>

            {/* 3. MULTI-WIDGET ACTION CONTROLS (Desktop & Tablet) */}
            <div className="hidden sm:flex items-center space-x-3">
              
              {/* Sun/Moon Dark Theme Switch */}
              <button
                onClick={handleToggleTheme}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-gray-400 hover:text-white transition-all cursor-pointer relative group"
                title="Toggle alternative theme aura"
              >
                {themeMode === 'amethyst' ? (
                  <Moon className="h-4 w-4 text-purple-400 group-hover:rotate-12 transition-transform" />
                ) : (
                  <Sun className="h-4 w-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
                )}
              </button>

              {/* Language Switcher Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsLangDropdownOpen(!isLangDropdownOpen);
                    setIsMegaMenuOpen(false);
                    setIsLoginDropdownOpen(false);
                  }}
                  className="flex items-center gap-1.5 p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-gray-400 hover:text-white text-xs font-mono font-bold uppercase cursor-pointer"
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span>{lang}</span>
                  <ChevronDown className="h-3 w-3" />
                </button>

                <AnimatePresence>
                  {isLangDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-40 rounded-xl border border-white/10 bg-[#090b10] p-1.5 shadow-2xl z-50 text-left"
                    >
                      {(['EN', 'ES', 'DE', 'HI'] as Language[]).map((ln) => (
                        <button
                          key={ln}
                          onClick={() => {
                            setLang(ln);
                            setIsLangDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-sans font-bold uppercase transition-colors ${
                            lang === ln 
                              ? 'bg-purple-600 text-white' 
                              : 'text-gray-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <span>{TRANSLATIONS[ln].langName}</span>
                          {lang === ln && <Check className="h-3 w-3" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Currency Select HUD */}
              <div className="relative">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="appearance-none bg-white/5 border border-white/5 hover:border-white/10 text-xs font-mono font-bold text-gray-300 hover:text-white px-3.5 py-2 pr-7 rounded-xl focus:outline-none cursor-pointer transition-all"
                >
                  <option value="USD" className="bg-[#090b10]">USD ($)</option>
                  <option value="EUR" className="bg-[#090b10]">EUR (€)</option>
                  <option value="INR" className="bg-[#090b10]">INR (₹)</option>
                  <option value="GBP" className="bg-[#090b10]">GBP (£)</option>
                </select>
                <div className="absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none text-gray-500 text-[8px]">▼</div>
              </div>

              {/* Login/Character Connection Hub */}
              {connectedUser ? (
                <div className="relative">
                  <button
                    onClick={() => {
                      setIsProfileDropdownOpen(!isProfileDropdownOpen);
                      setIsMegaMenuOpen(false);
                      setIsLoginDropdownOpen(false);
                    }}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 hover:from-purple-500/15 hover:to-indigo-500/15 border border-purple-500/20 px-3 py-1.5 rounded-xl cursor-pointer"
                  >
                    <img
                      src={`https://crafatar.com/avatars/${connectedUser}?size=22&overlay`}
                      alt={connectedUser}
                      className="h-5.5 w-5.5 rounded border border-purple-400/30 shadow-sm"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://minotar.net/helm/Steve/22.png`;
                      }}
                    />
                    <span className="text-xs font-mono font-black text-purple-300">{connectedUser}</span>
                    <ChevronDown className="h-3 w-3 text-purple-400" />
                  </button>

                  <AnimatePresence>
                    {isProfileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-64 rounded-2xl border border-purple-500/10 bg-[#090b10]/95 backdrop-blur-xl p-4 shadow-2xl z-50 space-y-3.5 text-left"
                      >
                        <div className="flex items-center gap-3 border-b border-purple-500/5 pb-3">
                          <img
                            src={`https://crafatar.com/avatars/${connectedUser}?size=40&overlay`}
                            alt={connectedUser}
                            className="h-10 w-10 rounded-lg border border-purple-500/20"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="text-xs font-mono font-black text-white">{connectedUser}</div>
                            <div className="text-[9px] font-mono text-emerald-400 flex items-center gap-1 mt-0.5">
                              <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                              Character Sync Active
                            </div>
                          </div>
                        </div>

                        {/* Player Statistics HUD Block */}
                        <div className="bg-black/40 border border-purple-500/5 rounded-xl p-2.5 space-y-1 text-[10px] font-mono text-gray-400">
                          <div className="flex justify-between">
                            <span>Parent Rank:</span>
                            <span className="text-purple-300 font-bold uppercase">MVP+ LIFETIME</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Volex Coins:</span>
                            <span className="text-amber-400 font-black">25,430 COINS</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Security level:</span>
                            <span className="text-cyan-400 font-bold uppercase">HIGH SECURITY</span>
                          </div>
                        </div>

                        {/* Open Dashboard Shortcut */}
                        <button
                          onClick={() => {
                            setActiveSection('dashboard');
                            setIsProfileDropdownOpen(false);
                          }}
                          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/20 text-purple-300 hover:text-purple-200 text-[10px] font-sans font-bold uppercase cursor-pointer transition-all"
                        >
                          <User className="h-3.5 w-3.5" />
                          <span>Open User Dashboard</span>
                        </button>

                        {/* Disconnect Action */}
                        <button
                          onClick={() => {
                            onDisconnect();
                            setIsProfileDropdownOpen(false);
                          }}
                          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 hover:text-rose-300 text-[10px] font-sans font-bold uppercase cursor-pointer transition-all"
                        >
                          <LogOut className="h-3.5 w-3.5" />
                          <span>{t.disconnect}</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  
                  {/* Link Character (Login alternative) button */}
                  <button
                    onClick={() => {
                      if (onOpenAuth) {
                        onOpenAuth();
                      } else {
                        setIsLoginDropdownOpen(!isLoginDropdownOpen);
                        setIsMegaMenuOpen(false);
                        setIsLangDropdownOpen(false);
                      }
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-sans font-extrabold uppercase bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-xl cursor-pointer text-gray-200 transition-all"
                  >
                    <Lock className="h-3.5 w-3.5 text-purple-400" />
                    <span>{t.login}</span>
                  </button>

                  {/* Register VIP (Register alternative) Button */}
                  <button
                    onClick={() => {
                      if (onOpenAuth) {
                        onOpenAuth();
                      } else {
                        setIsRegisterModalOpen(true);
                      }
                    }}
                    className={`flex items-center gap-1.5 px-4.5 py-2 text-xs font-sans font-black uppercase text-black rounded-xl cursor-pointer hover:scale-[1.03] transition-all ${
                      themeMode === 'amethyst' 
                        ? 'bg-[#bf5af2] hover:bg-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]' 
                        : 'bg-emerald-400 hover:bg-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                    }`}
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    <span>{t.register}</span>
                  </button>

                </div>
              )}

              {/* 4. PREMIUM SHOPPING CART ACTION BLOCK */}
              <button
                onClick={toggleCart}
                className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 cursor-pointer group transition-all"
              >
                <ShoppingBag className="h-4 w-4 text-gray-400 group-hover:text-white" />
                {cartCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0.6 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-black text-black shadow-lg"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </button>

            </div>

            {/* MOBILE ACTION TRIGGER BUTTON */}
            <div className="flex sm:hidden items-center space-x-2">
              {/* Shopping Cart Mini */}
              <button
                onClick={toggleCart}
                className="relative p-2 rounded-lg bg-white/5 border border-white/5 text-gray-300"
              >
                <ShoppingBag className="h-4 w-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[8px] font-black text-black">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg bg-white/5 border border-white/5 text-gray-400 hover:text-white"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* ==================== 5. MEGA MENU CONTAINER (DESKTOP) ==================== */}
        <AnimatePresence>
          {isMegaMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-purple-500/10 bg-[#090b10]/95 backdrop-blur-2xl overflow-hidden hidden lg:block"
            >
              <div className="mx-auto max-w-7xl px-8 py-8 grid grid-cols-3 gap-8">
                
                {/* Column 1: Game Modes */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-[#bf5af2]">
                    <Shield className="h-4.5 w-4.5" />
                    <span className="text-xs font-mono font-black uppercase tracking-widest">{t.gamemodes}</span>
                  </div>
                  <ul className="space-y-3.5">
                    <li className="group cursor-pointer">
                      <div className="text-xs font-black text-white group-hover:text-purple-300 flex items-center justify-between">
                        <span>Survival RPG [1.21.x]</span>
                        <span className="text-[9px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">62 ONLINE</span>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5">Vanilla survival with Dungeons, Custom Enchantments, and Jobs.</p>
                    </li>
                    <li className="group cursor-pointer">
                      <div className="text-xs font-black text-white group-hover:text-purple-300 flex items-center justify-between">
                        <span>Void Skyblock</span>
                        <span className="text-[9px] font-mono text-gray-500 bg-white/5 px-1.5 py-0.5 rounded">40 ONLINE</span>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5">Expand dynamic islands, trade on global economy, deploy minions.</p>
                    </li>
                  </ul>
                </div>

                {/* Column 2: Essential Commands */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-cyan-400">
                    <Terminal className="h-4.5 w-4.5" />
                    <span className="text-xs font-mono font-black uppercase tracking-widest">{t.commands}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-black/60 border border-purple-500/5 p-2 rounded-lg flex items-center justify-between text-[10px] font-mono">
                      <span className="text-[#bf5af2]">/spawn</span>
                      <span className="text-gray-500">Instant teleport to Hub Lobby</span>
                    </div>
                    <div className="bg-black/60 border border-purple-500/5 p-2 rounded-lg flex items-center justify-between text-[10px] font-mono">
                      <span className="text-cyan-400">/lp user &lt;name&gt;</span>
                      <span className="text-gray-500">Query active LuckPerms Ranks</span>
                    </div>
                    <div className="bg-black/60 border border-purple-500/5 p-2 rounded-lg flex items-center justify-between text-[10px] font-mono">
                      <span className="text-amber-400">/vote</span>
                      <span className="text-gray-500">Earn free daily Ancient Crate Keys</span>
                    </div>
                  </div>
                </div>

                {/* Column 3: Help & Wiki Documents */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-amber-400">
                    <BookOpen className="h-4.5 w-4.5" />
                    <span className="text-xs font-mono font-black uppercase tracking-widest">{t.explore}</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed font-sans">
                    Read server rank progression charts, loot pool drop statistics, or command permissions manuals inside our secure player handbook.
                  </p>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => {
                        setIsMegaMenuOpen(false);
                        setActiveSection('perks');
                      }}
                      className="bg-purple-600 hover:bg-purple-500 text-white font-mono text-[9px] uppercase font-bold py-2 px-4 rounded-lg cursor-pointer"
                    >
                      Compare Ranks
                    </button>
                    <a
                      href="https://discord.gg/mNKqC2bAYH"
                      target="_blank"
                      rel="noreferrer"
                      className="bg-white/5 hover:bg-white/10 text-white border border-white/5 hover:border-white/10 font-mono text-[9px] uppercase font-bold py-2 px-4 rounded-lg cursor-pointer flex items-center gap-1"
                    >
                      <span>Join Discord Support</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </nav>

      {/* ==================== 6. MOBILE NAVIGATION COLLAPSIBLE PANEL ==================== */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-18 bg-[#090b10] border-b border-purple-500/10 p-6 z-40 space-y-6 lg:hidden max-h-[85vh] overflow-y-auto"
          >
            {/* Quick Menu list */}
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => {
                  setActiveSection('home');
                  setIsMobileMenuOpen(false);
                }}
                className={`py-2 text-left font-sans text-xs font-bold uppercase ${activeSection === 'home' ? 'text-[#bf5af2]' : 'text-gray-300'}`}
              >
                {t.home}
              </button>
              <button
                onClick={() => {
                  setActiveSection('shop');
                  setIsMobileMenuOpen(false);
                }}
                className={`py-2 text-left font-sans text-xs font-bold uppercase ${activeSection === 'shop' ? 'text-[#bf5af2]' : 'text-gray-300'}`}
              >
                {t.store}
              </button>
              <button
                onClick={() => {
                  setActiveSection('perks');
                  setIsMobileMenuOpen(false);
                }}
                className={`py-2 text-left font-sans text-xs font-bold uppercase ${activeSection === 'perks' ? 'text-[#bf5af2]' : 'text-gray-300'}`}
              >
                {t.compare}
              </button>
              <button
                onClick={() => {
                  setActiveSection('admin');
                  setIsMobileMenuOpen(false);
                }}
                className={`py-2 text-left font-sans text-xs font-bold uppercase ${activeSection === 'admin' ? 'text-cyan-400' : 'text-gray-300'}`}
              >
                {t.console}
              </button>
              <button
                onClick={() => {
                  setActiveSection('dashboard');
                  setIsMobileMenuOpen(false);
                }}
                className={`py-2 text-left font-sans text-xs font-bold uppercase ${activeSection === 'dashboard' ? 'text-purple-400' : 'text-gray-300'}`}
              >
                Dashboard
              </button>
            </div>

            {/* Mobile User Profile Section */}
            {connectedUser ? (
              <div className="bg-black/40 border border-purple-500/5 p-4 rounded-xl space-y-3">
                <div className="flex items-center gap-2">
                  <img
                    src={`https://crafatar.com/avatars/${connectedUser}?size=24&overlay`}
                    alt={connectedUser}
                    className="h-6 w-6 rounded border border-purple-500/30"
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-xs font-mono font-black text-purple-300">{connectedUser}</span>
                </div>
                <button
                  onClick={() => {
                    onDisconnect();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2.5 rounded-lg bg-rose-500/15 border border-rose-500/25 text-rose-400 hover:text-rose-300 text-[10px] font-sans font-bold uppercase"
                >
                  {t.disconnect}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onOpenAuth) {
                      onOpenAuth();
                    } else {
                      setActiveSection('home');
                      document.getElementById('profile-gateway')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="py-2.5 bg-white/5 hover:bg-white/10 text-white text-[10px] font-sans font-black uppercase text-center rounded-xl border border-white/15"
                >
                  {t.login}
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onOpenAuth) {
                      onOpenAuth();
                    } else {
                      setIsRegisterModalOpen(true);
                    }
                  }}
                  className="py-2.5 bg-[#bf5af2] text-black text-[10px] font-sans font-black uppercase text-center rounded-xl"
                >
                  {t.register}
                </button>
              </div>
            )}

            {/* Language & Currency selector HUD mobile */}
            <div className="grid grid-cols-2 gap-4 border-t border-purple-500/5 pt-4">
              <div>
                <label className="text-[9px] font-mono text-gray-500 uppercase block mb-1">Select Language</label>
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value as Language)}
                  className="w-full bg-[#111115] border border-white/5 text-xs text-gray-300 p-2.5 rounded-xl focus:outline-none"
                >
                  <option value="EN">English</option>
                  <option value="ES">Español</option>
                  <option value="DE">Deutsch</option>
                  <option value="HI">हिन्दी</option>
                </select>
              </div>

              <div>
                <label className="text-[9px] font-mono text-gray-500 uppercase block mb-1">Select Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-[#111115] border border-white/5 text-xs text-gray-300 p-2.5 rounded-xl focus:outline-none"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>

            {/* Quick Online Widget Mini */}
            {serverStatus && serverStatus.online && (
              <div className="bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-xl flex items-center justify-between">
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">NETWORK STATUS</span>
                <span className="text-[10px] font-mono text-white font-extrabold">{serverStatus.players} ONLINE</span>
              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== 7. THE REGISTER VIP MODAL PROMPT ==================== */}
      <AnimatePresence>
        {isRegisterModalOpen && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-xl z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-md bg-[#090b10] border border-purple-500/10 rounded-2xl p-6 relative overflow-hidden"
            >
              {/* Top Banner Tag */}
              <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-[#bf5af2] to-cyan-500"></div>

              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10 text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>

              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-[#bf5af2]">
                  <Award className="h-5 w-5" />
                  <span className="text-[10px] font-mono font-black uppercase tracking-widest">{t.registerTitle}</span>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed font-sans">
                  {t.registerDesc}
                </p>

                {registerSuccess ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center text-emerald-400 text-xs font-mono animate-pulse">
                    ⚡ Account verified on LuckPerms! Launching sync...
                  </div>
                ) : (
                  <form onSubmit={handleSimulateRegister} className="space-y-4 pt-2">
                    <div>
                      <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">
                        Minecraft Username
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. shisir"
                        value={registerInput}
                        onChange={(e) => setRegisterInput(e.target.value)}
                        className="w-full bg-black/60 border border-purple-500/15 focus:border-purple-500/35 text-white text-xs font-mono p-3 rounded-xl focus:outline-none"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs uppercase rounded-xl cursor-pointer"
                    >
                      {t.registerAction}
                    </button>
                  </form>
                )}

                <div className="bg-black/40 border border-white/5 rounded-xl p-3 text-[10px] text-gray-500 font-sans leading-relaxed">
                  🔐 Registering an account adds an encrypted server-token to your browser cache. This maintains synchronization with checkout APIs during checkout.
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== 8. AESTHETIC THEME AURA TRIGGER FLOATING FLOATER ==================== */}
      <AnimatePresence>
        {themeChangeNotify && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className={`fixed bottom-6 right-6 z-50 rounded-xl border p-4 shadow-2xl backdrop-blur-md flex items-center gap-3 font-mono text-[11px] font-black tracking-widest ${
              themeMode === 'amethyst' 
                ? 'bg-purple-950/25 border-purple-500/20 text-purple-300' 
                : 'bg-emerald-950/25 border-emerald-500/20 text-emerald-300'
            }`}
          >
            <Sparkles className="h-4 w-4 animate-spin" />
            <span>{themeChangeNotify}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
