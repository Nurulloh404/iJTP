"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Flame, Sparkles, Trash2 } from "lucide-react";

const gradientByColor = {
  emerald: "from-emerald-400/40 via-emerald-500/20 to-emerald-400/5",
  violet: "from-violet-400/40 via-fuchsia-500/20 to-fuchsia-400/5",
  cyan: "from-cyan-400/40 via-sky-500/20 to-cyan-400/5",
};

const todayString = () => new Date().toISOString().slice(0, 10);

const HabitCard = ({ habit, onToggle, onDelete }) => {
  const completedToday = habit.completedDates?.includes(todayString());
  const gradientClass = gradientByColor[habit.color] || gradientByColor.emerald;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl glass-surface`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-60`} />
      <div className="relative flex items-start gap-4">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => onToggle(habit.id)}
          className={`mt-1 grid h-12 w-12 place-items-center rounded-2xl border transition-all ${
            completedToday
              ? "border-emerald-300/50 bg-emerald-500/20 shadow-[0_10px_30px_rgba(34,197,94,0.35)]"
              : "border-white/15 bg-white/5 hover:border-emerald-300/40 hover:bg-emerald-400/10"
          }`}
          aria-label={`Toggle ${habit.title}`}
        >
          <CheckCircle2
            className={`h-6 w-6 transition-all ${
              completedToday ? "text-emerald-300" : "text-slate-100/70"
            }`}
          />
        </motion.button>

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 text-sm text-emerald-100/80">
            <Sparkles className="h-4 w-4 text-emerald-300" />
            <span className="font-medium tracking-wide uppercase">Bugun</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-slate-50">{habit.title}</h3>
            <p className="text-sm text-slate-200/70">{habit.description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-emerald-100">
              <Flame className="h-4 w-4 text-amber-300" />
              {habit.streak} kun ketma-ket
            </span>
            {habit.lastCompleted && (
              <span className="text-slate-200/70">
                Oxirgi bajarilgan: <strong>{habit.lastCompleted}</strong>
              </span>
            )}
          </div>
        </div>

        {onDelete && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete(habit.id)}
            aria-label="Odatni o‘chirish"
            className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-200 hover:text-rose-200"
          >
            <Trash2 className="h-4 w-4" />
          </motion.button>
        )}
      </div>

      {completedToday && (
        <motion.div
          layoutId="glow"
          className="absolute inset-0 -z-10 rounded-2xl bg-emerald-500/10 blur-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
        />
      )}
    </motion.div>
  );
};

export default HabitCard;
