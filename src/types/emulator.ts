export type ScreenId = 'home' | 'graphics' | 'performance' | 'controls' | 'settings' | 'gameplay';

export type ResolutionOption = '0.5x (480p)' | '0.75x (540p - Recommended)' | '1.0x (720p Native)' | '1.5x (1080p)';
export type PerformancePreset = 'Performance (480p)' | 'Balanced (540p - Default)' | 'Quality (720p)';
export type FpsCapOption = 20 | 30 | 45 | 60 | 'Uncapped';
export type AntiAliasingOption = 'Disabled' | 'FXAA (Recommended)' | 'MSAA 2x' | 'MSAA 4x';
export type AnisotropicOption = 'Disabled' | '2x' | '4x (Recommended)' | '8x' | '16x';
export type ShadowQualityOption = 'Low' | 'Medium (Balanced)' | 'High';
export type AspectRatioOption = '16:9 (Native)' | 'Stretch to Fullscreen' | 'Original Switch Viewport';

export interface GraphicsConfig {
  resolution: ResolutionOption;
  vulkanBackend: string; // "Vulkan 1.3 (Mali-G615 Valhall)"
  asyncShaders: boolean;
  diskShaderCache: boolean;
  maliZeroCopyTileCache: boolean;
  antiAliasing: AntiAliasingOption;
  anisotropic: AnisotropicOption;
  shadowQuality: ShadowQualityOption;
  textureFiltering: 'Bilinear' | 'Trilinear' | 'Bicubic';
  vsync: boolean;
  aspectRatio: AspectRatioOption;
  fullscreen: boolean;
  dynamicResolutionFallback: boolean;
}

export interface PerformanceConfig {
  preset: PerformancePreset;
  fpsCap: FpsCapOption;
  cpuGovernor: 'Big.LITTLE Balanced (4x A78 + 4x A55)' | 'Performance (Pin 4x A78)' | 'Battery Saver';
  memoryBudgetCapMb: number; // 3200 MB safe threshold for 6GB RAM
  enableThermalGovernor: boolean;
  dimensityOptimization: boolean;
}

export interface ControllerConfig {
  opacity: number; // 0.1 to 1.0
  scale: number; // 0.8 to 1.4
  hapticFeedback: boolean;
  vibrationStrength: number; // 0 to 100
  showButtons: boolean;
  gyroSensitivity: number; // 0.5 to 2.0
  gyroCalibrated: boolean;
  eeveeThrowMode: 'Swipe' | 'Button Tap' | 'Gyroscope Motion';
  style3dOffset: boolean;
  connectedBluetoothGamepad: string | null;
}

export interface AudioConfig {
  backend: 'AAudio / Oboe (Low Latency)' | 'AudioTrack (Standard)' | 'OpenSL ES';
  latencyMs: number; // 10ms to 80ms (default 32ms)
  volume: number; // 0 to 100
  stereo: boolean;
  cracklePreventionRingBuffer: boolean;
  dynamicResampling: boolean;
}

export interface SaveSlot {
  id: string;
  name: string;
  location: string;
  badges: number;
  playtimeHours: number;
  lastSaved: string;
  sizeKb: number;
  isAutoSave: boolean;
}

export interface BenchmarkStage {
  id: 'boot' | 'menu' | 'overworld' | 'encounter' | 'battle' | 'viridian' | 'longsession';
  title: string;
  description: string;
  targetFps: number;
  avgFps: number;
  onePercentLow: number;
  framePacingPercent: number;
  peakRamMb: number;
  peakTempC: number;
  status: 'passed' | 'testing' | 'pending';
}

export interface LiveTelemetry {
  fps: number;
  targetFps: number;
  onePercentLow: number;
  frameTimeMs: number;
  cpuUtilization: number;
  gpuUtilization: number;
  ramUsedMb: number;
  ramTotalMb: number;
  temperatureC: number;
  thermalStatus: 'Normal (Cool)' | 'Warm' | 'Throttling';
  batteryPercent: number;
  batteryDrainMa: number;
  resolution: string;
  vulkanDrawCalls: number;
  shadersCached: number;
}
