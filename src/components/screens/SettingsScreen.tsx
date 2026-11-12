import React, { useState } from 'react';
import { AudioConfig, SaveSlot } from '../../types/emulator';
import { INITIAL_SAVE_SLOTS, RECOMP_CODEBASE_FILES, RecompFile } from '../../data/eeveeData';
import { 
  Settings, Volume2, Save, HardDrive, Terminal, FileCode, Copy, 
  Check, Download, Upload, Trash2, AlertCircle, Play, CheckCircle2 
} from 'lucide-react';

interface SettingsScreenProps {
  audio: AudioConfig;
  onUpdateAudio: (updated: Partial<AudioConfig>) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  audio,
  onUpdateAudio
}) => {
  const [activeTab, setActiveTab] = useState<'save' | 'audio' | 'architecture' | 'storage'>('save');
  const [saveSlots, setSaveSlots] = useState<SaveSlot[]>(INITIAL_SAVE_SLOTS);
  const [selectedRecompFile, setSelectedRecompFile] = useState<RecompFile>(RECOMP_CODEBASE_FILES[0]);
  const [copiedCode, setCopiedCode] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isPlayingTestTone, setIsPlayingTestTone] = useState(false);

  // Backup Save Slot
  const handleBackupSlot = (slot: SaveSlot) => {
    setToastMsg(`Backup created for "${slot.name}". Saved to /storage/emulated/0/Download/Eevee_Saves`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Restore Save Slot with safe confirmation
  const handleRestoreSlot = (slot: SaveSlot) => {
    const confirm = window.confirm(`Restore save from "${slot.name}"? Current in-game progress will be safely re-linked.`);
    if (confirm) {
      setToastMsg(`Restored "${slot.name}" to active Horizon OS /save partition.`);
      setTimeout(() => setToastMsg(null), 3500);
    }
  };

  // Test tone generator using Web Audio API
  const handleTestAudioTone = () => {
    setIsPlayingTestTone(true);
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {
      // Audio fallback
    }
    setTimeout(() => setIsPlayingTestTone(false), 500);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedRecompFile.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b-2 border-[#343C44]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[#C8FF35] font-black text-sm">✦</span>
            <h1 className="text-2xl font-display font-extrabold text-[#F5F7F2] tracking-tight">
              Settings & Recompilation Architecture
            </h1>
          </div>
          <p className="text-xs text-[#9AA4AD] mt-1">
            Audio pipelines, Horizon OS save backups, SAF storage, and native C++ code inspection.
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex items-center bg-[#11151A] p-1 rounded-full border-2 border-[#343C44] text-xs font-semibold overflow-x-auto">
          {(['save', 'audio', 'architecture', 'storage'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-full capitalize transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-[#C8FF35] text-[#0B0D10] font-bold shadow-[1px_1px_0px_#000000]'
                  : 'text-[#9AA4AD] hover:text-[#F5F7F2]'
              }`}
            >
              {tab === 'save' ? 'Saves' : tab === 'audio' ? 'Audio' : tab === 'architecture' ? 'C++ Architecture' : 'Storage'}
            </button>
          ))}
        </div>
      </div>

      {toastMsg && (
        <div className="bg-[#11151A] border-2 border-[#C8FF35] rounded-xl px-4 py-2.5 text-xs text-[#C8FF35] font-semibold flex items-center gap-2 shadow-[2px_2px_0px_#000000]">
          <CheckCircle2 className="w-4 h-4 text-[#C8FF35]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* TAB 1: Save Management */}
      {activeTab === 'save' && (
        <div className="space-y-4">
          <div className="ui-card-3d p-5 space-y-3">
            <div className="flex items-center justify-between border-b-2 border-[#343C44] pb-3">
              <div>
                <div className="text-xs font-bold text-[#F5F7F2] flex items-center gap-1.5">
                  <Save className="w-4 h-4 text-[#C8FF35]" />
                  <span>Horizon OS Save Data Management</span>
                </div>
                <div className="text-[11px] text-[#9AA4AD]">
                  Switch user save partition: /save/8000000000000010 (Never overwritten without confirmation)
                </div>
              </div>
              <button
                onClick={() => {
                  setToastMsg('All 4 save profiles exported to ZIP archive in /Download.');
                  setTimeout(() => setToastMsg(null), 3000);
                }}
                className="ui-btn-pill-lime px-3.5 py-1.5 text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export All ZIP</span>
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              {saveSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="bg-[#11151A] p-3.5 rounded-xl border-2 border-[#343C44] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#F5F7F2]">{slot.name}</span>
                      {slot.isAutoSave && (
                        <span className="text-[9px] font-mono text-[#0B0D10] bg-[#C8FF35] font-black px-1.5 py-0.2 rounded">
                          AUTO
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#9AA4AD] flex items-center gap-2">
                      <span>{slot.location}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono-numbers">{slot.playtimeHours}h Logged</span>
                      <span aria-hidden="true">·</span>
                      <span>{slot.lastSaved}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleRestoreSlot(slot)}
                      className="ui-btn-pill-dark px-3 py-1 text-xs cursor-pointer"
                    >
                      Restore
                    </button>
                    <button
                      onClick={() => handleBackupSlot(slot)}
                      className="ui-btn-pill-dark px-3 py-1 text-xs text-[#C8FF35] cursor-pointer"
                    >
                      Backup Slot
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Audio Configuration */}
      {activeTab === 'audio' && (
        <div className="space-y-4">
          <div className="ui-card-3d p-5 space-y-4">
            <div className="flex items-center justify-between border-b-2 border-[#343C44] pb-3">
              <div>
                <div className="text-xs font-bold text-[#F5F7F2] flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-[#C8FF35]" />
                  <span>Low-Latency Audio Subsystem (Oboe / AAudio)</span>
                </div>
                <div className="text-[11px] text-[#9AA4AD]">
                  Synchronized PCM16 48,000 Hz stereo audio synthesis
                </div>
              </div>
              <button
                onClick={handleTestAudioTone}
                disabled={isPlayingTestTone}
                className="ui-btn-pill-lime px-3.5 py-1.5 text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Play className={`w-3.5 h-3.5 fill-current ${isPlayingTestTone ? 'animate-spin' : ''}`} />
                <span>{isPlayingTestTone ? 'Emitting...' : 'Test Sync Tone (32ms)'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              {/* Latency Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[#9AA4AD]">
                  <span>Buffer Latency</span>
                  <span className="font-mono font-bold text-[#C8FF35]">{audio.latencyMs} ms</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="80"
                  step="2"
                  value={audio.latencyMs}
                  onChange={(e) => onUpdateAudio({ latencyMs: parseInt(e.target.value) })}
                  className="w-full accent-[#C8FF35]"
                />
                <div className="flex justify-between text-[10px] text-[#9AA4AD] font-mono-numbers">
                  <span>10ms (Tight)</span>
                  <span className="text-[#C8FF35]">32ms (Recommended)</span>
                  <span>80ms (Safe)</span>
                </div>
              </div>

              {/* Master Volume */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[#9AA4AD]">
                  <span>Master Volume</span>
                  <span className="font-mono font-bold text-[#F5F7F2]">{audio.volume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={audio.volume}
                  onChange={(e) => onUpdateAudio({ volume: parseInt(e.target.value) })}
                  className="w-full accent-[#C8FF35]"
                />
                <div className="flex justify-between text-[10px] text-[#9AA4AD] font-mono-numbers">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#343C44] space-y-2 text-xs">
              <label className="flex items-center gap-3 bg-[#11151A] p-3 rounded-xl border border-[#343C44] cursor-pointer">
                <input
                  type="checkbox"
                  checked={audio.cracklePreventionRingBuffer}
                  onChange={(e) => onUpdateAudio({ cracklePreventionRingBuffer: e.target.checked })}
                  className="w-4 h-4 accent-[#C8FF35] rounded"
                />
                <div>
                  <div className="font-bold text-[#F5F7F2]">Audio Crackle Prevention Ring Buffer</div>
                  <div className="text-[10px] text-[#9AA4AD]">Lock-free circular buffer preventing audio dropouts during heavy geometry passes.</div>
                </div>
              </label>

              <label className="flex items-center gap-3 bg-[#11151A] p-3 rounded-xl border border-[#343C44] cursor-pointer">
                <input
                  type="checkbox"
                  checked={audio.stereo}
                  onChange={(e) => onUpdateAudio({ stereo: e.target.checked })}
                  className="w-4 h-4 accent-[#C8FF35] rounded"
                />
                <div>
                  <div className="font-bold text-[#F5F7F2]">Stereo Positional Sound Field</div>
                  <div className="text-[10px] text-[#9AA4AD]">Synthesizes direction-accurate Pokémon cry spatialization.</div>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Architecture Audit & C++ Recompilation Codebase */}
      {activeTab === 'architecture' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* File List */}
            <div className="lg:col-span-4 space-y-2">
              <div className="text-xs font-bold text-[#F5F7F2] mb-1">
                Recompilation Architecture Files ({RECOMP_CODEBASE_FILES.length})
              </div>
              {RECOMP_CODEBASE_FILES.map((file) => (
                <button
                  key={file.path}
                  onClick={() => setSelectedRecompFile(file)}
                  className={`w-full text-left p-3 rounded-xl border-2 transition-all cursor-pointer ${
                    selectedRecompFile.path === file.path
                      ? 'border-[#C8FF35] bg-[#222930] shadow-[2px_2px_0px_#000000]'
                      : 'border-[#343C44] bg-[#11151A] hover:border-[#48545F]'
                  }`}
                >
                  <div className="font-mono text-xs font-bold text-[#F5F7F2] flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-[#C8FF35]" />
                    <span className="truncate">{file.name}</span>
                  </div>
                  <div className="text-[10px] text-[#9AA4AD] mt-1 line-clamp-1">{file.purpose}</div>
                </button>
              ))}
            </div>

            {/* Code Viewer */}
            <div className="lg:col-span-8 ui-card-3d overflow-hidden flex flex-col">
              <div className="px-4 py-2.5 bg-[#11151A] border-b-2 border-[#343C44] flex items-center justify-between">
                <span className="font-mono text-xs text-[#F5F7F2] font-semibold">{selectedRecompFile.path}</span>
                <button
                  onClick={handleCopyCode}
                  className="ui-btn-pill-dark px-3 py-1 text-xs flex items-center gap-1 cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-[#C8FF35]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <pre className="p-4 text-xs font-mono text-[#F5F7F2] overflow-x-auto max-h-[460px] leading-relaxed select-text bg-[#0B0D10]">
                <code>{selectedRecompFile.code}</code>
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Storage */}
      {activeTab === 'storage' && (
        <div className="space-y-4">
          <div className="ui-card-3d p-5 space-y-3">
            <div className="text-xs font-bold text-[#F5F7F2]">Storage Access Framework (SAF) & RomFS</div>
            <p className="text-xs text-[#9AA4AD] leading-relaxed">
              EEVEE MOBILE loads user-provided game data from isolated local storage. No copyrighted assets or proprietary firmware files are distributed with the APK.
            </p>
            <div className="space-y-2 text-xs pt-1">
              <div className="bg-[#11151A] p-3 rounded-xl border border-[#343C44] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#F5F7F2]">RomFS Mount Directory</div>
                  <div className="text-[11px] font-mono text-[#9AA4AD]">/storage/emulated/0/EeveeMobile/romfs</div>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                  Mounted
                </span>
              </div>

              <div className="bg-[#11151A] p-3 rounded-xl border border-[#343C44] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#F5F7F2]">Game Title ID</div>
                  <div className="text-[11px] font-mono text-[#9AA4AD]">010015100B5C4000 (v1.0.0 Base)</div>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                  Verified
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
