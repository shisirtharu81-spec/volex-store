import { StoreItem, Review } from './types';

export const STORE_ITEMS: StoreItem[] = [
  // 1. RANKS
  {
    id: "rank-vip",
    name: "VIP Rank",
    price: 4.99,
    originalPrice: 9.99,
    description: "Unlock essential bronze server privileges with lifetime duration. Stand out from normal players instantly.",
    category: "Ranks",
    badge: "BASIC LOBBY",
    perks: [
      "[VIP] Prefix in global server chat",
      "Ability to fly in all Hub lobbies",
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
    glowColor: "shadow-amber-500/20",
    image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=400&q=80",
    animation: "float"
  },
  {
    id: "coin-pack-4",
    name: "40,000 Volex Coins",
    price: 99.99,
    originalPrice: 199.99,
    description: "For the absolute coin emperors. Own the in-game market, buy full cosmetic arrays, and gift perks to friends.",
    category: "Coins",
    badge: "BEST VALUE BOOST",
    perks: [
      "40,000 Coins added immediately to server balance",
      "Unlocks unique Golden name badge in lobby scoreboard list",
      "8,000 bonus coins bundled in this pack"
    ],
    gradient: "from-amber-400 to-emerald-500",
    borderColor: "border-emerald-500/40",
    glowColor: "shadow-emerald-500/25",
    image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=400&q=80",
    animation: "scale-102"
  },

  // 4. KITS
  {
    id: "kit-gladiator",
    name: "Gladiator PVP Kit",
    price: 3.99,
    originalPrice: 7.99,
    description: "A heavy melee armor and weapon pack to dominate the Survival PvP Arenas. Fully enchanted iron tier.",
    category: "Kits",
    badge: "PVP CLASSIC",
    perks: [
      "Enchanted Gladiator Iron Armor Set (Protection III, Unbreaking II)",
      "Gladiator Diamond Greatsword (Sharpness IV, Knockback I)",
      "16x Golden Apples & 3x Instant Health II Potions",
      "Can be claimed once per 24 hours in-game using `/kit gladiator`"
    ],
    gradient: "from-red-600 to-rose-800",
    borderColor: "border-red-500/20",
    glowColor: "shadow-red-500/10",
    image: "https://images.unsplash.com/photo-1589156191108-c762ff4b96ab?auto=format&fit=crop&w=400&q=80",
    animation: "float"
  },
  {
    id: "kit-miner",
    name: "Master Miner Resource Kit",
    price: 2.99,
    originalPrice: 5.99,
    description: "Drill through coordinate elevations easily. Equipped with high-speed haste picks and deep-slate torches.",
    category: "Kits",
    perks: [
      "Efficiency V, Fortune III, Unbreaking III Diamond Pickaxe",
      "Efficiency IV Diamond Shovel & Haste II Potion (8 mins)",
      "3x Stacks of Torches and 1x Stack of Baked Potatoes",
      "Available for use every 12 hours via `/kit miner` command"
    ],
    gradient: "from-yellow-600 to-amber-700",
    borderColor: "border-yellow-500/20",
    glowColor: "shadow-yellow-500/10",
    image: "https://images.unsplash.com/photo-1536746803623-cef87080bfc8?auto=format&fit=crop&w=400&q=80",
    animation: "scale-102"
  },
  {
    id: "kit-cybertech",
    name: "CyberTech Vanguard Kit",
    price: 9.99,
    originalPrice: 19.99,
    description: "Advanced futuristic armor modules designed for Void Skyblock. Highly durable and anti-fall damage.",
    category: "Kits",
    badge: "VOID TECH",
    perks: [
      "Cyber Helmet with Night Vision and Water Breathing (Lifetime)",
      "Cyber Chestplate with Thorns III and Blast Protection V",
      "Cyber Boots with Feather Falling VI (Reduces void impacts by 50%)",
      "Vanguard laser pickaxe (Efficiency VII, Silk Touch I)"
    ],
    gradient: "from-cyan-600 to-indigo-700",
    borderColor: "border-cyan-500/30",
    glowColor: "shadow-cyan-500/15",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80",
    animation: "pulse-slow"
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: "rev-1",
    username: "notch",
    rating: 5,
    comment: "Volex has the absolute cleanest web interface ever created. Sync took literally 3 seconds. The keys opened with outstanding neon particles in-game!",
    date: "2026-06-28",
    verified: true
  },
  {
    id: "rev-2",
    username: "xX_Slayer_Xx",
    rating: 5,
    comment: "Upgraded from VIP to MVP+ last night. The discount was instantly applied! Highly professional, zero lag on execution commands.",
    date: "2026-07-02",
    verified: true
  },
  {
    id: "rev-3",
    username: "MinecraftGod",
    rating: 4,
    comment: "Super smooth checkout with Razorpay. Highly recommend buying the 5x Cosmic Keys, the reward kits are unbelievably robust on survival! Awesome store.",
    date: "2026-07-03",
    verified: true
  }
];
