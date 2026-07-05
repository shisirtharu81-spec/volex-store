import { StoreItem, Review } from './types';

export const STORE_ITEMS: StoreItem[] = [
  // 1. RANKS
  {
    id: "rank-vip",
    name: "VIP Rank",
    price: 1.99,
    originalPrice: 2.99,
    description: "Unlock essential bronze server privileges with lifetime duration. Stand out from normal players instantly.",
    category: "Ranks",
    badge: "BASIC LOBBY",
    perks: [
      "[VIP] Prefix in global server chat",
      "Green nameplate display & glow",
      "Home slot 4"
    ],
    gradient: "from-[#3b82f6] to-[#06b6d4]",
    borderColor: "border-cyan-500/30",
    glowColor: "shadow-cyan-500/10",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80",
    animation: "scale-102"
  },
  {
    id: "rank-vip-plus",
    name: "VIP+ Rank",
    price: 9.99,
    originalPrice: 19.99,
    description: "Step up your game with silver server benefits. Includes customizable features, pets, and chat filters.",
    category: "Ranks",
    badge: "POPULAR Tier",
    perks: [
      "[VIP+] Prefix in green with custom tag options",
      "All previous VIP features & commands",
      "Spawn custom cosmetic pets/companions (Lobby)",
      "Access to the VIP Guild creation tool",
      "4 weekly common mystery boxes",
      "Exclusive access to the VIP forum sections"
    ],
    gradient: "from-[#10b981] to-[#06b6d4]",
    borderColor: "border-emerald-500/30",
    glowColor: "shadow-emerald-500/10",
    image: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&w=400&q=80",
    animation: "pulse-slow"
  },
  {
    id: "rank-mvp",
    name: "MVP Rank",
    price: 19.99,
    originalPrice: 39.99,
    description: "A prestigious gold level package for hardcore players. Unlocks premium cosmetics and multipliers.",
    category: "Ranks",
    badge: "ELITE PACK",
    perks: [
      "[MVP] Radiant chat prefix",
      "All VIP & VIP+ features",
      "Unlock 3 standard Particle Aura trails",
      "1.5x Multiplier for server coin gain",
      "8 weekly rare mystery boxes",
      "Direct join status message inside hubs"
    ],
    gradient: "from-[#f59e0b] to-[#ec4899]",
    borderColor: "border-amber-500/30",
    glowColor: "shadow-amber-500/10",
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=80",
    animation: "glow-orange"
  },
  {
    id: "rank-mvp-plus",
    name: "MVP+ Rank",
    price: 29.99,
    originalPrice: 59.99,
    description: "The ultimate player's choice. Custom name colors, nicknames, housing worlds, and special permissions.",
    category: "Ranks",
    badge: "BEST SELLER",
    perks: [
      "[MVP+] Customizable tag colors (+ symbol modification)",
      "All previous VIP & MVP features included",
      "Full server nickname access via /nick command",
      "Create high-capacity creative housing worlds",
      "2x Multiplier for global coin gains",
      "Unlimited bypass for server join queues"
    ],
    gradient: "from-[#8b5cf6] to-[#ec4899]",
    borderColor: "border-purple-500/40",
    glowColor: "shadow-purple-500/20",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=400&q=80",
    animation: "float"
  },
  {
    id: "rank-volex",
    name: "VOLEX Cosmic Rank",
    price: 49.99,
    originalPrice: 99.99,
    description: "The absolute highest legendary rank in the server. Overlord status, server hosts, and infinite bragging rights.",
    category: "Ranks",
    badge: "ULTIMATE CYBER",
    perks: [
      "[VOLEX] Dynamic neon glowing chat tag",
      "Host private server custom mini-games for friends",
      "Access to all lobby cosmetics, pets, and trails (100% unlocked)",
      "3x Multiplier for all global server actions",
      "Server moderator application priority bypass",
      "Direct Discord developer beta testing lounge access",
      "Custom server join fireworks and lightning strikes!"
    ],
    gradient: "from-[#a855f7] to-[#3b82f6]",
    borderColor: "border-[#bf5af2]",
    glowColor: "shadow-[#bf5af2]/40",
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&q=80",
    animation: "vortex-glow"
  },

  // 2. KEYS
  {
    id: "key-ancient-1",
    name: "1x Ancient Crate Key",
    price: 1.99,
    originalPrice: 3.99,
    description: "Unlock the Ancient Crate at spawn. Contains custom standard tools, epic swords, and unique level kits.",
    category: "Keys",
    perks: [
      "1x Ancient Crate Key dispatched immediately",
      "Guarantees at least a Rare tier item drop",
      "Chance to unlock Rare glowing lobby emojis",
      "No expiration date - use whenever you want"
    ],
    gradient: "from-blue-600 to-indigo-600",
    borderColor: "border-blue-500/20",
    glowColor: "shadow-blue-500/10",
    image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=400&q=80",
    animation: "float"
  },
  {
    id: "key-mythic-5",
    name: "5x Mythic Crate Keys",
    price: 11.99,
    originalPrice: 24.99,
    description: "A highly demanded bulk deal for the Mythic Crate. Drops custom legendary neon weapons and pets.",
    category: "Keys",
    badge: "20% SAVINGS",
    perks: [
      "5x Mythic Crate Keys delivered immediately",
      "Guarantees at least an Epic tier item drop or higher",
      "0.5% Chance of gaining a free VIP Rank upgrade code",
      "Server-wide opening broadcast alert!"
    ],
    gradient: "from-purple-600 to-pink-600",
    borderColor: "border-purple-500/20",
    glowColor: "shadow-purple-500/10",
    image: "https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?auto=format&fit=crop&w=400&q=80",
    animation: "scale-102"
  },
  {
    id: "key-cosmic-5",
    name: "5x Cosmic Crate Keys",
    price: 19.99,
    originalPrice: 39.99,
    description: "Unlock the Cosmic Portal. High stakes crate featuring custom fly modes, particle trails, and ultimate cosmetics.",
    category: "Keys",
    badge: "HIGH REWARDS",
    perks: [
      "5x Cosmic Crate Keys delivered instantly",
      "Guarantees at least Legendary tier skin or multiplier",
      "Contains extreme cosmetic modules with cyberpunk look",
      "10% Chance for MVP Rank vouchers inside the drops"
    ],
    gradient: "from-pink-600 to-amber-500",
    borderColor: "border-pink-500/30",
    glowColor: "shadow-pink-500/15",
    image: "https://images.unsplash.com/photo-1548345680-f5475ea5df84?auto=format&fit=crop&w=400&q=80",
    animation: "float"
  },

  // 3. COINS
  {
    id: "coin-pack-1",
    name: "1,000 Volex Coins",
    price: 4.99,
    originalPrice: 9.99,
    description: "Exchange for cosmetics, rank tags, or dynamic trail modules inside our in-game GUI store `/gold`.",
    category: "Coins",
    perks: [
      "1,000 Coins added to your global in-game balance",
      "Purchases lobby perks or cosmetic wardrobe items",
      "Instantly syncs to your character account profile"
    ],
    gradient: "from-amber-600 to-yellow-500",
    borderColor: "border-amber-500/20",
    glowColor: "shadow-amber-500/10",
    image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=400&q=80",
    animation: "pulse-slow"
  },
  {
    id: "coin-pack-2",
    name: "5,000 Volex Coins",
    price: 24.99,
    originalPrice: 49.99,
    description: "A solid mid-tier bundle to secure premium custom companion pets and fancy interactive trail styles.",
    category: "Coins",
    badge: "BONUS COINS",
    perks: [
      "5,000 Coins added to global virtual wallet",
      "Get 500 bonus coins included (already factored)",
      "Syncs instantly on server reconnection"
    ],
    gradient: "from-amber-500 to-orange-500",
    borderColor: "border-amber-500/30",
    glowColor: "shadow-amber-500/15",
    image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=400&q=80",
    animation: "pulse-slow"
  },
  {
    id: "coin-pack-3",
    name: "15,000 Volex Coins",
    price: 49.99,
    originalPrice: 99.99,
    description: "An incredibly stacked vault of coins. Secure complete custom setups and epic kit modifications immediately.",
    category: "Coins",
    badge: "POPULAR VALUE",
    perks: [
      "15,000 Coins added to global server state",
      "Includes 2,000 bonus coins free",
      "Aesthetic shiny neon status indicator in scoreboard profile"
    ],
    gradient: "from-amber-500 to-rose-500",
    borderColor: "border-amber-500/40",
    glowColor
