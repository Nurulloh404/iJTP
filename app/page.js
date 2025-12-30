// Client component because we rely on LocalStorage and interactive UI.
"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  CheckSquare,
  Flame,
  Plus,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useMemo, useState } from "react";

import AddHabitModal from "@/components/AddHabitModal";
import HabitCard from "@/components/HabitCard";
import useHabits from "@/hooks/useHabits";

export default function Home() {
  const { habits, addHabit, toggleHabit, deleteHabit, completedTodayCount, today } = useHabits();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const completionRate = useMemo(() => {
    if (!habits.length) return 0;
    return Math.round((completedTodayCount / habits.length) * 100);
  }, [habits.length, completedTodayCount]);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(52,211,153,0.18),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(168,85,247,0.22),transparent_30%)]" />
      <div className="relative mx-auto flex max-w-4xl flex-col gap-6 px-4 pb-16 pt-10 sm:px-6">
        <header className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-900/50 to-slate-900/80 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl glass-surface">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="flex items-center gap-2 text-sm text-emerald-100/80">
                <Sparkles className="h-4 w-4 text-emerald-300" />
                Modern Habit Tracker
              </p>
              <h1 className="text-3xl font-semibold leading-tight tracking-tight text-slate-50 sm:text-4xl">
                Glow Habits
              </h1>
              <p className="max-w-xl text-sm text-slate-200/70">
                Dark mode, glassmorphism va framer-motion asosidagi silliq animatsiyalar bilan
                odatlaringizni chiroyli ko‘rinishda boshqaring.
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-fuchsia-500 px-4 py-3 text-sm font-semibold text-slate-900 shadow-[0_15px_60px_rgba(52,211,153,0.45)] transition hover:translate-y-[-1px]"
            >
              <Plus className="h-5 w-5" />
              Yangi odat
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <StatCard
              title="Bugungi sana"
              value={today}
              icon={<CalendarDays className="h-4 w-4 text-emerald-300" />}
            />
            <StatCard
              title="Bajarilgan"
              value={`${completedTodayCount} / ${habits.length || 1}`}
              icon={<CheckSquare className="h-4 w-4 text-emerald-300" />}
            />
            <StatCard
              title="Umumiy progress"
              value={`${completionRate}%`}
              icon={<Trophy className="h-4 w-4 text-emerald-300" />}
            />
          </div>
        </header>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm uppercase tracking-wide text-emerald-100/80">
              <Flame className="h-4 w-4 text-amber-300" />
              Bugungi odatlar
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-emerald-100 hover:border-emerald-300/50 hover:bg-emerald-500/10"
            >
              <Plus className="h-4 w-4" />
              Qo‘shish
            </button>
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {habits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onToggle={toggleHabit}
                  onDelete={deleteHabit}
                />
              ))}
            </AnimatePresence>

            {!habits.length && (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-center text-slate-200/70">
                Hozircha odatlar yo‘q. <strong>“Yangi odat”</strong> tugmasi orqali boshlang!
              </div>
            )}
          </div>
        </section>
      </div>

      <AddHabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={addHabit}
      />
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
