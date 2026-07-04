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
      "Access to 2 weekly common mystery boxes",
      "Priority server slot bypass on overflow (up to 400 players)"
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

  // 2. CRATES
  {
    id: "crate-ancient-pack",
    name: "Ancient Loot Crate Bundle",
    price: 2.49,
    originalPrice: 4.99,
    description: "A secure heavy metal case filled with essential mining tools, gear, and high-frequency loot. Drops at spawn.",
    category: "Crates",
    badge: "50% OFF",
    perks: [
      "3x Physical Ancient Loot Crates spawnable in-game",
      "Guarantees diamond tiered tools or epic custom shields",
      "Unlock server custom banner designs automatically",
      "Zero key requirements - right click to unbox instantly"
    ],
    gradient: "from-slate-600 to-zinc-800",
    borderColor: "border-slate-500/30",
    glowColor: "shadow-slate-500/10",
    image: "https://images.unsplash.com/photo-1605557202138-097824c3f9ff?auto=format&fit=crop&w=400&q=80",
    animation: "scale-102"
  },
  {
    id: "crate-mythic-pack",
    name: "Mythic Mystery Crate Bundle",
    price: 7.49,
    originalPrice: 14.99,
    description: "A radiant relic casket containing custom glowing neon weapons, lobby gadgets, and dynamic companion pets.",
    category: "Crates",
    badge: "MYSTERY RELIC",
    perks: [
      "2x Mythic Loot Caskets added to server profile",
      "Guaranteed epic level drop rate or higher",
      "Chance to secure highly demanded Custom Skyblock Minions",
      "Broadcasts a server-wide opening fanfare when clicked"
    ],
    gradient: "from-indigo-600 to-purple-800",
    borderColor: "border-indigo-500/30",
    glowColor: "shadow-indigo-500/10",
    image: "https://images.unsplash.com/photo-1595206133361-b1fe343e5e23?auto=format&fit=crop&w=400&q=80",
    animation: "pulse-slow"
  },
  {
    id: "crate-cosmic-pack",
    name: "Cosmic Overlord Loot Crate",
    price: 14.99,
    originalPrice: 29.99,
    description: "The crown jewel of server unboxings. Drops extreme cyberpunk skin modules, lobby flight keys, and MVP coupons.",
    category: "Crates",
    badge: "ULTIMATE LOOT",
    perks: [
      "1x Giant Cosmic Overlord chest dispatched immediately",
      "100% chance for Legendary or Cosmic tier custom cosmetics",
      "Possibility of unlocking permanent server /fly commands",
      "Emits hyper-detailed matrix particle circles at spawn"
    ],
    gradient: "from-pink-600 to-indigo-800",
    borderColor: "border-pink-500/30",
    glowColor: "shadow-pink-500/20",
    image: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=400&q=80",
    animation: "float"
  },

  // 3. KEYS
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

  // 4. COINS
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

  // 5. KITS
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
  },

  // 6. BUNDLES
  {
    id: "bundle-cyber",
    name: "Volex Cyber Bundle",
    price: 34.99,
    originalPrice: 69.99,
    description: "The complete setup to dominate VOLEX Server lobbies. Packed with Rank enhancements, keys, and currency boost.",
    category: "Bundles",
    badge: "50% TOTAL DISCOUNT",
    perks: [
      "MVP Rank (Lifetime upgrade for self or voucher)",
      "10x Mythic Crate Keys ($22 Value)",
      "5,000 Volex Coins ($25 Value)",
      "Special cyber particle trail unlocked forever"
    ],
    gradient: "from-indigo-600 to-purple-600",
    borderColor: "border-[#bf5af2]",
    glowColor: "shadow-[#bf5af2]/30",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80",
    animation: "float"
  },
  {
    id: "bundle-overlord",
    name: "Ultimate Overlord Bundle",
    price: 59.99,
    originalPrice: 119.99,
    description: "A supreme cosmic package grouping ultimate commands, custom pets, and a mountain of server multipliers.",
    category: "Bundles",
    badge: "PREMIUM PACK",
    perks: [
      "VIP+ Rank lifetime voucher card ($19.99 Value)",
      "30x Cosmic Portal Key bundles ($119.99 Value)",
      "Exclusive Companion Pet: Hologram Ender Dragon",
      "Immediate Server-Wide 2x Coin Booster (3 Hours)"
    ],
    gradient: "from-purple-600 to-rose-600",
    borderColor: "border-purple-500/30",
    glowColor: "shadow-purple-500/20",
    image: "https://images.unsplash.com/photo-1618005198143-e528346dd24f?auto=format&fit=crop&w=400&q=80",
    animation: "float"
  },

  // 7. SEASON PASS
  {
    id: "pass-summer-standard",
    name: "Summer Cosmic Pass",
    price: 9.99,
    originalPrice: 19.99,
    description: "Unlock the Summer seasonal leveling tier list. Complete quests to secure ancient relics, keys, and tags.",
    category: "Season Pass",
    badge: "SEASON 4",
    perks: [
      "Unlocks the premium tier list rewards for Summer Season",
      "Exclusive Summer-themed prefix tag in global lobbies",
      "Daily pass challenges with bonus Guild experience rewards",
      "Gain 500 Volex Coins instantly as an activation bonus"
    ],
    gradient: "from-orange-500 to-amber-600",
    borderColor: "border-orange-500/20",
    glowColor: "shadow-orange-500/10",
    image: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=400&q=80",
    animation: "scale-102"
  },
  {
    id: "pass-summer-elite",
    name: "Summer Pass Elite Upgrade",
    price: 19.99,
    originalPrice: 39.99,
    description: "Instantly jump 15 tiers in the Summer Cosmic Pass and gain double drop rewards from standard crates.",
    category: "Season Pass",
    badge: "ELITE BUNDLE",
    perks: [
      "Skips first 15 tiers of season pass progress immediately",
      "All regular Premium Summer Pass rewards unlocked",
      "Permenant +15% season quest experience multiplier",
      "Unlocks the glowing Neon Sun halo accessory in lobby wardrobes"
    ],
    gradient: "from-amber-500 to-yellow-600",
    borderColor: "border-amber-500/30",
    glowColor: "shadow-amber-500/15",
    image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=400&q=80",
    animation: "pulse-slow"
  },

  // 8. COSMETICS
  {
    id: "cosmetic-neon-tag",
    name: "Neon Custom Nameplate Tag",
    price: 1.49,
    originalPrice: 2.99,
    description: "Add a flashy custom neon glowing border around your nameplate visible in survival lobbies.",
    category: "Cosmetics",
    perks: [
      "Enables custom glowing colors for player scoreboard tags",
      "Toggleable dynamic color cycles (Amethyst, Emerald, Ruby)",
      "Standalone perk - works on top of any active server rank"
    ],
    gradient: "from-purple-500 to-indigo-500",
    borderColor: "border-purple-500/10",
    glowColor: "shadow-purple-500/10",
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=400&q=80",
    animation: "scale-102"
  },
  {
    id: "cosmetic-void-wings",
    name: "Void Dragon Wings",
    price: 5.99,
    originalPrice: 11.99,
    description: "Equip realistic custom dark void wings on your back inside lobbies and hub hubs. Highly detailed physics.",
    category: "Cosmetics",
    badge: "EXCLUSIVE RENDER",
    perks: [
      "Spawns dark animated wings that flap in synchronization with jumping",
      "Emits falling void obsidian particle dust under your coordinates",
      "Fully visible to all players in all mini-game lobbys"
    ],
    gradient: "from-slate-800 to-black",
    borderColor: "border-slate-700/30",
    glowColor: "shadow-slate-700/15",
    image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=400&q=80",
    animation: "float"
  },
  {
    id: "cosmetic-glitch-cape",
    name: "Glitch Cyber Cape",
    price: 3.49,
    originalPrice: 6.99,
    description: "An animated digital cape mimicking retro holographic matrices. Glitches between green and magenta matrix grids.",
    category: "Cosmetics",
    perks: [
      "Dynamic matrix cascading visual cape texture",
      "Custom scoreboard animation triggers on server joins",
      "Supports player custom initials embroidered in glowing text"
    ],
    gradient: "from-fuchsia-600 to-teal-500",
    borderColor: "border-fuchsia-500/20",
    glowColor: "shadow-fuchsia-500/10",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=400&q=80",
    animation: "float"
  },

  // 9. PETS
  {
    id: "pet-dragon",
    name: "Mini Ender Dragon Companion",
    price: 7.99,
    originalPrice: 15.99,
    description: "Your very own pet dragon! Hovers around your head, breathes safe violet flame puffs, and roars on command.",
    category: "Pets",
    badge: "LEGENDARY COMPANION",
    perks: [
      "Fully animated mini Ender Dragon following you in lobbies",
      "Allows riding on the pet dragon's back while in hub coordinates",
      "Plays quiet customized synth Ender Dragon roar sound effects",
      "Configurable nickname for the pet using command `/pet rename`"
    ],
    gradient: "from-[#bf5af2] to-slate-900",
    borderColor: "border-[#bf5af2]/30",
    glowColor: "shadow-[#bf5af2]/25",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=400&q=80",
    animation: "float"
  },
  {
    id: "pet-golem",
    name: "Cyber Iron Golem Guardian",
    price: 4.99,
    originalPrice: 9.99,
    description: "A small metallic security guard. Marches proudly beside your character and tosses roses to nearby players.",
    category: "Pets",
    perks: [
      "Cybernetic Golem companion with custom red-stone eye beams",
      "Periodically produces and offers red-stone roses to lobbies",
      "Protects player wardrobe selections in public hubs"
    ],
    gradient: "from-emerald-600 to-slate-800",
    borderColor: "border-emerald-500/20",
    glowColor: "shadow-emerald-500/10",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=400&q=80",
    animation: "scale-102"
  },
  {
    id: "pet-slime",
    name: "Rainbow Neon Slime Pet",
    price: 2.99,
    originalPrice: 5.99,
    description: "A cute bouncy slime companion that cycles between all RGB spectrum values. Splashes on impact.",
    category: "Pets",
    badge: "RGB SPECTRE",
    perks: [
      "Bouncing slime pet shifting through full rainbow colors",
      "Splashes tiny harmless neon particles whenever it hops",
      "Extremely lightweight companion - zero server lag contribution"
    ],
    gradient: "from-cyan-500 via-emerald-400 to-indigo-500",
    borderColor: "border-cyan-500/20",
    glowColor: "shadow-cyan-500/10",
    image: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=400&q=80",
    animation: "pulse-slow"
  },

  // 10. PARTICLES
  {
    id: "trail-fire",
    name: "Inferno Flame Particle Trail",
    price: 2.49,
    originalPrice: 4.99,
    description: "Surround your boots with rising red-hot volcanic fire embers as you sprint across lobbies.",
    category: "Particles",
    perks: [
      "Leaves flame footsteps trailing behind your character model",
      "Spawns circular fire halos when standing completely still",
      "Toggles automatically using wardrobe GUI command `/trails`"
    ],
    gradient: "from-red-500 to-orange-500",
    borderColor: "border-red-500/15",
    glowColor: "shadow-red-500/10",
    image: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=400&q=80",
    animation: "pulse-slow"
  },
  {
    id: "trail-aurora",
    name: "Aurora Borealis Glow Trail",
    price: 3.99,
    originalPrice: 7.99,
    description: "Drape your character in cascading ribbons of celestial green, emerald, and teal waves.",
    category: "Particles",
    badge: "HIGH ART",
    perks: [
      "Emits smooth curved ribbons of light above your head",
      "Fades gracefully through neon green, cyan, and sky blue hues",
      "Draws server crowd attention in public lobbies instantly"
    ],
    gradient: "from-emerald-400 to-teal-500",
    borderColor: "border-emerald-400/20",
    glowColor: "shadow-emerald-400/15",
    image: "https://images.unsplash.com/photo-1579033461380-adb47c3eb938?auto=format&fit=crop&w=400&q=80",
    animation: "float"
  },
  {
    id: "trail-void",
    name: "Void Spiral Helix Trail",
    price: 4.99,
    originalPrice: 9.99,
    description: "Two interlocking spiral columns of obsidian black and deep purple stars cycle around your skin.",
    category: "Particles",
    badge: "COSMIC HELIX",
    perks: [
      "Interactive physics helix swirling around your character",
      "Emits deep spatial portal teleportation particles",
      "Includes exclusive scoreboard particle multiplier bonuses"
    ],
    gradient: "from-indigo-600 to-purple-600",
    borderColor: "border-indigo-500/20",
    glowColor: "shadow-indigo-500/15",
    image: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=400&q=80",
    animation: "vortex-glow"
  },

  // 11. COMMANDS
  {
    id: "perk-fly",
    name: "Global Lobby Flight Permission",
    price: 2.99,
    originalPrice: 5.99,
    description: "Gain flight permissions across all server hubs. Hover, zoom, and visit build heights in style.",
    category: "Commands",
    perks: [
      "Enables the `/fly` command inside all Lobby and Hub worlds",
      "Works on current and future seasonal lobbies",
      "Toggles double tap space to levitate"
    ],
    gradient: "from-cyan-600 to-teal-500",
    borderColor: "border-cyan-500/20",
    glowColor: "shadow-cyan-500/10",
    image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=400&q=80",
    animation: "float"
  },
  {
    id: "command-nick",
    name: "Nickname Access Permission",
    price: 4.99,
    originalPrice: 9.99,
    description: "Play incognito or create custom stage identities. Perfect for streamers or creators evading targeted PvP.",
    category: "Commands",
    badge: "STREAMER FAVORITE",
    perks: [
      "Grants access to `/nick <name>` command inside Survival lobbies",
      "Randomly assigns real offline usernames to spoof your identity",
      "Hides real coordinates and profile stats on server listings"
    ],
    gradient: "from-purple-600 to-pink-600",
    borderColor: "border-purple-500/20",
    glowColor: "shadow-purple-500/10",
    image: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=400&q=80",
    animation: "scale-102"
  },
  {
    id: "command-heal",
    name: "Emergency Heal Permission",
    price: 3.49,
    originalPrice: 6.99,
    description: "Recover from dangerous cave explorations immediately. Instantly replenish food and health bars.",
    category: "Commands",
    perks: [
      "Enables command `/heal` and `/feed` in non-PvP zones",
      "Has a secure 10-minute cooldown to prevent combat logging",
      "Saves inventory drops in cases of accidental fall hazards"
    ],
    gradient: "from-emerald-500 to-teal-600",
    borderColor: "border-emerald-500/20",
    glowColor: "shadow-emerald-500/10",
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=400&q=80",
    animation: "pulse-slow"
  },

  // 12. BOOSTERS
  {
    id: "booster-coin-3h",
    name: "3-Hour 2x Coins Booster",
    price: 1.99,
    originalPrice: 3.99,
    description: "Multiply your server-wide minigame and survival coin earnings for a quick currency injection.",
    category: "Boosters",
    perks: [
      "2x Multiplier on all game completions and achievement checks",
      "Stacks with any existing active VIP or MVP rank multipliers",
      "Can be paused and resumed using console command `/boost`"
    ],
    gradient: "from-indigo-500 to-cyan-500",
    borderColor: "border-indigo-500/15",
    glowColor: "shadow-indigo-500/10",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80",
    animation: "scale-102"
  },
  {
    id: "booster-exp-1d",
    name: "1-Day 3x Guild EXP Booster",
    price: 5.99,
    originalPrice: 11.99,
    description: "Propel your Guild to the top of the leaderboards. Massive experience surge on block breaks.",
    category: "Boosters",
    badge: "GUILD FACTION",
    perks: [
      "3x Multiplier on all Guild level points generated",
      "Applies to all members currently active inside the faction",
      "Displays an active burning booster badge in server lists"
    ],
    gradient: "from-fuchsia-500 to-indigo-600",
    borderColor: "border-fuchsia-500/20",
    glowColor: "shadow-fuchsia-500/15",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80",
    animation: "float"
  },
  {
    id: "booster-global-1h",
    name: "1-Hour Server-Wide 2x Coin Booster",
    price: 9.99,
    originalPrice: 19.99,
    description: "Be the server hero. Activate a 2x coin booster for EVERY player active on the server simultaneously.",
    category: "Boosters",
    badge: "SERVER HERO",
    perks: [
      "Doubles coin rates for all online server slots for 1 hour",
      "Broadcasts your Minecraft character ID as the donor hero",
      "Unlocks the permanent 'Philanthropist' lobby title prefix"
    ],
    gradient: "from-amber-500 to-rose-600",
    borderColor: "border-amber-500/30",
    glowColor: "shadow-amber-500/20",
    image: "https://images.unsplash.com/photo-1492011221367-f47e3ccd77a0?auto=format&fit=crop&w=400&q=80",
    animation: "vortex-glow"
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
