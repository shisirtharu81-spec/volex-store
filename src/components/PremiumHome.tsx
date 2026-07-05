import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, MessageSquare, Star, CheckCircle, ChevronRight, Activity, 
  Server, Award, Users, Zap, Shield, Copy, Check, Gift, Coins, 
  Flame, ArrowRight, TrendingUp, Volume2, VolumeX, Compass
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

const CRATE_PRIZES = {
  ancient: [
    { name: "Diamond Sword [Sharpness IV]", rarity: "Rare", color: "text-blue-400" },
    { name: "1,000 Volex Coins Voucher", rarity: "Epic", color: "text-purple-400" },
    { name: "VIP Rank Lifetime Upgrade", rarity: "Legendary", color: "text-amber-400" },
  ],
  mythic: [
    { name: "Netherite Axe [Smite VI]", rarity: "Epic", color: "text-purple-400" },
    { name: "5,000 Volex Coins Voucher", rarity: "Epic", color: "text-purple-400" },
    { name: "MVP Rank Lifetime Upgrade", rarity: "Legendary", color: "text-amber-400" },
  ],
  cosmic: [
    { name: "VOLEX Cosmic Rank Upgrade [LIFETIME]", rarity: "Cosmic", color: "text-[#bf5af2] font-black" },
    { name: "15,000 Volex Coins Voucher", rarity: "Legendary", color: "text-amber-400" },
  ]
};

export const PremiumHome: React.FC<PremiumHomeProps> = ({
  serverStatus, discordStatus, connectedUser, onConnectUser, onDisconnectUser, 
  setActiveSection, setSelectedCategory, onAddToCart, formatPrice, reviews, 
  onPostReview, onSelectProduct
}) => {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const heroButtonsRef = useRef<HTMLDivElement>(null);

  // ... (Baaki logic wahi rahega jo aapne pehle diya tha)

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      
      {/* Minecraft Background Layer */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('/minecraft-dungeons-3840x2160-26715.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          filter: 'brightness(0.35)'
        }}
      />

      {/* Main Content Wrapper */}
      <div className="relative z-10 space-y-16 animate-fade-in p-6">
        
        {/* Sound Toggle */}
        <div className="flex justify-end">
           <button onClick={() => setSoundEnabled(!soundEnabled)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-purple-500/10 bg-black/40 text-gray-400 text-[10px] uppercase">
             {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
             {soundEnabled ? "SOUNDS ON" : "SOUNDS OFF"}
           </button>
        </div>

        {/* Hero Section */}
        <div className="text-center py-20 bg-black/20 backdrop-blur-md rounded-3xl border border-white/5">
          <h1 ref={titleRef} className="text-5xl md:text-8xl font-black text-white">UPGRADE YOUR SAGA</h1>
          <p ref={subtitleRef} className="text-gray-400 mt-4 max-w-xl mx-auto">Access lifetime ranks and loot instantly on play.volexmc.net</p>
          
          <div ref={heroButtonsRef} className="pt-8 flex justify-center gap-4">
            <button onClick={() => setActiveSection('shop')} className="bg-purple-600 px-8 py-4 rounded-xl font-black text-white hover:bg-purple-500 transition-all">
              EXPLORE STORE
            </button>
          </div>
        </div>

        {/* Baki sections yahan aayenge */}
      </div>
    </div>
  );
};
