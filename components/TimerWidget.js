"use client";

import { motion } from "framer-motion";
import { PauseCircle, PlayCircle, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const formatTime = (totalSeconds) => {
  const h = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, "0");
  const m = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${h}:${m}:${s}`;
};

const TimerWidget = ({ onSave, totalSeconds }) => {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(null);

  useEffect(() => {
    let raf;
    const tick = () => {
      if (running && startRef.current) {
        const delta = (Date.now() - startRef.current) / 1000;
        setElapsed(delta);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  const handleStart = () => {
    startRef.current = Date.now();
    setRunning(true);
  };

  const handlePause = () => {
    setRunning(false);
    const seconds = Math.floor(elapsed);
    if (seconds > 0) {
      onSave?.(seconds);
    }
    setElapsed(0);
    startRef.current = null;
  };

  const handleReset = () => {
    setRunning(false);
    setElapsed(0);
    startRef.current = null;
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-2xl glass-surface">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-100">Fokus timer</div>
        <div className="text-xs text-emerald-200/80">Umumiy: {formatTime(totalSeconds || 0)}</div>
      </div>

      <div className="mt-4 flex items-center justify-center">
        <motion.div
          className="flex h-32 w-32 items-center justify-center rounded-full border border-emerald-300/40 bg-emerald-400/10 text-3xl font-semibold text-emerald-100"
          animate={{ scale: running ? 1.03 : 1, boxShadow: running ? "0 0 30px rgba(52,211,153,0.45)" : "none" }}
        >
          {formatTime(elapsed)}
        </motion.div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-3">
        {running ? (
          <button
            onClick={handlePause}
            className="flex items-center gap-2 rounded-xl bg-emerald-500/80 px-4 py-2 text-sm font-semibold text-slate-900"
          >
            <PauseCircle className="h-5 w-5" />
            Pause & Save
          </button>
        ) : (
          <button
            onClick={handleStart}
            className="flex items-center gap-2 rounded-xl border border-emerald-300/60 bg-white/10 px-4 py-2 text-sm font-semibold text-emerald-100"
          >
            <PlayCircle className="h-5 w-5" />
            Start
          </button>
        )}
        <button
          onClick={handleReset}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </div>
    </div>
  );
};

export default TimerWidget;
