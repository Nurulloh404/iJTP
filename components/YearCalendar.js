"use client";

import { motion } from "framer-motion";
import MaruPie from "./MaruPie";
import { calculateMaruSlicesFromTime } from "@/hooks/useHabits";

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const YearCalendar = ({ year = 2026, tasks, timeTracking }) => {
  const monthSlices = months.map((label, idx) => {
    const monthTime = {};
    Object.entries(timeTracking || {}).forEach(([date, minis]) => {
      if (!date.startsWith(`${year}-`)) return;
      const d = new Date(date);
      if (d.getMonth() !== idx) return;
      Object.entries(minis || {}).forEach(([miniId, seconds]) => {
        monthTime[miniId] = (monthTime[miniId] || 0) + (seconds || 0);
      });
    });
    return { label, slices: calculateMaruSlicesFromTime(monthTime, tasks) };
  });

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm uppercase tracking-wide text-emerald-100/80">Yillik kalendar</div>
        <div className="text-xs text-slate-300/70">{year}</div>
      </div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {monthSlices.map(({ label, slices }) => (
          <motion.div
            key={label}
            className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-xl glass-surface"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-xs text-slate-200/80">{label}</div>
            <MaruPie slices={slices} size={72} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default YearCalendar;
