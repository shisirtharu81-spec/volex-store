import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Sparkles, Check, Heart, Star, ShoppingBag, Zap, Plus, Minus, 
  Rotate3d, MessageSquare, ChevronRight, Play, Eye, Share2, 
  Calendar, Award, ShieldCheck, HelpCircle, ChevronLeft, Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { StoreItem, CartItem, Review } from '../types';
import { STORE_ITEMS } from '../data';

interface ProductDetailsModalProps {
  item: StoreItem;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: StoreItem, quantity: number) => void;
  formatPrice: (price: number) => string;
  wishlisted: boolean;
  onToggleWishlist: (itemId: string) => void;
  onBuyNow: (item: StoreItem, quantity: number) => void;
  onNavigateToItem: (item: StoreItem) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  item,
  isOpen,
  onClose,
  onAddToCart,
  formatPrice,
  wishlisted,
  onToggleWishlist,
  onBuyNow,
  onNavigateToItem
}) => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'perks' | 'reviews' | 'faq'>('perks');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // Localized reviews state that can be added to in real-time
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReviewUser, setNewReviewUser] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState('');

  // 3D Card Tilt State
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Reset states on item change
  useEffect(() => {
    setQuantity(1);
    setSelectedImageIndex(0);
    setActiveTab('perks');
    setReviewSuccessMsg('');
    
    // Seed initial product-specific reviews
    const seededReviews: Review[] = [
      {
        id: `rev-${item.id}-1`,
        username: 'notch',
        rating: 5,
        comment: `Absolutely flawless integration. The ${item.name} activated on my character profile in literally 4 seconds. Highly recommended!`,
        date: '2026-06-28',
        verified: true
      },
      {
        id: `rev-${item.id}-2`,
        username: 'PvP_God_X',
        rating: item.category === 'Ranks' ? 5 : 4,
        comment: `Excellent product for this price. The custom animations are incredibly clean in-game. VOLEX server never disappoints.`,
        date: '2026-07-01',
        verified: true
      }
    ];
    setReviews(seededReviews);
  }, [item]);

  if (!isOpen) return null;

  // 3D Mouse Move handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    
    // Maximum tilt angles (12 degrees max for elegance)
    const factorX = -(y / (box.height / 2)) * 12;
    const factorY = (x / (box.width / 2)) * 12;
    
    setTiltX(factorX);
    setTiltY(factorY);
  };

  const handleMouseLeave = () => {
    setTiltX(0);
    setTiltY(0);
    setIsHovered(false);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewUser.trim() || !newReviewComment.trim()) return;

    const added: Review = {
      id: `rev-custom-${Date.now()}`,
      username: newReviewUser.trim(),
      rating: newReviewRating,
      comment: newReviewComment.trim(),
      date: new Date().toISOString().split('T')[0],
      verified: true
    };

    setReviews(prev => [added, ...prev]);
    setNewReviewUser('');
    setNewReviewComment('');
    setReviewSuccessMsg('Your review was verified and posted instantly!');
    setTimeout(() => setReviewSuccessMsg(''), 5000);
  };

  // Gallery Images - generates 4 multi-angle representations using different Unsplash presets
  const galleryImages = [
    item.image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=600&q=80", // Neon cyberspace
    "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=600&q=80", // Deep geometric abstract
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80"  // Cyber gaming cockpit
  ];

  // Price calculations
  const isRankOrBundle = item.category === 'Ranks' || item.category === 'Bundles' || item.category === 'Season Pass';
  const canAdjustQuantity = !isRankOrBundle && item.id !== 'bundle-cyber' && item.id !== 'bundle-overlord';
  const discountPercent = item.originalPrice 
    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) 
    : 0;

  // Retrieve Related Items in same category (limit 3)
  const relatedItems = STORE_ITEMS
    .filter(p => p.category === item.category && p.id !== item.id)
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      
      {/* Container Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-full max-w-5xl bg-[#08080c] border border-purple-500/15 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(139,92,246,0.15)] flex flex-col lg:flex-row text-white my-auto"
      >
        
        {/* Soft Radial Backlit Glow */}
        <div className={`absolute -left-32 -top-32 h-64 w-64 rounded-full bg-gradient-to-r ${item.gradient} opacity-20 blur-3xl pointer-events-none`}></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-40 p-2 rounded-full bg-black/60 hover:bg-black/80 border border-white/5 hover:border-purple-500/30 text-gray-400 hover:text-white cursor-pointer transition-all active:scale-90"
        >
          <X className="h-5 w-5" />
        </button>

        {/* LEFT COLUMN: Image Gallery & 3D Tilt Card */}
        <div className="w-full lg:w-[45%] p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-purple-500/10 bg-[#060609]">
          
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-black text-purple-400 bg-purple-950/40 border border-purple-500/20 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                {item.category} Details
              </span>
              <span className="text-[10px] font-mono font-bold text-gray-500 flex items-center gap-1">
                <Rotate3d className="h-3.5 w-3.5 text-purple-400" />
                Interactive 3D Demo
              </span>
            </div>

            {/* 3D TILT CONTAINER */}
            <div 
              className="perspective-1000 py-2"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onMouseEnter={() => setIsHovered(true)}
            >
              <motion.div
                ref={cardRef}
                style={{
                  rotateX: isHovered ? tiltX : 0,
                  rotateY: isHovered ? tiltY : 0,
                  transformStyle: "preserve-3d"
                }}
                transition={{ type: "spring", stiffness: 150, damping: 20 }}
                className={`relative w-full aspect-[4/3] rounded-2xl overflow-hidden border ${item.borderColor} bg-gradient-to-br from-black/40 to-[#0e0e15] shadow-[0_15px_35px_rgba(0,0,0,0.5)] cursor-grab active:cursor-grabbing`}
              >
                {/* 3D Holographic Glare overlay */}
                <div 
                  className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-transparent mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    transform: isHovered 
                      ? `translate(${tiltY * 3}px, ${-tiltX * 3}px)` 
                      : 'none'
                  }}
                />

                {/* Main Render Image */}
                <img 
                  src={galleryImages[selectedImageIndex]} 
                  alt={item.name} 
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover opacity-80"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = galleryImages[0];
                  }}
                />

                {/* Deep shadows */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 pointer-events-none"></div>

                {/* Absolute over-layers in card */}
                <div className="absolute bottom-5 left-5 right-5 z-10" style={{ transform: "translateZ(30px)" }}>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></div>
                    <span className="text-[9px] font-mono font-black tracking-widest text-emerald-400 bg-emerald-950/50 backdrop-blur-md px-2 py-0.5 rounded border border-emerald-500/20 uppercase">
                      LOCKED IN CLOUD QUEUE
                    </span>
                  </div>
                  <h4 className="text-xl font-black font-sans text-white mt-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {item.name}
                  </h4>
                  {item.badge && (
                    <span className="inline-flex items-center gap-1 text-[8px] font-black text-[#bf5af2] bg-black/60 backdrop-blur-md border border-[#bf5af2]/30 px-2.5 py-0.5 rounded-full mt-1.5 uppercase tracking-wider">
                      <Sparkles className="h-2 w-2" />
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Interactive Tilt Indicator Badge */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg border border-white/5 text-[9px] font-mono text-purple-300 flex items-center gap-1 pointer-events-none">
                  <Rotate3d className="h-3 w-3 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>3D Tilt Active</span>
                </div>
              </motion.div>
            </div>

            {/* GALLERY SELECTOR INDEX TABS */}
            <div className="grid grid-cols-4 gap-2.5">
              {galleryImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative aspect-[4/3] rounded-lg overflow-hidden border transition-all duration-300 cursor-pointer ${
                    selectedImageIndex === index 
                      ? 'border-purple-500 bg-purple-950/10 shadow-[0_0_10px_rgba(168,85,247,0.3)]' 
                      : 'border-white/5 hover:border-purple-500/30'
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`Preview angle ${index + 1}`} 
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover opacity-60 hover:opacity-80 transition-opacity"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = galleryImages[0];
                    }}
                  />
                  <span className="absolute bottom-1 right-1 text-[8px] font-mono bg-black/60 px-1 py-0.2 rounded text-gray-400">
                    0{index + 1}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Secure Delivery Warranties */}
          <div className="mt-6 pt-4 border-t border-purple-500/10 grid grid-cols-2 gap-3 text-[10px] text-gray-400">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="font-bold text-white uppercase">Instant Delivery</p>
                <p className="text-[9px]">4-second queue dispatch</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                <Award className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="font-bold text-white uppercase">Lifetime Support</p>
                <p className="text-[9px]">Minecraft-auth secured</p>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Details tab switcher, Related products, Add to cart */}
        <div className="w-full lg:w-[55%] p-6 sm:p-8 flex flex-col justify-between h-full bg-[#08080c]">
          
          <div>
            {/* Top row pricing info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-500/10">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black font-sans text-white tracking-tight">{item.name}</h2>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex items-center text-amber-400">
                    <Star className="h-3.5 w-3.5 fill-amber-400" />
                    <Star className="h-3.5 w-3.5 fill-amber-400" />
                    <Star className="h-3.5 w-3.5 fill-amber-400" />
                    <Star className="h-3.5 w-3.5 fill-amber-400" />
                    <Star className="h-3.5 w-3.5 fill-amber-400/50" />
                  </div>
                  <span className="text-xs font-mono text-gray-400">({reviews.length + 3} Verified Buyers)</span>
                </div>
              </div>

              {/* Precise Pricing Container */}
              <div className="bg-purple-950/15 border border-purple-500/10 px-4 py-2.5 rounded-2xl flex flex-col items-end">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-mono font-black text-white">{formatPrice(item.price * quantity)}</span>
                  {item.originalPrice && (
                    <span className="text-xs font-mono line-through text-gray-500">{formatPrice(item.originalPrice * quantity)}</span>
                  )}
                </div>
                {discountPercent > 0 && (
                  <span className="text-[9px] font-mono font-black text-red-400 mt-0.5">
                    🎁 SAVING {discountPercent}% INSTANTLY
                  </span>
                )}
              </div>
            </div>

            {/* Core Description */}
            <div className="py-4">
              <p className="text-xs text-gray-300 font-sans leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Tab Swapping Headers */}
            <div className="flex border-b border-purple-500/10 text-xs">
              <button
                onClick={() => setActiveTab('perks')}
                className={`py-2.5 px-4 font-bold border-b-2 tracking-wide uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'perks' 
                    ? 'border-purple-500 text-purple-300 bg-white/2' 
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                <Award className="h-3.5 w-3.5" />
                <span>Features & Perks</span>
              </button>
              
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-2.5 px-4 font-bold border-b-2 tracking-wide uppercase transition-all flex items-center gap-1.5 cursor-pointer relative ${
                  activeTab === 'reviews' 
                    ? 'border-purple-500 text-purple-300 bg-white/2' 
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Reviews ({reviews.length})</span>
                {reviews.length > 0 && (
                  <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('faq')}
                className={`py-2.5 px-4 font-bold border-b-2 tracking-wide uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'faq' 
                    ? 'border-purple-500 text-purple-300 bg-white/2' 
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                <HelpCircle className="h-3.5 w-3.5" />
                <span>Delivery FAQ</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="py-4.5 min-h-[170px] max-h-[220px] overflow-y-auto pr-1">
              
              {/* Tab 1: Perks and Features list */}
              {activeTab === 'perks' && (
                <div className="space-y-3 animate-fade-in">
                  <span className="text-[9px] font-mono font-black text-gray-500 uppercase tracking-widest block">
                    WHAT YOU WILL RECEIVE IN-GAME:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {item.perks.map((perk, idx) => (
                      <div key={idx} className="flex items-start text-[11px] text-gray-300 leading-normal bg-black/30 border border-purple-500/5 p-2 rounded-xl">
                        <span className="flex-shrink-0 mt-0.5 mr-2 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400">
                          <Check className="h-3 w-3" />
                        </span>
                        <span className="font-sans font-medium text-gray-300">{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 2: Interactive Review Feeds */}
              {activeTab === 'reviews' && (
                <div className="space-y-4 animate-fade-in">
                  {reviewSuccessMsg && (
                    <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 font-bold">
                      {reviewSuccessMsg}
                    </div>
                  )}

                  {/* Submit review form */}
                  <form onSubmit={handleAddReview} className="bg-black/40 border border-purple-500/10 p-3 rounded-xl space-y-2.5">
                    <span className="text-[9px] font-mono font-black text-purple-400 uppercase tracking-widest block">
                      WRITE A CUSTOM REVIEW:
                    </span>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="In-Game Name (e.g. notch)"
                        value={newReviewUser}
                        onChange={(e) => setNewReviewUser(e.target.value)}
                        required
                        className="flex-1 bg-black/60 border border-purple-500/10 rounded-lg px-2.5 py-1 text-xs focus:border-purple-500/30 focus:outline-none"
                      />
                      <select
                        value={newReviewRating}
                        onChange={(e) => setNewReviewRating(Number(e.target.value))}
                        className="bg-black/60 border border-purple-500/10 rounded-lg px-2 py-1 text-xs focus:border-purple-500/30 focus:outline-none text-amber-400 font-bold"
                      >
                        <option value="5">★★★★★ (5 Stars)</option>
                        <option value="4">★★★★☆ (4 Stars)</option>
                        <option value="3">★★★☆☆ (3 Stars)</option>
                        <option value="2">★★☆☆☆ (2 Stars)</option>
                        <option value="1">★☆☆☆☆ (1 Star)</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Your feedback... (Will display live instantly)"
                        value={newReviewComment}
                        onChange={(e) => setNewReviewComment(e.target.value)}
                        required
                        className="flex-grow bg-black/60 border border-purple-500/10 rounded-lg px-2.5 py-1 text-xs focus:border-purple-500/30 focus:outline-none"
                      />
                      <button 
                        type="submit"
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-3 rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      >
                        <Send className="h-3.5 w-3.5" />
                        <span>Submit</span>
                      </button>
                    </div>
                  </form>

                  {/* Reviews List */}
                  <div className="space-y-3">
                    {reviews.map((rev) => (
                      <div key={rev.id} className="border-b border-purple-500/5 pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-black text-cyan-400">{rev.username}</span>
                            <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 px-1.5 py-0.2 rounded">
                              ✓ Verified Buyer
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-gray-500 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {rev.date}
                          </span>
                        </div>
                        <div className="flex items-center text-amber-400 mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-3 w-3 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-600'}`} 
                            />
                          ))}
                        </div>
                        <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed font-sans">
                          "{rev.comment}"
                        </p>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* Tab 3: Detailed delivery FAQ */}
              {activeTab === 'faq' && (
                <div className="space-y-3.5 animate-fade-in text-[11px] text-gray-400 font-sans">
                  <div>
                    <h5 className="font-bold text-white uppercase">How fast will I receive my items?</h5>
                    <p className="mt-0.5">
                      Since everything is managed using Mojang authorization APIs, command delivery processes immediately (generally under 4 seconds). Ensure you are connected to the server.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-bold text-white uppercase">What if my inventory was full?</h5>
                    <p className="mt-0.5">
                      Consumable crate keys, coins, and perm codes do not require empty slots! They sync to your secure scoreboard character state.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-bold text-white uppercase">Can I gift these items?</h5>
                    <p className="mt-0.5">
                      Absolutely. If you input your friend's character username in the top profile gateway, the rewards will execute on their UUID!
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* LOWER SECTION: Adjust quantity, related products, buy now buttons */}
          <div className="border-t border-purple-500/10 pt-4 mt-auto">
            
            {/* RELATED PRODUCTS RECOMMENDATION SYSTEM */}
            {relatedItems.length > 0 && (
              <div className="mb-4">
                <span className="text-[9px] font-mono font-black text-gray-500 uppercase tracking-widest block mb-2">
                  RELATED PRODUCTS FROM {item.category.toUpperCase()}:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {relatedItems.map((rItem) => (
                    <button
                      key={rItem.id}
                      onClick={() => onNavigateToItem(rItem)}
                      className="bg-black/30 border border-purple-500/5 hover:border-purple-500/20 p-2 rounded-xl text-left cursor-pointer transition-all hover:bg-black/50 group flex items-center justify-between gap-1"
                    >
                      <div>
                        <p className="text-[10px] font-extrabold text-white truncate max-w-[110px] group-hover:text-purple-300">
                          {rItem.name}
                        </p>
                        <p className="text-[9px] font-mono text-[#bf5af2] font-black mt-0.5">
                          {formatPrice(rItem.price)}
                        </p>
                      </div>
                      <ChevronRight className="h-3 w-3 text-gray-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons stack */}
            <div className="space-y-3">
              {/* Quantity Adjustment Selector */}
              {canAdjustQuantity && (
                <div className="flex items-center justify-between bg-[#0a0a0f] border border-purple-500/10 rounded-2xl p-2.5">
                  <div className="pl-2">
                    <p className="text-xs font-bold text-white">Adjust Quantity</p>
                    <p className="text-[9px] text-gray-500">Add multiple keys or coins inside single checkout</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      disabled={quantity <= 1}
                      className="p-1.5 rounded-lg bg-purple-950/20 hover:bg-purple-950/40 text-purple-400 border border-purple-500/10 disabled:opacity-30 cursor-pointer transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-sm font-mono font-black text-white w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(prev => Math.min(25, prev + 1))}
                      className="p-1.5 rounded-lg bg-purple-950/20 hover:bg-purple-950/40 text-purple-400 border border-purple-500/10 cursor-pointer transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Shopping Triggers */}
              <div className="flex gap-3">
                {/* Add to Wishlist Toggle inside product details */}
                <button
                  onClick={() => onToggleWishlist(item.id)}
                  className={`px-4 py-3.5 rounded-xl border transition-all flex items-center justify-center cursor-pointer active:scale-95 ${
                    wishlisted 
                      ? 'border-rose-500/30 bg-rose-500/10 text-rose-500' 
                      : 'border-white/5 bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                  title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart className={`h-5 w-5 ${wishlisted ? 'fill-rose-500' : ''}`} />
                </button>

                {/* Add to Cart */}
                <button
                  onClick={() => {
                    onAddToCart(item, quantity);
                    onClose();
                  }}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-gray-200 hover:text-white font-extrabold text-xs uppercase py-3.5 rounded-xl border border-white/5 hover:border-purple-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Add to Cart</span>
                </button>

                {/* Immediate Checkout */}
                <button
                  onClick={() => {
                    onBuyNow(item, quantity);
                    onClose();
                  }}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-[#bf5af2] hover:to-indigo-500 text-white font-black text-xs uppercase py-3.5 rounded-xl border border-purple-500/20 hover:shadow-[0_0_25px_rgba(139,92,246,0.35)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="h-4 w-4 text-amber-300 fill-amber-300 animate-pulse" />
                  <span>Buy Now</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </motion.div>
    </div>
  );
};
