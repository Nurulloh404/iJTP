"use client";

import { motion } from "framer-motion";
import MaruPie from "./MaruPie";
import { calculateMaruSlices } from "@/hooks/useHabits";

const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

const CalendarView = ({ tasks, completions, selectedDate, onSelectDate }) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const totalDays = daysInMonth(year, month);

  const renderDay = (day) => {
    const dateStr = new Date(year, month, day).toISOString().slice(0, 10);
    const slices = calculateMaruSlices(completions[dateStr], tasks);
    const isSelected = selectedDate === dateStr;
    const isToday = dateStr === today.toISOString().slice(0, 10);

    return (
      <motion.button
        key={dateStr}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelectDate?.(dateStr)}
        className={`relative flex flex-col items-center gap-2 rounded-2xl border p-3 backdrop-blur-xl glass-surface ${
          isSelected
            ? "border-emerald-300/60 bg-emerald-400/10 shadow-[0_12px_40px_rgba(34,197,94,0.25)]"
            : "border-white/10 bg-white/5"
        }`}
        aria-label={`Kun ${day}`}
      >
        <div className="text-xs text-slate-300/80">{isToday ? "Bugun" : "Kun"}</div>
        <MaruPie slices={slices} size={64} />
        <div className="text-sm font-semibold text-slate-100">{day}</div>
      </motion.button>
    );
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm uppercase tracking-wide text-emerald-100/80">Maru Calendar</div>
        <div className="text-xs text-slate-300/70">
          {today.toLocaleString("default", { month: "long" })} {year}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
        {Array.from({ length: totalDays }, (_, i) => renderDay(i + 1))}
      </div>
    </section>
  );
};

export default CalendarView;
