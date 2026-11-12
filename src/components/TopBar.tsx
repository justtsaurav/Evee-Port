import React from 'react';
import { ScreenId } from '../types/emulator';
import { Play, Sparkles, Cpu, Zap, ShieldCheck } from 'lucide-react';

interface TopBarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onLaunchGame: () => void;
  activePreset: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentScreen,
  onNavigate,
  onLaunchGame,
  activePreset
}) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-6 px-4 sm:px-6 py-2.5 bg-[#0B0D10]/95 backdrop-blur-md border-b-2 border-[#343C44]">
      {/* Zone 1: Single Brand Lockup with Starburst & 3D styling */}
      <div 
        onClick={() => onNavigate('home')} 
        className="flex items-center gap-2.5 cursor-pointer whitespace-nowrap shrink-0 group select-none"
      >
        <div className="w-8 h-8 rounded-xl bg-[#C8FF35] border-2 border-[#343C44] shadow-[2px_2px_0px_#000000] flex items-center justify-center font-display font-extrabold text-sm text-[#0B0D10] group-hover:scale-105 transition-transform">
          ✦
        </div>
        <div className="flex flex-col">
          <span className="font-display font-extrabold text-base tracking-tight text-[#F5F7F2] group-hover:text-[#C8FF35] transition-colors leading-none">
            EEVEE MOBILE
          </span>
          <span className="text-[10px] text-[#9AA4AD] tracking-wider uppercase font-semibold mt-0.5">
            Pokémon Let's Go Port
          </span>
        </div>
      </div>

      {/* Zone 2: 4-5 single-line clean text links with subtle hover underlines */}
      <nav className="hidden md:flex items-center gap-5 text-xs font-semibold text-[#9AA4AD]">
        <button
          onClick={() => onNavigate('home')}
          className={`hover:text-[#F5F7F2] transition-colors whitespace-nowrap shrink-0 py-1 ${
            currentScreen === 'home' ? 'text-[#C8FF35] border-b-2 border-[#C8FF35]' : ''
          }`}
        >
          Home
        </button>
        <button
          onClick={() => onNavigate('graphics')}
          className={`hover:text-[#F5F7F2] transition-colors whitespace-nowrap shrink-0 py-1 ${
            currentScreen === 'graphics' ? 'text-[#C8FF35] border-b-2 border-[#C8FF35]' : ''
          }`}
        >
          Graphics
        </button>
        <button
          onClick={() => onNavigate('performance')}
          className={`hover:text-[#F5F7F2] transition-colors whitespace-nowrap shrink-0 py-1 ${
            currentScreen === 'performance' ? 'text-[#C8FF35] border-b-2 border-[#C8FF35]' : ''
          }`}
        >
          Performance & Benchmarks
        </button>
        <button
          onClick={() => onNavigate('controls')}
          className={`hover:text-[#F5F7F2] transition-colors whitespace-nowrap shrink-0 py-1 ${
            currentScreen === 'controls' ? 'text-[#C8FF35] border-b-2 border-[#C8FF35]' : ''
          }`}
        >
          Controls
        </button>
        <button
          onClick={() => onNavigate('settings')}
          className={`hover:text-[#F5F7F2] transition-colors whitespace-nowrap shrink-0 py-1 ${
            currentScreen === 'settings' ? 'text-[#C8FF35] border-b-2 border-[#C8FF35]' : ''
          }`}
        >
          Settings & Architecture
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-[#9AA4AD] bg-[#191E24] border-2 border-[#343C44] px-2.5 py-1 rounded-full font-mono-numbers shadow-[2px_2px_0px_#000000]">
          <Cpu className="w-3.5 h-3.5 text-[#C8FF35]" />
          <span>Dimensity 7300 · Mali-G615</span>
        </div>

        <button
          onClick={onLaunchGame}
          className="ui-btn-pill-lime flex items-center gap-1.5 px-4 py-1.5 text-xs whitespace-nowrap shrink-0 active:scale-95"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Launch Game</span>
        </button>
      </div>
    </header>
  );
};
