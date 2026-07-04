import React, { useState } from 'react';
import { Sparkles, Check, ShoppingBag, Plus, Minus, Heart, Zap, Eye } from 'lucide-react';
import { motion } from 'motion/react';
import { StoreItem } from '../types';

interface StoreItemCardProps {
  item: StoreItem;
  onAddToCart: (item: StoreItem, quantity: number) => void;
  formatPrice: (price: number) => string;
  wishlisted?: boolean;
  onToggleWishlist?: (itemId: string) => void;
  onBuyNow?: (item: StoreItem, quantity: number) => void;
  onSelect?: (item: StoreItem) => void;
}

export const StoreItemCard: React.FC<StoreItemCardProps> = ({
  item,
  onAddToCart,
  formatPrice,
  wishlisted = false,
  onToggleWishlist,
  onBuyNow,
  onSelect
}) => {
  const [quantity, setQuantity] = useState(1);

  // Allow quantity adjustment for consumable keys, coins, kits, and boosters, but not ranks/passes/bundles
  const isRankOrBundle = item.category === 'Ranks' || item.category === 'Bundles' || item.category === 'Season Pass';
  const canSelectQuantity = !isRankOrBundle && item.id !== 'bundle-cyber' && item.id !== 'bundle-overlord';

  const handleIncrement = () => setQuantity(prev => Math.min(25, prev + 1));
  const handleDecrement = () => setQuantity(prev => Math.max(1, prev - 1));

  const handleAdd = () => {
    onAddToCart(item, quantity);
    setQuantity(1); // Reset card quantity state
  };

  const handleImmediateBuy = () => {
    if (onBuyNow) {
      onBuyNow(item, quantity);
    } else {
      onAddToCart(item, quantity);
    }
  };

  // Calculate discount percentage if applicable
  const discountPercentage = item.originalPrice 
    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) 
    : 0;

  // Render custom Framer Motion variants based on specific product animations
  const getCardAnimation = () => {
    switch (item.animation) {
      case 'float':
        return {
          animate: { y: [0, -6, 0] },
          transition: { repeat: Infinity, duration: 4, ease: "easeInOut" }
        };
      case 'pulse-slow':
        return {
          animate: { scale: [1, 1.012, 1] },
          transition: { repeat: Infinity, duration: 3.5, ease: "easeInOut" }
        };
      case 'vortex-glow':
        return {
          animate: { boxShadow: ["0 0 15px rgba(191,90,242,0.1)", "0 0 30px rgba(191,90,242,0.3)", "0 0 15px rgba(191,90,242,0.1)"] },
          transition: { repeat: Infinity, duration: 3, ease: "easeInOut" }
        };
      case 'glow-orange':
        return {
          animate: { boxShadow: ["0 0 15px rgba(245,158,11,0.1)", "0 0 30px rgba(245,158,11,0.25)", "0 0 15px rgba(245,158,11,0.1)"] },
          transition: { repeat: Infinity, duration: 3, ease: "easeInOut" }
        };
      default:
        return {};
    }
  };

  const animationConfig = getCardAnimation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      {...animationConfig}
      id={`store-card-${item.id}`}
      className={`group relative overflow-hidden rounded-2xl border ${item.borderColor} bg-black/40 p-5 backdrop-blur-xl transition-all duration-300 hover:border-purple-500/40 hover:bg-black/60 hover:shadow-[0_0_40px_rgba(168,85,247,0.15)] flex flex-col justify-between h-full`}
    >
      
      {/* Background radial soft light halo */}
      <div className={`absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-r ${item.gradient} opacity-10 blur-3xl group-hover:opacity-20 transition-all duration-500 pointer-events-none`}></div>

      <div>
        {/* Card Image Wrapper with interactive Zoom */}
        {item.image && (
          <div 
            onClick={() => onSelect && onSelect(item)}
            className={`relative h-44 w-full rounded-xl overflow-hidden mb-4 border border-purple-500/10 bg-zinc-950/50 flex items-center justify-center ${onSelect ? 'cursor-pointer' : ''}`}
          >
            
            {/* Absolute badge overlays */}
            <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5 pointer-events-none">
              <span className="text-[9px] font-mono font-bold text-purple-400 bg-purple-950/70 backdrop-blur-md px-2 py-0.5 rounded border border-purple-500/20 uppercase tracking-widest w-fit">
                {item.category}
              </span>
              {item.badge && (
                <span className="flex items-center gap-1 text-[8px] font-black text-[#bf5af2] bg-[#bf5af2]/10 backdrop-blur-md border border-[#bf5af2]/30 px-2.5 py-0.5 rounded-full animate-pulse uppercase tracking-wider w-fit">
                  <Sparkles className="h-2 w-2" />
                  {item.badge}
                </span>
              )}
            </div>

            {/* Discount Stamp Tag */}
            {discountPercentage > 0 && (
              <div className="absolute bottom-2.5 right-2.5 z-10 bg-gradient-to-r from-red-600 to-rose-600 text-white text-[9px] font-mono font-black px-2.5 py-1 rounded-lg shadow-lg border border-red-500/20 uppercase tracking-wider pointer-events-none animate-bounce">
                -{discountPercentage}% SAVINGS
              </div>
            )}

            <motion.img
              src={item.image}
              alt={item.name}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover opacity-75 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500 select-none pointer-events-none"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80";
              }}
            />

            {/* premium hover banner */}
            {onSelect && (
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                <div className="bg-purple-950/80 border border-purple-500/40 rounded-full px-4 py-2 flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <Eye className="h-4 w-4 text-purple-300 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-white">Inspect Details</span>
                </div>
              </div>
            )}

            {/* Subtle inner darkness border */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/15 pointer-events-none"></div>
          </div>
        )}

        {/* Wishlist Button (Heart) */}
        {onToggleWishlist && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(item.id);
            }}
            id={`wishlist-btn-${item.id}`}
            className="absolute top-4 right-4 z-20 h-9 w-9 rounded-full bg-black/60 hover:bg-black/80 border border-white/5 hover:border-purple-500/30 flex items-center justify-center text-gray-400 hover:text-rose-500 transition-all cursor-pointer shadow-lg active:scale-90"
            title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`h-4.5 w-4.5 transition-all duration-300 ${wishlisted ? 'fill-rose-500 text-rose-500 scale-110' : 'text-gray-300 hover:scale-105'}`} />
          </button>
        )}

        {/* Title */}
        <h3 
          onClick={() => onSelect && onSelect(item)}
          className={`text-xl font-black text-white mt-1 font-sans tracking-tight group-hover:text-purple-300 transition-colors ${onSelect ? 'cursor-pointer' : ''}`}
        >
          {item.name}
        </h3>

        {/* Pricing Layout supporting strike-through Discount */}
        <div className="mt-3 flex items-baseline gap-2.5">
          <span className="text-2xl font-mono font-black text-white tracking-tight">
            {formatPrice(item.price * quantity)}
          </span>
          
          {item.originalPrice && (
            <span className="text-xs font-mono line-through text-gray-500">
              {formatPrice(item.originalPrice * quantity)}
            </span>
          )}

          {quantity > 1 && (
            <span className="text-[9px] text-gray-400 font-mono font-bold bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
              {formatPrice(item.price)} each
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-gray-400 mt-2.5 font-sans leading-relaxed">
          {item.description}
        </p>

        {/* Perks Grid Divider */}
        <div className="mt-4 border-t border-purple-500/10 pt-4">
          <span className="text-[9px] font-mono font-black text-gray-500 uppercase tracking-widest block mb-2.5">
            Included Perks & Command List:
          </span>
          <ul className="space-y-2">
            {item.perks.map((perk, idx) => (
              <li key={idx} className="flex items-start text-xs text-gray-300 leading-normal">
                <span className="flex-shrink-0 mt-0.5 mr-2 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <Check className="h-2.5 w-2.5" />
                </span>
                <span className="font-sans font-medium">{perk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer controls & Action triggers */}
      <div className="mt-6 pt-4 border-t border-purple-500/5 space-y-3">
        
        {/* Quantity Selection Panel */}
        {canSelectQuantity && (
          <div className="flex items-center justify-between bg-black/50 border border-purple-500/10 rounded-xl p-2">
            <span className="text-xs font-mono text-gray-400 pl-2">Adjust Quantity</span>
            <div className="flex items-center space-x-1">
              <button
                onClick={handleDecrement}
                disabled={quantity <= 1}
                className="p-1 rounded bg-purple-950/20 hover:bg-purple-950/40 text-purple-400 border border-purple-500/10 disabled:opacity-30 cursor-pointer transition-colors"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="text-xs font-mono font-black text-white w-7 text-center">{quantity}</span>
              <button
                onClick={handleIncrement}
                className="p-1 rounded bg-purple-950/20 hover:bg-purple-950/40 text-purple-400 border border-purple-500/10 cursor-pointer transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Buttons pair: Add to Cart & Buy Now */}
        <div className="flex gap-2.5">
          <button
            onClick={handleAdd}
            id={`add-cart-btn-${item.id}`}
            className="flex-1 bg-white/5 hover:bg-white/10 text-gray-200 hover:text-white font-extrabold text-[10px] uppercase py-3.5 rounded-xl border border-white/5 hover:border-purple-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Add to Cart</span>
          </button>

          <button
            onClick={handleImmediateBuy}
            id={`buy-now-btn-${item.id}`}
            className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-[#bf5af2] hover:to-indigo-500 text-white font-black text-[10px] uppercase py-3.5 rounded-xl border border-purple-500/20 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Zap className="h-3.5 w-3.5 text-amber-300 fill-amber-300" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>

    </motion.div>
  );
};
