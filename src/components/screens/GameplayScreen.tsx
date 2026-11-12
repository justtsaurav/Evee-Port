import React, { useState, useEffect, useRef } from 'react';
import { GraphicsConfig, PerformanceConfig, ControllerConfig, LiveTelemetry, ScreenId } from '../../types/emulator';
import { 
  Pause, Play, RotateCcw, Volume2, VolumeX, Sliders, 
  Settings2, Sparkles, Zap, Flame, Battery, Eye, CheckCircle2, ChevronDown, Gamepad2 
} from 'lucide-react';

interface GameplayScreenProps {
  graphics: GraphicsConfig;
  performance: PerformanceConfig;
  controller: ControllerConfig;
  onUpdateController: (updated: Partial<ControllerConfig>) => void;
  onNavigate: (screen: ScreenId) => void;
  onOpenSettings: () => void;
}

type SimulationScene = 'overworld' | 'encounter' | 'battle' | 'viridian';

export const GameplayScreen: React.FC<GameplayScreenProps> = ({
  graphics,
  performance,
  controller,
  onUpdateController,
  onNavigate,
  onOpenSettings
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeScene, setActiveScene] = useState<SimulationScene>('overworld');
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [showTelemetryHud, setShowTelemetryHud] = useState(true);
  const [showQuickDrawer, setShowQuickDrawer] = useState(false);
  const [activeButtons, setActiveButtons] = useState<{ [key: string]: boolean }>({});

  // Game interaction states
  const [playerPos, setPlayerPos] = useState({ x: 220, y: 150 });
  const [encounterProgress, setEncounterProgress] = useState(0);
  const [catchStatus, setCatchStatus] = useState<'idle' | 'aiming' | 'thrown' | 'caught'>('aiming');
  const [lastActionText, setLastActionText] = useState('Native Recompilation Tick Active @ 30 FPS');

  // Live telemetry (targeted for 540p / Dimensity 7300 30 FPS)
  const [telemetry, setTelemetry] = useState<LiveTelemetry>({
    fps: 30.0,
    targetFps: performance.fpsCap === 'Uncapped' ? 60 : Number(performance.fpsCap),
    onePercentLow: 27.2,
    frameTimeMs: 33.3,
    cpuUtilization: 34,
    gpuUtilization: 42,
    ramUsedMb: 2640,
    ramTotalMb: 3200,
    temperatureC: 40.2,
    thermalStatus: 'Normal (Cool)',
    batteryPercent: 88,
    batteryDrainMa: 640,
    resolution: graphics.resolution.split(' ')[0],
    vulkanDrawCalls: 480,
    shadersCached: 2150
  });

  const frameHistoryRef = useRef<number[]>(new Array(45).fill(33.3));
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const graphCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Joystick state
  const [joystickActive, setJoystickActive] = useState(false);
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const joystickBaseRef = useRef<HTMLDivElement | null>(null);

  // 60Hz Telemetry simulation with stable 30 FPS frame pacing on Dimensity 7300
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      const baseFps = performance.preset.includes('Performance') ? 30.0 : performance.preset.includes('Quality') ? 29.4 : 29.9;
      const jitter = (Math.random() - 0.5) * 0.5;
      const currentFps = Math.max(22, Math.min(60, Number((baseFps + jitter).toFixed(1))));
      const frameTime = Number((1000 / currentFps).toFixed(1));

      frameHistoryRef.current.shift();
      frameHistoryRef.current.push(frameTime);

      setTelemetry((prev) => ({
        ...prev,
        fps: currentFps,
        onePercentLow: Number((currentFps * 0.9).toFixed(1)),
        frameTimeMs: frameTime,
        cpuUtilization: Math.floor(32 + Math.random() * 6),
        gpuUtilization: Math.floor(38 + (graphics.resolution.includes('1.0x') ? 16 : graphics.resolution.includes('0.5x') ? -10 : 0) + Math.random() * 5),
        ramUsedMb: Math.floor(2600 + Math.sin(Date.now() / 6000) * 35),
        temperatureC: Number((40.0 + Math.sin(Date.now() / 15000) * 0.6).toFixed(1)),
        vulkanDrawCalls: Math.floor(460 + Math.random() * 30),
        shadersCached: prev.shadersCached + (Math.random() > 0.9 ? 1 : 0)
      }));
    }, 200);

    return () => clearInterval(interval);
  }, [isPlaying, performance.preset, graphics.resolution]);

  // Render Frame Pacing Graph
  useEffect(() => {
    const canvas = graphCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const history = frameHistoryRef.current;
    const step = canvas.width / (history.length - 1);

    // Target 33.3ms guideline (Lime Green dotted line)
    const targetY = canvas.height - (33.3 / 50) * canvas.height;
    ctx.strokeStyle = 'rgba(200, 255, 53, 0.4)';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(0, targetY);
    ctx.lineTo(canvas.width, targetY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Live frame time graph
    ctx.beginPath();
    ctx.strokeStyle = '#C8FF35';
    ctx.lineWidth = 1.8;
    history.forEach((ft, i) => {
      const y = Math.max(2, Math.min(canvas.height - 2, canvas.height - ((ft - 10) / 40) * canvas.height));
      if (i === 0) ctx.moveTo(0, y);
      else ctx.lineTo(i * step, y);
    });
    ctx.stroke();
  }, [telemetry.frameTimeMs]);

  // Main Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (activeScene === 'overworld') {
        // Route 1 / Pallet Town
        ctx.fillStyle = '#4fa83d';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Cobblestone / dirt path
        ctx.fillStyle = '#deb887';
        ctx.beginPath();
        ctx.ellipse(canvas.width / 2, canvas.height / 2 + 25, 240, 95, 0, 0, Math.PI * 2);
        ctx.fill();

        // Foliage tree circles
        ctx.fillStyle = '#2d6920';
        for (let x = 30; x < canvas.width; x += 65) {
          ctx.beginPath();
          ctx.arc(x, 35, 26, 0, Math.PI * 2);
          ctx.fill();
        }

        // Wild grass clumps
        ctx.fillStyle = '#3f8c30';
        ctx.fillRect(80, 130, 90, 60);
        ctx.fillRect(380, 140, 100, 70);

        // Partner Eevee following behind
        ctx.fillStyle = '#9b5e32';
        ctx.beginPath();
        ctx.arc(playerPos.x - 22, playerPos.y + 4, 11, 0, Math.PI * 2);
        ctx.fill();
        // Eevee fluffy collar & tail
        ctx.fillStyle = '#f8ebd2';
        ctx.beginPath();
        ctx.arc(playerPos.x - 30, playerPos.y + 2, 6, 0, Math.PI * 2);
        ctx.arc(playerPos.x - 22, playerPos.y + 8, 5, 0, Math.PI * 2);
        ctx.fill();

        // Trainer Character
        ctx.fillStyle = '#C8FF35'; // Trainer cap in lime
        ctx.beginPath();
        ctx.arc(playerPos.x, playerPos.y - 12, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#191E24'; // Jacket
        ctx.fillRect(playerPos.x - 8, playerPos.y - 2, 16, 20);
        ctx.fillStyle = '#F5F7F2'; // Shoes
        ctx.fillRect(playerPos.x - 7, playerPos.y + 18, 5, 6);
        ctx.fillRect(playerPos.x + 2, playerPos.y + 18, 5, 6);

      } else if (activeScene === 'encounter') {
        // Pokémon Let's Go Catching Scene
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, '#56ab2f');
        grad.addColorStop(1, '#a8e063');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Catch platform
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.ellipse(canvas.width / 2, canvas.height / 2 + 55, 170, 45, 0, 0, Math.PI * 2);
        ctx.fill();

        const cx = canvas.width / 2;
        const cy = canvas.height / 2 + 10;

        // Wild Eevee 3D model simulation
        ctx.fillStyle = '#9b5e32';
        ctx.beginPath();
        ctx.ellipse(cx, cy, 38, 30, 0, 0, Math.PI * 2);
        ctx.fill();

        // White fluffy collar
        ctx.fillStyle = '#f8ebd2';
        ctx.beginPath();
        ctx.ellipse(cx, cy + 12, 44, 20, 0, 0, Math.PI * 2);
        ctx.fill();

        // Head
        ctx.fillStyle = '#a66435';
        ctx.beginPath();
        ctx.arc(cx, cy - 25, 28, 0, Math.PI * 2);
        ctx.fill();

        // Ears
        ctx.beginPath();
        ctx.moveTo(cx - 16, cy - 45);
        ctx.lineTo(cx - 42, cy - 75);
        ctx.lineTo(cx - 5, cy - 40);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(cx + 16, cy - 45);
        ctx.lineTo(cx + 42, cy - 75);
        ctx.lineTo(cx + 5, cy - 40);
        ctx.fill();

        // Eyes & smile
        ctx.fillStyle = '#2b1d0c';
        ctx.beginPath();
        ctx.arc(cx - 9, cy - 26, 4.5, 0, Math.PI * 2);
        ctx.arc(cx + 9, cy - 26, 4.5, 0, Math.PI * 2);
        ctx.fill();

        // Catch Ring Animation
        const ringRadius = 55 - (encounterProgress % 32);
        ctx.strokeStyle = encounterProgress > 75 ? '#C8FF35' : '#f59e0b';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(cx, cy - 10, ringRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Outer Target Ring
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy - 10, 58, 0, Math.PI * 2);
        ctx.stroke();

        // Catch Text Overlay
        if (catchStatus === 'caught') {
          ctx.fillStyle = 'rgba(11, 13, 16, 0.88)';
          ctx.roundRect(canvas.width / 2 - 130, 20, 260, 32, 8);
          ctx.fill();
          ctx.fillStyle = '#C8FF35';
          ctx.font = 'bold 12px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('Gotcha! Wild Pokémon was caught!', canvas.width / 2, 40);
        }

      } else if (activeScene === 'battle') {
        // Pewter Gym Trainer Battle
        ctx.fillStyle = '#1c1f2e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Arena lines
        ctx.strokeStyle = '#343C44';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(30, 25, canvas.width - 60, canvas.height - 50);

        ctx.fillStyle = '#F5F7F2';
        ctx.font = 'bold 13px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText("Leader Brock: Let's see your bond with Eevee!", 45, 52);

        // Player Battle Card
        ctx.fillStyle = '#191E24';
        ctx.roundRect(canvas.width - 195, canvas.height - 85, 170, 50, 8);
        ctx.fill();
        ctx.strokeStyle = '#343C44';
        ctx.stroke();

        ctx.fillStyle = '#F5F7F2';
        ctx.font = '11px sans-serif';
        ctx.fillText('Eevee  Lv. 16', canvas.width - 180, canvas.height - 66);
        // HP bar (Lime)
        ctx.fillStyle = '#C8FF35';
        ctx.fillRect(canvas.width - 180, canvas.height - 58, 140, 8);

      } else {
        // Viridian Forest (Stress Test Scene)
        ctx.fillStyle = '#1b3d17';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Sun shafts
        ctx.fillStyle = 'rgba(200, 255, 53, 0.08)';
        ctx.beginPath();
        ctx.moveTo(100, 0);
        ctx.lineTo(220, canvas.height);
        ctx.lineTo(290, canvas.height);
        ctx.lineTo(170, 0);
        ctx.fill();

        // Dense foliage layers
        ctx.fillStyle = '#0f290c';
        for (let x = 10; x < canvas.width; x += 45) {
          ctx.beginPath();
          ctx.arc(x, 25, 30, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = '#F5F7F2';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Viridian Forest — Polygon & Particle Stress Pass', canvas.width / 2, canvas.height / 2);
        ctx.font = '10px sans-serif';
        ctx.fillStyle = '#C8FF35';
        ctx.fillText('Mali-G615 Tile SRAM: 28.4 FPS (Stable within 3.2 GB RAM)', canvas.width / 2, canvas.height / 2 + 18);
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [activeScene, playerPos, encounterProgress, catchStatus]);

  // Handle Joystick drag
  const handleJoystickMove = (clientX: number, clientY: number) => {
    if (!joystickBaseRef.current) return;
    const rect = joystickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxRadius = rect.width / 2;

    const clampedDist = Math.min(dist, maxRadius);
    const angle = Math.atan2(deltaY, deltaX);
    const clampedX = Math.cos(angle) * clampedDist;
    const clampedY = Math.sin(angle) * clampedDist;

    setJoystickPos({ x: clampedX, y: clampedY });

    const normX = clampedX / maxRadius;
    const normY = clampedY / maxRadius;
    setPlayerPos((prev) => ({
      x: Math.max(30, Math.min(520, prev.x + normX * 4.5)),
      y: Math.max(45, Math.min(240, prev.y + normY * 4.5))
    }));
  };

  // Button Action Handler
  const handleButtonPress = (btn: string) => {
    setActiveButtons((prev) => ({ ...prev, [btn]: true }));
    setLastActionText(`Button [${btn}] -> Native Recompilation Dispatch`);

    if (btn === 'A') {
      if (activeScene === 'overworld') setActiveScene('encounter');
      else if (activeScene === 'encounter') handleThrowPokeball();
      else if (activeScene === 'battle') setActiveScene('viridian');
      else if (activeScene === 'viridian') setActiveScene('overworld');
    } else if (btn === 'B') {
      setActiveScene('overworld');
    } else if (btn === 'X') {
      setActiveScene('battle');
    } else if (btn === 'Y') {
      setActiveScene('viridian');
    }

    setTimeout(() => {
      setActiveButtons((prev) => ({ ...prev, [btn]: false }));
    }, 150);
  };

  const handleThrowPokeball = () => {
    setCatchStatus('thrown');
    setLastActionText("Poké Ball Motion Thrown (Gyro / Touch)");
    let progress = 0;
    const throwInt = setInterval(() => {
      progress += 12;
      setEncounterProgress(progress);
      if (progress >= 100) {
        clearInterval(throwInt);
        setCatchStatus('caught');
        setLastActionText('Success! Pokémon captured and save data updated.');
        setTimeout(() => {
          setCatchStatus('aiming');
          setActiveScene('overworld');
        }, 2000);
      }
    }, 100);
  };

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-4 py-3 space-y-3">
      {/* Top Viewport Navigation Strip */}
      <div className="flex items-center justify-between gap-3 bg-[#11151A] px-3.5 py-2 rounded-2xl border-2 border-[#343C44] shadow-[3px_3px_0px_#000000]">
        <div className="flex items-center gap-2 truncate">
          <div className="w-2.5 h-2.5 rounded-full bg-[#C8FF35] animate-pulse" />
          <span className="font-display font-extrabold text-[#F5F7F2] text-xs sm:text-sm truncate">
            Pokémon: Let's Go, Eevee!
          </span>
          <span className="hidden sm:inline text-xs font-mono text-[#9AA4AD]">
            ({graphics.resolution.split(' ')[0]})
          </span>
        </div>

        {/* Scene Switcher Tabs (UI Kit segmented pills) */}
        <div className="flex items-center bg-[#0B0D10] p-1 rounded-full border border-[#343C44] text-xs">
          {(['overworld', 'encounter', 'battle', 'viridian'] as const).map((sc) => (
            <button
              key={sc}
              onClick={() => setActiveScene(sc)}
              className={`px-3 py-1 rounded-full capitalize text-xs font-semibold transition-all cursor-pointer ${
                activeScene === sc
                  ? 'bg-[#C8FF35] text-[#0B0D10] font-bold shadow-[1px_1px_0px_#000000]'
                  : 'text-[#9AA4AD] hover:text-[#F5F7F2]'
              }`}
            >
              {sc}
            </button>
          ))}
        </div>

        {/* Quick Toolbar */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            className="p-1.5 rounded-lg bg-[#191E24] border border-[#343C44] text-[#9AA4AD] hover:text-[#F5F7F2] cursor-pointer"
            title={isAudioMuted ? 'Unmute' : 'Mute'}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setShowTelemetryHud(!showTelemetryHud)}
            className={`p-1.5 rounded-lg border cursor-pointer ${
              showTelemetryHud ? 'bg-[#C8FF35] text-[#0B0D10] border-[#343C44]' : 'bg-[#191E24] border-[#343C44] text-[#9AA4AD]'
            }`}
            title="Toggle Performance HUD"
          >
            <Sliders className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-lg bg-[#191E24] border border-[#343C44] text-[#9AA4AD] hover:text-[#F5F7F2] cursor-pointer"
            title="Graphics & Performance"
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Fullscreen Game Viewport */}
      <div className="relative w-full aspect-[16/9] max-h-[540px] bg-black rounded-3xl overflow-hidden border-2 border-[#343C44] shadow-[5px_5px_0px_#000000] select-none">
        {/* Render Canvas */}
        <canvas
          ref={canvasRef}
          width={560}
          height={315}
          className="w-full h-full object-contain"
        />

        {/* Live HUD Telemetry Overlay */}
        {showTelemetryHud && (
          <div className="absolute top-3 left-3 bg-[#0B0D10]/90 backdrop-blur-md border-2 border-[#343C44] shadow-[3px_3px_0px_#000000] rounded-2xl p-3 text-xs font-mono-numbers space-y-1.5 max-w-[240px] pointer-events-none">
            <div className="flex items-center justify-between text-[#F5F7F2]">
              <span className="font-bold text-[#C8FF35] flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-current" />
                {telemetry.fps} FPS
              </span>
              <span className="text-[#9AA4AD] text-[10px]">1% Low: {telemetry.onePercentLow}</span>
            </div>

            {/* Frame Pacing Graph */}
            <div className="bg-[#11151A] rounded-lg p-1 border border-[#343C44]">
              <div className="flex justify-between text-[9px] text-[#9AA4AD] mb-0.5">
                <span>Frame Pacing</span>
                <span>{telemetry.frameTimeMs} ms</span>
              </div>
              <canvas ref={graphCanvasRef} width={200} height={26} className="w-full h-6 block" />
            </div>

            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10px] text-[#F5F7F2] pt-0.5">
              <div>CPU: <span className="font-bold text-[#C8FF35]">{telemetry.cpuUtilization}%</span> (4x A78)</div>
              <div>GPU: <span className="font-bold text-[#C8FF35]">{telemetry.gpuUtilization}%</span> (G615)</div>
              <div>RAM: <span className="font-bold">{telemetry.ramUsedMb}M</span> / 3.2G</div>
              <div>SoC: <span className="font-bold">{telemetry.temperatureC}°C</span></div>
            </div>
          </div>
        )}

        {/* On-Screen Touch Controls (with 3D Offset Styling from UI Kit) */}
        <div 
          className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between"
          style={{ opacity: controller.opacity }}
        >
          {/* Top Shoulder Triggers: L, ZL, ZR, R */}
          <div className="flex items-center justify-between w-full pointer-events-auto">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleButtonPress('ZL')}
                className="ui-touch-btn w-12 h-8 rounded-xl text-xs font-bold flex items-center justify-center cursor-pointer text-[#F5F7F2]"
              >
                ZL
              </button>
              <button
                onClick={() => handleButtonPress('L')}
                className="ui-touch-btn w-10 h-8 rounded-xl text-xs font-bold flex items-center justify-center cursor-pointer text-[#F5F7F2]"
              >
                L
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleButtonPress('R')}
                className="ui-touch-btn w-10 h-8 rounded-xl text-xs font-bold flex items-center justify-center cursor-pointer text-[#F5F7F2]"
              >
                R
              </button>
              <button
                onClick={() => handleButtonPress('ZR')}
                className="ui-touch-btn w-12 h-8 rounded-xl text-xs font-bold flex items-center justify-center cursor-pointer text-[#F5F7F2]"
              >
                ZR
              </button>
            </div>
          </div>

          {/* Bottom Controls: Left Joystick + Poké Ball Catch Center + Right Face Buttons */}
          <div className="flex items-end justify-between w-full pointer-events-auto">
            {/* Left Analog Joystick */}
            <div
              ref={joystickBaseRef}
              onMouseDown={(e) => {
                setJoystickActive(true);
                handleJoystickMove(e.clientX, e.clientY);
              }}
              onMouseMove={(e) => {
                if (joystickActive) handleJoystickMove(e.clientX, e.clientY);
              }}
              onMouseUp={() => {
                setJoystickActive(false);
                setJoystickPos({ x: 0, y: 0 });
              }}
              onTouchStart={(e) => {
                setJoystickActive(true);
                if (e.touches[0]) handleJoystickMove(e.touches[0].clientX, e.touches[0].clientY);
              }}
              onTouchMove={(e) => {
                if (joystickActive && e.touches[0]) {
                  handleJoystickMove(e.touches[0].clientX, e.touches[0].clientY);
                }
              }}
              onTouchEnd={() => {
                setJoystickActive(false);
                setJoystickPos({ x: 0, y: 0 });
              }}
              className="relative w-28 h-28 rounded-full bg-[#11151A]/80 border-2 border-[#343C44] shadow-[4px_4px_0px_#000000] flex items-center justify-center cursor-pointer"
            >
              <div
                className="w-12 h-12 rounded-full bg-[#222930] border-2 border-[#343C44] shadow-[2px_2px_0px_#000000] flex items-center justify-center"
                style={{ transform: `translate(${joystickPos.x}px, ${joystickPos.y}px)` }}
              >
                <div className="w-3.5 h-3.5 rounded-full bg-[#C8FF35]" />
              </div>
            </div>

            {/* Center Pokeball Throw Button during wild encounter */}
            {activeScene === 'encounter' && (
              <div className="pb-1">
                <button
                  onClick={handleThrowPokeball}
                  className="ui-btn-pill-lime flex items-center gap-2 px-5 py-3 text-xs font-bold cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Throw Poké Ball (Swipe / Tap)</span>
                </button>
              </div>
            )}

            {/* Right Diamond Face Buttons (A, B, X, Y) with 3D Offset Styling */}
            <div className="relative w-32 h-32 flex items-center justify-center">
              {/* Y */}
              <button
                onClick={() => handleButtonPress('Y')}
                className="ui-touch-btn absolute left-0 w-10 h-10 rounded-full text-xs font-bold flex items-center justify-center text-[#F5F7F2]"
              >
                Y
              </button>
              {/* X */}
              <button
                onClick={() => handleButtonPress('X')}
                className="ui-touch-btn absolute top-0 w-10 h-10 rounded-full text-xs font-bold flex items-center justify-center text-[#F5F7F2]"
              >
                X
              </button>
              {/* B */}
              <button
                onClick={() => handleButtonPress('B')}
                className="ui-touch-btn absolute bottom-0 w-10 h-10 rounded-full text-xs font-bold flex items-center justify-center text-[#F5F7F2]"
              >
                B
              </button>
              {/* A (Primary Action in Lime) */}
              <button
                onClick={() => handleButtonPress('A')}
                className="ui-touch-btn absolute right-0 w-11 h-11 rounded-full text-xs font-extrabold flex items-center justify-center text-[#C8FF35]"
              >
                A
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Terminal Tick Bar */}
      <div className="ui-card-3d px-3.5 py-2 flex items-center justify-between text-xs text-[#9AA4AD]">
        <div className="flex items-center gap-2 truncate">
          <span className="text-[#C8FF35] font-black">✦</span>
          <span className="truncate text-[#F5F7F2]">{lastActionText}</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] shrink-0">
          <span className="text-[#9AA4AD]">Mali Zero-Copy SRAM: ON</span>
          <span className="text-[#C8FF35] font-bold">30 FPS Pacing</span>
        </div>
      </div>
    </div>
  );
};
