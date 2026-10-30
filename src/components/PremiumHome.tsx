import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Gamepad2, ShieldCheck, Sparkles, Users, Zap, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { StoreItem, Review, ServerStatus, DiscordStatus } from '../types';
import { STORE_ITEMS } from '../data';
import { StoreItemCard } from './StoreItemCard';
import { UsernameLookup } from './UsernameLookup';
import { ServerStatusWidget } from './ServerStatusWidget';

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

export const PremiumHome: React.FC<PremiumHomeProps> = ({
  serverStatus, discordStatus, connectedUser, onConnectUser, onDisconnectUser,
  setActiveSection, setSelectedCategory, onAddToCart, formatPrice, reviews,
  onPostReview, onSelectProduct
}) => {
  const [reviewName, setReviewName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewSent, setReviewSent] = useState(false);

  const featuredItems = STORE_ITEMS.slice(0, 3);
  const onlineCount = serverStatus?.players ?? 0;
  const discordCount = discordStatus?.onlineMembers ?? 0;

  const openCategory = (category: string) => {
    setSelectedCategory(category);
    setActiveSection('shop');
  };

  const submitReview = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!reviewName.trim() || !reviewText.trim()) return;
    onPostReview(reviewName.trim(), reviewRating, reviewText.trim());
    setReviewName('');
    setReviewText('');
    setReviewRating(5);
    setReviewSent(true);
    window.setTimeout(() => setReviewSent(false), 3500);
  };

  return (
    <div className="volex-home space-y-16 pb-16">
      <section className="volex-hero grid items-stretch gap-8 rounded-[10px] bg-white p-8 md:grid-cols-[1.05fr_.95fr] md:p-12">
        <div className="flex flex-col justify-center py-4">
          <div className="volex-eyebrow mb-5 flex items-center gap-2 text-[11px] font-bold uppercase">
            <span className="h-2 w-2 rounded-full bg-[#0057ff]" />
            VOLEX NETWORK · MINECRAFT STORE
          </div>
          <h1 className="volex-section-title max-w-2xl text-4xl font-semibold leading-[1.08] md:text-6xl">
            Make your next
            <span className="block text-[#0057ff]">adventure legendary.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-[#777]">
            Discover ranks, keys, coins and exclusive in-game upgrades for your journey across the Volex network.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={() => setActiveSection('shop')} className="volex-primary">
              Explore the store <ArrowRight size={17} />
            </button>
            <a href={discordStatus?.inviteLink || 'https://discord.gg/BxAngTHFzv'} target="_blank" rel="noreferrer" className="volex-secondary">
              Join our Discord
            </a>
          </div>
          <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-sm text-[#777]">
            <span className="inline-flex items-center gap-2"><ShieldCheck size={16} className="text-[#0057ff]" /> Secure checkout</span>
            <span className="inline-flex items-center gap-2"><Zap size={16} className="text-[#0057ff]" /> In-game rewards</span>
            <span className="inline-flex items-center gap-2"><CheckCircle2 size={16} className="text-[#0057ff]" /> Player-first support</span>
          </div>
        </div>
        <div className="volex-hero-media relative min-h-[300px] overflow-hidden rounded-[10px] bg-[#191919]">
          <img
            src="/minecraft-dungeons-3840x2160-26715.jpg"
            alt="Minecraft adventure landscape"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-7 text-white">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white">
              <Sparkles size={13} /> Built for your next quest
            </div>
            <h2 className="text-2xl font-semibold text-white md:text-3xl">Play together. Rise together.</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-white/80">Find your place in the community and gear up for what comes next.</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="volex-panel flex items-center gap-4 p-5">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eef3ff] text-[#0057ff]"><Users size={20} /></span>
          <div><p className="text-xs text-[#777]">Players online</p><p className="mt-1 text-2xl font-semibold">{serverStatus ? onlineCount.toLocaleString() : '—'}</p></div>
        </div>
        <div className="volex-panel flex items-center gap-4 p-5">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eef3ff] text-[#0057ff]"><Gamepad2 size={20} /></span>
          <div><p className="text-xs text-[#777]">Server version</p><p className="mt-1 text-lg font-semibold">{serverStatus?.version || 'Java Edition'}</p></div>
        </div>
        <div className="volex-panel flex items-center gap-4 p-5">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eef3ff] text-[#0057ff]"><Users size={20} /></span>
          <div><p className="text-xs text-[#777]">Discord online</p><p className="mt-1 text-2xl font-semibold">{discordStatus ? discordCount.toLocaleString() : '—'}</p></div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="volex-eyebrow text-[10px] font-bold uppercase">Find your upgrade</p>
            <h2 className="volex-section-title mt-2 text-3xl font-semibold">Explore the collection</h2>
            <p className="mt-2 text-sm text-[#777]">Choose the perks that match the way you play.</p>
          </div>
          <button onClick={() => setActiveSection('shop')} className="inline-flex items-center gap-2 text-sm font-semibold text-[#0057ff] hover:gap-3">
            View all products <ArrowRight size={16} />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {['Ranks', 'Crates', 'Keys', 'Coins', 'Kits'].map(category => (
            <button key={category} onClick={() => openCategory(category)} className="rounded-full border border-[#e8e8e8] bg-white px-4 py-2 text-sm font-medium text-[#555] hover:border-[#0057ff] hover:text-[#0057ff]">
              {category}
            </button>
          ))}
        </div>
        <div className="volex-product-grid">
          {featuredItems.map(item => (
            <StoreItemCard
              key={item.id}
              item={item}
              onAddToCart={onAddToCart}
              formatPrice={formatPrice}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-[.85fr_1.15fr]">
        <div className="volex-panel p-6 md:p-8">
          <p className="volex-eyebrow text-[10px] font-bold uppercase">Player account</p>
          <h2 className="volex-section-title mt-2 text-2xl font-semibold">Connect your Minecraft profile</h2>
          <p className="mt-2 text-sm leading-6 text-[#777]">Link your in-game username before checkout so your order can be associated with the right player.</p>
          <div className="mt-6">
            <UsernameLookup onConnect={onConnectUser} connectedUser={connectedUser} onDisconnect={onDisconnectUser} />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <p className="volex-eyebrow text-[10px] font-bold uppercase">Live server information</p>
            <h2 className="volex-section-title mt-2 text-2xl font-semibold">Ready to join?</h2>
          </div>
          <ServerStatusWidget status={serverStatus} />
          <a href={discordStatus?.inviteLink || 'https://discord.gg/BxAngTHFzv'} target="_blank" rel="noreferrer" className="volex-panel flex items-center justify-between gap-4 p-5 hover:border-[#0057ff]">
            <div><p className="font-semibold">Need help or want to meet the community?</p><p className="mt-1 text-sm text-[#777]">Join the Volex Discord server.</p></div>
            <ArrowRight className="shrink-0 text-[#0057ff]" size={20} />
          </a>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div><p className="volex-eyebrow text-[10px] font-bold uppercase">Community feedback</p><h2 className="volex-section-title mt-2 text-3xl font-semibold">What players are saying</h2></div>
          <div className="flex items-center gap-1 text-sm text-[#777]"><Star size={15} className="fill-[#0057ff] text-[#0057ff]" /> Player reviews</div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {reviews.slice(0, 3).map(review => (
            <motion.article key={review.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="volex-panel p-5">
              <div className="flex gap-1 text-[#0057ff]">{Array.from({ length: review.rating }).map((_, i) => <Star key={i} size={14} className="fill-current" />)}</div>
              <p className="mt-4 text-sm leading-6 text-[#555]">“{review.comment}”</p>
              <p className="mt-5 text-sm font-semibold">{review.username}</p>
              <p className="mt-1 text-xs text-[#999]">{review.verified ? 'Verified player' : 'Community member'}</p>
            </motion.article>
          ))}
        </div>
        <form onSubmit={submitReview} className="volex-panel grid gap-3 p-5 md:grid-cols-[1fr_1fr_auto]">
          <input className="volex-input" value={reviewName} onChange={e => setReviewName(e.target.value)} placeholder="Your Minecraft username" required />
          <input className="volex-input" value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="Share your experience" required />
          <div className="flex items-center gap-3">
            <select className="volex-input !w-auto" value={reviewRating} onChange={e => setReviewRating(Number(e.target.value))} aria-label="Review rating">
              {[5,4,3,2,1].map(value => <option key={value} value={value}>{value} ★</option>)}
            </select>
            <button type="submit" className="volex-primary !min-h-[46px] !px-5">Post</button>
          </div>
          {reviewSent && <p className="text-sm text-[#0057ff] md:col-span-3">Thanks — your review has been added.</p>}
        </form>
      </section>
    </div>
  );
};
