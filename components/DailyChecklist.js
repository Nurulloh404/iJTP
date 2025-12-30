"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const DailyChecklist = ({ date, tasks, dayData, onToggle }) => {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm uppercase tracking-wide text-emerald-100/80">Bugungi mini-tasks</div>
        <div className="text-xs text-slate-300/70">{date}</div>
      </div>

      <div className="space-y-3">
        {tasks.map((main) => (
          <div
            key={main.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl glass-surface"
            style={{ boxShadow: `0 10px 40px ${main.color}33` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ background: main.color }}
                  aria-hidden
                />
                <h3 className="text-sm font-semibold text-slate-100">{main.title}</h3>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              {main.minis?.map((mini) => {
                const checked = Boolean(dayData?.[mini.id]);
                return (
                  <motion.button
                    key={mini.id}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onToggle?.(mini.id)}
                    className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left transition ${
                      checked
                        ? "border-emerald-300/60 bg-emerald-400/10"
                        : "border-white/10 bg-white/5 hover:border-emerald-200/40"
                    }`}
                  >
                    <span className="text-sm text-slate-100">{mini.title}</span>
                    <CheckCircle2
                      className={`h-5 w-5 ${checked ? "text-emerald-300" : "text-slate-400"}`}
                    />
                  </motion.button>
                );
              })}
              {!main.minis?.length && (
                <div className="rounded-xl border border-dashed border-white/15 bg-white/5 px-3 py-2 text-xs text-slate-300/70">
                  Mini-task qo‘shilmagan.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DailyChecklist;
