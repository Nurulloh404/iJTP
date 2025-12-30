"use client";

import { motion } from "framer-motion";
import { CalendarDays, Sparkles, Trophy } from "lucide-react";
import { useMemo, useState } from "react";

import CalendarView from "@/components/CalendarView";
import DailyChecklist from "@/components/DailyChecklist";
import TaskManager from "@/components/TaskManager";
import { calculateMaruSlices } from "@/hooks/useHabits";
import useHabits from "@/hooks/useHabits";

const todayString = () => new Date().toISOString().slice(0, 10);

export default function Home() {
  const { tasks, completions, addMainTask, addMiniTask, toggleMiniTask, getDayCompletion } =
    useHabits();
  const [selectedDate, setSelectedDate] = useState(todayString());

  const dayStats = getDayCompletion(selectedDate);
  const maruSlices = useMemo(
    () => calculateMaruSlices(completions[selectedDate], tasks),
    [completions, selectedDate, tasks],
  );

  const totalMain = tasks.length;
  const totalMini = tasks.reduce((sum, t) => sum + (t.minis?.length || 0), 0);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(52,211,153,0.18),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(168,85,247,0.22),transparent_30%)]" />
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 pb-16 pt-10 md:grid-cols-[2fr_1fr] sm:px-6">
        <div className="space-y-6">
          <header className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-900/50 to-slate-900/80 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl glass-surface">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="flex items-center gap-2 text-sm text-emerald-100/80">
                  <Sparkles className="h-4 w-4 text-emerald-300" />
                  Maru Habit Tracker
                </p>
                <h1 className="text-3xl font-semibold leading-tight tracking-tight text-slate-50 sm:text-4xl">
                  Hierarchical Tasks + Maru Calendar
                </h1>
                <p className="max-w-xl text-sm text-slate-200/70">
                  Main &amp; mini tasks, neon glassmorphism, va Maru (◯) pie chart kalendari bilan
                  progressni kuzating.
                </p>
              </div>
              <div className="hidden sm:block">
                <HeroMaru slices={maruSlices} />
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <StatCard
                title="Bugungi sana"
                value={selectedDate}
                icon={<CalendarDays className="h-4 w-4 text-emerald-300" />}
              />
              <StatCard
                title="Main tasks"
                value={totalMain}
                icon={<Sparkles className="h-4 w-4 text-emerald-300" />}
              />
              <StatCard
                title="Mini tasks"
                value={totalMini}
                icon={<Trophy className="h-4 w-4 text-emerald-300" />}
              />
            </div>
          </header>

          <CalendarView
            tasks={tasks}
            completions={completions}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />

          <DailyChecklist
            date={selectedDate}
            tasks={tasks}
            dayData={dayStats.day}
            onToggle={(miniId) => toggleMiniTask(selectedDate, miniId)}
          />
        </div>

        <TaskManager tasks={tasks} onAddMain={addMainTask} onAddMini={addMiniTask} />
      </div>
    </main>
  );
}

const StatCard = ({ title, value, icon }) => (
  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-inner shadow-emerald-500/10 backdrop-blur-xl glass-surface">
    <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-200/80">
      <span>{title}</span>
      {icon}
    </div>
    <div className="mt-2 text-2xl font-semibold text-slate-50">{value}</div>
  </div>
);

const HeroMaru = ({ slices }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl glass-surface"
  >
    <svg width="96" height="96" viewBox="0 0 96 96">
      <defs>
        <radialGradient id="heroGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(52,211,153,0.3)" />
          <stop offset="100%" stopColor="rgba(168,85,247,0.15)" />
        </radialGradient>
      </defs>
      <circle cx="48" cy="48" r="44" fill="url(#heroGlow)" opacity="0.35" />
      <circle cx="48" cy="48" r="42" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
      {slices?.length ? (
        (() => {
          const radius = 42;
          const circumference = 2 * Math.PI * radius;
          const segments = [];
          slices.reduce((offset, slice) => {
            const dash = (slice.percent / 100) * circumference;
            const gap = circumference - dash;
            segments.push({ slice, dash, gap, offset });
            return offset + dash;
          }, 0);

          return segments.map(({ slice, dash, gap, offset }, idx) => (
            <motion.circle
              key={`${slice.color}-${idx}`}
              cx="48"
              cy="48"
              r={radius}
              fill="none"
              stroke={slice.color}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-offset}
              initial={{ strokeDasharray: `0 ${circumference}` }}
              animate={{ strokeDasharray: `${dash} ${gap}` }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          ));
        })()
      ) : (
        <circle
          cx="48"
          cy="48"
          r="42"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="6"
          strokeDasharray="6 8"
        />
      )}
    </svg>
  </motion.div>
);
