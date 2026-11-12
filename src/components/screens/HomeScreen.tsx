import React from 'react';
import { ScreenId, GraphicsConfig, PerformanceConfig } from '../../types/emulator';
import { EEVEE_GAME_METADATA, DIMENSITY_7300_HARDWARE, EEVEE_COVER_IMAGE } from '../../data/eeveeData';
import { Play, RotateCcw, Cpu, Sparkles, CheckCircle2, ShieldCheck, Zap, HardDrive, BarChart3, Sliders, ChevronRight } from 'lucide-react';

interface HomeScreenProps {
  onLaunchGame: () => void;
  onResumeGame: () => void;
  onNavigate: (screen: ScreenId) => void;
  graphics: GraphicsConfig;
  performance: PerformanceConfig;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onLaunchGame,
  onResumeGame,
  onNavigate,
  graphics,
  performance
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner: Single-Game Scope Declaration */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#11151A] p-3.5 rounded-2xl border-2 border-[#343C44] shadow-[3px_3px_0px_#000000]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#C8FF35] text-[#0B0D10] font-black text-xs flex items-center justify-center shrink-0">
            ★
          </div>
          <div>
            <div className="text-xs font-bold text-[#F5F7F2]">Dedicated Single-Game Android Port</div>
            <div className="text-[11px] text-[#9AA4AD]">
              Static Recompilation (letsgo-recomp) · Zero JIT Overhead · Target: 30 FPS Stable
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-semibold text-[#0B0D10] bg-[#C8FF35] px-2.5 py-0.5 rounded-full border border-[#343C44]">
            {performance.preset.split(' ')[0]} ({graphics.resolution.split(' ')[0]})
          </span>
          <span className="text-[11px] text-[#9AA4AD] font-mono">v1.0.0</span>
        </div>
      </div>

      {/* Monumental Hero Game Card with 3D Offset Shadow */}
      <div className="ui-card-elevated-3d overflow-hidden p-6 sm:p-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left: Game Artwork with 3D Frame */}
          <div className="md:col-span-5 flex justify-center">
            <div className="relative group">
              <div className="w-56 sm:w-64 aspect-[3/4] rounded-2xl overflow-hidden border-2 border-[#343C44] shadow-[5px_5px_0px_#000000] bg-[#0B0D10]">
                <img
                  src={EEVEE_COVER_IMAGE}
                  alt={EEVEE_GAME_METADATA.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute -bottom-3 -right-3 bg-[#C8FF35] text-[#0B0D10] text-[10px] font-extrabold px-3 py-1 rounded-full border-2 border-[#343C44] shadow-[2px_2px_0px_#000000] flex items-center gap-1">
                <span>✦</span>
                <span>ARM64 RECOMP</span>
              </div>
            </div>
          </div>

          {/* Right: Game Overview & Primary Actions */}
          <div className="md:col-span-7 space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-[#9AA4AD] font-semibold">
                <span>Nintendo Switch Original</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-[#F5F7F2]">{EEVEE_GAME_METADATA.titleId}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-[#F5F7F2] tracking-tight leading-tight">
                {EEVEE_GAME_METADATA.title}
              </h1>
              <p className="text-xs sm:text-sm text-[#9AA4AD] leading-relaxed">
                Experience Kanto natively on Android with custom Vulkan 1.3 rendering optimized for MediaTek Dimensity 7300. Partner with Eevee with synchronized 30 FPS frame pacing.
              </p>
            </div>

            {/* Current Game State / Playtime Pills */}
            <div className="grid grid-cols-3 gap-2.5 pt-1 text-xs">
              <div className="bg-[#11151A] p-2.5 rounded-xl border-2 border-[#343C44] shadow-[2px_2px_0px_#000000]">
                <div className="text-[10px] text-[#9AA4AD] font-semibold">Partner Eevee</div>
                <div className="font-bold text-[#F5F7F2] mt-0.5">Level {EEVEE_GAME_METADATA.partnerLevel}</div>
              </div>
              <div className="bg-[#11151A] p-2.5 rounded-xl border-2 border-[#343C44] shadow-[2px_2px_0px_#000000]">
                <div className="text-[10px] text-[#9AA4AD] font-semibold">Location</div>
                <div className="font-bold text-[#F5F7F2] mt-0.5 truncate">{EEVEE_GAME_METADATA.currentLocation.split(' ')[0]}</div>
              </div>
              <div className="bg-[#11151A] p-2.5 rounded-xl border-2 border-[#343C44] shadow-[2px_2px_0px_#000000]">
                <div className="text-[10px] text-[#9AA4AD] font-semibold">Playtime</div>
                <div className="font-bold text-[#C8FF35] mt-0.5 font-mono-numbers">{EEVEE_GAME_METADATA.playtimeHours}h</div>
              </div>
            </div>

            {/* Big Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onLaunchGame}
                className="ui-btn-pill-lime flex items-center justify-center gap-2 px-6 py-3 text-sm flex-1 sm:flex-initial cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Launch Game</span>
              </button>

              <button
                onClick={onResumeGame}
                className="ui-btn-pill-dark flex items-center justify-center gap-2 px-5 py-3 text-sm flex-1 sm:flex-initial cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-[#C8FF35]" />
                <span>Resume Game</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Target Hardware Specifications Box (MediaTek Dimensity 7300 & Mali-G615) */}
      <div className="ui-card-3d p-5 space-y-3">
        <div className="flex items-center justify-between border-b-2 border-[#343C44] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#11151A] border-2 border-[#343C44] flex items-center justify-center text-[#C8FF35]">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#F5F7F2]">{DIMENSITY_7300_HARDWARE.soc}</h2>
              <div className="text-[11px] text-[#9AA4AD]">Primary Target Hardware Environment</div>
            </div>
          </div>
          <span className="text-[11px] font-mono text-[#0B0D10] bg-[#C8FF35] font-bold px-2.5 py-0.5 rounded-full border border-[#343C44]">
            6 GB RAM Guard Active
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-[#11151A] p-3 rounded-xl border border-[#343C44]">
            <div className="text-[10px] text-[#9AA4AD] font-semibold">CPU Architecture</div>
            <div className="font-bold text-[#F5F7F2] mt-0.5">4x A78 + 4x A55</div>
            <div className="text-[10px] text-[#9AA4AD]">Up to 2.5 GHz</div>
          </div>
          <div className="bg-[#11151A] p-3 rounded-xl border border-[#343C44]">
            <div className="text-[10px] text-[#9AA4AD] font-semibold">Graphics Engine</div>
            <div className="font-bold text-[#F5F7F2] mt-0.5">Mali-G615 MC2</div>
            <div className="text-[10px] text-[#C8FF35]">Vulkan 1.3 Tile Opt</div>
          </div>
          <div className="bg-[#11151A] p-3 rounded-xl border border-[#343C44]">
            <div className="text-[10px] text-[#9AA4AD] font-semibold">Memory Ceiling</div>
            <div className="font-bold text-[#F5F7F2] mt-0.5">3.2 GB Process Cap</div>
            <div className="text-[10px] text-emerald-400">Android LMK Protected</div>
          </div>
          <div className="bg-[#11151A] p-3 rounded-xl border border-[#343C44]">
            <div className="text-[10px] text-[#9AA4AD] font-semibold">Target Frame Rate</div>
            <div className="font-bold text-[#C8FF35] mt-0.5">30.0 FPS Locked</div>
            <div className="text-[10px] text-[#9AA4AD]">33.3ms Frame Pacing</div>
          </div>
        </div>
      </div>

      {/* 2-Column Feature Cards: Benchmark Suite & Graphics Overrides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Benchmark Banner */}
        <div 
          onClick={() => onNavigate('performance')}
          className="ui-card-3d p-5 flex flex-col justify-between cursor-pointer group hover:border-[#C8FF35]"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#C8FF35] uppercase tracking-wider flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4" />
                <span>7-Stage Benchmark Suite</span>
              </span>
              <span className="text-[10px] text-[#0B0D10] bg-[#C8FF35] font-bold px-2 py-0.5 rounded-full">
                7/7 Passed
              </span>
            </div>
            <h3 className="text-base font-bold text-[#F5F7F2] group-hover:text-[#C8FF35] transition-colors">
              Empirical Performance Validation
            </h3>
            <p className="text-xs text-[#9AA4AD] leading-relaxed">
              Verify real frame rates across Boot, Overworld, Encounters, Battles, and the high-polygon Viridian Forest stress test.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#343C44] flex items-center justify-between text-xs text-[#F5F7F2] font-semibold">
            <span>View Benchmark Logs</span>
            <ChevronRight className="w-4 h-4 text-[#C8FF35] group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Graphics & Vulkan Banner */}
        <div 
          onClick={() => onNavigate('graphics')}
          className="ui-card-3d p-5 flex flex-col justify-between cursor-pointer group hover:border-[#C8FF35]"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#C8FF35] uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-4 h-4" />
                <span>Vulkan 1.3 Graphics Tuning</span>
              </span>
              <span className="text-[10px] font-mono text-[#F5F7F2] bg-[#222930] border border-[#343C44] px-2 py-0.5 rounded-full">
                {graphics.resolution.split(' ')[0]}
              </span>
            </div>
            <h3 className="text-base font-bold text-[#F5F7F2] group-hover:text-[#C8FF35] transition-colors">
              Mali-G615 Tile Pipeline Config
            </h3>
            <p className="text-xs text-[#9AA4AD] leading-relaxed">
              Fine-tune internal rendering resolution, anisotropic filtering, async shader compilation, and zero-copy tile attachment memory.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#343C44] flex items-center justify-between text-xs text-[#F5F7F2] font-semibold">
            <span>Configure Graphics Options</span>
            <ChevronRight className="w-4 h-4 text-[#C8FF35] group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
