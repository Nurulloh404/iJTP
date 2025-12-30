"use client";

import { motion } from "framer-motion";
import { Palette, PlusCircle } from "lucide-react";
import { useMemo, useState } from "react";

const TaskManager = ({ tasks, onAddMain, onAddMini }) => {
  const [mainTitle, setMainTitle] = useState("");
  const [mainColor, setMainColor] = useState("#22d3ee");
  const [miniTitle, setMiniTitle] = useState("");
  const [selectedMain, setSelectedMain] = useState("");

  const mainOptions = useMemo(() => tasks.map((t) => ({ id: t.id, title: t.title })), [tasks]);

  const handleAddMain = (e) => {
    e.preventDefault();
    onAddMain?.(mainTitle, mainColor);
    setMainTitle("");
  };

  const handleAddMini = (e) => {
    e.preventDefault();
    if (!selectedMain) return;
    onAddMini?.(selectedMain, miniTitle);
    setMiniTitle("");
  };

  return (
    <section className="space-y-4 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/70 via-slate-900/40 to-slate-900/70 p-5 backdrop-blur-2xl glass-surface">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
        <Palette className="h-4 w-4 text-emerald-300" />
        Task Manager
      </div>

      <form onSubmit={handleAddMain} className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="text-xs uppercase tracking-wide text-slate-300/80">Main Task</div>
        <input
          value={mainTitle}
          onChange={(e) => setMainTitle(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:border-emerald-300/60 focus:outline-none"
          placeholder="Masalan, IT yoki Fitness"
        />
        <div className="flex items-center gap-3">
          <label className="text-xs text-slate-300/80">Rang</label>
          <input
            type="color"
            value={mainColor}
            onChange={(e) => setMainColor(e.target.value)}
            className="h-10 w-16 rounded-xl border border-white/10 bg-white/5"
          />
          <span className="text-xs text-slate-300/70">{mainColor}</span>
        </div>
        <motion.button
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-fuchsia-500 px-3 py-2 text-sm font-semibold text-slate-900"
        >
          <PlusCircle className="h-4 w-4" />
          Main task qo‘shish
        </motion.button>
      </form>

      <form onSubmit={handleAddMini} className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="text-xs uppercase tracking-wide text-slate-300/80">Mini Task</div>
        <select
          value={selectedMain}
          onChange={(e) => setSelectedMain(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-100 focus:border-emerald-300/60 focus:outline-none"
        >
          <option value="">Main task tanlang</option>
          {mainOptions.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.title}
            </option>
          ))}
        </select>
        <input
          value={miniTitle}
          onChange={(e) => setMiniTitle(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:border-emerald-300/60 focus:outline-none"
          placeholder="Mini task nomi, masalan Python"
        />
        <motion.button
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-violet-500 px-3 py-2 text-sm font-semibold text-slate-900"
        >
          <PlusCircle className="h-4 w-4" />
          Mini task qo‘shish
        </motion.button>
      </form>
    </section>
  );
};

export default TaskManager;
