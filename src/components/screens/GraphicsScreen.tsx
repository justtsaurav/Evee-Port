import React from 'react';
import { 
  GraphicsConfig, ResolutionOption, AntiAliasingOption, 
  AnisotropicOption, ShadowQualityOption, AspectRatioOption 
} from '../../types/emulator';
import { Sliders, Monitor, RefreshCw, Cpu, Check, Layers, Sparkles } from 'lucide-react';

interface GraphicsScreenProps {
  graphics: GraphicsConfig;
  onUpdateGraphics: (updated: Partial<GraphicsConfig>) => void;
  onResetDefaults: () => void;
}

export const GraphicsScreen: React.FC<GraphicsScreenProps> = ({
  graphics,
  onUpdateGraphics,
  onResetDefaults
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b-2 border-[#343C44]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[#C8FF35] font-black text-sm">✦</span>
            <h1 className="text-2xl font-display font-extrabold text-[#F5F7F2] tracking-tight">
              Graphics Settings
            </h1>
          </div>
          <p className="text-xs text-[#9AA4AD] mt-1">
            Native Vulkan 1.3 rendering pipeline optimized for ARM Mali-G615 MC2 on Dimensity 7300.
          </p>
        </div>

        <button
          onClick={onResetDefaults}
          className="ui-btn-pill-dark px-3.5 py-1.5 text-xs self-start sm:self-auto flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#C8FF35]" />
          <span>Reset 540p Defaults</span>
        </button>
      </div>

      {/* Mali-G615 Hardware Context Banner */}
      <div className="ui-card-3d p-4.5 space-y-2 bg-gradient-to-r from-[#191E24] to-[#222930]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#C8FF35]" />
            <span className="text-xs font-bold text-[#F5F7F2]">Mali-G615 Valhall Architecture Strategy</span>
          </div>
          <span className="text-[10px] font-mono font-bold text-[#0B0D10] bg-[#C8FF35] px-2 py-0.5 rounded-full border border-[#343C44]">
            Official MediaTek Driver
          </span>
        </div>
        <p className="text-xs text-[#9AA4AD] leading-relaxed">
          Because Turnip / Adreno custom drivers are strictly unsupported on Mali GPUs, EEVEE MOBILE relies on standard Vulkan 1.3 extensions with zero-copy on-chip tile SRAM attachment handling to prevent 6 GB memory bandwidth bottlenecks.
        </p>
      </div>

      {/* 1. Internal Resolution (480p, 540p, 720p, 1080p) */}
      <div className="ui-card-3d p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-[#F5F7F2]">1. Internal Resolution Scale</div>
            <div className="text-[11px] text-[#9AA4AD]">
              Recommended: 480p or 540p for optimal 30 FPS stability on Dimensity 7300.
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-[#C8FF35]">
            {graphics.resolution.split(' ')[0]}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs">
          {(['0.5x (480p)', '0.75x (540p - Recommended)', '1.0x (720p Native)', '1.5x (1080p)'] as ResolutionOption[]).map((res) => {
            const isSelected = graphics.resolution === res;
            return (
              <button
                key={res}
                onClick={() => onUpdateGraphics({ resolution: res })}
                className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#C8FF35] text-[#0B0D10] border-[#343C44] font-bold shadow-[2px_2px_0px_#000000]'
                    : 'bg-[#11151A] text-[#9AA4AD] border-[#343C44] hover:text-[#F5F7F2] hover:border-[#48545F]'
                }`}
              >
                <div className="text-xs">{res.split(' ')[0]}</div>
                <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-[#0B0D10]/80' : 'text-[#9AA4AD]'}`}>
                  {res.includes('480p') ? 'Battery Saver' : res.includes('540p') ? 'Balanced 30 FPS' : res.includes('720p') ? 'Native Switch' : 'High Quality'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2 & 3. Rendering Options & Shader Compilation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Anti-Aliasing */}
        <div className="ui-card-3d p-4.5 space-y-2.5">
          <div className="text-xs font-bold text-[#F5F7F2]">2. Anti-Aliasing (AA)</div>
          <div className="text-[11px] text-[#9AA4AD]">Reduces jagged polygon edges on Pokémon models.</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {(['Disabled', 'FXAA (Recommended)', 'MSAA 2x', 'MSAA 4x'] as AntiAliasingOption[]).map((aa) => (
              <button
                key={aa}
                onClick={() => onUpdateGraphics({ antiAliasing: aa })}
                className={`p-2 rounded-lg border-2 text-center text-xs font-semibold transition-all cursor-pointer ${
                  graphics.antiAliasing === aa
                    ? 'bg-[#C8FF35] text-[#0B0D10] border-[#343C44] shadow-[1px_1px_0px_#000000]'
                    : 'bg-[#11151A] text-[#9AA4AD] border-[#343C44] hover:text-[#F5F7F2]'
                }`}
              >
                {aa.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Anisotropic Filtering */}
        <div className="ui-card-3d p-4.5 space-y-2.5">
          <div className="text-xs font-bold text-[#F5F7F2]">3. Anisotropic Filtering</div>
          <div className="text-[11px] text-[#9AA4AD]">Improves texture clarity on Route 1 paths & ground.</div>
          <div className="grid grid-cols-5 gap-1.5 text-xs">
            {(['Disabled', '2x', '4x (Recommended)', '8x', '16x'] as AnisotropicOption[]).map((af) => (
              <button
                key={af}
                onClick={() => onUpdateGraphics({ anisotropic: af })}
                className={`py-2 text-center rounded-lg border-2 text-xs font-semibold transition-all cursor-pointer ${
                  graphics.anisotropic === af
                    ? 'bg-[#C8FF35] text-[#0B0D10] border-[#343C44] shadow-[1px_1px_0px_#000000]'
                    : 'bg-[#11151A] text-[#9AA4AD] border-[#343C44] hover:text-[#F5F7F2]'
                }`}
              >
                {af.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Shadow Quality & Texture Filtering */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="ui-card-3d p-4.5 space-y-2">
          <div className="text-xs font-bold text-[#F5F7F2]">4. Shadow Quality</div>
          <div className="text-[11px] text-[#9AA4AD]">Dynamic shadow map resolution for characters and trees.</div>
          <div className="grid grid-cols-3 gap-2 text-xs pt-1">
            {(['Low', 'Medium (Balanced)', 'High'] as ShadowQualityOption[]).map((sq) => (
              <button
                key={sq}
                onClick={() => onUpdateGraphics({ shadowQuality: sq })}
                className={`py-2 text-center rounded-lg border-2 text-xs font-semibold transition-all cursor-pointer ${
                  graphics.shadowQuality === sq
                    ? 'bg-[#C8FF35] text-[#0B0D10] border-[#343C44] shadow-[1px_1px_0px_#000000]'
                    : 'bg-[#11151A] text-[#9AA4AD] border-[#343C44] hover:text-[#F5F7F2]'
                }`}
              >
                {sq.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="ui-card-3d p-4.5 space-y-2">
          <div className="text-xs font-bold text-[#F5F7F2]">5. Aspect Ratio</div>
          <div className="text-[11px] text-[#9AA4AD]">Controls display viewport geometry.</div>
          <select
            value={graphics.aspectRatio}
            onChange={(e) => onUpdateGraphics({ aspectRatio: e.target.value as AspectRatioOption })}
            className="w-full bg-[#11151A] border-2 border-[#343C44] rounded-xl px-3 py-2 text-xs text-[#F5F7F2] font-semibold focus:outline-none focus:border-[#C8FF35]"
          >
            <option value="16:9 (Native)">16:9 (Native Pokémon Let's Go)</option>
            <option value="Stretch to Fullscreen">Stretch to Fullscreen</option>
            <option value="Original Switch Viewport">Original Switch Viewport</option>
          </select>
        </div>
      </div>

      {/* 5. Toggles: Shaders, VSync, Mali Tile Memory */}
      <div className="ui-card-3d p-5 space-y-3">
        <div className="text-xs font-bold text-[#F5F7F2]">Vulkan Pipeline Switches & Hardware Features</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <label className="flex items-center gap-3 bg-[#11151A] p-3 rounded-xl border border-[#343C44] cursor-pointer">
            <input
              type="checkbox"
              checked={graphics.maliZeroCopyTileCache}
              onChange={(e) => onUpdateGraphics({ maliZeroCopyTileCache: e.target.checked })}
              className="w-4 h-4 accent-[#C8FF35] rounded"
            />
            <div>
              <div className="font-bold text-[#F5F7F2]">Mali-G615 Tile Memory Cache</div>
              <div className="text-[10px] text-[#9AA4AD]">Zero-copy render passes directly inside on-chip tile SRAM.</div>
            </div>
          </label>

          <label className="flex items-center gap-3 bg-[#11151A] p-3 rounded-xl border border-[#343C44] cursor-pointer">
            <input
              type="checkbox"
              checked={graphics.asyncShaders}
              onChange={(e) => onUpdateGraphics({ asyncShaders: e.target.checked })}
              className="w-4 h-4 accent-[#C8FF35] rounded"
            />
            <div>
              <div className="font-bold text-[#F5F7F2]">Asynchronous Shader Compilation</div>
              <div className="text-[10px] text-[#9AA4AD]">Compiles Vulkan SPIR-V pipelines in background threads.</div>
            </div>
          </label>

          <label className="flex items-center gap-3 bg-[#11151A] p-3 rounded-xl border border-[#343C44] cursor-pointer">
            <input
              type="checkbox"
              checked={graphics.diskShaderCache}
              onChange={(e) => onUpdateGraphics({ diskShaderCache: e.target.checked })}
              className="w-4 h-4 accent-[#C8FF35] rounded"
            />
            <div>
              <div className="font-bold text-[#F5F7F2]">Persistent Disk Shader Cache</div>
              <div className="text-[10px] text-[#9AA4AD]">Saves compiled pipelines to prevent re-stuttering across launches.</div>
            </div>
          </label>

          <label className="flex items-center gap-3 bg-[#11151A] p-3 rounded-xl border border-[#343C44] cursor-pointer">
            <input
              type="checkbox"
              checked={graphics.vsync}
              onChange={(e) => onUpdateGraphics({ vsync: e.target.checked })}
              className="w-4 h-4 accent-[#C8FF35] rounded"
            />
            <div>
              <div className="font-bold text-[#F5F7F2]">VSync & Frame Pacing Lock</div>
              <div className="text-[10px] text-[#9AA4AD]">Locks presentation to display refresh interval (33.3ms pacing).</div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};
