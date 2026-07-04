import React, { useState } from 'react';
import { Copy, Check, Activity, Server, Users } from 'lucide-react';
import { ServerStatus } from '../types';

interface ServerStatusWidgetProps {
  status: ServerStatus | null;
}

export const ServerStatusWidget: React.FC<ServerStatusWidgetProps> = ({ status }) => {
  const [copied, setCopied] = useState(false);

  const copyIp = () => {
    if (!status) return;
    navigator.clipboard.writeText(status.ip);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-purple-500/10 bg-black/40 p-6 backdrop-blur-md">
      {/* Glow Effect */}
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-500/10 blur-2xl"></div>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Server IP Copy Box */}
        <div className="flex items-center space-x-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-950/30 border border-purple-500/20 text-purple-400">
            <Server className="h-5.5 w-5.5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-black text-purple-400 uppercase tracking-widest">SERVER CONNECTION IP</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <div className="flex items-center space-x-2 mt-0.5">
              <span className="text-lg font-mono font-extrabold text-white tracking-tight select-all">
                {status?.ip || "play.volexmc.net"}
              </span>
              <button
                onClick={copyIp}
                className="p-1.5 rounded-md hover:bg-white/5 border border-transparent hover:border-white/10 text-gray-400 hover:text-white transition-all duration-300 cursor-pointer"
                title="Copy Server IP"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Status Indicators (Players / Ping / Version) */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          
          {/* Players online */}
          <div className="flex items-center space-x-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-xl">
            <Users className="h-4 w-4 text-cyan-400" />
            <div className="flex flex-col">
              <span className="text-[9px] font-mono text-gray-400 uppercase leading-none">Players</span>
              <span className="text-sm font-mono font-bold text-white mt-0.5">
                {status ? `${status.players}/${status.maxPlayers}` : "Loading..."}
              </span>
            </div>
          </div>

          {/* Ping */}
          <div className="flex items-center space-x-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-xl">
            <Activity className="h-4 w-4 text-purple-400" />
            <div className="flex flex-col">
              <span className="text-[9px] font-mono text-gray-400 uppercase leading-none">Response</span>
              <span className="text-sm font-mono font-bold text-white mt-0.5">
                {status ? `${status.ping}ms` : "checking..."}
              </span>
            </div>
          </div>

          {/* Version */}
          <div className="flex items-center space-x-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-xl">
            <div className="h-4 w-4 rounded-full bg-cyan-950 flex items-center justify-center border border-cyan-500/20 text-[8px] font-mono text-cyan-400 font-bold font-sans">
              v
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-mono text-gray-400 uppercase leading-none">Version</span>
              <span className="text-sm font-mono font-bold text-white mt-0.5">
                {status ? status.version : "1.20.x"}
              </span>
            </div>
          </div>

        </div>

      </div>
      
      {/* Toast Alert for Copy Confirmation */}
      {copied && (
        <div className="absolute bottom-1 left-4 rounded bg-emerald-500/90 text-black text-[9px] font-black px-2 py-0.5 tracking-wider uppercase animate-fade-in">
          IP Copied to Clipboard!
        </div>
      )}
    </div>
  );
};
