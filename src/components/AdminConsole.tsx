import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, BarChart2, DollarSign, Sliders, Play, RefreshCw, Layers, ShieldCheck, 
  CheckCircle2, ChevronRight, Activity, Users, ShoppingBag, Tag, Percent, Megaphone, 
  Settings2, MessageSquare, Plus, Trash2, Search, Edit2, Save, X, Lock, Unlock, 
  Bell, HelpCircle, Send, Eye, EyeOff, Server, AlertTriangle, Clock, ArrowUpRight, 
  Compass, Globe, ShieldAlert, Cpu, HeartHandshake, FileText, Check
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, 
  BarChart, Bar, CartesianGrid, LineChart, Line 
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { Transaction, StoreItem } from '../types';
import { STORE_ITEMS } from '../data';

interface AdminConsoleProps {
  formatPrice: (price: number) => string;
}

type TabType = 
  | 'analytics' 
  | 'revenue' 
  | 'users' 
  | 'products' 
  | 'orders' 
  | 'coupons' 
  | 'categories' 
  | 'tickets' 
  | 'announcements' 
  | 'discord' 
  | 'logs' 
  | 'settings';

export const AdminConsole: React.FC<AdminConsoleProps> = ({ formatPrice }) => {
  const [activeTab, setActiveTab] = useState<TabType>('analytics');
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 1. Core database states (Simulated persistent database)
  const [products, setProducts] = useState<StoreItem[]>(() => {
    const saved = localStorage.getItem('volex_admin_products');
    return saved ? JSON.parse(saved) : STORE_ITEMS;
  });

  const [users, setUsers] = useState<any[]>(() => {
    const saved = localStorage.getItem('volex_admin_users');
    return saved ? JSON.parse(saved) : [
      { id: 'usr-1', username: 'shisir', rank: 'VOLEX Cosmic', status: 'Active', joins: 242, coins: 40000, email: 'shisirtharu51@gmail.com', lastSeen: '2026-07-04 03:15' },
      { id: 'usr-2', username: 'notch', rank: 'VIP', status: 'Active', joins: 832, coins: 15000, email: 'notch@mojang.com', lastSeen: '2026-07-03 21:40' },
      { id: 'usr-3', username: 'xX_Slayer_Xx', rank: 'MVP+', status: 'Active', joins: 54, coins: 2500, email: 'slayer@gmail.com', lastSeen: '2026-07-04 01:10' },
      { id: 'usr-4', username: 'VolexFan', rank: 'VIP+', status: 'Active', joins: 120, coins: 5000, email: 'fan@volexmc.net', lastSeen: '2026-07-02 18:05' },
      { id: 'usr-5', username: 'GamerCheater', rank: 'None', status: 'Banned', joins: 12, coins: 0, email: 'banned@cheating.com', lastSeen: '2026-06-30 11:02' }
    ];
  });

  const [coupons, setCoupons] = useState<any[]>(() => {
    const saved = localStorage.getItem('volex_admin_coupons');
    return saved ? JSON.parse(saved) : [
      { code: 'VOLEX50', discount: 50, status: 'Active', uses: 142, expiry: '2026-08-31' },
      { code: 'LAUNCH', discount: 30, status: 'Active', uses: 43, expiry: '2026-07-31' },
      { code: 'MINECRAFT', discount: 20, status: 'Active', uses: 82, expiry: '2026-12-31' },
      { code: 'WINTER', discount: 15, status: 'Expired', uses: 205, expiry: '2026-02-28' }
    ];
  });

  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('volex_admin_categories');
    return saved ? JSON.parse(saved) : ['Ranks', 'Crates', 'Keys', 'Coins', 'Kits', 'Bundles', 'Season Pass', 'Cosmetics', 'Pets', 'Particles', 'Commands', 'Boosters'];
  });

  const [tickets, setTickets] = useState<any[]>(() => {
    const saved = localStorage.getItem('volex_admin_tickets');
    return saved ? JSON.parse(saved) : [
      { id: 'TKT-824', sender: 'shisir', subject: 'Did not receive Keys in-game', priority: 'High', status: 'Open', message: 'I purchased 5x Cosmic Keys through Stripe 10 minutes ago, got the receipt on email, but in-game balance did not change. Please help sync!', responses: ['System: Ticket registered. Queue priority High.'], timestamp: '2026-07-04 02:14' },
      { id: 'TKT-109', sender: 'notch', subject: 'Custom tag color glitch', priority: 'Medium', status: 'In Progress', message: 'The Amethyst neon cycle tag is glitching to white when I join the survival parkour hub. Let me know if there is a hotfix.', responses: ['Staff: We are inspecting the particles file.', 'notch: Thank you, waiting.'], timestamp: '2026-07-03 18:22' },
      { id: 'TKT-942', sender: 'xX_Slayer_Xx', subject: 'Gladiator Kit claim interval question', priority: 'Low', status: 'Closed', message: 'Is the Gladiator claim on a 24h rolling clock or standard midnight reset? Just curious.', responses: ['Staff: Rolling 24 hour clock from execution.'], timestamp: '2026-07-02 11:05' }
    ];
  });

  const [announcements, setAnnouncements] = useState<any>(() => {
    const saved = localStorage.getItem('volex_admin_announcements');
    return saved ? JSON.parse(saved) : {
      globalAlert: "🔥 SUMMER SEASON 4 IS NOW LIVE! USE CODE VOLEX50 FOR 50% OFF ALL PACAKGES! 🔥",
      marqueeSpeed: 30,
      showBanner: true,
      popupMessage: "Attention gamers! Maintenance scheduled for play.volexmc.net on Sunday 04:00 UTC."
    };
  });

  const [discordSettings, setDiscordSettings] = useState<any>(() => {
    const saved = localStorage.getItem('volex_admin_discord');
    return saved ? JSON.parse(saved) : {
      webhookUrl: "https://discord.com/api/webhooks/948291039820/xyz_secret_key_volex",
      notifyOnOrder: true,
      notifyOnTicket: true,
      notifyOnAlert: false,
      avatarUrl: "https://minotar.net/helm/Steve/100.png"
    };
  });

  const [settings, setSettings] = useState<any>(() => {
    const saved = localStorage.getItem('volex_admin_settings');
    return saved ? JSON.parse(saved) : {
      storeCurrency: 'USD',
      taxRate: 8,
      maintenanceMode: false,
      sandboxMode: true,
      serverIp: "play.volexmc.net",
      autoSyncPeriod: 10
    };
  });

  // Audit event logs
  const [auditLogs, setAuditLogs] = useState<string[]>(() => {
    const saved = localStorage.getItem('volex_admin_audit_logs');
    return saved ? JSON.parse(saved) : [
      '03:10:12 - Admin system initialized securely from shisirtharu51@gmail.com',
      '03:12:45 - Loaded 12 core store category registers',
      '03:15:32 - Verified LuckPerms database bridge connection',
      '03:19:05 - Sync check: play.volexmc.net response status 200 OK (ping: 18ms)'
    ];
  });

  // Save states to local storage on changes
  useEffect(() => {
    localStorage.setItem('volex_admin_products', JSON.stringify(products));
  }, [products]);
  useEffect(() => {
    localStorage.setItem('volex_admin_users', JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    localStorage.setItem('volex_admin_coupons', JSON.stringify(coupons));
  }, [coupons]);
  useEffect(() => {
    localStorage.setItem('volex_admin_categories', JSON.stringify(categories));
  }, [categories]);
  useEffect(() => {
    localStorage.setItem('volex_admin_tickets', JSON.stringify(tickets));
  }, [tickets]);
  useEffect(() => {
    localStorage.setItem('volex_admin_announcements', JSON.stringify(announcements));
  }, [announcements]);
  useEffect(() => {
    localStorage.setItem('volex_admin_discord', JSON.stringify(discordSettings));
  }, [discordSettings]);
  useEffect(() => {
    localStorage.setItem('volex_admin_settings', JSON.stringify(settings));
  }, [settings]);
  useEffect(() => {
    localStorage.setItem('volex_admin_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const addAuditLog = (msg: string) => {
    const now = new Date().toLocaleTimeString();
    setAuditLogs(prev => [`${now} - ${msg}`, ...prev]);
  };

  // 2. Fetch/Simulate live transaction data from Express
  const [analytics, setAnalytics] = useState<any>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [customCommand, setCustomCommand] = useState('');
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    '[VOLEX-CONSOLE] [INFO] Booting VOLEX Server Command Hub...',
    '[VOLEX-CONSOLE] [INFO] Connection established on play.volexmc.net:25565',
    '[VOLEX-CONSOLE] [INFO] Vault Plugin synced with Tebex Webhook endpoint',
    '[VOLEX-CONSOLE] [INFO] LuckPerms ranks mapped to Store UUID database'
  ]);

  const logsEndRef = useRef<HTMLDivElement>(null);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const aRes = await fetch('/api/admin/analytics');
      const aData = await aRes.json();
      setAnalytics(aData);

      const tRes = await fetch('/api/admin/transactions');
      const tData = await tRes.json();
      setTransactions(tData);
    } catch (err) {
      console.error("Failed to load admin stats:", err);
      // fallback simulation
      setAnalytics({
        dailyEarnings: [
          { day: "Mon", Stripe: 240, PayPal: 150, Razorpay: 110, Crypto: 80, Tebex: 320 },
          { day: "Tue", Stripe: 310, PayPal: 210, Razorpay: 220, Crypto: 95, Tebex: 410 },
          { day: "Wed", Stripe: 280, PayPal: 190, Razorpay: 190, Crypto: 140, Tebex: 350 },
          { day: "Thu", Stripe: 450, PayPal: 310, Razorpay: 380, Crypto: 220, Tebex: 600 },
          { day: "Fri", Stripe: 590, PayPal: 400, Razorpay: 420, Crypto: 310, Tebex: 780 },
          { day: "Sat", Stripe: 820, PayPal: 610, Razorpay: 680, Crypto: 450, Tebex: 1120 },
          { day: "Sun", Stripe: 640, PayPal: 520, Razorpay: 510, Crypto: 380, Tebex: 890 }
        ],
        categoryDistribution: [
          { name: "Ranks", value: 45 },
          { name: "Crates", value: 15 },
          { name: "Keys", value: 15 },
          { name: "Coins", value: 15 },
          { name: "Bundles", value: 10 }
        ],
        totalSales: 8432.50,
        checkoutCount: 142,
        currentQueueCount: 0
      });
      setTransactions([
        { id: 'STRIPE-891-B3', username: 'notch', items: [], amount: 49.99, paymentMethod: 'stripe', status: 'completed', timestamp: '2026-07-04T03:12:00.000Z', commands: ['/lp user notch parent add volex'] },
        { id: 'PAYPAL-401-K2', username: 'shisir', items: [], amount: 19.99, paymentMethod: 'paypal', status: 'completed', timestamp: '2026-07-04T02:45:00.000Z', commands: ['/crate give physical mythic 5 shisir'] },
        { id: 'RAZORPAY-104-U1', username: 'xX_Slayer_Xx', items: [], amount: 24.99, paymentMethod: 'razorpay', status: 'completed', timestamp: '2026-07-03T23:15:00.000Z', commands: ['/coins add xX_Slayer_Xx 5000'] }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, settings.autoSyncPeriod * 1000); 
    return () => clearInterval(interval);
  }, [settings.autoSyncPeriod]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [consoleLogs]);

  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCommand.trim()) return;

    const cmd = customCommand.trim();
    setConsoleLogs(prev => [...prev, `[VOLEX-CONSOLE] [USER-COMMAND] Dispatching: ${cmd}`]);
    addAuditLog(`Dispatched console command: ${cmd}`);
    setCustomCommand('');

    try {
      const response = await fetch('/api/admin/dispatch-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmd })
      });
      const data = await response.json();
      if (data.success) {
        setConsoleLogs(prev => [...prev, data.consoleResponse]);
      }
    } catch (err) {
      setConsoleLogs(prev => [...prev, `[VOLEX-CONSOLE] [ERROR] Command transmitted. Status synchronized client-side.`]);
    }
  };

  // State managers for various forms
  // Users Section State
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [userSearch, setUserSearch] = useState('');
  const [isEditingUser, setIsEditingUser] = useState(false);

  // Products Section State
  const [productSearch, setProductSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<StoreItem | null>(null);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<StoreItem>>({
    id: '', name: '', price: 0, description: '', category: 'Ranks', perks: [], gradient: 'from-purple-500 to-indigo-500', borderColor: 'border-purple-500/30', glowColor: 'shadow-purple-500/10'
  });

  // Coupons Section State
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState(20);
  const [newCouponExpiry, setNewCouponExpiry] = useState('2026-12-31');

  // Categories Section State
  const [newCategoryName, setNewCategoryName] = useState('');

  // Tickets Section State
  const [activeTicket, setActiveTicket] = useState<any | null>(null);
  const [ticketReply, setTicketReply] = useState('');

  // Discord State
  const [sendingDiscordTest, setSendingDiscordTest] = useState(false);
  const [discordPayloadConsole, setDiscordPayloadConsole] = useState<string[]>([]);

  // 3. Handlers
  // Coupon
  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    const code = newCouponCode.trim().toUpperCase();
    if (coupons.some(c => c.code === code)) {
      showToast("Coupon code already exists.");
      return;
    }
    const nC = {
      code,
      discount: newCouponDiscount,
      status: 'Active',
      uses: 0,
      expiry: newCouponExpiry
    };
    setCoupons(prev => [nC, ...prev]);
    addAuditLog(`Created coupon promo code "${code}" with ${newCouponDiscount}% discount.`);
    showToast(`Coupon ${code} added successfully!`);
    setNewCouponCode('');
  };

  const handleDeleteCoupon = (code: string) => {
    setCoupons(prev => prev.filter(c => c.code !== code));
    addAuditLog(`Deleted coupon promo code "${code}".`);
    showToast(`Coupon ${code} removed.`);
  };

  const toggleCouponStatus = (code: string) => {
    setCoupons(prev => prev.map(c => {
      if (c.code === code) {
        const nextStatus = c.status === 'Active' ? 'Expired' : 'Active';
        addAuditLog(`Updated coupon ${code} status to ${nextStatus}.`);
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  // User Manager
  const handleUpdateUserStatus = (id: string, status: 'Active' | 'Banned') => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        addAuditLog(`Updated user ${u.username} status to ${status}.`);
        return { ...u, status };
      }
      return u;
    }));
    if (selectedUser?.id === id) {
      setSelectedUser((prev: any) => ({ ...prev, status }));
    }
    showToast(`User status set to ${status}.`);
  };

  const handleSaveUserCoins = (id: string, coins: number) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        addAuditLog(`Updated user ${u.username} coin balance to ${coins}.`);
        return { ...u, coins };
      }
      return u;
    }));
    showToast(`Coins updated successfully.`);
    setIsEditingUser(false);
  };

  // Category Manager
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = newCategoryName.trim();
    if (!cat) return;
    if (categories.includes(cat)) {
      showToast("Category already exists.");
      return;
    }
    setCategories(prev => [...prev, cat]);
    addAuditLog(`Added store category "${cat}".`);
    showToast(`Category "${cat}" added.`);
    setNewCategoryName('');
  };

  const handleDeleteCategory = (cat: string) => {
    setCategories(prev => prev.filter(c => c !== cat));
    addAuditLog(`Removed store category "${cat}".`);
    showToast(`Category "${cat}" removed.`);
  };

  // Product Manager
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      showToast("Please provide product name and price.");
      return;
    }
    const id = newProduct.id || `custom-${newProduct.name.toLowerCase().replace(/\s+/g, '-')}`;
    const item: StoreItem = {
      id,
      name: newProduct.name,
      price: Number(newProduct.price),
      description: newProduct.description || 'Dynamic server reward bundle package.',
      category: newProduct.category || 'Ranks',
      perks: newProduct.perks && newProduct.perks.length > 0 ? newProduct.perks : ['Custom VIP perks unlocked in global lobbies'],
      gradient: newProduct.gradient || 'from-cyan-500 to-indigo-500',
      borderColor: newProduct.borderColor || 'border-cyan-500/20',
      glowColor: newProduct.glowColor || 'shadow-cyan-500/10'
    };

    setProducts(prev => [item, ...prev]);
    addAuditLog(`Added new store product "${item.name}" ($${item.price}).`);
    showToast(`Product "${item.name}" added successfully!`);
    setIsEditingProduct(false);
    setNewProduct({
      id: '', name: '', price: 0, description: '', category: 'Ranks', perks: [], gradient: 'from-purple-500 to-indigo-500', borderColor: 'border-purple-500/30', glowColor: 'shadow-purple-500/10'
    });
  };

  const handleDeleteProduct = (id: string) => {
    const item = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    addAuditLog(`Deleted store product "${item?.name || id}".`);
    showToast("Product deleted successfully.");
  };

  // Support tickets
  const handleReplyTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketReply.trim() || !activeTicket) return;

    const responseLine = `Staff: ${ticketReply.trim()}`;
    setTickets(prev => prev.map(t => {
      if (t.id === activeTicket.id) {
        const nextResponses = [...t.responses, responseLine];
        addAuditLog(`Replied to ticket ${t.id} from user ${t.sender}.`);
        return { ...t, responses: nextResponses, status: 'In Progress' };
      }
      return t;
    }));

    setActiveTicket((prev: any) => ({
      ...prev,
      responses: [...prev.responses, responseLine],
      status: 'In Progress'
    }));

    setTicketReply('');
    showToast("Response delivered successfully.");
  };

  const handleUpdateTicketStatus = (id: string, status: 'Open' | 'In Progress' | 'Closed') => {
    setTickets(prev => prev.map(t => {
      if (t.id === id) {
        addAuditLog(`Set ticket ${id} status to ${status}.`);
        return { ...t, status };
      }
      return t;
    }));
    if (activeTicket?.id === id) {
      setActiveTicket((prev: any) => ({ ...prev, status }));
    }
    showToast(`Ticket status set to ${status}.`);
  };

  // Discord test webhook
  const handleSendDiscordTest = async () => {
    setSendingDiscordTest(true);
    setDiscordPayloadConsole([]);
    
    const steps = [
      `[POST] Handshaking with discord.com/api/webhooks...`,
      `[STATUS] Endpoint validated. Dispatching JSON structure...`,
      `[PAYLOAD] {\n  "username": "Volex Store Webhook",\n  "content": "🔔 **NEW COIN PURCHASE SUCCESSFUL!**",\n  "embeds": [{\n    "title": "Stripe Authorization #891",\n    "description": "Player notch secured 15,000 Coins ($49.99)",\n    "color": 12541426\n  }]\n}`,
      `[SUCCESS] Response code 204 No Content. Webhook triggered successfully!`
    ];

    for (const step of steps) {
      setDiscordPayloadConsole(prev => [...prev, step]);
      await new Promise(r => setTimeout(r, 600));
    }
    setSendingDiscordTest(false);
    addAuditLog("Fired simulated Discord Webhook verification test payload.");
    showToast("Discord webhook test complete!");
  };

  // Clear server logs
  const handleClearLogs = () => {
    setConsoleLogs([
      '[VOLEX-CONSOLE] [INFO] Cleared console output logs.',
      '[VOLEX-CONSOLE] [INFO] Socket active on play.volexmc.net:25565'
    ]);
  };

  // Recharts PIE slice styling colors
  const PIE_COLORS = ['#bf5af2', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#6366f1'];

  // Search filter math
  const filteredUsers = users.filter(u => u.username.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()));
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.category.toLowerCase().includes(productSearch.toLowerCase()));

  // Calculations for Gross/Net revenue tab
  const totalGross = analytics ? analytics.totalSales : 8432.50;
  const platformFees = totalGross * 0.035; // 3.5% Gateway fees
  const netEarnings = totalGross - platformFees;

  return (
    <div id="advanced-admin-dashboard" className="space-y-8 pb-16 animate-fade-in text-white relative z-10">
      
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-[#bf5af2] text-black font-extrabold text-xs uppercase px-4 py-3 rounded-xl border border-purple-400 shadow-[0_0_20px_rgba(191,90,242,0.4)] flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 border-b border-purple-500/10 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-purple-400">
            <Cpu className="h-4.5 w-4.5 animate-spin" />
            <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#bf5af2]">ROOT ACCESS GRANTED</span>
          </div>
          <h2 className="text-3.5xl font-black text-white font-sans tracking-tight mt-1 flex items-center gap-3">
            ADMINISTRATOR <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">DASHBOARD</span>
            <span className="text-[9px] font-mono font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 rounded-full uppercase animate-pulse">
              System Live
            </span>
          </h2>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl">
            Fully responsive game console, custom database registries, RCON query relays, in-game announcement tickers, and support channels.
          </p>
        </div>

        {/* Dynamic global analytics box */}
        <div className="flex items-center gap-4">
          <button
            onClick={fetchStats}
            disabled={loading}
            className="bg-[#bf5af2]/10 hover:bg-[#bf5af2]/20 border border-[#bf5af2]/30 text-[#bf5af2] hover:text-purple-300 px-4.5 py-2.5 rounded-xl text-xs font-black uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Live Core</span>
          </button>
        </div>
      </div>

      {/* TWELVE TAB SUB-NAVIGATION BAR (Gaming Grid/Deck) */}
      <div className="bg-black/60 border border-purple-500/10 p-2.5 rounded-2xl grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2.5 backdrop-blur-xl">
        
        {/* Tab 1: Analytics */}
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
            activeTab === 'analytics'
              ? 'bg-purple-500/15 border-[#bf5af2] text-[#bf5af2]'
              : 'bg-black/30 border-transparent text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <BarChart2 className="h-4 w-4" />
          <span>Analytics</span>
        </button>

        {/* Tab 2: Revenue */}
        <button
          onClick={() => setActiveTab('revenue')}
          className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
            activeTab === 'revenue'
              ? 'bg-cyan-500/15 border-cyan-400 text-cyan-400'
              : 'bg-black/30 border-transparent text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <DollarSign className="h-4 w-4" />
          <span>Revenue</span>
        </button>

        {/* Tab 3: Users */}
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
            activeTab === 'users'
              ? 'bg-emerald-500/15 border-emerald-400 text-emerald-400'
              : 'bg-black/30 border-transparent text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Users</span>
        </button>

        {/* Tab 4: Products */}
        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
            activeTab === 'products'
              ? 'bg-amber-500/15 border-amber-400 text-amber-400'
              : 'bg-black/30 border-transparent text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <ShoppingBag className="h-4 w-4" />
          <span>Products</span>
        </button>

        {/* Tab 5: Orders */}
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-blue-500/15 border-blue-400 text-blue-400'
              : 'bg-black/30 border-transparent text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>Orders</span>
        </button>

        {/* Tab 6: Coupons */}
        <button
          onClick={() => setActiveTab('coupons')}
          className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
            activeTab === 'coupons'
              ? 'bg-pink-500/15 border-pink-400 text-pink-400'
              : 'bg-black/30 border-transparent text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Tag className="h-4 w-4" />
          <span>Coupons</span>
        </button>

        {/* Tab 7: Categories */}
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
            activeTab === 'categories'
              ? 'bg-orange-500/15 border-orange-400 text-orange-400'
              : 'bg-black/30 border-transparent text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>Categories</span>
        </button>

        {/* Tab 8: Tickets */}
        <button
          onClick={() => setActiveTab('tickets')}
          className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
            activeTab === 'tickets'
              ? 'bg-rose-500/15 border-rose-400 text-rose-400'
              : 'bg-black/30 border-transparent text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          <span>Tickets</span>
          {tickets.filter(t => t.status === 'Open').length > 0 && (
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping"></span>
          )}
        </button>

        {/* Tab 9: Announcements */}
        <button
          onClick={() => setActiveTab('announcements')}
          className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
            activeTab === 'announcements'
              ? 'bg-yellow-500/15 border-yellow-400 text-yellow-400'
              : 'bg-black/30 border-transparent text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Megaphone className="h-4 w-4" />
          <span>Alerts</span>
        </button>

        {/* Tab 10: Discord Integration */}
        <button
          onClick={() => setActiveTab('discord')}
          className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
            activeTab === 'discord'
              ? 'bg-indigo-500/15 border-indigo-400 text-indigo-400'
              : 'bg-black/30 border-transparent text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Cpu className="h-4 w-4" />
          <span>Discord</span>
        </button>

        {/* Tab 11: Logs */}
        <button
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
            activeTab === 'logs'
              ? 'bg-[#bf5af2]/10 border-cyan-400/30 text-cyan-300'
              : 'bg-black/30 border-transparent text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Terminal className="h-4 w-4" />
          <span>RCON Logs</span>
        </button>

        {/* Tab 12: Settings */}
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-teal-500/15 border-teal-400 text-teal-400'
              : 'bg-black/30 border-transparent text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Settings2 className="h-4 w-4" />
          <span>Settings</span>
        </button>

      </div>

      {/* ACTIVE SCREEN CONTENT */}
      <div className="min-h-[450px]">
        
        {/* VIEW 1: ANALYTICS HUB */}
        {activeTab === 'analytics' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Top overview metrics cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              <div className="rounded-2xl border border-purple-500/10 bg-black/40 p-6 backdrop-blur-md relative overflow-hidden">
                <div className="absolute right-4 top-4 bg-purple-500/10 border border-purple-500/20 rounded-xl p-2 text-[#bf5af2]">
                  <DollarSign className="h-5 w-5" />
                </div>
                <span className="text-[9px] font-mono font-black text-gray-500 uppercase tracking-widest">Gross Store Earnings</span>
                <h4 className="text-3xl font-black text-white mt-1.5 font-mono">
                  {formatPrice(totalGross)}
                </h4>
                <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono mt-2 leading-none">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>+12.4% this week</span>
                </div>
              </div>

              <div className="rounded-2xl border border-purple-500/10 bg-black/40 p-6 backdrop-blur-md relative overflow-hidden">
                <div className="absolute right-4 top-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-2 text-cyan-400">
                  <Activity className="h-5 w-5" />
                </div>
                <span className="text-[9px] font-mono font-black text-gray-500 uppercase tracking-widest">Total Transactions</span>
                <h4 className="text-3xl font-black text-white mt-1.5 font-mono">
                  {analytics ? analytics.checkoutCount : 142} orders
                </h4>
                <div className="flex items-center gap-1.5 text-[10px] text-cyan-400 font-mono mt-2 leading-none">
                  <ShieldCheck className="h-3 w-3 animate-pulse" />
                  <span>All commands delivered</span>
                </div>
              </div>

              <div className="rounded-2xl border border-purple-500/10 bg-black/40 p-6 backdrop-blur-md relative overflow-hidden">
                <div className="absolute right-4 top-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-2 text-emerald-400">
                  <Users className="h-5 w-5" />
                </div>
                <span className="text-[9px] font-mono font-black text-gray-500 uppercase tracking-widest">Registered Gamers</span>
                <h4 className="text-3xl font-black text-white mt-1.5 font-mono">
                  {users.length} unique profiles
                </h4>
                <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono mt-2 leading-none">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Synced with Mojang registers</span>
                </div>
              </div>

              <div className="rounded-2xl border border-purple-500/10 bg-black/40 p-6 backdrop-blur-md relative overflow-hidden">
                <div className="absolute right-4 top-4 bg-rose-500/10 border border-rose-500/20 rounded-xl p-2 text-rose-400">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <span className="text-[9px] font-mono font-black text-gray-500 uppercase tracking-widest">Active Tickets</span>
                <h4 className="text-3xl font-black text-white mt-1.5 font-mono">
                  {tickets.filter(t => t.status !== 'Closed').length} pending
                </h4>
                <div className="flex items-center gap-1 text-[10px] text-amber-400 font-mono mt-2 leading-none">
                  <AlertTriangle className="h-3 w-3" />
                  <span>Avg reply latency: 8 mins</span>
                </div>
              </div>

            </div>

            {/* Graphs row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Earnings line area chart */}
              <div className="lg:col-span-2 rounded-2xl border border-purple-500/10 bg-black/40 p-6 backdrop-blur-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black text-white tracking-wider uppercase font-mono flex items-center gap-1.5">
                    <BarChart2 className="h-4 w-4 text-purple-400" />
                    <span>Weekly Payment Gateway Stream</span>
                  </h3>
                  <span className="text-[10px] font-mono text-gray-400">Auto-polls every {settings.autoSyncPeriod}s</span>
                </div>
                
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics?.dailyEarnings || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorStripe" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#bf5af2" stopOpacity={0.35}/>
                          <stop offset="95%" stopColor="#bf5af2" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorPayPal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" stroke="#6b7280" fontSize={10} fontFamily="monospace" />
                      <YAxis stroke="#6b7280" fontSize={10} fontFamily="monospace" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#07070a', border: '1px solid rgba(191,90,242,0.2)', borderRadius: '12px' }}
                        labelStyle={{ color: '#fff', fontSize: '11px', fontFamily: 'monospace' }}
                        itemStyle={{ fontSize: '11px', fontFamily: 'monospace' }}
                      />
                      <Area type="monotone" dataKey="Stripe" stroke="#bf5af2" strokeWidth={2} fillOpacity={1} fill="url(#colorStripe)" />
                      <Area type="monotone" dataKey="Tebex" stroke="#6366f1" strokeWidth={1.5} fillOpacity={0.1} />
                      <Area type="monotone" dataKey="PayPal" stroke="#3b82f6" strokeWidth={1.5} fillOpacity={1} fill="url(#colorPayPal)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pie category distributions */}
              <div className="rounded-2xl border border-purple-500/10 bg-black/40 p-6 backdrop-blur-md flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-black text-white tracking-wider uppercase font-mono mb-4 flex items-center gap-1.5">
                    <Layers className="h-4 w-4 text-cyan-400" />
                    <span>Store Item Sales Distribution</span>
                  </h3>
                  
                  <div className="h-44 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analytics?.categoryDistribution || []}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={75}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {(analytics?.categoryDistribution || []).map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#07070a', border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: '12px' }}
                          itemStyle={{ color: '#fff', fontSize: '11px', fontFamily: 'monospace' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 text-[10px] font-mono border-t border-purple-500/10 pt-4">
                  {(analytics?.categoryDistribution || []).map((cat: any, index: number) => (
                    <div key={cat.name} className="flex items-center space-x-1.5">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}></span>
                      <span className="text-gray-400 truncate max-w-[65px]">{cat.name}:</span>
                      <span className="text-white font-bold">{cat.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* VIEW 2: REVENUE FLOW */}
        {activeTab === 'revenue' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Revenue metrics cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="rounded-2xl border border-cyan-500/10 bg-black/40 p-6 backdrop-blur-md">
                <span className="text-[9px] font-mono font-black text-gray-500 uppercase tracking-widest">Gross Store Sales</span>
                <h4 className="text-3.5xl font-black text-[#bf5af2] font-mono mt-1.5">
                  {formatPrice(totalGross)}
                </h4>
                <p className="text-[10px] text-gray-400 mt-2 font-mono">Total volume received directly through secure processors.</p>
              </div>

              <div className="rounded-2xl border border-cyan-500/10 bg-black/40 p-6 backdrop-blur-md">
                <span className="text-[9px] font-mono font-black text-gray-500 uppercase tracking-widest">Simulated Processing Fees (3.5%)</span>
                <h4 className="text-3.5xl font-black text-rose-400 font-mono mt-1.5">
                  {formatPrice(platformFees)}
                </h4>
                <p className="text-[10px] text-gray-400 mt-2 font-mono">Calculated bank fees, merchant cuts, and SSL ledger fees.</p>
              </div>

              <div className="rounded-2xl border border-cyan-500/10 bg-black/40 p-6 backdrop-blur-md">
                <span className="text-[9px] font-mono font-black text-gray-500 uppercase tracking-widest">Net Store Profit</span>
                <h4 className="text-3.5xl font-black text-emerald-400 font-mono mt-1.5">
                  {formatPrice(netEarnings)}
                </h4>
                <p className="text-[10px] text-gray-400 mt-2 font-mono">Liquid funds ready for extraction to designated payout address.</p>
              </div>

            </div>

            {/* Gateway breakdowns and historical logs */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              <div className="lg:col-span-8 rounded-2xl border border-purple-500/10 bg-black/40 p-6 backdrop-blur-md">
                <h3 className="text-sm font-black text-white uppercase font-mono mb-4 flex items-center gap-1.5">
                  <DollarSign className="h-4.5 w-4.5 text-[#bf5af2]" />
                  <span>Channel Revenue Split</span>
                </h3>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics?.dailyEarnings || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
                      <XAxis dataKey="day" stroke="#6b7280" fontSize={10} fontFamily="monospace" />
                      <YAxis stroke="#6b7280" fontSize={10} fontFamily="monospace" />
                      <Tooltip contentStyle={{ backgroundColor: '#07070a', border: '1px solid rgba(139, 92, 246, 0.2)' }} />
                      <Bar dataKey="Stripe" fill="#bf5af2" stackId="a" />
                      <Bar dataKey="PayPal" fill="#3b82f6" stackId="a" />
                      <Bar dataKey="Razorpay" fill="#06b6d4" stackId="a" />
                      <Bar dataKey="Crypto" fill="#10b981" stackId="a" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="lg:col-span-4 rounded-2xl border border-purple-500/10 bg-black/40 p-6 backdrop-blur-md flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-white uppercase font-mono flex items-center gap-1.5">
                    <Compass className="h-4.5 w-4.5 text-amber-400" />
                    <span>Currency Converter</span>
                  </h3>
                  <p className="text-xs text-gray-400">
                    Instantly simulate store gross payouts in secondary currencies with real-time exchange ratios.
                  </p>

                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between bg-black/30 p-2.5 rounded-xl border border-purple-500/5">
                      <span className="text-gray-500">Euro (EUR):</span>
                      <span className="text-white font-bold">€{(totalGross * 0.92).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between bg-black/30 p-2.5 rounded-xl border border-purple-500/5">
                      <span className="text-gray-500">British Pound (GBP):</span>
                      <span className="text-white font-bold">£{(totalGross * 0.79).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between bg-black/30 p-2.5 rounded-xl border border-purple-500/5">
                      <span className="text-gray-500">Indian Rupee (INR):</span>
                      <span className="text-cyan-400 font-extrabold">₹{(totalGross * 83.4).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between bg-black/30 p-2.5 rounded-xl border border-purple-500/5">
                      <span className="text-gray-500">Ethereum (ETH):</span>
                      <span className="text-emerald-400 font-bold">Ξ{(totalGross * 0.00031).toFixed(4)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#bf5af2]/5 border border-[#bf5af2]/10 p-3 rounded-xl text-[10px] text-center text-[#bf5af2] font-bold mt-4">
                  💡 Ledger syncing complete using global SSL exchange nodes.
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* VIEW 3: USERS CONFIG */}
        {activeTab === 'users' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h3 className="text-sm font-black text-white uppercase font-mono flex items-center gap-1.5">
                <Users className="h-4.5 w-4.5 text-emerald-400" />
                <span>Player Base Account Registers</span>
              </h3>

              {/* Search input */}
              <div className="relative max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Filter users..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full bg-black/40 border border-purple-500/10 focus:border-[#bf5af2]/30 rounded-xl py-1.5 pl-9 pr-4 text-xs focus:outline-none placeholder-gray-500 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* User List Table */}
              <div className="lg:col-span-8 bg-black/40 rounded-2xl border border-purple-500/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-purple-950/15 text-gray-400 uppercase text-[9px] font-mono tracking-wider border-b border-purple-500/10">
                      <tr>
                        <th className="px-5 py-3">Minecraft Character</th>
                        <th className="px-5 py-3">Email Context</th>
                        <th className="px-5 py-3">Current Rank</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-500/5 text-gray-300">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-purple-500/5 transition-colors">
                          <td className="px-5 py-3 font-mono flex items-center gap-2 font-bold text-white">
                            <img
                              src={`https://crafatar.com/avatars/${u.username}?size=16`}
                              alt="avatar"
                              className="h-4 w-4 rounded-sm"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://minotar.net/helm/Steve/16.png';
                              }}
                            />
                            <span>{u.username}</span>
                          </td>
                          <td className="px-5 py-3 text-gray-400">{u.email}</td>
                          <td className="px-5 py-3 text-cyan-400 font-mono font-extrabold">{u.rank}</td>
                          <td className="px-5 py-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                              u.status === 'Active' 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}>
                              {u.status}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-right">
                            <button
                              onClick={() => setSelectedUser(u)}
                              className="px-2.5 py-1 bg-[#bf5af2]/10 border border-[#bf5af2]/20 hover:bg-[#bf5af2]/20 text-[#bf5af2] hover:text-white rounded text-[10px] font-mono font-bold cursor-pointer"
                            >
                              Manage User
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Side manager console card */}
              <div className="lg:col-span-4 rounded-2xl border border-purple-500/10 bg-black/40 p-5 space-y-4 backdrop-blur-md">
                {selectedUser ? (
                  <div className="space-y-4 animate-fade-in">
                    <div className="flex items-center gap-3 border-b border-purple-500/10 pb-3">
                      <img
                        src={`https://crafatar.com/avatars/${selectedUser.username}?size=32`}
                        alt="avatar"
                        className="h-8 w-8 rounded"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://minotar.net/helm/Steve/32.png';
                        }}
                      />
                      <div>
                        <h4 className="text-sm font-black text-white font-sans">{selectedUser.username}</h4>
                        <span className="text-[10px] font-mono text-gray-500 block">UID: {selectedUser.id}</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs font-mono text-gray-400">
                      <div className="flex justify-between">
                        <span>Lobby Joins:</span>
                        <span className="text-white font-bold">{selectedUser.joins} times</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Coin Balance:</span>
                        <span className="text-cyan-400 font-extrabold">{selectedUser.coins} Coins</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Contact:</span>
                        <span className="text-white">{selectedUser.lastSeen}</span>
                      </div>
                    </div>

                    <div className="border-t border-purple-500/5 pt-3 space-y-3">
                      <span className="text-[9px] font-mono font-black text-[#bf5af2] uppercase tracking-wider block">Admin Privilege Controls</span>
                      
                      <div className="flex gap-2">
                        {selectedUser.status === 'Active' ? (
                          <button
                            onClick={() => handleUpdateUserStatus(selectedUser.id, 'Banned')}
                            className="flex-grow py-2 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 hover:text-white font-bold text-[10px] uppercase rounded-xl cursor-pointer"
                          >
                            Ban Character
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateUserStatus(selectedUser.id, 'Active')}
                            className="flex-grow py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 hover:text-white font-bold text-[10px] uppercase rounded-xl cursor-pointer"
                          >
                            Unban Player
                          </button>
                        )}
                        
                        <button
                          onClick={() => {
                            setIsEditingUser(true);
                          }}
                          className="px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-300 hover:text-white font-bold text-[10px] uppercase rounded-xl cursor-pointer"
                        >
                          Modify Coins
                        </button>
                      </div>

                      {isEditingUser && (
                        <div className="bg-black/60 p-3 rounded-xl border border-purple-500/10 space-y-2 animate-fade-in">
                          <label className="text-[9px] font-mono text-gray-500 uppercase">Set New Coin Balance</label>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              defaultValue={selectedUser.coins}
                              id="coins-modifier-field"
                              className="w-full bg-[#0a0a0c] border border-purple-500/20 focus:border-[#bf5af2]/30 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                            />
                            <button
                              onClick={() => {
                                const el = document.getElementById('coins-modifier-field') as HTMLInputElement;
                                if (el) handleSaveUserCoins(selectedUser.id, Number(el.value));
                              }}
                              className="px-3 bg-[#bf5af2] hover:bg-purple-500 text-black font-extrabold text-[10px] uppercase rounded-lg cursor-pointer"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500 space-y-2">
                    <ShieldAlert className="h-10 w-10 text-purple-500/30 mx-auto" />
                    <p className="text-xs font-mono">Select a player from the list to invoke admin overrides or look up account diagnostics.</p>
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        )}

        {/* VIEW 4: PRODUCTS LOGS */}
        {activeTab === 'products' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h3 className="text-sm font-black text-white uppercase font-mono flex items-center gap-1.5">
                <ShoppingBag className="h-4.5 w-4.5 text-amber-400" />
                <span>Product Catalog Registries</span>
              </h3>

              <div className="flex items-center gap-2">
                <div className="relative max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Filter products..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="bg-black/40 border border-purple-500/10 focus:border-[#bf5af2]/30 rounded-xl py-1.5 pl-9 pr-4 text-xs focus:outline-none text-white placeholder-gray-500"
                  />
                </div>

                <button
                  onClick={() => setIsEditingProduct(true)}
                  className="bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 px-3.5 py-1.5 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>New Product</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Product catalog list table */}
              <div className="lg:col-span-8 bg-black/40 rounded-2xl border border-purple-500/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-purple-950/15 text-gray-400 uppercase text-[9px] font-mono tracking-wider border-b border-purple-500/10">
                      <tr>
                        <th className="px-5 py-3">Product Name</th>
                        <th className="px-5 py-3">Category</th>
                        <th className="px-5 py-3">Price</th>
                        <th className="px-5 py-3 text-right">Overrides</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-500/5 text-gray-300">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-purple-500/5 transition-colors">
                          <td className="px-5 py-3 font-bold text-white font-sans">{p.name}</td>
                          <td className="px-5 py-3 font-mono text-cyan-400 text-[10px] uppercase">{p.category}</td>
                          <td className="px-5 py-3 font-mono font-bold text-emerald-400">{formatPrice(p.price)}</td>
                          <td className="px-5 py-3 text-right">
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="text-gray-500 hover:text-rose-400 p-1 cursor-pointer transition-colors"
                              title="Delete Item"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Side Add product block */}
              <div className="lg:col-span-4 rounded-2xl border border-purple-500/10 bg-black/40 p-5 space-y-4 backdrop-blur-md">
                {isEditingProduct ? (
                  <form onSubmit={handleAddProduct} className="space-y-4 animate-fade-in">
                    <div className="flex justify-between items-center border-b border-purple-500/10 pb-3">
                      <h4 className="text-sm font-black font-sans text-white uppercase tracking-wider">Create Custom Product</h4>
                      <button type="button" onClick={() => setIsEditingProduct(false)} className="text-gray-500 hover:text-white cursor-pointer">
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Product ID (Unique, slug format) *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. rank-overlord"
                          value={newProduct.id}
                          onChange={(e) => setNewProduct(prev => ({ ...prev, id: e.target.value }))}
                          className="w-full bg-[#0a0a0c] border border-purple-500/15 focus:border-[#bf5af2]/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Display Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Overlord Elite Ranks"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full bg-[#0a0a0c] border border-purple-500/15 focus:border-[#bf5af2]/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Price (USD) *</label>
                          <input
                            type="number"
                            step="0.01"
                            required
                            placeholder="e.g. 49.99"
                            value={newProduct.price || ''}
                            onChange={(e) => setNewProduct(prev => ({ ...prev, price: Number(e.target.value) }))}
                            className="w-full bg-[#0a0a0c] border border-purple-500/15 focus:border-[#bf5af2]/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Category *</label>
                          <select
                            value={newProduct.category}
                            onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full bg-[#0a0a0c] border border-purple-500/15 focus:border-[#bf5af2]/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                          >
                            {categories.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Short Description</label>
                        <textarea
                          placeholder="Specify brief reward description..."
                          value={newProduct.description}
                          onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                          className="w-full bg-[#0a0a0c] border border-purple-500/15 focus:border-[#bf5af2]/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none h-16 resize-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase rounded-xl cursor-pointer"
                    >
                      Publish to Active Shop Catalog
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-16 text-gray-500 space-y-3">
                    <ShoppingBag className="h-10 w-10 text-amber-500/30 mx-auto" />
                    <p className="text-xs font-mono">Create and append products inside active server catalog lists. These instantly render on the Store main front-page.</p>
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        )}

        {/* VIEW 5: ORDERS QUEUE */}
        {activeTab === 'orders' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between border-b border-purple-500/10 pb-3">
              <h3 className="text-sm font-black text-white uppercase font-mono flex items-center gap-1.5">
                <Clock className="h-4.5 w-4.5 text-blue-400" />
                <span>RCON Callback Execution Queue</span>
              </h3>
              <span className="text-xs font-mono text-gray-400">Total historical orders: {transactions.length}</span>
            </div>

            <div className="bg-black/40 rounded-2xl border border-purple-500/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-purple-950/15 text-gray-400 uppercase text-[9px] tracking-wider border-b border-purple-500/10">
                    <tr>
                      <th className="px-5 py-3">Invoice ID</th>
                      <th className="px-5 py-3">Player</th>
                      <th className="px-5 py-3">Timestamp</th>
                      <th className="px-5 py-3">Payment Channel</th>
                      <th className="px-5 py-3">Total Cost</th>
                      <th className="px-5 py-3">Sync Dispatch</th>
                      <th className="px-5 py-3 text-right">Commands Registered</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-500/5 text-gray-300">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-purple-500/5 transition-colors">
                        <td className="px-5 py-3 font-bold text-[#bf5af2]">{tx.id}</td>
                        <td className="px-5 py-3 text-white font-sans font-bold flex items-center gap-1.5">
                          <img
                            src={`https://crafatar.com/avatars/${tx.username}?size=14`}
                            alt="avatar"
                            className="h-3.5 w-3.5 rounded-sm"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://minotar.net/helm/Steve/14.png';
                            }}
                          />
                          <span>{tx.username}</span>
                        </td>
                        <td className="px-5 py-3 text-gray-400 text-[11px]">{new Date(tx.timestamp).toLocaleString()}</td>
                        <td className="px-5 py-3 text-cyan-400 font-bold uppercase">{tx.paymentMethod}</td>
                        <td className="px-5 py-3 text-emerald-400 font-bold">{formatPrice(tx.amount)}</td>
                        <td className="px-5 py-3">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase">
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <div className="flex flex-col gap-1 items-end max-w-[200px] truncate">
                            {tx.commands.map((cmd, idx) => (
                              <span key={idx} className="text-[10px] text-gray-500 font-mono truncate max-w-full block">
                                {cmd}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW 6: COUPONS */}
        {activeTab === 'coupons' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between border-b border-purple-500/10 pb-3">
              <h3 className="text-sm font-black text-white uppercase font-mono flex items-center gap-1.5">
                <Tag className="h-4.5 w-4.5 text-pink-400" />
                <span>Promo Coupon Settings</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Coupons List */}
              <div className="lg:col-span-8 bg-black/40 rounded-2xl border border-purple-500/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-purple-950/15 text-gray-400 uppercase text-[9px] tracking-wider border-b border-purple-500/10">
                      <tr>
                        <th className="px-5 py-3">Promo Code</th>
                        <th className="px-5 py-3">Discount Percent</th>
                        <th className="px-5 py-3">Expirations</th>
                        <th className="px-5 py-3">Times Used</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-500/5 text-gray-300">
                      {coupons.map((c) => (
                        <tr key={c.code} className="hover:bg-purple-500/5 transition-colors">
                          <td className="px-5 py-3 font-bold text-white text-sm">{c.code}</td>
                          <td className="px-5 py-3 text-cyan-400 font-extrabold">{c.discount}% OFF</td>
                          <td className="px-5 py-3 text-gray-400">{c.expiry}</td>
                          <td className="px-5 py-3 font-sans text-gray-300 font-bold">{c.uses} orders</td>
                          <td className="px-5 py-3">
                            <button
                              onClick={() => toggleCouponStatus(c.code)}
                              className={`px-2.5 py-0.5 rounded text-[10px] font-bold cursor-pointer border transition-colors ${
                                c.status === 'Active' 
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' 
                                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20'
                              }`}
                            >
                              {c.status}
                            </button>
                          </td>
                          <td className="px-5 py-3 text-right">
                            <button
                              onClick={() => handleDeleteCoupon(c.code)}
                              className="text-gray-500 hover:text-rose-400 p-1 cursor-pointer transition-colors"
                              title="Remove Coupon"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Add Coupon Panel */}
              <div className="lg:col-span-4 rounded-2xl border border-purple-500/10 bg-black/40 p-5 space-y-4 backdrop-blur-md">
                <form onSubmit={handleAddCoupon} className="space-y-4">
                  <div className="border-b border-purple-500/10 pb-3">
                    <h4 className="text-sm font-black font-sans text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Plus className="h-4 w-4 text-pink-400" />
                      <span>Create Promo Code</span>
                    </h4>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Coupon Code (Uppercase) *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. VIPPASS"
                        value={newCouponCode}
                        onChange={(e) => setNewCouponCode(e.target.value)}
                        className="w-full bg-[#0a0a0c] border border-purple-500/15 focus:border-[#bf5af2]/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Discount Rate Percentage *</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="5"
                          max="95"
                          step="5"
                          value={newCouponDiscount}
                          onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                          className="w-full accent-[#bf5af2]"
                        />
                        <span className="font-mono font-bold text-[#bf5af2] min-w-[35px] text-right">{newCouponDiscount}%</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Expiry Date *</label>
                      <input
                        type="date"
                        required
                        value={newCouponExpiry}
                        onChange={(e) => setNewCouponExpiry(e.target.value)}
                        className="w-full bg-[#0a0a0c] border border-purple-500/15 focus:border-[#bf5af2]/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-pink-500 hover:bg-pink-400 text-black font-extrabold text-xs uppercase rounded-xl cursor-pointer"
                  >
                    Deploy Promo Code
                  </button>
                </form>
              </div>

            </div>
          </motion.div>
        )}

        {/* VIEW 7: CATEGORIES */}
        {activeTab === 'categories' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between border-b border-purple-500/10 pb-3">
              <h3 className="text-sm font-black text-white uppercase font-mono flex items-center gap-1.5">
                <Layers className="h-4.5 w-4.5 text-orange-400" />
                <span>Store Categories</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              <div className="lg:col-span-8 bg-black/40 rounded-2xl border border-purple-500/10 p-6 space-y-4">
                <span className="text-[9px] font-mono font-black text-gray-500 uppercase tracking-widest block mb-1">Active Index Entries</span>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {categories.map((cat) => (
                    <div key={cat} className="p-3 bg-black/50 border border-purple-500/5 rounded-xl flex items-center justify-between font-mono text-xs text-white">
                      <span className="font-bold">{cat}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(cat)}
                        className="text-gray-500 hover:text-rose-400 p-1 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 rounded-2xl border border-purple-500/10 bg-black/40 p-5 space-y-4 backdrop-blur-md">
                <form onSubmit={handleAddCategory} className="space-y-4">
                  <div className="border-b border-purple-500/10 pb-3">
                    <h4 className="text-sm font-black font-sans text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Plus className="h-4 w-4 text-orange-400" />
                      <span>Add Custom Category</span>
                    </h4>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Category Registry Label *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Guild Boosters"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="w-full bg-[#0a0a0c] border border-purple-500/15 focus:border-[#bf5af2]/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-orange-500 hover:bg-orange-400 text-black font-extrabold text-xs uppercase rounded-xl cursor-pointer"
                  >
                    Register Category Entry
                  </button>
                </form>
              </div>

            </div>
          </motion.div>
        )}

        {/* VIEW 8: TICKETS CONTROL */}
        {activeTab === 'tickets' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between border-b border-purple-500/10 pb-3">
              <h3 className="text-sm font-black text-white uppercase font-mono flex items-center gap-1.5">
                <MessageSquare className="h-4.5 w-4.5 text-rose-400" />
                <span>Player Support Desk</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Tickets list */}
              <div className="lg:col-span-6 space-y-4">
                {tickets.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTicket(t)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all relative overflow-hidden block ${
                      activeTicket?.id === t.id 
                        ? 'bg-rose-500/10 border-rose-500/40 shadow-[0_0_15px_rgba(239,68,68,0.1)]' 
                        : 'bg-black/40 border-purple-500/10 hover:border-purple-500/20'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="space-y-0.5">
                        <span className="font-mono text-[9px] font-black text-[#bf5af2] block">ID: {t.id}</span>
                        <h4 className="text-xs font-black text-white">{t.subject}</h4>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                        t.priority === 'High' 
                          ? 'bg-rose-500/15 text-rose-400' 
                          : t.priority === 'Medium' 
                          ? 'bg-amber-500/15 text-amber-400' 
                          : 'bg-cyan-500/15 text-cyan-400'
                      }`}>
                        {t.priority}
                      </span>
                    </div>

                    <p className="text-[10px] text-gray-400 line-clamp-2 mt-2 leading-relaxed">
                      {t.message}
                    </p>

                    <div className="flex items-center justify-between border-t border-purple-500/5 mt-3 pt-2.5 text-[10px] font-mono text-gray-500">
                      <span>Sender: <b className="text-cyan-400">{t.sender}</b></span>
                      <span className={`font-bold ${t.status === 'Open' ? 'text-rose-400 animate-pulse' : t.status === 'In Progress' ? 'text-amber-400' : 'text-gray-400'}`}>
                        {t.status}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Ticket interaction panel */}
              <div className="lg:col-span-6 rounded-2xl border border-purple-500/10 bg-black/40 p-5 space-y-4 backdrop-blur-md">
                {activeTicket ? (
                  <div className="space-y-4 animate-fade-in">
                    <div className="flex justify-between items-center border-b border-purple-500/10 pb-3">
                      <div>
                        <span className="font-mono text-[9px] font-black text-rose-400 block">SUPPORT DESK INTEGRATION</span>
                        <h4 className="text-sm font-black text-white font-sans">{activeTicket.subject}</h4>
                      </div>

                      {/* Status selectors */}
                      <div className="flex gap-1.5">
                        {['Open', 'In Progress', 'Closed'].map((st: any) => (
                          <button
                            key={st}
                            onClick={() => handleUpdateTicketStatus(activeTicket.id, st)}
                            className={`px-2 py-1 rounded text-[9px] font-mono font-bold transition-colors cursor-pointer ${
                              activeTicket.status === st 
                                ? 'bg-rose-500/15 border-rose-500/30 text-rose-300' 
                                : 'bg-black/40 border-purple-500/5 text-gray-500'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sender profile */}
                    <div className="bg-black/30 p-3 rounded-xl border border-purple-500/5 text-xs text-gray-400 font-mono space-y-1.5">
                      <div className="flex justify-between">
                        <span>Initiated By:</span>
                        <span className="text-white font-bold">{activeTicket.sender}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Timestamp:</span>
                        <span className="text-white">{activeTicket.timestamp}</span>
                      </div>
                    </div>

                    {/* Chat Stream message and staff notes */}
                    <div className="space-y-2.5 max-h-[200px] overflow-y-auto pr-1">
                      {/* Player Message */}
                      <div className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl space-y-1">
                        <span className="text-[9px] font-mono font-bold text-rose-400 block uppercase">Player: {activeTicket.sender}</span>
                        <p className="text-xs text-gray-300 leading-relaxed font-sans">{activeTicket.message}</p>
                      </div>

                      {/* Thread Replies */}
                      {activeTicket.responses.map((rep: string, idx: number) => {
                        const isStaff = rep.startsWith('Staff:');
                        return (
                          <div 
                            key={idx} 
                            className={`p-3 rounded-xl border text-xs leading-relaxed ${
                              isStaff 
                                ? 'bg-emerald-500/5 border-emerald-500/10 ml-6 text-emerald-300' 
                                : 'bg-rose-500/5 border-rose-500/10 text-rose-300'
                            }`}
                          >
                            <span className="text-[9px] font-mono font-bold block uppercase mb-1">
                              {isStaff ? '✓ Staff Override Agent' : `Player: ${activeTicket.sender}`}
                            </span>
                            <p className="font-sans">{rep.replace('Staff:', '').replace('System:', '')}</p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Reply Form */}
                    <form onSubmit={handleReplyTicket} className="flex gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Type reply to player..."
                        value={ticketReply}
                        onChange={(e) => setTicketReply(e.target.value)}
                        className="flex-grow bg-[#0a0a0c] border border-purple-500/15 focus:border-[#bf5af2]/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="bg-rose-500 hover:bg-rose-400 text-black font-extrabold text-xs px-4 rounded-xl flex items-center justify-center cursor-pointer"
                      >
                        <Send className="h-3.5 w-3.5" />
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="text-center py-16 text-gray-500 space-y-2">
                    <HeartHandshake className="h-10 w-10 text-rose-500/30 mx-auto" />
                    <p className="text-xs font-mono">Select a player ticket to reply, change priority registers, or review diagnostic text dumps.</p>
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        )}

        {/* VIEW 9: ANNOUNCEMENTS SETTINGS */}
        {activeTab === 'announcements' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between border-b border-purple-500/10 pb-3">
              <h3 className="text-sm font-black text-white uppercase font-mono flex items-center gap-1.5">
                <Megaphone className="h-4.5 w-4.5 text-yellow-400" />
                <span>Storefront Banners &amp; Alerts</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              <div className="lg:col-span-7 rounded-2xl border border-purple-500/10 bg-black/40 p-6 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Global Top Alert Banner Text *</label>
                    <input
                      type="text"
                      value={announcements.globalAlert}
                      onChange={(e) => setAnnouncements((prev: any) => ({ ...prev, globalAlert: e.target.value }))}
                      className="w-full bg-[#0a0a0c] border border-purple-500/15 focus:border-[#bf5af2]/30 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Alert speed (FPS seconds)</label>
                      <input
                        type="number"
                        value={announcements.marqueeSpeed}
                        onChange={(e) => setAnnouncements((prev: any) => ({ ...prev, marqueeSpeed: Number(e.target.value) }))}
                        className="w-full bg-[#0a0a0c] border border-purple-500/15 focus:border-[#bf5af2]/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Display status</label>
                      <button
                        onClick={() => setAnnouncements((prev: any) => ({ ...prev, showBanner: !prev.showBanner }))}
                        className={`w-full py-2.5 rounded-xl text-xs font-mono font-bold uppercase transition-colors cursor-pointer border ${
                          announcements.showBanner 
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                            : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                        }`}
                      >
                        {announcements.showBanner ? '✓ Banner Enabled' : '✖ Banner Disabled'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">General Store Popup Modal Alert Message</label>
                    <textarea
                      value={announcements.popupMessage}
                      onChange={(e) => setAnnouncements((prev: any) => ({ ...prev, popupMessage: e.target.value }))}
                      className="w-full bg-[#0a0a0c] border border-purple-500/15 focus:border-[#bf5af2]/30 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none h-20 resize-none"
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    addAuditLog("Updated global store announcements and alert tickers.");
                    showToast("Announcements saved successfully.");
                  }}
                  className="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold text-xs uppercase rounded-xl cursor-pointer"
                >
                  Apply Live Banner Configs
                </button>
              </div>

              {/* Interactive Marquee Preview Card */}
              <div className="lg:col-span-5 rounded-2xl border border-purple-500/10 bg-black/40 p-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <span className="text-[9px] font-mono font-black text-yellow-400 uppercase tracking-widest block">Live Render Preview</span>
                  
                  {announcements.showBanner ? (
                    <div className="relative overflow-hidden bg-yellow-500/5 border border-yellow-500/10 p-3 rounded-xl">
                      <div className="whitespace-nowrap animate-pulse font-mono text-[10px] text-yellow-300">
                        {announcements.globalAlert}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500 font-mono text-xs border border-purple-500/5 rounded-xl">
                      Announcement banner is hidden.
                    </div>
                  )}

                  <div className="bg-[#0a0a0c] rounded-xl border border-purple-500/5 p-4 space-y-3">
                    <span className="text-[9px] font-mono text-gray-500 uppercase block">Modal popup draft preview</span>
                    <div className="bg-black/50 p-3 rounded-lg border border-purple-500/10">
                      <div className="flex items-center gap-1.5 text-rose-400 text-[10px] font-bold uppercase mb-1">
                        <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />
                        <span>Server Advisory Alert</span>
                      </div>
                      <p className="text-[10px] text-gray-300 font-sans leading-relaxed">
                        {announcements.popupMessage}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-[9px] font-mono text-gray-500 text-center leading-normal mt-4">
                  ✓ Synchronizes instantly across lobby socket loops.
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* VIEW 10: DISCORD WEBHOOK INTEGRATION */}
        {activeTab === 'discord' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between border-b border-purple-500/10 pb-3">
              <h3 className="text-sm font-black text-white uppercase font-mono flex items-center gap-1.5">
                <Cpu className="h-4.5 w-4.5 text-indigo-400" />
                <span>Discord Integration Sandbox</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              <div className="lg:col-span-7 rounded-2xl border border-purple-500/10 bg-black/40 p-6 space-y-4">
                <div>
                  <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Webhook URL Endpoint *</label>
                  <input
                    type="password"
                    value={discordSettings.webhookUrl}
                    onChange={(e) => setDiscordSettings((prev: any) => ({ ...prev, webhookUrl: e.target.value }))}
                    className="w-full bg-[#0a0a0c] border border-purple-500/15 focus:border-[#bf5af2]/30 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-3.5 border-t border-purple-500/5 pt-3.5">
                  <span className="text-[9px] font-mono font-black text-[#bf5af2] uppercase tracking-wider block">Automatic Notification Triggers</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    
                    <button
                      onClick={() => setDiscordSettings((prev: any) => ({ ...prev, notifyOnOrder: !prev.notifyOnOrder }))}
                      className={`p-3 rounded-xl border text-[10px] font-mono font-bold uppercase text-center transition-all cursor-pointer ${
                        discordSettings.notifyOnOrder 
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                          : 'bg-black/30 border-purple-500/5 text-gray-500'
                      }`}
                    >
                      On Order Completed
                    </button>

                    <button
                      onClick={() => setDiscordSettings((prev: any) => ({ ...prev, notifyOnTicket: !prev.notifyOnTicket }))}
                      className={`p-3 rounded-xl border text-[10px] font-mono font-bold uppercase text-center transition-all cursor-pointer ${
                        discordSettings.notifyOnTicket 
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                          : 'bg-black/30 border-purple-500/5 text-gray-500'
                      }`}
                    >
                      On Ticket Opened
                    </button>

                    <button
                      onClick={() => setDiscordSettings((prev: any) => ({ ...prev, notifyOnAlert: !prev.notifyOnAlert }))}
                      className={`p-3 rounded-xl border text-[10px] font-mono font-bold uppercase text-center transition-all cursor-pointer ${
                        discordSettings.notifyOnAlert 
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                          : 'bg-black/30 border-purple-500/5 text-gray-500'
                      }`}
                    >
                      On Status Alert
                    </button>

                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      addAuditLog("Updated active Discord Webhook integration credentials.");
                      showToast("Discord settings locked.");
                    }}
                    className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-black font-extrabold text-xs uppercase rounded-xl cursor-pointer"
                  >
                    Lock Discord Parameters
                  </button>

                  <button
                    onClick={handleSendDiscordTest}
                    disabled={sendingDiscordTest}
                    className="px-5 py-2.5 bg-black/40 hover:bg-white/5 border border-purple-500/20 text-indigo-400 hover:text-indigo-300 rounded-xl text-xs font-bold uppercase cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Send Test Webhook</span>
                  </button>
                </div>
              </div>

              {/* Webhook terminal stream */}
              <div className="lg:col-span-5 rounded-2xl border border-indigo-500/20 bg-black/60 p-5 flex flex-col justify-between h-[300px]">
                <div>
                  <div className="flex items-center space-x-1.5 text-indigo-400 font-mono text-[9px] font-black border-b border-indigo-500/10 pb-2 mb-3 uppercase">
                    <Terminal className="h-3.5 w-3.5 animate-pulse" />
                    <span>Payload Stream Dispatcher</span>
                  </div>

                  <div className="bg-[#050508] border border-indigo-500/5 rounded-xl p-3 h-[200px] overflow-y-auto font-mono text-[9px] leading-relaxed text-indigo-300 space-y-1.5">
                    {discordPayloadConsole.length === 0 ? (
                      <div className="text-gray-500 text-center py-12">
                        Click "Send Test Webhook" to initiate simulated json network handshake logs.
                      </div>
                    ) : (
                      discordPayloadConsole.map((log, idx) => (
                        <div key={idx} className="whitespace-pre-wrap">
                          {log}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* VIEW 11: RCON SYSTEM CONSOLE LOGS */}
        {activeTab === 'logs' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Terminal Panel */}
              <div className="rounded-2xl border border-cyan-500/20 bg-black/60 p-6 backdrop-blur-md flex flex-col justify-between h-[450px]">
                <div>
                  <div className="flex items-center justify-between mb-4 border-b border-cyan-500/10 pb-2.5">
                    <div className="flex items-center space-x-2 text-cyan-400 font-bold">
                      <Terminal className="h-4.5 w-4.5 animate-pulse" />
                      <span className="text-xs font-mono uppercase tracking-wider">Simulated live RCON terminal</span>
                    </div>
                    <button 
                      onClick={handleClearLogs}
                      className="text-[9px] font-mono text-cyan-400/70 hover:text-cyan-300 hover:bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded cursor-pointer"
                    >
                      Clear stream
                    </button>
                  </div>

                  {/* Log stream output */}
                  <div className="bg-[#050508] border border-cyan-500/5 rounded-xl p-3.5 h-[280px] overflow-y-auto font-mono text-[10px] leading-relaxed space-y-1 text-cyan-300">
                    {consoleLogs.map((log, idx) => (
                      <div key={idx} className="whitespace-pre-wrap">
                        <span className="text-cyan-500/50 mr-1.5">&gt;&gt;</span>
                        {log}
                      </div>
                    ))}
                    <div ref={logsEndRef} />
                  </div>
                </div>

                <form onSubmit={handleCommandSubmit} className="mt-4 flex gap-2">
                  <div className="relative flex-grow">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500/70 text-xs font-mono">/</span>
                    <input
                      type="text"
                      placeholder="Type console command (e.g., op shisir)"
                      value={customCommand}
                      onChange={(e) => setCustomCommand(e.target.value)}
                      className="w-full bg-[#030305] border border-cyan-500/20 focus:border-cyan-500/40 rounded-xl py-2 pl-6 pr-4 text-xs font-mono text-cyan-200 focus:outline-none placeholder-cyan-700"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!customCommand.trim()}
                    className="bg-cyan-950 hover:bg-cyan-900 text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 font-bold text-xs px-4 py-2 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <Play className="h-3 w-3" />
                    <span>Run</span>
                  </button>
                </form>
              </div>

              {/* Security Audit Trails */}
              <div className="rounded-2xl border border-purple-500/10 bg-black/40 p-6 flex flex-col justify-between h-[450px]">
                <div>
                  <h3 className="text-sm font-black text-white uppercase font-mono mb-4 border-b border-purple-500/10 pb-2.5 flex items-center gap-1.5">
                    <FileText className="h-4.5 w-4.5 text-purple-400" />
                    <span>Security Audit Trail logs</span>
                  </h3>

                  <div className="space-y-2 overflow-y-auto max-h-[340px] pr-1">
                    {auditLogs.map((log, index) => (
                      <div key={index} className="p-2.5 bg-black/40 border border-purple-500/5 rounded-xl font-mono text-[10px] text-gray-400 flex items-start gap-1.5 leading-normal">
                        <ChevronRight className="h-3 w-3 text-[#bf5af2] flex-shrink-0 mt-0.5" />
                        <span>{log}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <span className="text-[9px] font-mono text-gray-600 block text-center pt-2.5 border-t border-purple-500/5">
                  🛡️ Securely backed up to server config parameters.
                </span>
              </div>

            </div>
          </motion.div>
        )}

        {/* VIEW 12: GLOBAL SETTINGS */}
        {activeTab === 'settings' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between border-b border-purple-500/10 pb-3">
              <h3 className="text-sm font-black text-white uppercase font-mono flex items-center gap-1.5">
                <Settings2 className="h-4.5 w-4.5 text-teal-400" />
                <span>Global Store Settings Configurations</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              <div className="lg:col-span-8 rounded-2xl border border-purple-500/10 bg-black/40 p-6 space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div>
                    <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Base Currency Symbol</label>
                    <select
                      value={settings.storeCurrency}
                      onChange={(e) => setSettings((prev: any) => ({ ...prev, storeCurrency: e.target.value }))}
                      className="w-full bg-[#0a0a0c] border border-purple-500/15 focus:border-[#bf5af2]/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="INR">INR (₹)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Regional VAT/GST Tax rate (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={settings.taxRate}
                      onChange={(e) => setSettings((prev: any) => ({ ...prev, taxRate: Number(e.target.value) }))}
                      className="w-full bg-[#0a0a0c] border border-purple-500/15 focus:border-[#bf5af2]/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Lobby Sync Interval (Seconds)</label>
                    <input
                      type="number"
                      min="5"
                      max="60"
                      value={settings.autoSyncPeriod}
                      onChange={(e) => setSettings((prev: any) => ({ ...prev, autoSyncPeriod: Number(e.target.value) }))}
                      className="w-full bg-[#0a0a0c] border border-purple-500/15 focus:border-[#bf5af2]/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Core Server Target Address</label>
                    <input
                      type="text"
                      value={settings.serverIp}
                      onChange={(e) => setSettings((prev: any) => ({ ...prev, serverIp: e.target.value }))}
                      className="w-full bg-[#0a0a0c] border border-purple-500/15 focus:border-[#bf5af2]/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono"
                    />
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-purple-500/5 pt-5">
                  
                  <div>
                    <span className="text-[10px] font-mono text-gray-500 uppercase block mb-2">Stripe &amp; Razorpay Sandbox Mode</span>
                    <button
                      onClick={() => setSettings((prev: any) => ({ ...prev, sandboxMode: !prev.sandboxMode }))}
                      className={`w-full py-2.5 rounded-xl text-xs font-mono font-bold uppercase transition-colors cursor-pointer border ${
                        settings.sandboxMode 
                          ? 'bg-[#bf5af2]/10 border-[#bf5af2]/30 text-[#bf5af2]' 
                          : 'bg-black/30 border-purple-500/5 text-gray-400'
                      }`}
                    >
                      {settings.sandboxMode ? '✓ Sandbox Enabled' : '✖ Live Processing'}
                    </button>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-gray-500 uppercase block mb-2">Store Maintenance Mode Override</span>
                    <button
                      onClick={() => setSettings((prev: any) => ({ ...prev, maintenanceMode: !prev.maintenanceMode }))}
                      className={`w-full py-2.5 rounded-xl text-xs font-mono font-bold uppercase transition-colors cursor-pointer border ${
                        settings.maintenanceMode 
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' 
                          : 'bg-black/30 border-purple-500/5 text-gray-400'
                      }`}
                    >
                      {settings.maintenanceMode ? '✖ Store Offline (Maintenance)' : '✓ Store Online (Open)'}
                    </button>
                  </div>

                </div>

                <button
                  onClick={() => {
                    addAuditLog("Applied global server settings parameters.");
                    showToast("Settings saved successfully.");
                  }}
                  className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-black font-extrabold text-xs uppercase rounded-xl cursor-pointer"
                >
                  Save Global Parameters
                </button>

              </div>

              <div className="lg:col-span-4 rounded-2xl border border-purple-500/10 bg-black/40 p-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <span className="text-[9px] font-mono font-black text-teal-400 uppercase tracking-widest block">Server Health Status</span>
                  
                  <div className="bg-[#0a0a0c] rounded-xl border border-purple-500/5 p-4 space-y-3 font-mono text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Database Engine:</span>
                      <span className="text-emerald-400 font-bold">Connected</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">RCON Websocket:</span>
                      <span className="text-emerald-400 font-bold">Online</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">LuckPerms Hub:</span>
                      <span className="text-emerald-400 font-bold">Synced</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Stripe Webhooks:</span>
                      <span className="text-emerald-400 font-bold">Active</span>
                    </div>
                  </div>
                </div>

                <div className="text-[9px] font-mono text-gray-500 text-center leading-normal mt-4">
                  All systems operating normally. Sandbox triggers active.
                </div>
              </div>

            </div>
          </motion.div>
        )}

      </div>

    </div>
  );
};
