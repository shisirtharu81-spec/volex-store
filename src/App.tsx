import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  MessageSquare, 
  Star, 
  CheckCircle, 
  ChevronRight, 
  Activity, 
  Server, 
  Award, 
  Heart,
  Users,
  Terminal,
  Shield,
  Zap,
  DollarSign,
  X,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Data & Components
import { STORE_ITEMS, MOCK_REVIEWS } from './data';
import { StoreItem, CartItem, ServerStatus, DiscordStatus, Review } from './types';
import { Navbar } from './components/Navbar';
import { ServerStatusWidget } from './components/ServerStatusWidget';
import { UsernameLookup } from './components/UsernameLookup';
import { StoreItemCard } from './components/StoreItemCard';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminConsole } from './components/AdminConsole';
import { PremiumHome } from './components/PremiumHome';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { UserDashboard } from './components/UserDashboard';
import { CheckoutPage } from './components/CheckoutPage';
import { AuthModal } from './components/AuthModal';
import { AuthPage } from './components/AuthPage';

export default function App() {
  // Navigation & UI States
  const [activeSection, setActiveSection] = useState<string>('auth');
  const [currency, setCurrency] = useState<string>('USD');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  
  // Detailed Product Modal State
  const [selectedItemForDetails, setSelectedItemForDetails] = useState<StoreItem | null>(null);

  // Cart & Authentication States
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [connectedUser, setConnectedUser] = useState<string | null>(null);

  // Wishlist State
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('volex_wishlist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('volex_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Saved for Later State
  const [savedItems, setSavedItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('volex_saved_for_later');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('volex_saved_for_later', JSON.stringify(savedItems));
  }, [savedItems]);

  // Stripe Gateway Redirect parameters state
  const [stripeSuccess, setStripeSuccess] = useState<boolean>(false);
  const [stripeCancelled, setStripeCancelled] = useState<boolean>(false);
  const [stripeSessionId, setStripeSessionId] = useState<string | null>(null);

  // Live status integrations (Polled from Express)
  const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null);
  const [discordStatus, setDiscordStatus] = useState<DiscordStatus | null>(null);

  // Reviews list (Simulated local storage state)
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Fetch status indicators on boot
  const fetchStatuses = async () => {
    try {
      const sRes = await fetch('/api/server-status');
      const sData = await sRes.json();
      setServerStatus(sData);

      const dRes = await fetch('/api/discord-status');
      const dData = await dRes.json();
      setDiscordStatus(dData);
    } catch (err) {
      console.warn("Express APIs are booting up or not initialized, using static fallbacks.");
      // Fallback values if API is loading or unavailable
      setServerStatus({
        online: true,
        players: 142,
        maxPlayers: 500,
        ip: "play.volexmc.net",
        port: 25565,
        ping: 18,
        version: "1.20.4 - 1.21.x",
        playersList: ["shisir", "notch", "xX_Slayer_Xx", "VolexLover"]
      });
      setDiscordStatus({
        onlineMembers: 1420,
        totalMembers: 8432,
        inviteLink: "https://discord.gg/MAdBF6Kmdf"
      });
    }
  };

  useEffect(() => {
    fetchStatuses();
    const interval = setInterval(fetchStatuses, 10000); // refresh status
    return () => clearInterval(interval);
  }, []);

  // Sync connected account on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('volex_username');
    if (savedUser) setConnectedUser(savedUser);
  }, []);

  // Parse Stripe redirect query parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment_success') === 'true') {
      setStripeSuccess(true);
      const sid = params.get('session_id');
      if (sid) setStripeSessionId(sid);
      
      // Clear cart because the order was finalized and processed
      setCartItems([]);
      
      // Clear address query params cleanly
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    } else if (params.get('payment_cancelled') === 'true') {
      setStripeCancelled(true);
      
      // Clear address query params cleanly
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  // Account Connect handlers
  const handleConnectUser = (username: string) => {
    setConnectedUser(username);
    localStorage.setItem('volex_username', username);
  };

  const handleDisconnectUser = () => {
    setConnectedUser(null);
    localStorage.removeItem('volex_username');
  };

  // Cart operations
  const handleAddToCart = (item: StoreItem, quantity: number) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { ...item, quantity }];
    });
    // Open cart drawer automatically for visual feedback
    setIsCartOpen(true);
  };

  const handleToggleWishlist = (itemId: string) => {
    setWishlist(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId) 
        : [...prev, itemId]
    );
  };

  const handleBuyNow = (item: StoreItem, quantity: number) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { ...item, quantity }];
    });
    setIsCartOpen(true);
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  };

  const handleUpdateCartQuantity = (id: string, quantity: number) => {
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, Math.min(25, quantity)) } : item));
  };

  const handleSaveForLater = (id: string) => {
    const itemToSave = cartItems.find(i => i.id === id);
    if (itemToSave) {
      setCartItems(prev => prev.filter(i => i.id !== id));
      setSavedItems(prev => {
        const existing = prev.find(i => i.id === id);
        if (existing) {
          return prev.map(i => i.id === id ? { ...i, quantity: i.quantity + itemToSave.quantity } : i);
        }
        return [...prev, itemToSave];
      });
    }
  };

  const handleMoveToCart = (id: string) => {
    const itemToMove = savedItems.find(i => i.id === id);
    if (itemToMove) {
      setSavedItems(prev => prev.filter(i => i.id !== id));
      setCartItems(prev => {
        const existing = prev.find(i => i.id === id);
        if (existing) {
          return prev.map(i => i.id === id ? { ...i, quantity: i.quantity + itemToMove.quantity } : i);
        }
        return [...prev, itemToMove];
      });
    }
  };

  const handleRemoveSavedItem = (id: string) => {
    setSavedItems(prev => prev.filter(i => i.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Currency utility converter
  const formatPrice = (price: number): string => {
    let rate = 1.0;
    let symbol = '$';

    if (currency === 'EUR') {
      rate = 0.92;
      symbol = '€';
    } else if (currency === 'GBP') {
      rate = 0.79;
      symbol = '£';
    } else if (currency === 'INR') {
      rate = 83.5;
      symbol = '₹';
    }

    const converted = (price * rate).toFixed(2);
    // Add comma format for Indian Rupee if needed
    return `${symbol}${parseFloat(converted).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  };

  // Testimonial comment post submission
  const handlePostReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      username: reviewName.trim(),
      rating: reviewRating,
      comment: reviewComment.trim(),
      date: new Date().toISOString().split('T')[0],
      verified: true
    };

    setReviews(prev => [newRev, ...prev]);
    setReviewName('');
    setReviewComment('');
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 4000);
  };

  // Filter products category list
  const filteredItems = selectedCategory === 'All' 
    ? STORE_ITEMS 
    : selectedCategory === 'Wishlist'
      ? STORE_ITEMS.filter(item => wishlist.includes(item.id))
      : STORE_ITEMS.filter(item => item.category === selectedCategory);

  return (
    <div id="app" className="min-h-screen bg-[#050507] text-white font-sans selection:bg-[#bf5af2] selection:text-black antialiased relative overflow-hidden">
      
      {/* Background Matrix Mesh Lines */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,rgba(139,92,246,0.08),transparent)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

      {/* Navigation Bar */}
      <Navbar 
        serverStatus={serverStatus} 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        toggleCart={() => setIsCartOpen(!isCartOpen)}
        currency={currency}
        setCurrency={setCurrency}
        connectedUser={connectedUser}
        onDisconnect={handleDisconnectUser}
        onConnectDirect={handleConnectUser}
        onOpenAuth={() => setActiveSection('auth')}
      />

      {/* Premium Fully Connected Secure Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(username) => {
          handleConnectUser(username);
          setIsAuthOpen(false);
          setActiveSection('dashboard');
        }}
      />

      {/* Interactive Sliding Side Cart Drawer */}
      <CheckoutModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        formatPrice={formatPrice}
        connectedUser={connectedUser}
        onConnectPrompt={() => {
          setIsCartOpen(false);
          setActiveSection('home');
          // Smooth scroll to lookup box
          document.getElementById('profile-gateway')?.scrollIntoView({ behavior: 'smooth' });
        }}
        currency={currency}
        onUpdateQuantity={handleUpdateCartQuantity}
        onSaveForLater={handleSaveForLater}
        savedItems={savedItems}
        onMoveToCart={handleMoveToCart}
        onRemoveSavedItem={handleRemoveSavedItem}
        onNavigateToCheckout={() => {
          setIsCartOpen(false);
          setActiveSection('checkout');
        }}
      />

      {/* Advanced Animated Product Details Modal */}
      {selectedItemForDetails && (
        <ProductDetailsModal
          item={selectedItemForDetails}
          isOpen={!!selectedItemForDetails}
          onClose={() => setSelectedItemForDetails(null)}
          onAddToCart={handleAddToCart}
          formatPrice={formatPrice}
          wishlisted={wishlist.includes(selectedItemForDetails.id)}
          onToggleWishlist={handleToggleWishlist}
          onBuyNow={handleBuyNow}
          onNavigateToItem={setSelectedItemForDetails}
        />
      )}

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        {/* Stripe Success Notification Banner */}
        {stripeSuccess && (
          <div className="mb-8 rounded-2xl border border-emerald-500/20 bg-emerald-950/10 p-5 backdrop-blur-md flex gap-4 relative overflow-hidden animate-fade-in">
            <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-400"></div>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="flex-grow">
              <h4 className="text-sm font-black text-white uppercase tracking-wide flex items-center gap-1.5 font-sans">
                Real-Time Secure Payment Confirmed
                <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">STRIPE SECURED</span>
              </h4>
              <p className="text-xs text-gray-300 mt-1 leading-relaxed max-w-4xl">
                Thank you! Your transaction was completed successfully. The VOLEX Server Console is actively broadcasting your purchase and deploying parent node metadata hooks in LuckPerms. 
              </p>
              {stripeSessionId && (
                <div className="mt-2 text-[10px] font-mono text-emerald-400/80 bg-black/40 border border-emerald-500/10 px-2 py-1 rounded inline-block">
                  Session reference: <span className="text-white select-all">{stripeSessionId}</span>
                </div>
              )}
            </div>
            <button
              onClick={() => setStripeSuccess(false)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10 text-gray-400 hover:text-white cursor-pointer transition-all"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Stripe Cancelled Notification Banner */}
        {stripeCancelled && (
          <div className="mb-8 rounded-2xl border border-amber-500/20 bg-amber-950/10 p-5 backdrop-blur-md flex gap-4 relative overflow-hidden animate-fade-in">
            <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-amber-500 to-orange-400"></div>
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
              <Activity className="h-5 w-5" />
            </div>
            <div className="flex-grow">
              <h4 className="text-sm font-black text-white uppercase tracking-wide flex items-center gap-1.5 font-sans">
                Payment Session Closed
                <span className="text-[9px] font-mono font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full">CANCELLED</span>
              </h4>
              <p className="text-xs text-gray-300 mt-1 leading-relaxed max-w-4xl">
                The Stripe Checkout gateway connection was exited. No charges were created, and your selected server items are still saved securely in your cart drawer. Click the cart icon in the top right to try again.
              </p>
            </div>
            <button
              onClick={() => setStripeCancelled(false)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10 text-gray-400 hover:text-white cursor-pointer transition-all"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* VIEW 0: SECURE AUTHENTICATION GATE (LOGIN & REGISTER PAGE) */}
        {activeSection === 'auth' && (
          <AuthPage
            onAuthSuccess={(username) => {
              handleConnectUser(username);
              setActiveSection('home');
            }}
            onBypass={() => {
              setActiveSection('home');
            }}
          />
        )}

        {/* VIEW 1: HOME LANDING */}
        {activeSection === 'home' && (
          <PremiumHome
            serverStatus={serverStatus}
            discordStatus={discordStatus}
            connectedUser={connectedUser}
            onConnectUser={handleConnectUser}
            onDisconnectUser={handleDisconnectUser}
            setActiveSection={setActiveSection}
            setSelectedCategory={setSelectedCategory}
            onAddToCart={handleAddToCart}
            formatPrice={formatPrice}
            reviews={reviews}
            onPostReview={(name, rating, comment) => {
              const newRev: Review = {
                id: `rev-${Date.now()}`,
                username: name,
                rating: rating,
                comment: comment,
                date: new Date().toISOString().split('T')[0],
                verified: true
              };
              setReviews(prev => [newRev, ...prev]);
            }}
            onSelectProduct={setSelectedItemForDetails}
          />
        )}

        {/* VIEW 2: SHOP PRODUCTS */}
        {activeSection === 'shop' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Store categories selector */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-purple-500/10 pb-6">
              <div>
                <span className="text-[10px] font-mono font-black text-[#bf5af2] uppercase tracking-widest block">VOLEX CATALOGUE</span>
                <h2 className="text-3xl font-black text-white font-sans tracking-tight mt-1">
                  SERVER STORE PACKAGES
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Select a category to explore lifetime ranks, custom keys, bundles, and Virtual Volex Coins.
                </p>
              </div>

              {/* Connected notice if any */}
              {connectedUser ? (
                <div className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-3.5 py-1.5 rounded-xl font-mono text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-gray-400">Cart linked to: </span>
                  <span className="text-purple-300 font-bold">{connectedUser}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-xl font-mono text-xs text-amber-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                  <span>Username disconnected. Connect profile below!</span>
                </div>
              )}
            </div>

            {/* Sub-category Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {['All', 'Ranks', 'Crates', 'Keys', 'Coins', 'Kits', 'Bundles', 'Season Pass', 'Cosmetics', 'Pets', 'Particles', 'Commands', 'Boosters', 'Wishlist'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-500/40 shadow-[0_0_15px_rgba(147,51,234,0.15)]'
                      : 'bg-[#0a0a0d] border-purple-500/10 hover:border-purple-500/30 text-gray-400 hover:text-purple-300'
                  }`}
                >
                  {cat === 'Wishlist' ? (
                    <>
                      <Heart className={`h-3.5 w-3.5 ${wishlist.length > 0 ? 'text-rose-500 fill-rose-500' : 'text-gray-400'}`} />
                      <span>Wishlist ({wishlist.length})</span>
                    </>
                  ) : cat === 'All' ? 'View All' : cat}
                </button>
              ))}
            </div>

            {/* Username gate if disconnected */}
            {!connectedUser && (
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                    <Terminal className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-white leading-tight">Minecraft ID Required</h4>
                    <p className="text-xs text-gray-400 mt-1">
                      You must link a character username before checkout to synchronize command dispatches correctly.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveSection('home');
                    setTimeout(() => {
                      document.getElementById('profile-gateway')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-xs uppercase px-5 py-2.5 rounded-xl cursor-pointer transition-colors"
                >
                  Link ID on Home
                </button>
              </div>
            )}

            {/* Store Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <StoreItemCard
                  key={item.id}
                  item={item}
                  onAddToCart={handleAddToCart}
                  formatPrice={formatPrice}
                  wishlisted={wishlist.includes(item.id)}
                  onToggleWishlist={handleToggleWishlist}
                  onBuyNow={handleBuyNow}
                  onSelect={setSelectedItemForDetails}
                />
              ))}
            </div>

          </div>
        )}

        {/* VIEW 3: RANK COMPARISON MATRIX */}
        {activeSection === 'perks' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <span className="text-[10px] font-mono font-black text-cyan-400 uppercase tracking-widest block">MATRIX COMPARISON</span>
              <h2 className="text-3xl font-black text-white font-sans tracking-tight mt-1">
                LUCKPERMS RANK PRIVILEGES
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                A thorough breakdown of perks, multiplier increments, prefixes, and chat color modifiers for every rank.
              </p>
            </div>

            {/* High-fidelity responsive comparison table */}
            <div className="overflow-x-auto rounded-2xl border border-purple-500/10 bg-black/40 backdrop-blur-md">
              <table className="w-full min-w-[700px] border-collapse text-left font-sans text-xs">
                <thead>
                  <tr className="border-b border-purple-500/10 bg-black/60 text-[10px] font-mono font-black uppercase tracking-wider text-purple-400">
                    <th className="p-4">Rank Tier Features</th>
                    <th className="p-4">Default</th>
                    <th className="p-4 text-cyan-400">VIP</th>
                    <th className="p-4 text-emerald-400">VIP+</th>
                    <th className="p-4 text-amber-400">MVP</th>
                    <th className="p-4 text-purple-400">MVP+</th>
                    <th className="p-4 text-[#bf5af2]">VOLEX Cosmic</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-500/5 text-gray-300">
                  
                  <tr>
                    <td className="p-4 font-bold text-white">Global Chat Prefix</td>
                    <td className="p-4 font-mono text-gray-500">None</td>
                    <td className="p-4 font-mono text-cyan-400 font-bold">[VIP]</td>
                    <td className="p-4 font-mono text-emerald-400 font-bold">[VIP+]</td>
                    <td className="p-4 font-mono text-amber-400 font-bold">[MVP]</td>
                    <td className="p-4 font-mono text-purple-400 font-bold">[MVP+]</td>
                    <td className="p-4 font-mono text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text font-black">[VOLEX]</td>
                  </tr>

                  <tr>
                    <td className="p-4 font-bold text-white">Lobby Flight (/fly)</td>
                    <td className="p-4 text-red-500 font-bold">❌ No</td>
                    <td className="p-4 text-emerald-400 font-bold">✅ Yes</td>
                    <td className="p-4 text-emerald-400 font-bold">✅ Yes</td>
                    <td className="p-4 text-emerald-400 font-bold">✅ Yes</td>
                    <td className="p-4 text-emerald-400 font-bold">✅ Yes</td>
                    <td className="p-4 text-emerald-400 font-bold">✅ Yes</td>
                  </tr>

                  <tr>
                    <td className="p-4 font-bold text-white">Server Queue Bypass</td>
                    <td className="p-4 text-red-500 font-bold">❌ No</td>
                    <td className="p-4 text-gray-400">Lobby check</td>
                    <td className="p-4 text-gray-400">Lobby check</td>
                    <td className="p-4 text-emerald-400 font-bold">✅ Priority</td>
                    <td className="p-4 text-emerald-400 font-bold">✅ Instant</td>
                    <td className="p-4 text-emerald-400 font-bold">✅ Overlord Byp</td>
                  </tr>

                  <tr>
                    <td className="p-4 font-bold text-white">Coin Earning Multipliers</td>
                    <td className="p-4 font-mono text-gray-500">1.0x</td>
                    <td className="p-4 font-mono text-gray-300">1.2x</td>
                    <td className="p-4 font-mono text-gray-300">1.3x</td>
                    <td className="p-4 font-mono text-cyan-400 font-bold">1.5x</td>
                    <td className="p-4 font-mono text-emerald-400 font-bold">2.0x</td>
                    <td className="p-4 font-mono text-[#bf5af2] font-black">3.0x Ultimate</td>
                  </tr>

                  <tr>
                    <td className="p-4 font-bold text-white">Custom Nicknames (/nick)</td>
                    <td className="p-4 text-red-500 font-bold">❌ No</td>
                    <td className="p-4 text-red-500 font-bold">❌ No</td>
                    <td className="p-4 text-red-500 font-bold">❌ No</td>
                    <td className="p-4 text-red-500 font-bold">❌ No</td>
                    <td className="p-4 text-emerald-400 font-bold">✅ Yes</td>
                    <td className="p-4 text-emerald-400 font-bold">✅ Unrestricted</td>
                  </tr>

                  <tr>
                    <td className="p-4 font-bold text-white">Creative Housing Worlds</td>
                    <td className="p-4 text-red-500 font-bold">❌ No</td>
                    <td className="p-4 text-red-500 font-bold">❌ No</td>
                    <td className="p-4 text-gray-400">100 slots</td>
                    <td className="p-4 text-gray-400">200 slots</td>
                    <td className="p-4 text-emerald-400 font-bold">✅ Premium (500)</td>
                    <td className="p-4 text-emerald-400 font-bold">✅ Infinite hosting</td>
                  </tr>

                  <tr>
                    <td className="p-4 font-bold text-white">Weekly Mystery Boxes</td>
                    <td className="p-4 font-mono text-gray-500">0</td>
                    <td className="p-4 font-mono text-gray-300">2x Common</td>
                    <td className="p-4 font-mono text-gray-300">4x Common</td>
                    <td className="p-4 font-mono text-cyan-400 font-bold">8x Rare</td>
                    <td className="p-4 font-mono text-purple-400 font-bold">12x Epic</td>
                    <td className="p-4 font-mono text-[#bf5af2] font-black">20x Mythic!</td>
                  </tr>

                </tbody>
              </table>
            </div>

            <div className="rounded-2xl border border-cyan-500/10 bg-cyan-500/5 p-4 text-xs leading-relaxed text-cyan-300">
              <span className="font-bold uppercase tracking-wider block mb-1">💡 Upgrades Discount Note</span>
              If you already own VIP, purchasing MVP or MVP+ will automatically deduct your previous rank's base value from the total sum during checkout. We support seamless, incremental rank progression!
            </div>

          </div>
        )}

        {/* VIEW 4: ADMIN CONSOLE */}
        {activeSection === 'admin' && (
          <AdminConsole formatPrice={formatPrice} />
        )}

        {/* VIEW 5: PREMIUM USER DASHBOARD */}
        {activeSection === 'dashboard' && (
          <UserDashboard
            connectedUser={connectedUser}
            onConnectUser={handleConnectUser}
            onDisconnectUser={handleDisconnectUser}
            formatPrice={formatPrice}
          />
        )}

        {/* VIEW 6: PREMIUM SECURE CHECKOUT PAGE */}
        {activeSection === 'checkout' && (
          <CheckoutPage
            cartItems={cartItems}
            onRemoveItem={handleRemoveCartItem}
            onUpdateQuantity={handleUpdateCartQuantity}
            onClearCart={handleClearCart}
            formatPrice={formatPrice}
            connectedUser={connectedUser}
            onConnectUser={handleConnectUser}
            setActiveSection={setActiveSection}
          />
        )}

      </main>

      {/* Footer Block */}
      <footer className="border-t border-purple-500/10 bg-black/60 py-12 mt-20 relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 p-[1px]">
                <div className="h-full w-full bg-[#0a0a0c] rounded-[7px] flex items-center justify-center font-bold text-sm text-white">V</div>
              </div>
              <span className="font-black text-sm tracking-wider text-white">VOLEX SERVER STORE</span>
            </div>

            <p className="text-xs text-gray-500 text-center md:text-right leading-relaxed font-sans max-w-md">
              VOLEX is in no way affiliated with or endorsed by Mojang Synergies AB or Microsoft Corporation. Minecraft is a registered trademark of Mojang Synergies AB.
            </p>

          </div>

          <div className="border-t border-purple-500/5 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-gray-600">
            <span>&copy; 2026 VOLEX Network Store. All server rights reserved.</span>
            <div className="flex items-center space-x-3">
              <span className="cursor-pointer hover:text-purple-400">Terms of Service</span>
              <span>•</span>
              <span className="cursor-pointer hover:text-purple-400">Privacy Policy</span>
              <span>•</span>
              <span className="cursor-pointer hover:text-purple-400">Direct Support</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
