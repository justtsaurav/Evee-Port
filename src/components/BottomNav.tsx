import React from 'react';
import { ScreenId } from '../types/emulator';
import { Home, Sliders, Activity, Gamepad2, Settings } from 'lucide-react';

interface BottomNavProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const tabs = [
    { id: 'home' as ScreenId, label: 'Home', icon: Home },
    { id: 'graphics' as ScreenId, label: 'Graphics', icon: Sliders },
    { id: 'performance' as ScreenId, label: 'Performance', icon: Activity },
    { id: 'controls' as ScreenId, label: 'Controls', icon: Gamepad2 },
    { id: 'settings' as ScreenId, label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B0D10]/95 backdrop-blur-lg border-t-2 border-[#343C44] px-2 py-1.5 shadow-[0px_-2px_10px_rgba(0,0,0,0.5)]">
      <div className="grid grid-cols-5 items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentScreen === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all min-h-[44px] ${
                isActive
                  ? 'text-[#C8FF35]'
                  : 'text-[#9AA4AD] hover:text-[#F5F7F2]'
              }`}
            >
              <div className={`p-1 rounded-full ${isActive ? 'bg-[#222930] border-2 border-[#343C44] shadow-[1px_1px_0px_#000000]' : ''}`}>
                <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight font-bold ${isActive ? 'text-[#C8FF35]' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
