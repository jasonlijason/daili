import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 单文件可运行：默认导出 React 组件
export default function StressReliefMiniGame() {
  const [mode, setMode] = useState<"bubble" | "particles">("bubble");
  return (
    <div className="min-h-screen w-full bg-neutral-950 text-neutral-100 flex flex-col items-center p-6 gap-4">
      <header className="w-full max-w-4xl flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">解压小游戏</h1>
        <ModeSwitch mode={mode} setMode={setMode} />
      </header>
      <main className="w-full max-w-4xl rounded-2xl bg-neutral-900/60 shadow-inner border border-neutral-800 p-4">
        <AnimatePresence mode="wait">
          {mode === "bubble" ? (
            <motion.div
              key="bubble"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <BubbleWrap />
            </motion.div>
          ) : (
            <motion.div
              key="particles"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <ZenParticles />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <footer className="text-xs text-neutral-400">Tip: 切换模式尝试不同的放松方式。</footer>
    </div>
  );
}

function ModeSwitch({
  mode,
  setMode,
}: {
  mode: "bubble" | "particles";
  setMode: (m: "bubble" | "particles") => void;
}) {
  const base =
    "px-3 py-1.5 rounded-xl text-sm border transition-colors select-none";
  return (
    <div className="flex gap-2">
      <button
        className={`${base} ${
          mode === "bubble"
            ? "bg-neutral-100 text-neutral-900 border-neutral-100"
            : "bg-transparent text-neutral-200 border-neutral-700 hover:border-neutral-500"
        }`}
        onClick={() => setMode("bubble")}
      >
        泡泡纸
      </button>
      <button
        className={`${base} ${
          mode === "particles"
            ? "bg-neutral-100 text-neutral-900 border-neutral-100"
            : "bg-transparent text-neutral-200 border-neutral-700 hover:border-neutral-500"
        }`}
        onClick={() => setMode("particles")}
      >
        禅意粒子
      </button>
    </div>
  );
}

// --------------- 泡泡纸 ---------------
function BubbleWrap() {
  const cols = 10;
  const rows = 12;
  const [grid, setGrid] = useState(() =>
    Array.from({ length: rows * cols }, () => false)
  );
  const poppedCount = grid.filter(Boolean).length;
  const audioRef = useRef<AudioContext | null>(null);

  function ensureAudio() {
    if (!audioRef.current) {
      audioRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioRef.current;
  }

  function popSound() {
    const ctx = ensureAudio();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "triangle";
    const now = ctx.currentTime;
    o.frequency.setValueAtTime(220, now);
    o.frequency.exponentialRampToValueAtTime(60, now + 0.12);
    g.gain.setValueAtTime(0.001, now);
    g.gain.exponentialRampToValueAtTime(0.5, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(now + 0.16);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="text-sm text-neutral-300">
          已戳爆: <span className="font-semibold text-white">{poppedCount}</span> / {rows * cols}
        </div>
        <div className="flex gap-2">
          <button
            className="px-3 py-1.5 rounded-lg text-sm bg-neutral-800 border border-neutral-700 hover:border-neutral-500"
            onClick={() => setGrid(Array.from({ length: rows * cols }, () => false))}
          >
            重置
          </button>
          <button
            className="px-3 py-1.5 rounded-lg text-sm bg-neutral-800 border border-neutral-700 hover:border-neutral-500"
            onClick={() => {
              // 全部戳爆
              setGrid(Array.from({ length: rows * cols }, () => true));
              popSound();
            }}
          >
            一键全爆
          </button>
        </div>
      </div>

      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {grid.map((popped, i) => (
          <motion.button
            key={i}
            onClick={() => {
              if (grid[i]) return; // 已爆
              popSound();
              setGrid((g) => {
                const copy = [...g];
                copy[i] = true;
                return copy;
              });
            }}
            className={`relative aspect-square rounded-full border ${
              popped
                ? "bg-neutral-700 border-neutral-600"
                : "bg-neutral-800 border-neutral-700 hover:border-neutral-500"
            } shadow-inner overflow-hidden`}
            whileTap={{ scale: 0.8 }}
          >
            {/* 高光 */}
            {!popped && (
              <span className="pointer-events-none absolute inset-0 rounded-full" style={{
                background:
                  "radial-gradient(120% 120% at 30% 30%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.06) 35%, rgba(255,255,255,0.02) 48%, rgba(0,0,0,0.3) 100%)",
              }} />
            )}
            {/* 爆裂涟漪 */}
            <AnimatePresence>
              {popped && (
                <motion.span
                  className="absolute inset-0 rounded-full"
                  initial={{ scale: 0.6, opacity: 0.9 }}
                  animate={{ scale: 1.4, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  style={{
                    background:
                      "radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 60%)",
                  }}
                />
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// --------------- 禅意粒子 ---------------
function ZenParticles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouse = useRef({ x: 0, y: 0, down: false });
  const [count, setCount] = useState(300);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let dpr = Math.max(1, window.devicePixelRatio || 1);

    function resize() {
      const { clientWidth, clientHeight } = canvas;
      canvas.width = Math.floor(clientWidth * dpr);
      canvas.height = Math.floor(clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function resetParticles(n = count) {
      particlesRef.current = Array.from({ length: n }, () => new Particle(canvas));
    }

    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 柔和背景渐隐
      ctx.fillStyle = "rgba(12,12,12,0.06)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (const p of particlesRef.current) {
        p.update(mouse.current, canvas);
        p.draw(ctx);
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    resize();
    resetParticles(count);
    tick();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [count]);

  function onPointerMove(e: React.PointerEvent) {
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    mouse.current.x = e.clientX - rect.left;
    mouse.current.y = e.clientY - rect.top;
  }
  function onPointerDown() {
    mouse.current.down = true;
  }
  function onPointerUp() {
    mouse.current.down = false;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="text-sm text-neutral-300">在画布上移动或按住鼠标以吸引粒子</div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-neutral-400">粒子数量</label>
          <input
            type="range"
            min={100}
            max={1000}
            step={50}
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value))}
          />
        </div>
      </div>
      <div className="relative w-full h-[60vh] rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950">
        <canvas
          ref={canvasRef}
          className="w-full h-full touch-none"
          onPointerMove={onPointerMove}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        />
      </div>
    </div>
  );
}

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number;
  radius: number;
  hue: number;

  constructor(canvas: HTMLCanvasElement) {
    this.x = Math.random() * canvas.clientWidth;
    this.y = Math.random() * canvas.clientHeight;
    const a = Math.random() * Math.PI * 2;
    this.speed = 0.4 + Math.random() * 0.8;
    this.vx = Math.cos(a) * this.speed;
    this.vy = Math.sin(a) * this.speed;
    this.radius = 1 + Math.random() * 2.2;
    this.hue = Math.floor(Math.random() * 360);
  }

  update(mouse: { x: number; y: number; down: boolean }, canvas: HTMLCanvasElement) {
    // 边界回弹
    if (this.x < 0 || this.x > canvas.clientWidth) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.clientHeight) this.vy *= -1;

    // 轻微噪声抖动
    this.vx += (Math.random() - 0.5) * 0.05;
    this.vy += (Math.random() - 0.5) * 0.05;

    // 鼠标吸引或爆散
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const dist = Math.hypot(dx, dy) + 0.0001;
    const dirX = dx / dist;
    const dirY = dy / dist;
    const force = mouse.down ? -2.2 : 0.9; // 按下时爆散
    const strength = Math.min(2.5 / dist, 0.06) * force;
    this.vx += dirX * strength;
    this.vy += dirY * strength;

    // 摩擦
    this.vx *= 0.995;
    this.vy *= 0.995;

    this.x += this.vx;
    this.y += this.vy;
  }

  draw(ctx: CanvasRenderingContext2D) {
    // 连接线
    // 随机少量连接以避免 O(n^2)
    // 简化为短尾拖影
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${this.hue}, 70%, 70%)`;
    ctx.fill();
  }
}
