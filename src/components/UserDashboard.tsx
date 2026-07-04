import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  Key, 
  CreditCard, 
  Wallet, 
  Download, 
  ShoppingBag, 
  Bell, 
  Settings, 
  Award, 
  HelpCircle, 
  PlusCircle, 
  Check, 
  Trash2, 
  KeyRound, 
  RefreshCw, 
  Smartphone, 
  Eye, 
  EyeOff, 
  Loader2, 
  Search, 
  ArrowRight, 
  Star, 
  Heart, 
  Trophy, 
  FileText, 
  CheckCircle2, 
  Ticket,
  ChevronRight,
  MessageSquare,
  AlertTriangle,
  Send,
  Zap,
  CheckCircle,
  Copy,
  DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ServerStatus, CartItem } from '../types';

interface UserDashboardProps {
  connectedUser: string | null;
  onConnectUser: (username: string) => void;
  onDisconnectUser: () => void;
  formatPrice: (price: number) => string;
}

// Sub-navigation interfaces
type DashboardTab = 
  | 'profile' 
  | 'wallet' 
  | 'orders' 
  | 'downloads' 
  | 'security' 
  | 'tickets' 
  | 'achievements' 
  | 'notifications';

export const UserDashboard: React.FC<UserDashboardProps> = ({
  connectedUser,
  onConnectUser,
  onDisconnectUser,
  formatPrice
}) => {
  // Current user context
  const activeUser = connectedUser || 'shisir';
  
  // Tab control state
  const [activeTab, setActiveTab] = useState<DashboardTab>('profile');

  // Interactive profile state
  const [customTitle, setCustomTitle] = useState('Cosmic Emperor');
  const [bio, setBio] = useState('Veteran Minecraft architect and Skyblock void champion. Dominating dungeons since 2023.');
  const [discordLinked, setDiscordLinked] = useState(true);
  const [microsoftLinked, setMicrosoftLinked] = useState(true);
  const [githubLinked, setGithubLinked] = useState(false);
  const [saveProfileSuccess, setSaveProfileSuccess] = useState(false);

  // Security 2FA settings states
  const [is2faEnabled, setIs2faEnabled] = useState(false);
  const [is2faSetupOpen, setIs2faSetupOpen] = useState(false);
  const [pin2fa, setPin2fa] = useState('');
  const [twoFactorError, setTwoFactorError] = useState('');
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedBackup, setCopiedBackup] = useState(false);

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Active sessions & audit log states (REAL BACKEND VALUES)
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const [securityAuditLogs, setSecurityAuditLogs] = useState<any[]>([]);

  // Fetch real profile details
  const fetchUserProfile = async () => {
    const token = localStorage.getItem('volex_jwt_token') || sessionStorage.getItem('volex_jwt_token');
    if (!token) return;

    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        const user = data.user;
        
        if (user.username && user.username !== connectedUser) {
          onConnectUser(user.username);
        }

        setIs2faEnabled(user.twoFactorEnabled);
        setUserCoins(user.coins);
        setUserTokens(user.tokens);
        setDiscordLinked(user.discordLinked);
        setGithubLinked(user.googleLinked);
        setActiveSessions(user.sessions || []);
        setSecurityAuditLogs(user.auditLogs || []);
      }
    } catch (e) {
      console.error("Error fetching user profile:", e);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    // Poll profile details to keep metrics in sync
    const interval = setInterval(fetchUserProfile, 4000);
    return () => clearInterval(interval);
  }, [connectedUser]);

  // Wallet and coins states
  const [userCoins, setUserCoins] = useState(25430);
  const [userTokens, setUserTokens] = useState(1200);
  const [isAddingCoins, setIsAddingCoins] = useState(false);
  const [addCoinsStep, setAddCoinsStep] = useState<'select' | 'processing' | 'success'>('select');
  const [selectedCoinPack, setSelectedCoinPack] = useState({ coins: 5000, price: 24.99 });
  const [coinTransactions, setCoinTransactions] = useState([
    { id: 'TXN-90142', description: 'Store Purchase (+5,000 Coins Bundle)', amount: '+5,000', currency: 'coins', date: '2026-07-02', status: 'Completed' },
    { id: 'TXN-88941', description: 'Bought RGB Slime Companion Pet', amount: '-2,900', currency: 'coins', date: '2026-06-28', status: 'Completed' },
    { id: 'TXN-88120', description: 'Daily Web Portal Streak Reward', amount: '+100', currency: 'coins', date: '2026-07-04', status: 'Completed' },
    { id: 'TXN-87421', description: 'Crate Unboxing fee (Ancient)', amount: '-400', currency: 'coins', date: '2026-06-15', status: 'Completed' },
    { id: 'TXN-86512', description: 'Converted Gold Tokens to Coins', amount: '+2,000', currency: 'coins', date: '2026-05-19', status: 'Completed' },
  ]);

  // Support tickets states
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketPriority, setTicketPriority] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [ticketCategory, setTicketCategory] = useState('Billing Issue');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketsList, setTicketsList] = useState([
    {
      id: 'TKT-9421',
      subject: 'Rank upgrade VIP to VIP+ didn\'t sync immediately',
      category: 'Billing Issue',
      priority: 'Critical',
      status: 'Resolved',
      date: '2026-07-02',
      messages: [
        { sender: 'user', text: 'Hey, I just purchased the VIP+ upgrade from VIP but my rank prefix inside Lobby 2 is still VIP. Can you check?', timestamp: '2026-07-02 14:32' },
        { sender: 'admin', text: 'Hello, Notch! I checked our gateway records. The transaction was secured on Stripe. I manually dispatched the parent LuckPerms node command on our main Lobby instance. Could you reconnect to the server and confirm?', timestamp: '2026-07-02 14:39' },
        { sender: 'user', text: 'Awesome! I reconnected and now I have VIP+ prefix with custom green tag modifiers. Thank you so much for the instant service!', timestamp: '2026-07-02 14:45' }
      ]
    },
    {
      id: 'TKT-8120',
      subject: 'Unable to toggle particle aura trail inside Void Skyblock',
      category: 'Game Bug',
      priority: 'Medium',
      status: 'Open',
      date: '2026-07-03',
      messages: [
        { sender: 'user', text: 'I unlocked the Inferno Flame Particle Trail but when I enter the skyblock lobby and type /trails, it says particle limits reached on my island coordinates.', timestamp: '2026-07-03 18:22' },
        { sender: 'admin', text: 'Hi shisir, our Skyblock islands have safe particle throttling limits of 200 units per region chunk to maintain server FPS. Let me check if we can whitelist your MVP+ rank coordinates.', timestamp: '2026-07-04 01:15' }
      ]
    }
  ]);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [ticketReplyText, setTicketReplyText] = useState('');
  const [ticketCreateSuccess, setTicketCreateSuccess] = useState(false);

  // Active downloads states
  const [downloadsList, setDownloadsList] = useState([
    { id: 'dl-1', title: 'Volex Cyber HD 256x Resource Pack', size: '142 MB', version: 'v1.21.x Optimized', count: 4832, progress: 0, isDownloading: false },
    { id: 'dl-2', title: 'Volex PvP Optimized FPS Booster pack', size: '32 MB', version: 'v1.20.x/v1.21.x', count: 12942, progress: 0, isDownloading: false },
    { id: 'dl-3', title: 'Volex Custom HUD Client Companion Mod (Fabric/Forge)', size: '12 MB', version: 'v2.4.1 Beta', count: 1842, progress: 0, isDownloading: false },
    { id: 'dl-4', title: 'Cosmic Overlord Wallpapers Pack (4K UHD Render)', size: '84 MB', version: 'Latest Release', count: 2439, progress: 0, isDownloading: false }
  ]);

  // Notifications state
  const [notifications, setNotifications] = useState([
    { id: 'notif-1', title: '🚨 Security Recommendation', message: 'Two-Factor Authentication is highly recommended to protect your virtual coin balances and crate keys.', type: 'security', read: false, date: 'Just now' },
    { id: 'notif-2', title: '🎁 Daily Streak Reward Unlocked', message: 'You have logged in for 4 consecutive days. Claim 100 Volex Coins inside the virtual wallet tab.', type: 'reward', read: false, date: '2 hours ago' },
    { id: 'notif-3', title: '⚙️ Maintenance: Lobby 3 Upgrades', message: 'Lobby 3 will undergo database node upgrades on July 8 at 02:00 UTC. Expect 15 mins down times on that block.', type: 'system', read: true, date: '1 day ago' },
    { id: 'notif-4', title: '🎉 Double Coins Weekend Event', message: 'Season 4 summer event is active! Earn 2x coin drops on all Dungeons and PvP mini-games.', type: 'promo', read: true, date: '2 days ago' }
  ]);

  // Command sync simulation state
  const [isSyncingCommands, setIsSyncingCommands] = useState(false);
  const [syncStatusText, setSyncStatusText] = useState<string | null>(null);

  // Achievement list states
  const [achievements, setAchievements] = useState([
    { id: 'ach-1', title: 'First Connection', desc: 'Sync your Minecraft Character ID to the Volex web store.', points: 100, reward: '100 Volex Coins', progress: 100, claimed: true, category: 'General' },
    { id: 'ach-2', title: 'Store Veteran', desc: 'Complete 3 or more store package transactions.', points: 250, reward: '[Veteran] Prefix tag', progress: 100, claimed: true, category: 'Shopping' },
    { id: 'ach-3', title: 'Secure Vault', desc: 'Configure Two-Factor Authentication (2FA) for your web profile.', points: 150, reward: '1,000 Coins Bonus', progress: 0, claimed: false, category: 'Security' },
    { id: 'ach-4', title: 'Coin Emperor', desc: 'Reach a balance of 20,000+ Volex Coins.', points: 200, reward: 'Golden Nameplate glow', progress: 100, claimed: false, category: 'Finance' },
    { id: 'ach-5', title: 'Master Contributor', desc: 'Active level 100 check in server networks.', points: 500, reward: 'Cosmic Wing access', progress: 84, claimed: false, category: 'Gameplay' },
    { id: 'ach-6', title: 'Support Advocate', desc: 'Submit and resolve an issue thread with our staff.', points: 100, reward: '100 Guild XP Points', progress: 100, claimed: false, category: 'General' }
  ]);

  // Settings states
  const [lobbyFlight, setLobbyFlight] = useState(true);
  const [joinFireworks, setJoinFireworks] = useState(true);
  const [particleRenderRange, setParticleRenderRange] = useState(40);
  const [hudVisibility, setHudVisibility] = useState(true);
  const [showDiscordActivity, setShowDiscordActivity] = useState(true);
  const [preferredLang, setPreferredLang] = useState('English');

  // Interactive password strength evaluator
  useEffect(() => {
    let score = 0;
    if (newPassword.length >= 6) score += 1;
    if (newPassword.length >= 10) score += 1;
    if (/[A-Z]/.test(newPassword)) score += 1;
    if (/[0-9]/.test(newPassword)) score += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) score += 1;
    setPasswordStrength(score);
  }, [newPassword]);

  // Synchronize LuckPerms server check simulation
  const handleSyncCommands = () => {
    setIsSyncingCommands(true);
    setSyncStatusText("QUERYING MOJANG UUID REGISTRIES...");
    
    setTimeout(() => {
      setSyncStatusText("DEPLOYING PERMISSION PARRENT NODES...");
      setTimeout(() => {
        setSyncStatusText("BROADCASTING SYNC COMMANDS ON LUCKPERMS...");
        setTimeout(() => {
          setIsSyncingCommands(false);
          setSyncStatusText("SYNCHRONIZATION COMPLETED SUCCESSFULLY! Reconnect in-game.");
          setTimeout(() => setSyncStatusText(null), 4000);
        }, 1200);
      }, 1000);
    }, 1000);
  };

  // Submit support ticket reply
  const handleTicketReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketReplyText.trim() || !selectedTicketId) return;

    setTicketsList(prev => prev.map(tkt => {
      if (tkt.id === selectedTicketId) {
        return {
          ...tkt,
          messages: [
            ...tkt.messages,
            { sender: 'user', text: ticketReplyText.trim(), timestamp: 'Just Now' }
          ]
        };
      }
      return tkt;
    }));

    setTicketReplyText('');

    // Simulate Admin response
    setTimeout(() => {
      setTicketsList(prev => prev.map(tkt => {
        if (tkt.id === selectedTicketId) {
          return {
            ...tkt,
            messages: [
              ...tkt.messages,
              { sender: 'admin', text: 'Thank you for updating the ticket. Our active lead engineers are assessing your query node on Lobby cluster B. Please standby.', timestamp: 'A few seconds ago' }
            ]
          };
        }
        return tkt;
      }));
    }, 2000);
  };

  // Create new ticket action
  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) return;

    const newTicket = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: ticketSubject,
      category: ticketCategory,
      priority: ticketPriority,
      status: 'Open',
      date: new Date().toISOString().split('T')[0],
      messages: [
        { sender: 'user', text: ticketMessage, timestamp: 'Just Now' }
      ]
    };

    setTicketsList(prev => [newTicket, ...prev]);
    setTicketSubject('');
    setTicketMessage('');
    setTicketCreateSuccess(true);
    setTimeout(() => setTicketCreateSuccess(false), 4000);
  };

  // Simulated download triggers
  const startDownload = (id: string) => {
    setDownloadsList(prev => prev.map(dl => {
      if (dl.id === id) {
        return { ...dl, isDownloading: true, progress: 0 };
      }
      return dl;
    }));

    const interval = setInterval(() => {
      setDownloadsList(prev => prev.map(dl => {
        if (dl.id === id) {
          if (dl.progress >= 100) {
            clearInterval(interval);
            return { ...dl, isDownloading: false, progress: 100 };
          }
          return { ...dl, progress: dl.progress + 10 };
        }
        return dl;
      }));
    }, 250);
  };

  // Claim achievement reward simulation
  const claimAchievementReward = (id: string) => {
    setAchievements(prev => prev.map(ach => {
      if (ach.id === id) {
        // If it's the coin reward, add coins!
        if (ach.id === 'ach-3') {
          setUserCoins(c => c + 1000);
        } else if (ach.id === 'ach-4') {
          // Glow claimed
        }
        return { ...ach, claimed: true };
      }
      return ach;
    }));

    // Trigger visual notification
    const newAlert = {
      id: `notif-${Date.now()}`,
      title: 'Trophy Reward Claimed',
      message: `You successfully claimed the reward: ${achievements.find(a => a.id === id)?.reward}`,
      type: 'reward',
      read: false,
      date: 'Just Now'
    };
    setNotifications(prev => [newAlert, ...prev]);
  };

  // Enable Two Factor Authorization Workflow
  const handleConfirm2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin2fa.length < 6) {
      setTwoFactorError("Please input a valid 6-digit confirmation pin.");
      return;
    }

    const token = localStorage.getItem('volex_jwt_token') || sessionStorage.getItem('volex_jwt_token');
    if (!token) return;

    try {
      const res = await fetch('/api/auth/security/toggle-2fa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ enable: true, code: pin2fa })
      });
      const data = await res.json();
      if (!res.ok) {
        setTwoFactorError(data.error || "Mismatched validation pin");
      } else {
        setIs2faEnabled(true);
        setIs2faSetupOpen(false);
        setPin2fa('');
        setTwoFactorError('');
        fetchUserProfile();

        // Trigger Achievements check
        setAchievements(prev => prev.map(ach => {
          if (ach.id === 'ach-3') {
            return { ...ach, progress: 100 };
          }
          return ach;
        }));

        // Add alert
        const newAlert = {
          id: `notif-${Date.now()}`,
          title: '🛡️ 2FA Security Secured',
          message: 'Two-factor Authentication has been successfully bound. Backup codes saved to clipboard.',
          type: 'security',
          read: false,
          date: 'Just now'
        };
        setNotifications(prev => [newAlert, ...prev]);
      }
    } catch (err) {
      setTwoFactorError("Network connection failed");
    }
  };

  // Disable 2FA
  const disable2FA = async () => {
    const token = localStorage.getItem('volex_jwt_token') || sessionStorage.getItem('volex_jwt_token');
    if (!token) return;

    try {
      const res = await fetch('/api/auth/security/toggle-2fa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ enable: false })
      });
      if (res.ok) {
        setIs2faEnabled(false);
        setPin2fa('');
        setTwoFactorError('');
        fetchUserProfile();
      }
    } catch (e) {
      setTwoFactorError("Failed to deactivate 2FA");
    }
  };

  // Change password submit
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setPasswordError("Please specify your current active password.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("New password must contain at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Confirmation password doesn't match new password.");
      return;
    }

    const token = localStorage.getItem('volex_jwt_token') || sessionStorage.getItem('volex_jwt_token');
    if (!token) {
      setPasswordError("Unauthorized access. Please log in first.");
      return;
    }

    try {
      const res = await fetch('/api/auth/security/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        setPasswordError(data.error || "Password change failed");
      } else {
        setPasswordChangeSuccess(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordError('');
        fetchUserProfile();
        setTimeout(() => setSaveProfileSuccess(false), 4000);
      }
    } catch (err) {
      setPasswordError("Network request failed");
    }
  };

  // Simulate purchasing coins inside wallet
  const triggerSimulateCoinBuy = () => {
    setAddCoinsStep('processing');
    setTimeout(() => {
      setUserCoins(prev => prev + selectedCoinPack.coins);
      const newTxn = {
        id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
        description: `Bought ${selectedCoinPack.coins.toLocaleString()} Coins Pack`,
        amount: `+${selectedCoinPack.coins.toLocaleString()}`,
        currency: 'coins',
        date: new Date().toISOString().split('T')[0],
        status: 'Completed'
      };
      setCoinTransactions(prev => [newTxn, ...prev]);
      setAddCoinsStep('success');
    }, 2000);
  };

  // General counts
  const unreadNotifs = notifications.filter(n => !n.read).length;

  return (
    <div id="premium-dashboard" className="space-y-8 animate-fade-in relative z-10 text-white">
      
      {/* 1. TOP HEADER SUMMARY */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-purple-500/10 pb-6">
        <div>
          <span className="text-[10px] font-mono font-black text-[#bf5af2] uppercase tracking-widest block">SECURE SYSTEM PANEL</span>
          <h2 className="text-3xl font-black text-white font-sans tracking-tight mt-1 flex items-center gap-2">
            PREMIUM USER DASHBOARD
            <span className="text-[9px] font-mono font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              SECURE SESSION
            </span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Manage your Minecraft characters, verify shop licenses, claim gold token balances, and inspect LuckPerms permission status.
          </p>
        </div>

        {/* Sync Controls / Username link */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Quick sync LuckPerms commands button */}
          <button
            onClick={handleSyncCommands}
            disabled={isSyncingCommands}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-xl cursor-pointer text-xs font-bold transition-all text-gray-200"
          >
            {isSyncingCommands ? (
              <>
                <Loader2 className="h-4 w-4 text-[#bf5af2] animate-spin" />
                <span>Syncing Commands...</span>
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 text-[#bf5af2]" />
                <span>Sync Server Commands</span>
              </>
            )}
          </button>

          {/* Connected character info */}
          <div className="flex items-center gap-2.5 bg-[#bf5af2]/10 border border-[#bf5af2]/20 px-4 py-2 rounded-xl text-xs font-mono font-bold text-white">
            <img
              src={`https://crafatar.com/avatars/${activeUser}?size=20&overlay`}
              alt={activeUser}
              className="h-5 w-5 rounded border border-purple-400/30 shadow-sm"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://minotar.net/helm/Steve/20.png`;
              }}
            />
            <span className="text-purple-300">{activeUser}</span>
          </div>
        </div>
      </div>

      {/* Synchronizing Feedback Terminal */}
      <AnimatePresence>
        {syncStatusText && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="bg-black/60 border border-cyan-500/20 rounded-xl p-3 text-xs font-mono text-cyan-400 flex items-center gap-2.5"
          >
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span className="font-bold">SYSTEM LOG:</span>
            <span>{syncStatusText}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. MAIN GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* SIDEBAR NAVIGATION PANEL (Animated Hover cards) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-2xl border border-purple-500/10 bg-black/40 p-4 space-y-1.5 backdrop-blur-md">
            
            <div className="text-[9px] font-mono font-black text-gray-500 uppercase tracking-widest px-3 mb-3 block">
              DASHBOARD SECTIONS
            </div>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/10 border border-purple-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <User className="h-4 w-4" />
                <span>My Profile</span>
              </div>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={() => setActiveTab('wallet')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'wallet'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/10 border border-purple-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Wallet className="h-4 w-4" />
                <span>Wallet & Funds</span>
              </div>
              <span className="text-[9px] font-mono bg-amber-500/15 border border-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-bold">
                {userCoins.toLocaleString()}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/10 border border-purple-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="h-4 w-4" />
                <span>Orders & Keys</span>
              </div>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={() => setActiveTab('downloads')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'downloads'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/10 border border-purple-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Download className="h-4 w-4" />
                <span>Downloads</span>
              </div>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={() => setActiveTab('achievements')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'achievements'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/10 border border-purple-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Award className="h-4 w-4" />
                <span>Achievements</span>
              </div>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={() => setActiveTab('tickets')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'tickets'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/10 border border-purple-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <HelpCircle className="h-4 w-4" />
                <span>Support Tickets</span>
              </div>
              {ticketsList.some(t => t.status === 'Open') && (
                <span className="h-2 w-2 rounded-full bg-[#bf5af2] animate-pulse"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'notifications'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/10 border border-purple-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Bell className="h-4 w-4" />
                <span>Alerts & Inbox</span>
              </div>
              {unreadNotifs > 0 && (
                <span className="bg-purple-500 text-black text-[9px] font-mono font-black h-4.5 w-4.5 rounded-full flex items-center justify-center animate-pulse">
                  {unreadNotifs}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'security'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/10 border border-purple-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Shield className="h-4 w-4" />
                <span>Security & Settings</span>
              </div>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>

          </div>

          {/* Quick status box card */}
          <div className="rounded-2xl border border-purple-500/10 bg-[#0d0c12]/40 p-4.5 space-y-3 backdrop-blur-md relative overflow-hidden">
            <div className="absolute -left-10 -bottom-10 h-24 w-24 rounded-full bg-[#bf5af2]/5 blur-2xl"></div>
            <span className="text-[9px] font-mono font-black text-purple-400 uppercase tracking-widest block">VIP SERVER STATUS</span>
            <div className="space-y-2 text-xs font-mono text-gray-400">
              <div className="flex justify-between">
                <span>Account Status:</span>
                <span className="text-emerald-400 font-bold">SYNCHRONIZED</span>
              </div>
              <div className="flex justify-between">
                <span>Active Rank:</span>
                <span className="text-purple-300 font-extrabold uppercase">MVP+ LIFETIME</span>
              </div>
              <div className="flex justify-between">
                <span>Lobby flight:</span>
                <span className="text-cyan-400 font-bold">ENABLED</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. DYNAMIC CONTENT CARD MODULE (Animated slide shifts) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="min-h-[500px] rounded-2xl border border-purple-500/10 bg-black/45 p-6 md:p-8 backdrop-blur-md relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-purple-600/5 blur-3xl pointer-events-none"></div>

            {/* TAB CONTENT SWITCH */}
            <div>
              {/* TAB 1: PROFILE */}
              {activeTab === 'profile' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Top Intro Section with Minecraft skin avatar */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 border-b border-purple-500/5 pb-6">
                    <div className="relative group">
                      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#bf5af2] to-cyan-500 opacity-60 blur group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative h-24 w-24 rounded-2xl bg-[#090a10] border border-white/10 flex items-center justify-center p-1 overflow-hidden">
                        <img
                          src={`https://crafatar.com/avatars/${activeUser}?size=128&overlay`}
                          alt={activeUser}
                          className="h-full w-full rounded-xl object-contain object-center scale-102"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://minotar.net/helm/Steve/128.png`;
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2 text-center sm:text-left flex-grow">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                        <h3 className="text-2xl font-black text-white font-sans">{activeUser}</h3>
                        <span className="text-[9px] font-mono font-bold text-black bg-[#bf5af2] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-[0_0_10px_rgba(191,90,242,0.3)]">
                          MVP+ Rank
                        </span>
                        <span className="text-[9px] font-mono font-bold text-cyan-400 bg-cyan-500/15 border border-cyan-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Level 84
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1.5 text-xs text-gray-400 font-mono">
                        <span className="flex items-center gap-1">
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                          Character sync active
                        </span>
                        <span>•</span>
                        <span>Member since: Jan 15, 2026</span>
                      </div>
                    </div>
                  </div>

                  {/* Settings / Titles updates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Bio & Custom Player Titles card */}
                    <div className="space-y-4 rounded-xl border border-purple-500/5 bg-black/30 p-5">
                      <span className="text-[9px] font-mono font-black text-[#bf5af2] uppercase tracking-widest block">PERSONALIZATION</span>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Custom Display Title</label>
                          <select
                            value={customTitle}
                            onChange={(e) => setCustomTitle(e.target.value)}
                            className="w-full bg-[#0a0a0e] border border-purple-500/10 focus:border-purple-500/30 p-2.5 rounded-lg text-xs focus:outline-none"
                          >
                            <option value="Cosmic Emperor">Cosmic Emperor</option>
                            <option value="Shadow Ninja">Shadow Ninja</option>
                            <option value="Volex Champion">Volex Champion</option>
                            <option value="Dungeon Slayer">Dungeon Slayer</option>
                            <option value="Pixel Pioneer">Pixel Pioneer</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Character Bio Profile</label>
                          <textarea
                            rows={3}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="w-full bg-[#0a0a0e] border border-purple-500/10 focus:border-purple-500/30 p-2.5 rounded-lg text-xs focus:outline-none resize-none text-gray-300"
                          />
                        </div>

                        <button
                          onClick={async () => {
                            const token = localStorage.getItem('volex_jwt_token') || sessionStorage.getItem('volex_jwt_token');
                            if (!token) return;

                            try {
                              const res = await fetch('/api/auth/profile-sync', {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                  'Authorization': `Bearer ${token}`
                                },
                                body: JSON.stringify({ customTitle, bio, discordLinked, googleLinked: githubLinked })
                              });
                              if (res.ok) {
                                setSaveProfileSuccess(true);
                                fetchUserProfile();
                                setTimeout(() => setSaveProfileSuccess(false), 3000);
                              }
                            } catch (e) {
                              console.error("Error saving profile:", e);
                            }
                          }}
                          className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs uppercase rounded-lg transition-all cursor-pointer text-center"
                        >
                          Save Profile Changes
                        </button>

                        {saveProfileSuccess && (
                          <div className="text-center text-xs font-mono text-emerald-400 animate-pulse mt-2">
                            ✓ Bio and display title successfully pushed to server wardrobes!
                          </div>
                        )}
                      </div>
                    </div>

                    {/* OAuth Connections links */}
                    <div className="space-y-4 rounded-xl border border-purple-500/5 bg-black/30 p-5">
                      <span className="text-[9px] font-mono font-black text-cyan-400 uppercase tracking-widest block">CONNECTION ACCOUNTS</span>
                      
                      <div className="space-y-3.5">
                        
                        {/* Discord */}
                        <div className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-purple-500/5">
                          <div className="flex items-center gap-2.5">
                            <div className="h-7 w-7 rounded-lg bg-[#5865F2]/10 border border-[#5865F2]/20 flex items-center justify-center text-[#5865F2]">
                              <MessageSquare className="h-4 w-4" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] font-sans font-black text-white">Discord Link</span>
                              <span className="text-[9px] font-mono text-emerald-400">Linked as shisir#4812</span>
                            </div>
                          </div>
                          <button
                            onClick={() => setDiscordLinked(!discordLinked)}
                            className={`text-[9px] font-mono uppercase font-bold px-2.5 py-1 rounded transition-colors ${
                              discordLinked ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400' : 'bg-purple-600 hover:bg-purple-500 text-white'
                            }`}
                          >
                            {discordLinked ? 'Unlink' : 'Link Account'}
                          </button>
                        </div>

                        {/* Microsoft (Minecraft license) */}
                        <div className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-purple-500/5">
                          <div className="flex items-center gap-2.5">
                            <div className="h-7 w-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                              <ShieldCheck className="h-4 w-4" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] font-sans font-black text-white">Microsoft License Check</span>
                              <span className="text-[9px] font-mono text-emerald-400">Verified Mojang Account</span>
                            </div>
                          </div>
                          <span className="text-[8px] font-mono font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
                            SECURE
                          </span>
                        </div>

                        {/* GitHub Developer Node */}
                        <div className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-purple-500/5">
                          <div className="flex items-center gap-2.5">
                            <div className="h-7 w-7 rounded-lg bg-gray-500/10 border border-gray-500/20 flex items-center justify-center text-gray-300">
                              <Key className="h-4 w-4" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] font-sans font-black text-white">GitHub Account Link</span>
                              <span className={`text-[9px] font-mono ${githubLinked ? 'text-emerald-400' : 'text-gray-500'}`}>
                                {githubLinked ? 'Linked developer node' : 'Unlinked (No badges)'}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => setGithubLinked(!githubLinked)}
                            className={`text-[9px] font-mono uppercase font-bold px-2.5 py-1 rounded transition-colors ${
                              githubLinked ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400' : 'bg-[#bf5af2] hover:bg-purple-500 text-black font-extrabold'
                            }`}
                          >
                            {githubLinked ? 'Unlink' : 'Link GitHub'}
                          </button>
                        </div>

                      </div>
                    </div>

                  </div>

                </div>
              )}

              {/* TAB 2: WALLET */}
              {activeTab === 'wallet' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Simulated Debit/Credit Card */}
                    <div className="md:col-span-1 rounded-2xl p-5 bg-gradient-to-br from-purple-800 via-indigo-900 to-black border border-purple-500/30 relative overflow-hidden shadow-[0_10px_30px_rgba(147,51,234,0.15)] flex flex-col justify-between h-48">
                      {/* Logo and chip */}
                      <div className="flex justify-between items-start">
                        <div className="h-7 w-10 rounded-md bg-amber-400/80 border border-amber-500/20 flex items-center justify-center font-mono font-bold text-black text-[10px]">CHIP</div>
                        <span className="text-xs font-black tracking-widest text-purple-300">VOLEX GOLD CARD</span>
                      </div>

                      {/* Card Number */}
                      <div>
                        <div className="text-sm font-mono text-gray-300 tracking-widest">**** **** **** 8412</div>
                        <div className="flex justify-between items-end mt-4">
                          <div>
                            <span className="text-[7px] text-gray-400 uppercase block">CARD HOLDER</span>
                            <span className="text-xs font-mono font-bold text-white uppercase">{activeUser}</span>
                          </div>
                          <div>
                            <span className="text-[7px] text-gray-400 uppercase block">EXP DATE</span>
                            <span className="text-xs font-mono font-bold text-white">07/31</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Coins balances */}
                    <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 relative overflow-hidden flex flex-col justify-between h-48">
                      <div className="absolute -right-10 -top-10 h-28 w-28 bg-amber-500/5 rounded-full blur-2xl"></div>
                      <div>
                        <span className="text-[9px] font-mono font-black text-amber-500 uppercase tracking-widest block">VOLEX COIN BALANCE</span>
                        <h4 className="text-3xl font-black font-sans text-amber-400 tracking-tight mt-1">{userCoins.toLocaleString()} <span className="text-sm text-gray-400">Coins</span></h4>
                        <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">Spendable inside server GUI stores via `/gold` menu command. Exchangeable for cosmetics, companions, and multipliers.</p>
                      </div>
                      
                      <button
                        onClick={() => {
                          setIsAddingCoins(true);
                          setAddCoinsStep('select');
                        }}
                        className="py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer text-center"
                      >
                        Buy Coins Bundle
                      </button>
                    </div>

                    {/* Gold Tokens balance */}
                    <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5 relative overflow-hidden flex flex-col justify-between h-48">
                      <div className="absolute -right-10 -top-10 h-28 w-28 bg-cyan-500/5 rounded-full blur-2xl"></div>
                      <div>
                        <span className="text-[9px] font-mono font-black text-cyan-400 uppercase tracking-widest block">GOLDEN SEASON TOKENS</span>
                        <h4 className="text-3xl font-black font-sans text-cyan-300 tracking-tight mt-1">{userTokens.toLocaleString()} <span className="text-sm text-gray-400">Tokens</span></h4>
                        <p className="text-[10px] text-gray-400 mt-1 leading-relaxed font-sans">Seasonal experience tokens generated from daily challenge accomplishments inside dungeons lobbies. Expire at the end of Season 4.</p>
                      </div>

                      <div className="text-[10px] font-mono text-cyan-400/80 bg-cyan-500/10 border border-cyan-500/20 p-2 rounded-lg text-center font-bold">
                        AUTO-CONVERT TO COINS SYSTEM ACTIVE
                      </div>
                    </div>

                  </div>

                  {/* Wallet Purchases and ledger */}
                  <div className="space-y-4">
                    <span className="text-[10px] font-mono font-black text-gray-500 uppercase tracking-widest block">RECENT WALLET TRANSACTIONS</span>
                    
                    <div className="overflow-x-auto rounded-xl border border-purple-500/10 bg-black/20">
                      <table className="w-full min-w-[600px] border-collapse text-left font-sans text-xs">
                        <thead>
                          <tr className="border-b border-purple-500/10 bg-black/40 text-[9px] font-mono font-black text-purple-400 uppercase tracking-wider">
                            <th className="p-3">Reference ID</th>
                            <th className="p-3">Transaction Description</th>
                            <th className="p-3">Date</th>
                            <th className="p-3">Amount Transfer</th>
                            <th className="p-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-purple-500/5 text-gray-300">
                          {coinTransactions.map((txn, idx) => (
                            <tr key={idx} className="hover:bg-white/2">
                              <td className="p-3 font-mono text-[10px] text-gray-500">{txn.id}</td>
                              <td className="p-3 font-bold text-white">{txn.description}</td>
                              <td className="p-3 font-mono text-gray-400">{txn.date}</td>
                              <td className={`p-3 font-mono font-bold ${txn.amount.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>{txn.amount}</td>
                              <td className="p-3">
                                <span className="text-[8px] font-mono font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded">
                                  {txn.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* COINS SIMULATOR GATEWAY MODAL */}
                  <AnimatePresence>
                    {isAddingCoins && (
                      <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="w-full max-w-md bg-[#090b10] border border-amber-500/20 rounded-2xl p-6 relative"
                        >
                          <div className="absolute top-0 inset-x-0 h-[2px] bg-amber-500"></div>
                          
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center space-x-2 text-amber-500">
                              <Wallet className="h-5 w-5" />
                              <span className="text-[10px] font-mono font-black uppercase tracking-widest">COIN QUANTUM GATEWAY</span>
                            </div>
                            <button
                              onClick={() => setIsAddingCoins(false)}
                              className="text-gray-500 hover:text-white font-mono text-xs cursor-pointer"
                            >
                              [X] CLOSE
                            </button>
                          </div>

                          {addCoinsStep === 'select' && (
                            <div className="space-y-4">
                              <p className="text-xs text-gray-400">Select a premium coins package to simulate transaction checkouts and synchronizations instantly:</p>
                              
                              <div className="space-y-2">
                                {[
                                  { coins: 1000, price: 4.99 },
                                  { coins: 5000, price: 24.99 },
                                  { coins: 15000, price: 49.99 },
                                  { coins: 40000, price: 99.99 }
                                ].map((pack, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => setSelectedCoinPack(pack)}
                                    className={`w-full p-3 rounded-xl border text-left flex justify-between items-center transition-all cursor-pointer ${
                                      selectedCoinPack.coins === pack.coins
                                        ? 'bg-amber-500/10 border-amber-500 text-white'
                                        : 'bg-black/40 border-purple-500/5 text-gray-400 hover:border-amber-500/30'
                                    }`}
                                  >
                                    <div>
                                      <div className="text-xs font-black uppercase tracking-wider text-white">
                                        {pack.coins.toLocaleString()} Coins Pack
                                      </div>
                                      <div className="text-[10px] text-gray-500">Immediate character profile transfer</div>
                                    </div>
                                    <div className="text-xs font-mono font-black text-amber-400">{formatPrice(pack.price)}</div>
                                  </button>
                                ))}
                              </div>

                              <button
                                onClick={triggerSimulateCoinBuy}
                                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-xs uppercase tracking-widest transition-all cursor-pointer"
                              >
                                Simulate Payment Checkout ({formatPrice(selectedCoinPack.price)})
                              </button>
                            </div>
                          )}

                          {addCoinsStep === 'processing' && (
                            <div className="py-8 text-center space-y-4">
                              <Loader2 className="h-10 w-10 text-amber-500 animate-spin mx-auto" />
                              <div>
                                <h4 className="text-sm font-bold">Contacting Gateway API...</h4>
                                <p className="text-xs text-gray-400 mt-1">Connecting node hooks on Stripe parent ledger networks.</p>
                              </div>
                            </div>
                          )}

                          {addCoinsStep === 'success' && (
                            <div className="py-6 text-center space-y-4">
                              <div className="h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-xl">
                                ✓
                              </div>
                              <div>
                                <h4 className="text-sm font-black uppercase tracking-wider text-white">PAYMENT CAPTURED SUCCESSFULLY</h4>
                                <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">Your virtual account profile was credited with <span className="text-amber-400 font-bold">{selectedCoinPack.coins.toLocaleString()} Coins</span>. Sync commands deployed.</p>
                              </div>
                              <button
                                onClick={() => setIsAddingCoins(false)}
                                className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs uppercase rounded-lg cursor-pointer"
                              >
                                Back to Wallet
                              </button>
                            </div>
                          )}

                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>

                </div>
              )}

              {/* TAB 3: ORDERS */}
              {activeTab === 'orders' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Shop Keys / Active Purchases summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                    
                    {/* Active keys box */}
                    <div className="rounded-xl border border-purple-500/10 bg-black/30 p-5 space-y-3 relative overflow-hidden">
                      <div className="absolute -right-10 -top-10 h-24 w-24 bg-purple-500/5 rounded-full blur-2xl"></div>
                      <span className="text-[9px] font-mono font-black text-purple-400 uppercase tracking-widest block">ACTIVE KEYS INVENTORY</span>
                      <div className="space-y-2 text-xs font-mono">
                        <div className="flex justify-between p-2 rounded bg-black/20 border border-white/2">
                          <span>Cosmic Portal Keys:</span>
                          <span className="text-pink-400 font-bold">5 Keys Unused</span>
                        </div>
                        <div className="flex justify-between p-2 rounded bg-black/20 border border-white/2">
                          <span>Mythic Mystery Keys:</span>
                          <span className="text-purple-400 font-bold">2 Keys Unused</span>
                        </div>
                        <div className="flex justify-between p-2 rounded bg-black/20 border border-white/2">
                          <span>Ancient Crate Keys:</span>
                          <span className="text-cyan-400 font-bold">0 Keys Unused</span>
                        </div>
                      </div>
                      <button
                        onClick={handleSyncCommands}
                        className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono font-bold text-[10px] uppercase rounded-lg cursor-pointer"
                      >
                        Force Claim Key Bundles In-game
                      </button>
                    </div>

                    {/* Wardrobe Active Perks */}
                    <div className="rounded-xl border border-purple-500/10 bg-black/30 p-5 space-y-3 relative overflow-hidden">
                      <div className="absolute -right-10 -top-10 h-24 w-24 bg-cyan-500/5 rounded-full blur-2xl"></div>
                      <span className="text-[9px] font-mono font-black text-cyan-400 uppercase tracking-widest block">ENABLED LOBBY COSMETICS</span>
                      <div className="space-y-2 text-xs font-mono text-gray-400">
                        <div className="flex justify-between">
                          <span>Inferno Flame Particle Trail:</span>
                          <span className="text-emerald-400 font-bold">ACTIVE</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Void Spiral Helix Trail:</span>
                          <span className="text-gray-500">DISABLED</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Mini Ender Dragon Pet:</span>
                          <span className="text-emerald-400 font-bold">ACTIVE (LOBBY 1)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Neon Display Title Badge:</span>
                          <span className="text-emerald-400 font-bold">ACTIVE</span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Complete transactions history */}
                  <div className="space-y-4">
                    <span className="text-[10px] font-mono font-black text-gray-500 uppercase tracking-widest block">ORDER LICENSE RECORDS</span>
                    
                    <div className="space-y-3">
                      {[
                        { id: 'VOL-89412', name: 'Cosmic Overlord Loot Crate Bundle', date: '2026-07-02', price: 14.99, gateway: 'Stripe Secured', commands: ['/lp user {user} permission set temp.cosmic_chest', '/crate give {user} cosmic 1'], status: 'Completed' },
                        { id: 'VOL-89311', name: '5,000 Volex Coins Pack', date: '2026-06-15', price: 24.99, gateway: 'PayPal Inc', commands: ['/coins add {user} 5000'], status: 'Completed' },
                        { id: 'VOL-88942', name: 'Master Miner Resource Kit', date: '2026-05-20', price: 2.99, gateway: 'Stripe Secured', commands: ['/kit claim miner {user}'], status: 'Completed' },
                        { id: 'VOL-88120', name: 'VIP+ Rank (Lifetime Upgrade)', date: '2026-04-12', price: 9.99, gateway: 'Razorpay Gateway', commands: ['/lp user {user} parent set vip_plus'], status: 'Completed' }
                      ].map((order, idx) => (
                        <div key={idx} className="rounded-xl border border-purple-500/5 bg-[#090b10] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono text-gray-500">{order.id}</span>
                              <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded text-[8px] font-bold">{order.gateway}</span>
                            </div>
                            <h4 className="text-xs font-extrabold text-white">{order.name}</h4>
                            <p className="text-[9px] font-mono text-gray-500">Transaction Date: {order.date} • Base Value: {formatPrice(order.price)}</p>
                          </div>

                          <div className="bg-black/50 border border-purple-500/5 p-2 rounded-lg max-w-sm md:max-w-xs flex-grow font-mono text-[8px] text-gray-400 space-y-0.5 select-all">
                            <span className="text-[#bf5af2] font-bold block uppercase tracking-wider">COMMAND COUPLING:</span>
                            {order.commands.map((cmd, cIdx) => (
                              <div key={cIdx} className="truncate">{cmd.replace('{user}', activeUser)}</div>
                            ))}
                          </div>

                          <div className="flex flex-col items-end gap-1 flex-shrink-0">
                            <span className="text-[9px] font-mono font-black text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded uppercase">
                              {order.status}
                            </span>
                          </div>

                        </div>
                      ))}
                    </div>

                  </div>

                </div>
              )}

              {/* TAB 4: DOWNLOADS */}
              {activeTab === 'downloads' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Warning on license checks */}
                  <div className="rounded-xl border border-cyan-500/10 bg-cyan-500/5 p-4 text-xs text-cyan-300 leading-relaxed">
                    <span className="font-bold uppercase tracking-wider block mb-1">🎮 Asset License Active</span>
                    All server resource packs, custom FPS optimizations, and cyberpunk graphic widgets listed below are pre-licensed and unlocked for your connected Minecraft profile account. Hover and hit download to activate.
                  </div>

                  {/* Grid of download files */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {downloadsList.map((dl) => (
                      <div key={dl.id} className="rounded-xl border border-purple-500/5 bg-[#090b10] p-5 relative overflow-hidden flex flex-col justify-between h-44">
                        
                        <div>
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] font-mono text-gray-500">{dl.size} • {dl.version}</span>
                            <span className="text-[8px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded font-bold">{dl.count.toLocaleString()} Downloads</span>
                          </div>
                          <h4 className="text-sm font-extrabold text-white mt-1.5">{dl.title}</h4>
                        </div>

                        {/* Download progress bar */}
                        {dl.progress > 0 && (
                          <div className="space-y-1 mt-2">
                            <div className="flex justify-between text-[8px] font-mono text-cyan-400">
                              <span>Downloading...</span>
                              <span>{dl.progress}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-black/60 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all" style={{ width: `${dl.progress}%` }}></div>
                            </div>
                          </div>
                        )}

                        <div className="mt-3">
                          {dl.progress === 100 ? (
                            <div className="w-full py-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono font-bold text-[10px] uppercase text-center rounded-lg">
                              ✓ DOWNLOAD SECURED (Click to Open)
                            </div>
                          ) : (
                            <button
                              onClick={() => startDownload(dl.id)}
                              disabled={dl.isDownloading}
                              className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-white font-mono font-bold text-[10px] uppercase rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5"
                            >
                              <Download className="h-3.5 w-3.5 text-[#bf5af2]" />
                              <span>{dl.isDownloading ? 'Downloading Asset...' : 'Start Secure Download'}</span>
                            </button>
                          )}
                        </div>

                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* TAB 5: ACHIEVEMENTS */}
              {activeTab === 'achievements' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Top achievement summary progress */}
                  <div className="rounded-xl border border-purple-500/10 bg-black/40 p-5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono font-black text-[#bf5af2] uppercase tracking-widest block font-sans">TROPHY PROGRESS</span>
                      <h4 className="text-lg font-black text-white">LUCKPERMS ACHIEVEMENT TIERS</h4>
                      <p className="text-xs text-gray-400">Complete server challenges to claim virtual cash tokens, particle halos, and special lobby prefixes.</p>
                    </div>

                    {/* Progress Circle bar details */}
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-16 flex items-center justify-center rounded-full bg-purple-500/10 border-2 border-purple-500/30">
                        <span className="text-xs font-mono font-black text-purple-300">
                          {Math.round((achievements.filter(a => a.progress === 100).length / achievements.length) * 100)}%
                        </span>
                      </div>
                      <div className="text-xs font-mono space-y-0.5">
                        <div className="text-white font-bold">{achievements.filter(a => a.progress === 100).length} Unlocked</div>
                        <div className="text-gray-500">{achievements.filter(a => a.progress < 100).length} In Progress</div>
                      </div>
                    </div>
                  </div>

                  {/* Grid of achievements cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {achievements.map((ach) => (
                      <div key={ach.id} className="rounded-xl border border-purple-500/5 bg-[#090b10] p-4.5 flex flex-col justify-between h-48 relative overflow-hidden">
                        
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[9px] font-mono text-gray-500">{ach.category}</span>
                            <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                              ach.progress === 100 ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'
                            }`}>
                              {ach.progress === 100 ? 'Unlocked' : `${ach.progress}%`}
                            </span>
                          </div>

                          <h4 className="text-xs font-black text-white flex items-center gap-1">
                            {ach.title}
                            {ach.progress === 100 && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                          </h4>
                          <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">{ach.desc}</p>
                        </div>

                        {/* Reward tag */}
                        <div className="space-y-2 mt-4">
                          <div className="flex justify-between text-[8px] font-mono">
                            <span className="text-gray-500">REWARD BOND:</span>
                            <span className="text-cyan-400 font-bold">{ach.reward}</span>
                          </div>

                          {ach.progress === 100 ? (
                            ach.claimed ? (
                              <div className="w-full py-1.5 bg-black/40 border border-purple-500/5 text-gray-500 font-mono text-[9px] uppercase text-center rounded">
                                CLAIMED RECORD
                              </div>
                            ) : (
                              <button
                                onClick={() => claimAchievementReward(ach.id)}
                                className="w-full py-1.5 bg-[#bf5af2] hover:bg-purple-500 text-black font-mono font-black text-[9px] uppercase text-center rounded cursor-pointer transition-all"
                              >
                                CLAIM REWARD
                              </button>
                            )
                          ) : (
                            <div className="w-full py-1.5 bg-black/60 border border-white/2 text-gray-600 font-mono text-[9px] uppercase text-center rounded">
                              LOCKED ({ach.progress}%)
                            </div>
                          )}
                        </div>

                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* TAB 6: SUPPORT TICKETS */}
              {activeTab === 'tickets' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Grid for Support */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Column 1: Tickets List & Create Form */}
                    <div className="lg:col-span-1 space-y-4">
                      
                      {/* Ticket creation trigger card */}
                      <div className="rounded-xl border border-purple-500/10 bg-black/30 p-4 space-y-3">
                        <span className="text-[9px] font-mono font-black text-[#bf5af2] uppercase tracking-widest block">HELP DESK ASSISTANCE</span>
                        <h4 className="text-xs font-bold text-white">Create Support Ticket</h4>
                        <p className="text-[10px] text-gray-400 leading-relaxed font-sans">Encountered rank synchronization delays, inventory losses, or billing disputes? Submit a ticket to query our staff nodes.</p>

                        <form onSubmit={handleCreateTicket} className="space-y-3 pt-1">
                          <div>
                            <label className="text-[9px] font-mono text-gray-500 uppercase block mb-1">Subject Title</label>
                            <input
                              type="text"
                              placeholder="e.g. VIP sync failed"
                              value={ticketSubject}
                              onChange={(e) => setTicketSubject(e.target.value)}
                              className="w-full bg-[#0a0a0e] border border-purple-500/10 focus:border-purple-500/30 text-xs p-2 rounded-lg text-white focus:outline-none"
                              required
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[9px] font-mono text-gray-500 uppercase block mb-1">Priority</label>
                              <select
                                value={ticketPriority}
                                onChange={(e) => setTicketPriority(e.target.value as any)}
                                className="w-full bg-[#0a0a0e] border border-purple-500/10 focus:border-purple-500/30 text-[10px] p-2 rounded-lg text-white focus:outline-none"
                              >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Critical">Critical</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-[9px] font-mono text-gray-500 uppercase block mb-1">Category</label>
                              <select
                                value={ticketCategory}
                                onChange={(e) => setTicketCategory(e.target.value)}
                                className="w-full bg-[#0a0a0e] border border-purple-500/10 focus:border-purple-500/30 text-[10px] p-2 rounded-lg text-white focus:outline-none"
                              >
                                <option value="Billing Issue">Billing Issue</option>
                                <option value="Game Bug">Game Bug</option>
                                <option value="Rank Issue">Rank Issue</option>
                                <option value="Other Query">Other Query</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="text-[9px] font-mono text-gray-500 uppercase block mb-1">Details Message</label>
                            <textarea
                              rows={3}
                              placeholder="Please describe your server coordinates or receipt references..."
                              value={ticketMessage}
                              onChange={(e) => setTicketMessage(e.target.value)}
                              className="w-full bg-[#0a0a0e] border border-purple-500/10 focus:border-purple-500/30 text-xs p-2 rounded-lg text-white focus:outline-none resize-none"
                              required
                            />
                          </div>

                          <button
                            type="submit"
                            className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-[10px] uppercase rounded-lg transition-all cursor-pointer text-center"
                          >
                            Dispatch Support Ticket
                          </button>

                          {ticketCreateSuccess && (
                            <div className="text-center text-[10px] font-mono text-emerald-400 animate-pulse mt-2">
                              ✓ Ticket generated and queued for moderator validation!
                            </div>
                          )}
                        </form>
                      </div>

                    </div>

                    {/* Column 2 & 3: Selected Ticket conversation */}
                    <div className="lg:col-span-2 space-y-4">
                      
                      {/* Ticket History Sidebar selection list */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono font-black text-gray-500 uppercase tracking-widest block">ACTIVE TICKET RECORDS</span>
                        
                        <div className="space-y-2">
                          {ticketsList.map((tkt) => (
                            <div
                              key={tkt.id}
                              onClick={() => setSelectedTicketId(tkt.id === selectedTicketId ? null : tkt.id)}
                              className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                                tkt.id === selectedTicketId
                                  ? 'bg-purple-500/10 border-purple-500 text-white'
                                  : 'bg-black/30 border-purple-500/5 text-gray-400 hover:border-purple-500/20'
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                  <span className="text-[9px] font-mono text-gray-500">{tkt.id}</span>
                                  <span className={`text-[8px] font-mono font-bold px-1.5 py-0.2 rounded ${
                                    tkt.priority === 'Critical' ? 'bg-rose-500/15 text-rose-400' : 'bg-amber-500/15 text-amber-400'
                                  }`}>
                                    {tkt.priority} Priority
                                  </span>
                                </div>
                                <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded-full ${
                                  tkt.status === 'Resolved' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-cyan-500/15 text-cyan-400'
                                }`}>
                                  {tkt.status}
                                </span>
                              </div>
                              <h4 className="text-xs font-black text-white mt-1.5">{tkt.subject}</h4>
                              <p className="text-[9px] font-mono text-gray-500 mt-1">Category: {tkt.category} • Last Update: {tkt.date}</p>

                              {/* Collapsible conversation block */}
                              {tkt.id === selectedTicketId && (
                                <div className="mt-4 border-t border-purple-500/15 pt-4 space-y-3.5" onClick={(e) => e.stopPropagation()}>
                                  <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                                    {tkt.messages.map((msg, mIdx) => (
                                      <div
                                        key={mIdx}
                                        className={`p-2.5 rounded-xl text-[10px] leading-relaxed max-w-[85%] ${
                                          msg.sender === 'user'
                                            ? 'bg-purple-950/20 border border-purple-500/10 ml-auto text-purple-200 text-right'
                                            : 'bg-black/60 border border-purple-500/5 mr-auto text-gray-300'
                                        }`}
                                      >
                                        <span className="text-[8px] font-mono text-gray-500 uppercase block mb-1">
                                          {msg.sender === 'user' ? activeUser : 'VOLEX REPRESENTATIVE'} • {msg.timestamp}
                                        </span>
                                        <span>{msg.text}</span>
                                      </div>
                                    ))}
                                  </div>

                                  {/* Reply Box input */}
                                  {tkt.status !== 'Resolved' && (
                                    <form onSubmit={handleTicketReply} className="flex gap-2">
                                      <input
                                        type="text"
                                        placeholder="Type comment message to support agent..."
                                        value={ticketReplyText}
                                        onChange={(e) => setTicketReplyText(e.target.value)}
                                        className="flex-grow bg-black/60 border border-purple-500/10 focus:border-purple-500/30 text-xs p-2 rounded-lg text-white focus:outline-none"
                                        required
                                      />
                                      <button
                                        type="submit"
                                        className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white text-xs font-bold font-sans flex items-center justify-center cursor-pointer"
                                      >
                                        <Send className="h-3.5 w-3.5" />
                                      </button>
                                    </form>
                                  )}
                                </div>
                              )}

                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                  </div>

                </div>
              )}

              {/* TAB 7: ALERTS & NOTIFICATIONS */}
              {activeTab === 'notifications' && (
                <div className="space-y-6 animate-fade-in">
                  
                  <div className="flex justify-between items-center border-b border-purple-500/5 pb-4">
                    <span className="text-[10px] font-mono font-black text-gray-500 uppercase tracking-widest block">SYSTEM NOTIFICATION INBOX</span>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                        }}
                        className="text-[10px] font-mono font-bold text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 px-2 py-1 rounded cursor-pointer"
                      >
                        Mark All Read
                      </button>
                      <button
                        onClick={() => setNotifications([])}
                        className="text-[10px] font-mono font-bold text-rose-400 hover:text-rose-300 bg-rose-500/10 px-2 py-1 rounded cursor-pointer"
                      >
                        Clear Inbox
                      </button>
                    </div>
                  </div>

                  {notifications.length === 0 ? (
                    <div className="py-12 text-center text-gray-500 text-xs font-mono">
                      No notifications or inbox alerts found. All systems synchronized.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`rounded-xl border p-4.5 flex gap-4 transition-all relative overflow-hidden ${
                            notif.read
                              ? 'border-purple-500/5 bg-[#090b10]/40 opacity-70'
                              : 'border-purple-500/15 bg-purple-500/5 shadow-[0_0_15px_rgba(147,51,234,0.05)]'
                          }`}
                        >
                          {/* Left indicator marker */}
                          <div className={`absolute top-0 left-0 bottom-0 w-1 ${
                            notif.type === 'security'
                              ? 'bg-rose-500'
                              : notif.type === 'reward'
                                ? 'bg-amber-500'
                                : 'bg-[#bf5af2]'
                          }`}></div>

                          {/* Icon marker representation */}
                          <div className="flex-shrink-0 mt-0.5">
                            {notif.type === 'security' ? (
                              <ShieldAlert className="h-5 w-5 text-rose-400" />
                            ) : notif.type === 'reward' ? (
                              <Trophy className="h-5 w-5 text-amber-400" />
                            ) : (
                              <Bell className="h-5 w-5 text-[#bf5af2]" />
                            )}
                          </div>

                          {/* Text body */}
                          <div className="flex-grow space-y-1">
                            <div className="flex justify-between items-start">
                              <h4 className="text-xs font-black text-white">{notif.title}</h4>
                              <span className="text-[8px] font-mono text-gray-500">{notif.date}</span>
                            </div>
                            <p className="text-[11px] text-gray-300 leading-relaxed font-sans">{notif.message}</p>
                          </div>

                          {/* Delete/Dismiss single indicator button */}
                          <button
                            onClick={() => {
                              setNotifications(prev => prev.filter(n => n.id !== notif.id));
                            }}
                            className="text-gray-500 hover:text-rose-400 transition-colors p-1 flex-shrink-0"
                            title="Delete notification"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>

                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )}

              {/* TAB 8: SECURITY & SETTINGS */}
              {activeTab === 'security' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Password Updating & 2FA Configuration columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-4">
                    
                    {/* Password change form container */}
                    <div className="rounded-xl border border-purple-500/10 bg-black/30 p-5 space-y-4">
                      <div className="flex items-center space-x-2 text-[#bf5af2]">
                        <KeyRound className="h-4.5 w-4.5" />
                        <span className="text-[9px] font-mono font-black uppercase tracking-widest block">SECURE PASSWORD STORAGE</span>
                      </div>

                      <form onSubmit={handleChangePassword} className="space-y-3.5">
                        <div>
                          <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Current Password</label>
                          <input
                            type="password"
                            placeholder="••••••••••••"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full bg-[#0a0a0e] border border-purple-500/10 focus:border-purple-500/30 text-xs p-2.5 rounded-lg text-white focus:outline-none font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">New Cyber Password</label>
                          <input
                            type="password"
                            placeholder="••••••••••••"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full bg-[#0a0a0e] border border-purple-500/10 focus:border-purple-500/30 text-xs p-2.5 rounded-lg text-white focus:outline-none font-mono"
                          />
                        </div>

                        {/* Strength Visual Meter */}
                        {newPassword.length > 0 && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-[8px] font-mono text-gray-400">
                              <span>Password Strength Check:</span>
                              <span className={
                                passwordStrength <= 2 ? 'text-rose-400 font-bold' : passwordStrength <= 4 ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'
                              }>
                                {passwordStrength <= 2 ? 'WEAK' : passwordStrength <= 4 ? 'MEDIUM' : 'EXCELLENT CYBER SECURE'}
                              </span>
                            </div>
                            <div className="h-1.5 w-full bg-black/60 rounded-full overflow-hidden flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((step) => (
                                <div
                                  key={step}
                                  className={`h-full flex-grow transition-all duration-300 ${
                                    passwordStrength >= step
                                      ? passwordStrength <= 2
                                        ? 'bg-rose-500'
                                        : passwordStrength <= 4
                                          ? 'bg-amber-500'
                                          : 'bg-emerald-500'
                                      : 'bg-white/5'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        <div>
                          <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Confirm New Password</label>
                          <input
                            type="password"
                            placeholder="••••••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-[#0a0a0e] border border-purple-500/10 focus:border-purple-500/30 text-xs p-2.5 rounded-lg text-white focus:outline-none font-mono"
                          />
                        </div>

                        {passwordError && (
                          <div className="text-rose-400 text-[10px] font-mono animate-pulse">
                            ❌ {passwordError}
                          </div>
                        )}

                        <button
                          type="submit"
                          className="w-full py-2.5 bg-[#bf5af2] hover:bg-purple-600 text-black font-extrabold text-xs uppercase rounded-xl transition-all cursor-pointer text-center"
                        >
                          Update Web Password
                        </button>

                        {passwordChangeSuccess && (
                          <div className="text-center text-xs font-mono text-emerald-400 animate-pulse mt-2">
                            ✓ Security Credentials successfully compiled and hashed!
                          </div>
                        )}
                      </form>
                    </div>

                    {/* Two-Factor Authentication Workflow */}
                    <div className="rounded-xl border border-purple-500/10 bg-black/30 p-5 space-y-4">
                      <div className="flex items-center space-x-2 text-cyan-400">
                        <ShieldCheck className="h-4.5 w-4.5" />
                        <span className="text-[9px] font-mono font-black uppercase tracking-widest block">TWO-FACTOR AUTHENTICATION (2FA)</span>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3.5 rounded-xl bg-black/40 border border-purple-500/5">
                          <div>
                            <div className="text-xs font-bold text-white">Status Status Check</div>
                            <div className="text-[9px] font-mono text-gray-500 mt-0.5">Secure coin logs authorizations</div>
                          </div>
                          
                          <span className={`text-[9px] font-mono font-bold px-2.5 py-1 rounded-full border ${
                            is2faEnabled 
                              ? 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]' 
                              : 'text-rose-400 bg-rose-500/15 border-rose-500/30'
                          }`}>
                            {is2faEnabled ? 'ENABLED (SECURE)' : 'DISABLED (VULNERABLE)'}
                          </span>
                        </div>

                        <p className="text-[10px] text-gray-400 leading-relaxed font-sans">We highly recommend linking authenticator apps (Google Authenticator, Authy) to secure crate keys transaction checks.</p>

                        {is2faEnabled ? (
                          <button
                            onClick={disable2FA}
                            className="w-full py-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 hover:text-rose-300 font-mono font-bold text-xs uppercase rounded-xl cursor-pointer"
                          >
                            Disable Two-Factor Verification
                          </button>
                        ) : is2faSetupOpen ? (
                          <form onSubmit={handleConfirm2FA} className="space-y-4 bg-black/60 p-4 rounded-xl border border-purple-500/10">
                            
                            {/* QR Code and secret key block mock */}
                            <div className="flex items-center gap-4 border-b border-purple-500/5 pb-3">
                              <div className="h-20 w-20 bg-white rounded-lg p-1 flex-shrink-0 flex flex-wrap gap-1 items-center justify-center relative overflow-hidden">
                                {/* Simulated QR matrix blocks */}
                                <div className="absolute inset-1 bg-black/10"></div>
                                <div className="h-3 w-3 bg-black self-start justify-self-start"></div>
                                <div className="h-3 w-3 bg-black self-start justify-self-end"></div>
                                <div className="h-3 w-3 bg-black self-end justify-self-start"></div>
                                <div className="h-2 w-2 bg-black"></div>
                                <div className="h-1.5 w-4 bg-black"></div>
                                <div className="h-3 w-1 bg-black"></div>
                                <div className="h-1 w-5 bg-black"></div>
                              </div>

                              <div className="space-y-1 text-[9px] font-mono text-gray-400">
                                <div className="text-white font-bold">Manual Bind Key:</div>
                                <div className="bg-black p-1 rounded border border-white/5 text-gray-300 text-[10px] tracking-wider select-all">VOLX-SF2E-A9D8-K912</div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText("VOLX-SF2E-A9D8-K912");
                                    setCopiedSecret(true);
                                    setTimeout(() => setCopiedSecret(false), 2000);
                                  }}
                                  className="text-[#bf5af2] hover:underline font-bold text-[8px]"
                                >
                                  {copiedSecret ? 'COPIED SECRET' : 'COPY SECRET KEY'}
                                </button>
                              </div>
                            </div>

                            {/* Verification Pin Field */}
                            <div>
                              <label className="text-[9px] font-mono text-gray-500 uppercase block mb-1">Enter 6-Digit Verification PIN</label>
                              <input
                                type="text"
                                maxLength={6}
                                placeholder="123456"
                                value={pin2fa}
                                onChange={(e) => setPin2fa(e.target.value.replace(/\D/g, ''))}
                                className="w-full bg-[#0a0a0e] border border-purple-500/15 focus:border-purple-500/35 text-center text-sm font-mono tracking-widest p-2 rounded-lg text-white focus:outline-none"
                              />
                            </div>

                            {twoFactorError && (
                              <div className="text-rose-400 text-[9px] font-mono text-center">
                                {twoFactorError}
                              </div>
                            )}

                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() => setIs2faSetupOpen(false)}
                                className="py-2 bg-white/5 hover:bg-white/10 text-white font-mono text-[9px] uppercase font-bold rounded-lg cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="py-2 bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-[9px] uppercase font-bold rounded-lg cursor-pointer"
                              >
                                Activate 2FA
                              </button>
                            </div>

                          </form>
                        ) : (
                          <button
                            onClick={() => setIs2faSetupOpen(true)}
                            className="w-full py-2.5 bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs uppercase rounded-xl cursor-pointer shadow-[0_0_15px_rgba(34,211,238,0.1)] transition-all text-center"
                          >
                            Setup Two-Factor Authentication
                          </button>
                        )}

                      </div>
                    </div>

                  </div>

                  {/* Real-time Security Logbook & Session History Panel */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Active Sessions Panel */}
                    <div className="rounded-xl border border-purple-500/10 bg-black/30 p-5 space-y-4">
                      <div className="flex items-center space-x-2 text-cyan-400">
                        <Key className="h-4.5 w-4.5" />
                        <span className="text-[9px] font-mono font-black uppercase tracking-widest block">ACTIVE SESSION NODES (JWT)</span>
                      </div>
                      
                      <div className="space-y-3">
                        {activeSessions.length === 0 ? (
                          <div className="text-center py-6 text-xs text-gray-500 font-mono">
                            No active auth tokens found. Please re-authenticate.
                          </div>
                        ) : (
                          activeSessions.map((sess, idx) => (
                            <div key={idx} className="p-3 bg-black/40 rounded-xl border border-purple-500/5 flex justify-between items-center text-xs font-mono">
                              <div className="space-y-1">
                                <div className="text-white font-bold flex items-center gap-1.5">
                                  <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                  {sess.device || 'Web Browser'}
                                </div>
                                <div className="text-[9px] text-gray-500">IP: {sess.ip} • Last Active: {sess.lastActive ? new Date(sess.lastActive).toLocaleTimeString() : 'Just Now'}</div>
                              </div>
                              <span className="text-[8px] font-mono font-bold bg-cyan-500/15 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/30">
                                ACTIVE TOKEN
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Audit Logs Logbook */}
                    <div className="rounded-xl border border-purple-500/10 bg-black/30 p-5 space-y-4">
                      <div className="flex items-center space-x-2 text-purple-400">
                        <Shield className="h-4.5 w-4.5" />
                        <span className="text-[9px] font-mono font-black uppercase tracking-widest block">SECURITY LOGS AUDIT BOOK</span>
                      </div>

                      <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                        {securityAuditLogs.length === 0 ? (
                          <div className="text-center py-6 text-xs text-gray-500 font-mono">
                            Audit logs compilation empty.
                          </div>
                        ) : (
                          securityAuditLogs.map((log) => (
                            <div key={log.id} className="p-2.5 bg-[#090b10] rounded-lg border border-purple-500/5 text-[10px] font-mono flex justify-between items-start">
                              <div className="space-y-0.5">
                                <div className="text-gray-300 font-bold">{log.event}</div>
                                <div className="text-[8px] text-gray-500">Node: {log.ip} ({log.device?.split('/')[0] || 'Browser'})</div>
                              </div>
                              <span className="text-[8px] text-purple-400 mt-0.5">{log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : 'Just Now'}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                  </div>

                  {/* General In-game preferences config settings */}
                  <div className="space-y-4">
                    <span className="text-[10px] font-mono font-black text-gray-500 uppercase tracking-widest block">IN-GAME COMMAND & HUD PREFERENCES</span>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Preference Toggles item 1 */}
                      <div className="rounded-xl border border-purple-500/5 bg-[#090b10] p-4 flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-white">Toggle Hub Flight Permission</h4>
                          <p className="text-[10px] text-gray-500 mt-0.5 font-sans">Double tap space in lobbies to activate /fly commands.</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={lobbyFlight}
                          onChange={(e) => setLobbyFlight(e.target.checked)}
                          className="h-4.5 w-4.5 rounded border-purple-500/10 focus:ring-0 checked:bg-purple-600 cursor-pointer"
                        />
                      </div>

                      {/* Toggle fireworks on joins */}
                      <div className="rounded-xl border border-purple-500/5 bg-[#090b10] p-4 flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-white">Join Lighting Fireworks</h4>
                          <p className="text-[10px] text-gray-500 mt-0.5 font-sans">Triggers cosmic animations whenever you connect slots.</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={joinFireworks}
                          onChange={(e) => setJoinFireworks(e.target.checked)}
                          className="h-4.5 w-4.5 rounded border-purple-500/10 focus:ring-0 checked:bg-purple-600 cursor-pointer"
                        />
                      </div>

                      {/* Display server sidebar info */}
                      <div className="rounded-xl border border-purple-500/5 bg-[#090b10] p-4 flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-white">Scoreboard HUD Sidebar</h4>
                          <p className="text-[10px] text-gray-500 mt-0.5 font-sans">Show ping rates, server levels, and coin stats inside sidebar.</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={hudVisibility}
                          onChange={(e) => setHudVisibility(e.target.checked)}
                          className="h-4.5 w-4.5 rounded border-purple-500/10 focus:ring-0 checked:bg-purple-600 cursor-pointer"
                        />
                      </div>

                      {/* Discord rich status activity */}
                      <div className="rounded-xl border border-purple-500/5 bg-[#090b10] p-4 flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-white">Discord Rich Presence Active</h4>
                          <p className="text-[10px] text-gray-500 mt-0.5 font-sans">Display in-game server coordinates inside discord status activity.</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={showDiscordActivity}
                          onChange={(e) => setShowDiscordActivity(e.target.checked)}
                          className="h-4.5 w-4.5 rounded border-purple-500/10 focus:ring-0 checked:bg-purple-600 cursor-pointer"
                        />
                      </div>

                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* Premium badge footer panel */}
            <div className="border-t border-purple-500/5 mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-gray-600">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-purple-400" />
                <span>SSL Encrypted Web Session SHA-256</span>
              </span>
              <span>Account Synchronizer UUID: play.volexmc.net:{activeUser}</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
