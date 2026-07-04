export interface StoreItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: 'Ranks' | 'Crates' | 'Keys' | 'Coins' | 'Kits' | 'Bundles' | 'Season Pass' | 'Cosmetics' | 'Pets' | 'Particles' | 'Commands' | 'Boosters' | string;
  badge?: string;
  perks: string[];
  gradient: string; // Tailwind gradient starting color
  borderColor: string;
  glowColor: string;
  image?: string;
  animation?: string;
}

export interface CartItem extends StoreItem {
  quantity: number;
}

export interface ServerStatus {
  online: boolean;
  players: number;
  maxPlayers: number;
  ip: string;
  port: number;
  ping: number;
  version: string;
  playersList: string[];
}

export interface DiscordStatus {
  onlineMembers: number;
  totalMembers: number;
  inviteLink: string;
}

export interface Transaction {
  id: string;
  username: string;
  items: CartItem[];
  amount: number;
  paymentMethod: string;
  status: 'pending' | 'verifying' | 'processing' | 'transmitted' | 'completed';
  timestamp: string;
  commands: string[];
}

export interface Review {
  id: string;
  username: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}
