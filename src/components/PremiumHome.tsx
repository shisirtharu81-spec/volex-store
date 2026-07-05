import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  MessageSquare, 
  Star, 
  CheckCircle, 
  ChevronRight, 
  Activity, 
  Server, 
  Award, 
  Users, 
  Zap, 
  Shield, 
  Copy, 
  Check, 
  Gift, 
  Coins, 
  Flame, 
  ArrowRight,
  TrendingUp,
  Volume2,
  VolumeX,
  Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { gsap } from 'gsap';
import { StoreItem, Review, ServerStatus, DiscordStatus } from '../types';
import { STORE_ITEMS } from '../data';

interface PremiumHomeProps {
  serverStatus: ServerStatus | null;
  discordStatus: DiscordStatus | null;
  connectedUser: string | null;
  onConnectUser: (username: string) => void;
  onDisconnectUser: () => void;
  setActiveSection: (sec: string) => void;
  setSelectedCategory: (cat: string) => void;
  onAddToCart: (item: StoreItem, qty: number) => void;
  formatPrice: (price: number) => string;
  reviews: Review[];
  onPostReview: (name: string, rating: number, comment: string) => void;
  onSelectProduct?: (item: StoreItem) => void;
}

// Live Simulated Purchases Feed Data
const RECENT_BUYERS = [
];

// Interactive Crate Prizes Pool for the simulated Crate Roll
const CRATE_PRIZES = {
  ancient: [
    { name: "Diamond Sword [Sharpness IV]", rarity: "Rare", color: "text-blue-400" },
    { name: "1,000 Volex Coins Voucher", rarity: "Epic", color: "text-purple-400" },
    { name: "VIP Rank Lifetime Upgrade", rarity: "Legendary", color: "text-amber-400" },
    { name: "Ancient Kit Voucher", rarity: "Rare", color: "text-blue-400" },
    { name: "32x Enchanted Golden Apples", rarity: "Epic", color: "text-purple-400" }
  ],
  mythic: [
    { name: "Netherite Axe [Smite VI]", rarity: "Epic", color: "text-purple-400" },
    { name: "5,000 Volex Coins Voucher", rarity: "Epic", color: "text-purple-400" },
    { name: "MVP Rank Lifetime Upgrade", rarity: "Legendary", color: "text-amber-400" },
    { name: "Mythical Ender Dragon Companion", rarity: "Cosmic", color: "text-[#bf5af2] font-black" },
    { name: "Lobby Neon Nameplate Voucher", rarity: "Epic", color: "text-purple-400" }
  ],
  cosmic: [
    { name: "VOLEX Cosmic Rank Upgrade [LIFETIME]", rarity: "Cosmic", color: "text-[#bf5af2] font-black" },
    { name: "15,000 Volex Coins Voucher", rarity: "Legendary", color: "text-amber-400" },
    { name: "Custom Lobby Particle Flight Trail", rarity: "Cosmic", color: "text-[#bf5af2] font-black" },
    { name: "Volex Cyber Bundle Key", rarity: "Legendary", color: "text-amber-400" },
    { name: "Infinity Bow [Power VIII, Flame II]", rarity: "Epic", color: "text-purple-400" }
  ]
};

export const PremiumHome: React.FC<PremiumHomeProps> = ({
  serverStatus,
  discordStatus,
  connectedUser,
  onConnectUser,
  onDisconnectUser,
  setActiveSection,
  setSelectedCategory,
  onAddToCart,
  formatPrice,
  reviews,
  onPostReview,
  onSelectProduct
}) => {
  // Input fields for reviews local hook
  const [revName, setRevName] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [revComment, setRevComment] = useState('');
  const [revSuccess, setRevSuccess] = useState(false);

  // General States
  const [ipCopied, setIpCopied] = useState(false);
  const [liveBuyers, setLiveBuyers] = useState(RECENT_BUYERS);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // GSAP Ref bindings
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const heroButtonsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);

  // Interactive Crate Opening States
  const [activeCrate, setActiveCrate] = useState<'ancient' | 'mythic' | 'cosmic'>('cosmic');
  const [crateRolling, setCrateRolling] = useState(false);
  const [crateWinner, setCrateWinner] = useState<any | null>(null);
  const [rollSequence, setRollSequence] = useState<string[]>([]);
  const [rollIndex, setRollIndex] = useState(0);

  // Copy IP callback
  const handleCopyIp = () => {
    navigator.clipboard.writeText("rex-2.drexhost.in:19121");
    setIpCopied(true);
    if (soundEnabled) playSound('click');
    setTimeout(() => setIpCopied(false), 2000);
  };

  // Helper sound function (creates high-fidelity synthesized browser sounds mimicking Minecraft or click clicks)
  const playSound = (type: 'click' | 'levelup' | 'exp' | 'anvil') => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'click') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(120, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.16);
      } else if (type === 'levelup') {
        // High pitched ding chord
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
        osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.3); // C6
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
      } else if (type === 'exp') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800 + Math.random() * 400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
        osc.start();
        osc.stop(ctx.currentTime + 0.13);
      } else if (type === 'anvil') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      }
    } catch (e) {
      console.warn("Audio Context failed to compile.", e);
    }
  };

  // Live dynamic simulated buyers generator (updates real-time ledger)
  useEffect(() => {
    const timer = setInterval(() => {
      const itemsList = [
        "VOLEX Cosmic Rank", "MVP+ Rank", "5x Cosmic Crate Keys", 
        "15,000 Volex Coins", "5x Mythic Crate Keys", "1x Ancient Crate Key", 
        "VIP+ Rank", "Volex Cyber Bundle", "40,000 Volex Coins", "Global Lobby Flight"
      ];
      const playersList = [
        "shisir"
      ];
      const avatarList = ["Steve", "Alex", "Notch", "MHF_Herobrine", "Dream", "Technoblade"];
      
      const randomPlayer = playersList[Math.floor(Math.random() * playersList.length)];
      const randomItem = itemsList[Math.floor(Math.random() * itemsList.length)];
      const randomAvatar = avatarList[Math.floor(Math.random() * avatarList.length)];
      const matchedPrice = STORE_ITEMS.find(i => i.name === randomItem)?.price || 9.99;

      const newBuyer = {
        player: randomPlayer,
        item: randomItem,
        time: "Just now",
        avatar: randomAvatar,
        price: matchedPrice
      };

      setLiveBuyers(prev => {
        const updated = [newBuyer, ...prev.slice(0, 6)];
        // Stagger time descriptions of prior purchases
        return updated.map((buy, idx) => {
          if (idx === 0) return buy;
          return { ...buy, time: `${idx * 2 + Math.floor(Math.random() * 2)} mins ago` };
        });
      });

      if (soundEnabled) playSound('exp');
    }, 14000);

    return () => clearInterval(timer);
  }, [soundEnabled]);

  // Particle Canvas Background Loop
  useEffect(() => {
    const canvas = particleCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = 420);

    const handleResize = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = 420;
    };
    window.addEventListener('resize', handleResize);

    // Particle Classes (golden orbs & void purple motes)
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      life: number;
      maxLife: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 3.2 + 1;
        this.speedX = (Math.random() - 0.5) * 1.2;
        this.speedY = -(Math.random() * 1.5 + 0.3); // always float up
        this.color = Math.random() > 0.4 ? 'rgba(191, 90, 242, 0.4)' : 'rgba(245, 158, 11, 0.35)'; // Purple/Yellow
        this.life = 0;
        this.maxLife = Math.random() * 150 + 100;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life++;
        if (this.y < -10 || this.life >= this.maxLife) {
          this.y = height + 10;
          this.x = Math.random() * width;
          this.life = 0;
        }
      }

      draw(c: CanvasRenderingContext2D) {
        c.save();
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fillStyle = this.color;
        // make particles glow
        c.shadowBlur = 8;
        c.shadowColor = this.color;
        c.fill();
        c.restore();
      }
    }

    const particles: Particle[] = [];
    for (let i = 0; i < 48; i++) {
      particles.push(new Particle());
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update();
        p.draw(ctx);
      });
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // GSAP Premium Load-in effects
  useEffect(() => {
    // Elegant stagger on title elements
    gsap.fromTo(titleRef.current, 
      { opacity: 0, y: 35, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power4.out" }
    );

    gsap.fromTo(subtitleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1.0, delay: 0.2, ease: "power3.out" }
    );

    gsap.fromTo(heroButtonsRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.6, delay: 0.4, ease: "back.out(1.5)" }
    );
  }, []);

  // Form review submit handler
  const handleFormReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revName.trim() || !revComment.trim()) return;
    onPostReview(revName.trim(), revRating, revComment.trim());
    setRevName('');
    setRevComment('');
    setRevSuccess(true);
    playSound('levelup');
    setTimeout(() => setRevSuccess(false), 4000);
  };

  // Interactive simulated Crate Key opening module!
  const rollCrate = () => {
    if (crateRolling) return;
    setCrateRolling(true);
    setCrateWinner(null);
    playSound('click');

    const prizes = CRATE_PRIZES[activeCrate];
    const sequence: string[] = [];
    
    // Generate 25 cycles for a high fidelity roulette visual feeling
    for (let i = 0; i < 28; i++) {
      const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
      sequence.push(randomPrize.name);
    }
    
    setRollSequence(sequence);
    let index = 0;

    // Simulate ticking sounds and fast scroll
    const intervalTime = 60; // ms
    const tickTimer = setInterval(() => {
      setRollIndex(index);
      if (soundEnabled) playSound('click');
      index++;

      if (index >= sequence.length - 1) {
        clearInterval(tickTimer);
        
        // Pick absolute final prize
        const finalWinner = prizes[Math.floor(Math.random() * prizes.length)];
        setCrateWinner(finalWinner);
        setCrateRolling(false);
        playSound('levelup');
      }
    }, intervalTime);
  };

  // Filter out ranks and crates specifically for homepage presentation
  const ranksOnHome = STORE_ITEMS.filter(i => i.category === 'Ranks').slice(1, 4); // VIP+, MVP+, Cosmic
  const keyPackages = STORE_ITEMS.filter(i => i.category === 'Keys');

  return (
    <div className="space-y-16 animate-fade-in relative">
      
      {/* Sound Toggle HUD Element */}
      <div className="absolute right-4 -top-8 z-20 flex items-center gap-1.5">
        <button
          onClick={() => {
            setSoundEnabled(!soundEnabled);
            if (!soundEnabled) {
              setTimeout(() => playSound('levelup'), 100);
            }
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-mono tracking-widest transition-all uppercase cursor-pointer ${
            soundEnabled 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
              : 'bg-black/40 border-purple-500/10 text-gray-400 hover:text-gray-200'
          }`}
          title="Toggle UI Minecraft sound effects"
        >
          {soundEnabled ? (
            <>
              <Volume2 className="h-3.5 w-3.5" />
              <span>SOUNDS ON</span>
            </>
          ) : (
            <>
              <VolumeX className="h-3.5 w-3.5" />
              <span>SOUNDS OFF</span>
            </>
          )}
        </button>
      </div>

      {/* Hero Header Frame with Floating Blocks */}
      <div className="relative text-center py-20 md:py-28 overflow-hidden rounded-3xl border border-purple-500/10 bg-black/40 backdrop-blur-xl">
        
        {/* Particle Canvas Integration overlay */}
        <canvas 
          ref={particleCanvasRef} 
          className="absolute inset-0 w-full h-full pointer-events-none opacity-80"
        />

        {/* Ambient Cosmic Lights */}
        <div className="absolute -left-20 top-0 h-96 w-96 rounded-full bg-[#bf5af2]/5 blur-3xl animate-pulse"></div>
        <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-cyan-500/5 blur-3xl animate-pulse"></div>

        {/* 3D Floating Block elements (CSS animated) */}
        <div className="absolute left-10 bottom-12 h-14 w-14 rounded-xl border border-purple-500/20 bg-gradient-to-br from-[#bf5af2]/10 to-indigo-500/10 backdrop-blur-lg flex items-center justify-center animate-bounce duration-1000 select-none shadow-[0_0_20px_rgba(168,85,247,0.1)] pointer-events-none md:flex hidden">
          <Sparkles className="h-6 w-6 text-purple-400 animate-spin" />
        </div>
        <div className="absolute right-12 top-16 h-16 w-16 rounded-xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-lg flex items-center justify-center animate-pulse select-none shadow-[0_0_20px_rgba(6,182,212,0.1)] pointer-events-none md:flex hidden">
          <Coins className="h-7 w-7 text-cyan-400" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 space-y-6">
          
          {/* Discount Banner Tag */}
          <div className="inline-flex items-center space-x-2 rounded-full border border-purple-500/20 bg-[#bf5af2]/5 px-4 py-1.5 text-xs text-purple-300 font-mono uppercase tracking-widest animate-pulse">
            <Flame className="h-4 w-4 text-orange-400" />
            <span>SUMMER MULTIPLIER ACTIVE: USE CODE <strong className="text-white bg-[#bf5af2]/20 px-2 py-0.5 rounded ml-1 border border-purple-500/30">VOLEX50</strong> FOR 50% SAVINGS</span>
          </div>

          <h1 ref={titleRef} className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-tight text-white leading-none font-sans">
            UPGRADE YOUR <br />
            <span className="bg-gradient-to-r from-[#bf5af2] via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              MINECRAFT SAGA
            </span>
          </h1>

          <p ref={subtitleRef} className="text-xs sm:text-sm md:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed font-sans">
            Connect your character with our secure API to access LuckPerms lifetime ranks, high-frequency loot keys, and cosmetic coins instantly. Powering the absolute best vanilla custom gameplay on <strong className="text-purple-300 font-mono">play.volexmc.net</strong>.
          </p>

          <div ref={heroButtonsRef} className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
            <button
              onClick={() => {
                if (soundEnabled) playSound('levelup');
                setSelectedCategory('All');
                setActiveSection('shop');
              }}
              className="w-full sm:w-auto bg-gradient-to-r from-[#bf5af2] to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs uppercase px-8 py-4 rounded-xl border border-purple-400/20 shadow-[0_0_25px_rgba(168,85,247,0.3)] hover:scale-[1.03] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span>EXPLORE PERKS STORE</span>
            </button>
            <button
              onClick={() => {
                if (soundEnabled) playSound('click');
                setActiveSection('perks');
              }}
              className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase px-8 py-4 rounded-xl border border-white/10 hover:border-white/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>COMPARE RANKS</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href={discordStatus?.inviteLink || "https://discord.gg/MAdBF6Kmdf"}
              target="_blank"
              rel="noreferrer"
              onClick={() => { if (soundEnabled) playSound('click'); }}
              className="w-full sm:w-auto bg-[#5865F2] hover:bg-[#4752C4] text-white font-black text-xs uppercase px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(88,101,242,0.35)] hover:scale-[1.03] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Users className="h-4 w-4" />
              <span>JOIN DISCORD</span>
            </a>
          </div>

          {/* Quick Stats Grid under Hero */}
          <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 border-t border-purple-500/5 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-xl md:text-2xl font-black text-white font-mono">142+</div>
              <div className="text-[9px] text-gray-500 font-mono uppercase tracking-wider">Players Online</div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-2xl font-black text-purple-400 font-mono">8,432</div>
              <div className="text-[9px] text-gray-500 font-mono uppercase tracking-wider">Discord Guild</div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-2xl font-black text-cyan-400 font-mono">2.4M+</div>
              <div className="text-[9px] text-gray-500 font-mono uppercase tracking-wider">Total Commands</div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-2xl font-black text-emerald-400 font-mono">100%</div>
              <div className="text-[9px] text-gray-500 font-mono uppercase tracking-wider">Safe Delivery</div>
            </div>
          </div>

        </div>
      </div>

      {/* Real-time Scrolling Purchases Ticker */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-purple-500/5 pb-2">
          <div className="flex items-center gap-1.5 text-purple-400">
            <TrendingUp className="h-4 w-4" />
            <span className="text-[10px] font-mono font-black uppercase tracking-widest">LIVE TRANSACTIONS LEDGER</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono uppercase flex items-center gap-1">
            <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-ping"></span>
            Synchronized
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {liveBuyers.slice(0, 4).map((buy, index) => (
              <motion.div 
                layout
                key={`${buy.player}-${index}`}
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="bg-[#090b10] border border-purple-500/5 hover:border-purple-500/15 p-3 rounded-xl flex items-center gap-3 relative overflow-hidden group transition-all"
              >
                <img 
                  src={`https://crafatar.com/avatars/${buy.avatar}?size=32&overlay`}
                  alt={buy.player}
                  className="h-8 w-8 rounded border border-purple-500/20 group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://minotar.net/helm/Steve/32.png`;
                  }}
                />
                <div className="flex-grow min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-white truncate">{buy.player}</span>
                    <span className="text-[8px] text-gray-500 font-mono">{buy.time}</span>
                  </div>
                  <div className="text-[10px] text-purple-300 truncate font-sans font-semibold mt-0.5">{buy.item}</div>
                </div>
                <div className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 flex-shrink-0">
                  +${buy.price.toFixed(0)}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Featured Ranks Section (3D hover card styling) */}
      <div className="space-y-6">
        <div className="text-center sm:text-left">
          <span className="text-[10px] font-mono font-black text-purple-400 uppercase tracking-widest block">FEATURED Lifetime RANKS</span>
          <h2 className="text-2xl md:text-3xl font-black text-white font-sans mt-1">
            CLAIM PRESTIGIOUS TIER BENEFITS
          </h2>
          <p className="text-xs text-gray-400 mt-1 max-w-xl leading-relaxed">
            Gain immediate permanent permissions. Select between silver VIP+, elite MVP+ or command server private sessions as the VOLEX Overlord.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ranksOnHome.map((rank) => (
            <div 
              key={rank.id}
              className={`relative overflow-hidden rounded-2xl border ${rank.borderColor} bg-black/40 p-6.5 flex flex-col justify-between group transition-all duration-300 hover:scale-[1.02] hover:border-purple-500/30`}
              style={{ contentVisibility: 'auto' }}
            >
              {/* Inner ambient glow */}
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#bf5af2]/5 group-hover:bg-[#bf5af2]/10 blur-3xl transition-all duration-500"></div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[9px] font-mono font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                    {rank.badge || "LIFETIME TIER"}
                  </span>
                  <Award className="h-5 w-5 text-[#bf5af2]" />
                </div>

                <h3 className="text-xl font-black text-white font-sans">{rank.name}</h3>
                <p className="text-xs text-gray-400 mt-2 font-sans leading-relaxed">{rank.description}</p>

                {/* Sub-features preview list */}
                <ul className="mt-5 space-y-2 border-t border-purple-500/5 pt-4">
                  {rank.perks.slice(0, 4).map((perk, pi) => (
                    <li key={pi} className="flex items-start gap-2 text-[11px] text-gray-300 font-sans leading-relaxed">
                      <CheckCircle className="h-3.5 w-3.5 text-purple-400 mt-0.5 flex-shrink-0" />
                      <span>{perk}</span>
                    </li>
                  ))}
                  {rank.perks.length > 4 && (
                    <li className="text-[10px] text-purple-400 font-mono tracking-wide">
                      + {rank.perks.length - 4} more server features included...
                    </li>
                  )}
                </ul>
              </div>

              <div className="mt-6.5 pt-4 border-t border-purple-500/5 flex items-center justify-between gap-2">
                <div>
                  <div className="text-[9px] font-mono text-gray-500 uppercase leading-none">Lifetime Price</div>
                  <div className="text-2xl font-mono font-black text-white mt-1">
                    {formatPrice(rank.price)}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => {
                      if (soundEnabled) playSound('levelup');
                      onAddToCart(rank, 1);
                    }}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-[9px] uppercase py-2 px-3 rounded-lg border border-purple-500/20 cursor-pointer transition-all"
                  >
                    Buy lifetime
                  </button>
                  {onSelectProduct && (
                    <button
                      onClick={() => {
                        if (soundEnabled) playSound('click');
                        onSelectProduct(rank);
                      }}
                      className="bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-bold text-[9px] uppercase py-1.5 px-3 rounded-lg border border-white/5 cursor-pointer transition-all text-center"
                    >
                      Inspect Perks
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Crate Opening interactive simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-gradient-to-br from-[#0c0d12] to-[#07080a] border border-purple-500/10 rounded-3xl p-6 md:p-8 relative overflow-hidden">
        
        {/* Lights */}
        <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none"></div>

        <div className="lg:col-span-5 space-y-5">
          <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-[9px] font-mono text-cyan-400 uppercase tracking-widest">
            <Compass className="h-3.5 w-3.5" />
            <span>Interactive Lobby Preview</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white font-sans leading-tight">
            THE CRATE PORTAL <br />
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              TEST YOUR LUCK
            </span>
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed font-sans">
            Curious what drops from our mystery server lootboxes? Select a key tier below, then roll the simulated roulette to see real live drop tables!
          </p>

          {/* Selector Tabs */}
          <div className="grid grid-cols-3 gap-2 bg-black/40 p-1.5 rounded-xl border border-white/5">
            <button
              onClick={() => {
                if (soundEnabled) playSound('click');
                setActiveCrate('ancient');
                setCrateWinner(null);
              }}
              className={`py-2 px-1 text-[9px] font-mono font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer text-center ${
                activeCrate === 'ancient' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Ancient Key
            </button>
            <button
              onClick={() => {
                if (soundEnabled) playSound('click');
                setActiveCrate('mythic');
                setCrateWinner(null);
              }}
              className={`py-2 px-1 text-[9px] font-mono font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer text-center ${
                activeCrate === 'mythic' ? 'bg-purple-500/15 text-purple-400 border border-purple-500/20' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Mythic Key
            </button>
            <button
              onClick={() => {
                if (soundEnabled) playSound('click');
                setActiveCrate('cosmic');
                setCrateWinner(null);
              }}
              className={`py-2 px-1 text-[9px] font-mono font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer text-center ${
                activeCrate === 'cosmic' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Cosmic Key
            </button>
          </div>

          <button
            onClick={rollCrate}
            disabled={crateRolling}
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-black font-extrabold text-xs uppercase py-3.5 rounded-xl cursor-pointer transition-all hover:scale-[1.01] flex items-center justify-center gap-1.5"
          >
            <Zap className="h-4 w-4" />
            <span>{crateRolling ? "Opening Lootbox..." : "Roll Test Key"}</span>
          </button>
        </div>

        {/* Crate Visual Output Frame */}
        <div className="lg:col-span-7 bg-black/60 border border-purple-500/5 rounded-2xl p-5 min-h-[220px] flex flex-col justify-center items-center relative text-center">
          
          {/* Crate Icon indicator */}
          <div className="absolute top-4 left-4 flex items-center gap-1.5 text-[9px] font-mono text-gray-500 uppercase">
            <Gift className="h-3.5 w-3.5 text-purple-400" />
            <span>{activeCrate} crate simulator</span>
          </div>

          <AnimatePresence mode="wait">
            {!crateRolling && !crateWinner && (
              <motion.div 
                key="idle"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3 p-4"
              >
                <div className="h-16 w-16 bg-gradient-to-br from-purple-500/15 to-cyan-500/15 border border-purple-500/30 rounded-2xl flex items-center justify-center mx-auto text-[#bf5af2] animate-bounce duration-1000">
                  <Gift className="h-8 w-8" />
                </div>
                <h4 className="text-xs font-mono text-gray-400 uppercase tracking-widest font-black">Crate ready for key insertion</h4>
                <p className="text-[10px] text-gray-500 leading-normal max-w-xs font-sans">
                  Click 'Roll Test Key' to simulate a server-wide opening broadcast.
                </p>
              </motion.div>
            )}

            {crateRolling && (
              <motion.div 
                key="rolling"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full max-w-sm space-y-4"
              >
                <div className="text-[10px] text-cyan-400 font-mono animate-pulse uppercase tracking-wider font-bold">
                  Inserting Key &amp; Resolving loot algorithms...
                </div>
                
                {/* Visual scrolling tape */}
                <div className="h-14 w-full bg-[#0a0a0d] border border-cyan-500/20 rounded-xl flex items-center justify-center overflow-hidden relative">
                  <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] bg-cyan-500 z-10 shadow-[0_0_8px_cyan]"></div>
                  <div className="text-xs font-mono font-black text-purple-300">
                    {rollSequence[rollIndex]}
                  </div>
                </div>
                
                <div className="text-[9px] text-gray-600 font-mono uppercase">
                  TICK TICK TICK...
                </div>
              </motion.div>
            )}

            {crateWinner && (
              <motion.div 
                key="winner"
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="space-y-4 p-4"
              >
                <span className="text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase tracking-widest">
                  CRATE DROP WON
                </span>
                
                <div className={`text-xl md:text-2xl font-black font-sans leading-tight ${crateWinner.color}`}>
                  {crateWinner.name}
                </div>
                
                <div className="text-[10px] font-mono text-gray-400">
                  Rarity: <strong className="text-purple-300 uppercase">{crateWinner.rarity}</strong>
                </div>

                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={() => {
                      if (soundEnabled) playSound('click');
                      setSelectedCategory('Keys');
                      setActiveSection('shop');
                    }}
                    className="bg-white/5 hover:bg-white/10 text-white font-bold text-[9px] uppercase px-4 py-1.5 rounded border border-white/10 transition-all cursor-pointer"
                  >
                    Buy actual keys
                  </button>
                  <button
                    onClick={() => {
                      setCrateWinner(null);
                    }}
                    className="text-purple-400 hover:text-white font-bold text-[9px] uppercase font-mono tracking-wide cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>

      {/* Copy IP and Discord Grid block */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Copy IP card */}
        <div className="rounded-2xl border border-purple-500/10 bg-black/40 p-6 flex flex-col justify-between backdrop-blur-md relative overflow-hidden group">
          <div className="absolute -right-16 -bottom-16 h-40 w-40 rounded-full bg-purple-500/5 group-hover:bg-purple-500/10 blur-3xl transition-all pointer-events-none"></div>

          <div className="space-y-3.5">
            <div className="flex items-center space-x-2">
              <Server className="h-5 w-5 text-[#bf5af2]" />
              <span className="text-[10px] font-mono font-black text-purple-400 uppercase tracking-widest">MINECRAFT SERVER IP</span>
            </div>
            <h3 className="text-xl font-black text-white font-sans leading-none">JOIN THE NETWORK</h3>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              Enter the IP below into your Minecraft multiplayer console. Compatible with Java versions 1.20.4 to 1.21.x.
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between bg-[#090b10] border border-purple-500/5 rounded-xl p-3">
            <div className="font-mono text-sm text-white select-all font-bold">play.volexmc.net</div>
            <button
              onClick={handleCopyIp}
              className="flex items-center gap-1 bg-purple-600 hover:bg-purple-500 text-white font-mono text-[10px] uppercase font-bold py-1.5 px-3 rounded-lg cursor-pointer transition-all"
            >
              {ipCopied ? (
                <>
                  <Check className="h-3 w-3" />
                  <span>COPIED IP</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>COPY IP</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Join Discord card */}
        <div className="rounded-2xl border border-purple-500/10 bg-black/40 p-6 flex flex-col justify-between backdrop-blur-md relative overflow-hidden group">
          <div className="absolute -right-16 -bottom-16 h-40 w-40 rounded-full bg-cyan-500/5 group-hover:bg-cyan-500/10 blur-3xl transition-all pointer-events-none"></div>

          <div className="space-y-3.5">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-cyan-400" />
              <span className="text-[10px] font-mono font-black text-cyan-400 uppercase tracking-widest">COMMUNITY DISCORD GUILD</span>
            </div>
            <h3 className="text-xl font-black text-white font-sans leading-none">JOIN THE COMMUNITY</h3>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              Participate in live giveaways, custom events, support tickets, and get immediate coupon announcements.
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between bg-[#090b10] border border-purple-500/5 rounded-xl p-3">
            <div>
              <div className="text-[9px] font-mono text-gray-500 uppercase leading-none">Discord Status</div>
              <div className="text-xs font-mono font-bold text-white mt-1">
                {discordStatus ? `${discordStatus.onlineMembers} / ${discordStatus.totalMembers} Members Online` : "1,420 Online"}
              </div>
            </div>
            <a
              href={discordStatus?.inviteLink || "https://discord.gg/MAdBF6Kmdf"}
              target="_blank"
              rel="noreferrer"
              onClick={() => { if (soundEnabled) playSound('click'); }}
              className="flex items-center gap-1 bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-[10px] uppercase font-extrabold py-1.5 px-3 rounded-lg cursor-pointer transition-all"
            >
              <span>JOIN GUILD</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

      </div>

      {/* Customer Feedback & Testimonials section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Post a feedback */}
        <div className="rounded-2xl border border-purple-500/10 bg-black/40 p-6 backdrop-blur-md h-fit">
          <div className="flex items-center space-x-1.5 text-purple-400">
            <MessageSquare className="h-4.5 w-4.5" />
            <span className="text-[10px] font-mono font-black uppercase tracking-widest">PLAYER REVIEWS</span>
          </div>
          <h3 className="text-xl font-black text-white mt-1 font-sans">SUBMIT FEEDBACK</h3>
          <p className="text-xs text-gray-400 mt-1 mb-5 leading-normal">
            Your review helps us adjust lootboxes, ranks, and custom keys to maintain a balanced sandbox.
          </p>

          <form onSubmit={handleFormReview} className="space-y-4">
            <div>
              <label className="text-[10px] font-mono text-gray-400 uppercase block mb-1">Character Name</label>
              <input
                type="text"
                placeholder="e.g. notch"
                value={revName}
                onChange={(e) => setRevName(e.target.value)}
                className="w-full bg-[#090b10] border border-purple-500/10 focus:border-purple-500/30 text-white text-xs font-mono rounded-lg p-2.5 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-gray-400 uppercase block mb-1">Rating Stars</label>
              <select
                value={revRating}
                onChange={(e) => setRevRating(Number(e.target.value))}
                className="w-full bg-[#090b10] border border-purple-500/10 focus:border-purple-500/30 text-xs font-mono rounded-lg p-2.5 focus:outline-none text-purple-300"
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                <option value={3}>⭐⭐⭐ (3 Stars)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono text-gray-400 uppercase block mb-1">Detailed Comment</label>
              <textarea
                placeholder="Briefly review key drop rates, rank delivery times, or command access..."
                value={revComment}
                onChange={(e) => setRevComment(e.target.value)}
                className="w-full bg-[#090b10] border border-purple-500/10 focus:border-purple-500/30 text-white text-xs font-sans rounded-lg p-2.5 focus:outline-none h-24 resize-none leading-relaxed"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs uppercase py-2.5 rounded-lg border border-purple-500/20 cursor-pointer transition-all"
            >
              Post comment
            </button>
          </form>

          {revSuccess && (
            <div className="mt-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono rounded p-2 text-center animate-pulse">
              Verified review posted locally on the console ledger!
            </div>
          )}
        </div>

        {/* Live reviews lists */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono font-black text-cyan-400 uppercase tracking-widest block">FEEDBACK FEED</span>
              <h3 className="text-xl font-black text-white mt-1 font-sans">VERIFIED TESTIMONIALS</h3>
            </div>
            <span className="text-xs font-mono text-gray-500">{reviews.length} total reviews</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[460px] overflow-y-auto pr-2">
            {reviews.map((rev) => (
              <div key={rev.id} className="rounded-xl border border-purple-500/5 bg-black/40 p-4.5 space-y-2.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <img
                        src={`https://crafatar.com/avatars/${rev.username}?size=24&overlay`}
                        alt={rev.username}
                        className="h-6 w-6 rounded border border-purple-500/20"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://minotar.net/helm/Steve/24.png`;
                        }}
                      />
                      <span className="text-xs font-mono font-bold text-white leading-none">{rev.username}</span>
                    </div>
                    
                    <div className="flex text-amber-400 text-xs">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-amber-500" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 mt-2.5 italic leading-relaxed font-sans">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-purple-500/5 pt-2 text-[9px] font-mono text-gray-500">
                  <span>Logged: {rev.date}</span>
                  {rev.verified && (
                    <span className="text-emerald-400 font-bold uppercase tracking-wider">Verified VIP Character</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
