import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Edit3, Plus, Shield, Package, X, Save, Settings } from 'lucide-react';

export const AdminConsole = ({ onExit }: { onExit: () => void }) => {
  // Main Data State
  const [data, setData] = useState([
    { id: 1, name: 'VIP Rank', category: 'RANK', price: '4.99' },
    { id: 2, name: 'Cosmic Key', category: 'KEY', price: '9.99' },
    { id: 3, name: 'Gladiator Kit', category: 'KIT', price: '0.00' }
  ]);

  const [newItem, setNewItem] = useState({ name: '', category: 'RANK', price: '' });

  // Add Item Logic
  const handleAddItem = () => {
    if (!newItem.name) return;
    setData([...data, { id: Date.now(), ...newItem }]);
    setNewItem({ name: '', category: 'RANK', price: '' });
  };

  // Delete Item Logic
  const handleDelete = (id: number) => setData(data.filter(i => i.id !== id));

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl p-4 md:p-8 overflow-y-auto"
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-purple-500/30 pb-6">
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Shield className="text-purple-500" /> VOLEX CONTROL
          </h1>
          <button onClick={onExit} className="p-2 bg-white/5 rounded-full hover:bg-red-500/20"><X /></button>
        </div>

        {/* Input Form */}
        <div className="bg-white/5 p-6 rounded-2xl border border-purple-500/20 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <input className="bg-black/50 p-2 rounded border border-white/10 text-white col-span-2" placeholder="Item Name" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} />
          <select className="bg-black/50 p-2 rounded border border-white/10 text-white" onChange={e => setNewItem({...newItem, category: e.target.value})}>
            <option value="RANK">RANK</option><option value="KEY">KEY</option><option value="KIT">KIT</option>
          </select>
          <button onClick={handleAddItem} className="bg-purple-600 hover:bg-purple-500 flex justify-center items-center gap-2 font-bold rounded">
            <Plus size={18}/> ADD
          </button>
        </div>

        {/* Dynamic List */}
        <div className="space-y-3">
          <AnimatePresence>
            {data.map((item) => (
              <motion.div 
                key={item.id} layout exit={{ opacity: 0, x: -50 }}
                className="flex justify-between items-center p-4 bg-white/5 border border-white/10 rounded-xl hover:border-purple-500/50 transition-all"
              >
                <div>
                  <h3 className="text-white font-bold">{item.name}</h3>
                  <span className="text-[10px] text-purple-400 font-mono tracking-widest bg-purple-500/10 px-2 py-0.5 rounded">{item.category}</span>
                </div>
                <div className="flex gap-4">
                  <button className="text-blue-400 hover:text-blue-300"><Edit3 size={18} /></button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-300"><Trash2 size={18} /></button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
