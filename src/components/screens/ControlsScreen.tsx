import React, { useState } from 'react';
import { ControllerConfig } from '../../types/emulator';
import { 
  Gamepad2, Compass, Bluetooth, Usb, Sliders, CheckCircle2, 
  RotateCcw, Sparkles, Check, Move 
} from 'lucide-react';

interface ControlsScreenProps {
  controller: ControllerConfig;
  onUpdateController: (updated: Partial<ControllerConfig>) => void;
  onResetLayout: () => void;
}

export const ControlsScreen: React.FC<ControlsScreenProps> = ({
  controller,
  onUpdateController,
  onResetLayout
}) => {
  const [calibratingGyro, setCalibratingGyro] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const handleCalibrateGyro = () => {
    setCalibratingGyro(true);
    setTimeout(() => {
      setCalibratingGyro(false);
      onUpdateController({ gyroCalibrated: true });
      setSaveToast('Gyroscope zero-point calibrated successfully.');
      setTimeout(() => setSaveToast(null), 3000);
    }, 1000);
  };

  const handleSaveLayout = () => {
    setSaveToast('Custom touchscreen layout profile saved.');
    setTimeout(() => setSaveToast(null), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b-2 border-[#343C44]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[#C8FF35] font-black text-sm">✦</span>
            <h1 className="text-2xl font-display font-extrabold text-[#F5F7F2] tracking-tight">
              Controller & Input Configuration
            </h1>
          </div>
          <p className="text-xs text-[#9AA4AD] mt-1">
            Touchscreen overlay customization, Poké Ball aiming mechanics, and gyroscope motion calibration.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onResetLayout}
            className="ui-btn-pill-dark px-3 py-1.5 text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#C8FF35]" />
            <span>Reset Layout</span>
          </button>
          <button
            onClick={handleSaveLayout}
            className="ui-btn-pill-lime px-4 py-1.5 text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>Save Profile</span>
          </button>
        </div>
      </div>

      {saveToast && (
        <div className="bg-[#11151A] border-2 border-[#C8FF35] rounded-xl px-4 py-2.5 text-xs text-[#C8FF35] font-semibold flex items-center gap-2 shadow-[2px_2px_0px_#000000]">
          <CheckCircle2 className="w-4 h-4 text-[#C8FF35]" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Pokémon Let's Go-Specific Catching & Aiming Mechanics */}
      <div className="ui-card-3d p-5 space-y-3 bg-gradient-to-r from-[#191E24] to-[#222930]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C8FF35]" />
            <span className="text-xs font-bold text-[#F5F7F2]">
              Pokémon: Let's Go, Eevee! Special Catching Mode
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold text-[#0B0D10] bg-[#C8FF35] px-2 py-0.5 rounded-full border border-[#343C44]">
            Joy-Con Motion Emulation
          </span>
        </div>
        <p className="text-xs text-[#9AA4AD] leading-relaxed">
          Select how you throw Poké Balls during wild encounters. You can swipe up on the touch viewport, tap the [A] button, or physically swing your device using Android accelerometer and gyroscope sensors.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
          {(['Swipe', 'Button Tap', 'Gyroscope Motion'] as const).map((mode) => {
            const isSelected = controller.eeveeThrowMode === mode;
            return (
              <button
                key={mode}
                onClick={() => onUpdateController({ eeveeThrowMode: mode })}
                className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#C8FF35] text-[#0B0D10] border-[#343C44] font-bold shadow-[2px_2px_0px_#000000]'
                    : 'bg-[#11151A] text-[#9AA4AD] border-[#343C44] hover:text-[#F5F7F2]'
                }`}
              >
                <div>{mode}</div>
                <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-[#0B0D10]/80' : 'text-[#9AA4AD]'}`}>
                  {mode === 'Swipe' ? 'Touch gesture swipe' : mode === 'Button Tap' ? 'Tap [A] key' : 'Device motion swing'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Touch Screen Customizer Sliders */}
      <div className="ui-card-3d p-5 space-y-4">
        <div className="text-xs font-bold text-[#F5F7F2]">On-Screen Controller Appearance & Ergonomics</div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
          {/* Opacity Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[#9AA4AD]">
              <span>Button Transparency (Opacity)</span>
              <span className="font-mono font-bold text-[#F5F7F2]">{Math.round(controller.opacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={controller.opacity}
              onChange={(e) => onUpdateController({ opacity: parseFloat(e.target.value) })}
              className="w-full accent-[#C8FF35]"
            />
          </div>

          {/* Scale Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[#9AA4AD]">
              <span>Button Scale (Size)</span>
              <span className="font-mono font-bold text-[#F5F7F2]">{controller.scale}x</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="1.4"
              step="0.05"
              value={controller.scale}
              onChange={(e) => onUpdateController({ scale: parseFloat(e.target.value) })}
              className="w-full accent-[#C8FF35]"
            />
          </div>

          {/* Haptic Vibration Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[#9AA4AD]">
              <span>Haptic Vibration Feedback</span>
              <span className="font-mono font-bold text-[#F5F7F2]">{controller.vibrationStrength}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={controller.vibrationStrength}
              onChange={(e) => onUpdateController({ vibrationStrength: parseInt(e.target.value) })}
              className="w-full accent-[#C8FF35]"
            />
          </div>

          {/* Gyroscope Sensitivity */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[#9AA4AD]">
              <span>Gyroscope Motion Sensitivity</span>
              <span className="font-mono font-bold text-[#F5F7F2]">{controller.gyroSensitivity}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={controller.gyroSensitivity}
              onChange={(e) => onUpdateController({ gyroSensitivity: parseFloat(e.target.value) })}
              className="w-full accent-[#C8FF35]"
            />
          </div>
        </div>

        {/* Visual 3D Styling Toggle */}
        <div className="pt-2 border-t border-[#343C44] flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-[#F5F7F2]">3D Offset Button Appearance</div>
            <div className="text-[11px] text-[#9AA4AD]">Renders buttons with tactile 3D drop-shadows matching the UI Kit.</div>
          </div>
          <input
            type="checkbox"
            checked={controller.style3dOffset}
            onChange={(e) => onUpdateController({ style3dOffset: e.target.checked })}
            className="w-5 h-5 accent-[#C8FF35] rounded"
          />
        </div>
      </div>

      {/* Gyroscope Sensor Calibration Box */}
      <div className="ui-card-3d p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-[#F5F7F2] flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#C8FF35]" />
              <span>Android Sensor Calibration</span>
            </div>
            <div className="text-[11px] text-[#9AA4AD] mt-0.5">
              Zero out accelerometer bias by placing device on a flat surface.
            </div>
          </div>
          <button
            onClick={handleCalibrateGyro}
            disabled={calibratingGyro}
            className="ui-btn-pill-dark px-3.5 py-1.5 text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Compass className={`w-3.5 h-3.5 text-[#C8FF35] ${calibratingGyro ? 'animate-spin' : ''}`} />
            <span>{calibratingGyro ? 'Calibrating...' : 'Calibrate Gyro'}</span>
          </button>
        </div>
      </div>

      {/* External Controller Support (Bluetooth / USB) */}
      <div className="ui-card-3d p-5 space-y-3">
        <div className="text-xs font-bold text-[#F5F7F2]">External Hardware Controllers</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-[#11151A] p-3.5 rounded-xl border border-[#343C44] space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-[#F5F7F2]">
              <Bluetooth className="w-4 h-4 text-[#C8FF35]" />
              <span>Bluetooth Gamepad</span>
            </div>
            <p className="text-[11px] text-[#9AA4AD]">
              Xbox Wireless Controller / DualShock 4 / 8BitDo mapped to Switch Pro Controller layout.
            </p>
            <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Ready for pairing</span>
            </div>
          </div>

          <div className="bg-[#11151A] p-3.5 rounded-xl border border-[#343C44] space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-[#F5F7F2]">
              <Usb className="w-4 h-4 text-[#C8FF35]" />
              <span>USB-C OTG Direct HID</span>
            </div>
            <p className="text-[11px] text-[#9AA4AD]">
              Zero input lag through direct Android USB Host API integration.
            </p>
            <div className="text-[10px] text-[#9AA4AD] font-mono">Listening on /dev/bus/usb...</div>
          </div>
        </div>
      </div>
    </div>
  );
};
