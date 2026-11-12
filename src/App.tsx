/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ScreenId, GraphicsConfig, PerformanceConfig, 
  ControllerConfig, AudioConfig 
} from './types/emulator';
import { TopBar } from './components/TopBar';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/screens/HomeScreen';
import { GraphicsScreen } from './components/screens/GraphicsScreen';
import { PerformanceScreen } from './components/screens/PerformanceScreen';
import { ControlsScreen } from './components/screens/ControlsScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { GameplayScreen } from './components/screens/GameplayScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');

  // Graphics Configuration (540p Balanced Default for Dimensity 7300)
  const [graphicsConfig, setGraphicsConfig] = useState<GraphicsConfig>({
    resolution: '0.75x (540p - Recommended)',
    vulkanBackend: 'Vulkan 1.3 (Mali-G615 Valhall)',
    asyncShaders: true,
    diskShaderCache: true,
    maliZeroCopyTileCache: true,
    antiAliasing: 'FXAA (Recommended)',
    anisotropic: '4x (Recommended)',
    shadowQuality: 'Medium (Balanced)',
    textureFiltering: 'Bilinear',
    vsync: true,
    aspectRatio: '16:9 (Native)',
    fullscreen: true,
    dynamicResolutionFallback: false
  });

  // Performance Configuration (Balanced Mode Default)
  const [performanceConfig, setPerformanceConfig] = useState<PerformanceConfig>({
    preset: 'Balanced (540p - Default)',
    fpsCap: 30,
    cpuGovernor: 'Big.LITTLE Balanced (4x A78 + 4x A55)',
    memoryBudgetCapMb: 3200,
    enableThermalGovernor: true,
    dimensityOptimization: true
  });

  // Controller Configuration (Always visible with 3D offset styling)
  const [controllerConfig, setControllerConfig] = useState<ControllerConfig>({
    opacity: 0.75,
    scale: 1.0,
    hapticFeedback: true,
    vibrationStrength: 70,
    showButtons: true,
    gyroSensitivity: 1.0,
    gyroCalibrated: true,
    eeveeThrowMode: 'Swipe',
    style3dOffset: true,
    connectedBluetoothGamepad: null
  });

  // Audio Configuration
  const [audioConfig, setAudioConfig] = useState<AudioConfig>({
    backend: 'AAudio / Oboe (Low Latency)',
    latencyMs: 32,
    volume: 85,
    stereo: true,
    cracklePreventionRingBuffer: true,
    dynamicResampling: true
  });

  // Launch Game
  const handleLaunchGame = () => {
    setCurrentScreen('gameplay');
  };

  const handleResetGraphicsDefaults = () => {
    setGraphicsConfig({
      resolution: '0.75x (540p - Recommended)',
      vulkanBackend: 'Vulkan 1.3 (Mali-G615 Valhall)',
      asyncShaders: true,
      diskShaderCache: true,
      maliZeroCopyTileCache: true,
      antiAliasing: 'FXAA (Recommended)',
      anisotropic: '4x (Recommended)',
      shadowQuality: 'Medium (Balanced)',
      textureFiltering: 'Bilinear',
      vsync: true,
      aspectRatio: '16:9 (Native)',
      fullscreen: true,
      dynamicResolutionFallback: false
    });
  };

  const handleResetControls = () => {
    setControllerConfig({
      opacity: 0.75,
      scale: 1.0,
      hapticFeedback: true,
      vibrationStrength: 70,
      showButtons: true,
      gyroSensitivity: 1.0,
      gyroCalibrated: true,
      eeveeThrowMode: 'Swipe',
      style3dOffset: true,
      connectedBluetoothGamepad: null
    });
  };

  return (
    <div className="min-h-screen bg-[#0B0D10] text-[#F5F7F2] flex flex-col font-sans selection:bg-[#C8FF35] selection:text-[#0B0D10] pb-20 md:pb-8">
      {/* Top Bar Contract (3 Zones) */}
      <TopBar
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        onLaunchGame={handleLaunchGame}
        activePreset={performanceConfig.preset}
      />

      {/* Main Screen Router */}
      <main className="flex-1">
        {currentScreen === 'home' && (
          <HomeScreen
            onLaunchGame={handleLaunchGame}
            onResumeGame={handleLaunchGame}
            onNavigate={setCurrentScreen}
            graphics={graphicsConfig}
            performance={performanceConfig}
          />
        )}

        {currentScreen === 'graphics' && (
          <GraphicsScreen
            graphics={graphicsConfig}
            onUpdateGraphics={(upd) => setGraphicsConfig((prev) => ({ ...prev, ...upd }))}
            onResetDefaults={handleResetGraphicsDefaults}
          />
        )}

        {currentScreen === 'performance' && (
          <PerformanceScreen
            performance={performanceConfig}
            graphics={graphicsConfig}
            onUpdatePerformance={(upd) => setPerformanceConfig((prev) => ({ ...prev, ...upd }))}
            onUpdateGraphics={(upd) => setGraphicsConfig((prev) => ({ ...prev, ...upd }))}
          />
        )}

        {currentScreen === 'controls' && (
          <ControlsScreen
            controller={controllerConfig}
            onUpdateController={(upd) => setControllerConfig((prev) => ({ ...prev, ...upd }))}
            onResetLayout={handleResetControls}
          />
        )}

        {currentScreen === 'settings' && (
          <SettingsScreen
            audio={audioConfig}
            onUpdateAudio={(upd) => setAudioConfig((prev) => ({ ...prev, ...upd }))}
          />
        )}

        {currentScreen === 'gameplay' && (
          <GameplayScreen
            graphics={graphicsConfig}
            performance={performanceConfig}
            controller={controllerConfig}
            onUpdateController={(upd) => setControllerConfig((prev) => ({ ...prev, ...upd }))}
            onNavigate={setCurrentScreen}
            onOpenSettings={() => setCurrentScreen('graphics')}
          />
        )}
      </main>

      {/* Compact Mobile Bottom Navigation */}
      <BottomNav
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
      />
    </div>
  );
}
