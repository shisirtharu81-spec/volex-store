import React, { useState } from 'react';
import { User, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';

interface UsernameLookupProps {
  onConnect: (username: string) => void;
  connectedUser: string | null;
  onDisconnect: () => void;
}

export const UsernameLookup: React.FC<UsernameLookupProps> = ({
  onConnect,
  connectedUser,
  onDisconnect
}) => {
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState('');

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setLoading(true);
    setStatusText('Contacting Mojang Auth API...');

    setTimeout(() => {
      setStatusText('Syncing VOLEX Server database...');
      setTimeout(() => {
        onConnect(inputValue.trim());
        setLoading(false);
        setStatusText('');
      }, 700);
    }, 600);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-purple-500/10 bg-black/40 p-6 backdrop-blur-md">
      {/* Accent Light */}
      <div className="absolute -left-12 -bottom-12 h-36 w-36 rounded-full bg-purple-600/10 blur-2xl"></div>

      {connectedUser ? (
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Linked Skin Render */}
          <div className="relative flex-shrink-0 group">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 opacity-70 blur-md group-hover:opacity-100 transition duration-500"></div>
            <div className="relative h-20 w-20 rounded-full bg-[#0a0a0c] border border-purple-500/20 p-2 overflow-hidden flex items-center justify-center">
              <img
                src={`https://crafatar.com/avatars/${connectedUser}?size=80&overlay`}
                alt={connectedUser}
                className="h-14 w-14 rounded-md object-contain transition-transform duration-300 group-hover:scale-110"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://minotar.net/helm/Steve/80.png`;
                }}
              />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-black border border-[#0a0a0c]">
              <CheckCircle2 className="h-4.5 w-4.5 text-black" />
            </span>
          </div>

          {/* Profile details */}
          <div className="text-center sm:text-left flex-grow">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded uppercase">
                Active Profile
              </span>
              <span className="text-[10px] font-mono text-purple-400">UUID: Verified</span>
            </div>
            <h3 className="text-xl font-black text-white mt-1.5 tracking-tight font-sans">
              Welcome to VOLEX, <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">{connectedUser}</span>!
            </h3>
            <p className="text-xs text-gray-400 mt-1 max-w-md">
              Your server account is successfully connected. Selected packages will automatically be dispatched to your character in-game via RCON.
            </p>
          </div>

          <div className="flex-shrink-0 w-full sm:w-auto">
            <button
              onClick={onDisconnect}
              className="w-full sm:w-auto bg-red-950/20 hover:bg-red-950/40 border border-red-500/20 hover:border-red-500/40 text-red-400 hover:text-red-300 text-xs font-bold uppercase py-2 px-4 rounded-xl cursor-pointer transition-all duration-300"
            >
              Disconnect
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="max-w-md text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-2 text-purple-400">
              <Sparkles className="h-4.5 w-4.5" />
              <span className="text-[10px] font-mono font-black uppercase tracking-wider">SECURE SYNC GATEWAY</span>
            </div>
            <h3 className="text-xl font-black text-white mt-1 font-sans tracking-tight">
              CONNECT YOUR MC ACCOUNT
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Provide your username before purchasing so our checkout hooks can sync with the server database.
            </p>
          </div>

          <form onSubmit={handleConnect} className="w-full lg:max-w-md flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-grow">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400/60" />
              <input
                type="text"
                placeholder="Minecraft Character Name..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={loading}
                className="w-full bg-[#0a0a0c] border border-purple-500/10 focus:border-purple-500/30 text-white placeholder-gray-500 rounded-xl py-2.5 pl-10 pr-4 text-sm font-mono focus:outline-none transition-all"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading || !inputValue.trim()}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs uppercase px-5 py-2.5 rounded-xl border border-purple-400/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-2 flex-shrink-0"
            >
              {loading ? (
                <>
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Syncing...</span>
                </>
              ) : (
                <span>Connect Profile</span>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Loading Status Subtitle */}
      {statusText && (
        <div className="mt-3 text-center sm:text-left text-[10px] font-mono text-purple-400/90 animate-pulse flex items-center justify-center sm:justify-start gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-purple-400"></span>
          {statusText}
        </div>
      )}
    </div>
  );
};
