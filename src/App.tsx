import { useState } from 'react';
import { Home } from './components/Home';
import { StorePackages } from './components/StorePackages';
import { Navbar } from './components/Navbar';

function App() {
  const [activeSection, setActiveSection] = useState('home');

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Navbar mein 'setActiveSection' pass karein */}
      <Navbar onNavigate={setActiveSection} />

      {activeSection === 'home' && <Home />}
      {activeSection === 'store' && <StorePackages />}
    </div>
  );
}
