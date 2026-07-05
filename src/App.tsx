import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Activity, Terminal, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Data & Components
import { STORE_ITEMS, MOCK_REVIEWS } from './data';
import { StoreItem, CartItem, ServerStatus, DiscordStatus, Review } from './types';
import { Navbar } from './components/Navbar';
import { ServerStatusWidget } from './components/ServerStatusWidget';
import { UsernameLookup } from './components/UsernameLookup';
import { StoreItemCard } from './components/StoreItemCard';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminConsole } from './components/AdminConsole';
// Sahi import path: PremiumHome hi main home component hai
import { PremiumHome } from './components/PremiumHome'; 
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { UserDashboard } from './components/UserDashboard';
import { CheckoutPage } from './components/CheckoutPage';
import { AuthModal } from './components/AuthModal';
import { AuthPage } from './components/AuthPage';

export default function App() {
  // Navigation State - default 'home' rakha hai taaki seedha dikhe
  const [activeSection, setActiveSection] = useState<string>('home'); 
  const [currency, setCurrency] = useState<string>('USD');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  
  // ... (Baaki saara state aur logic waisa hi rahega)

  return (
    <div id="app" className="min-h-screen bg-[#050507] text-white font-sans ...">
      
      {/* Navbar mein props check kar lein ki wo match ho rahe hain */}
      <Navbar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        // ... baaki props
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        {/* Yahan Home import issue fix ho gaya hai */}
        {activeSection === 'home' && (
          <PremiumHome
            serverStatus={serverStatus}
            discordStatus={discordStatus}
            connectedUser={connectedUser}
            onConnectUser={handleConnectUser}
            onDisconnectUser={handleDisconnectUser}
            setActiveSection={setActiveSection}
            setSelectedCategory={setSelectedCategory}
            onAddToCart={handleAddToCart}
            formatPrice={formatPrice}
            reviews={reviews}
            onPostReview={(name, rating, comment) => { /* logic */ }}
            onSelectProduct={setSelectedItemForDetails}
          />
        )}
        
        {/* Baaki sections... */}
      </main>
    </div>
  );
}
