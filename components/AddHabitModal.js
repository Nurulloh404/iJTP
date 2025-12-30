"use client";

import { AnimatePresence, motion } from "framer-motion";
import { PlusCircle, Sparkles } from "lucide-react";
import { useState } from "react";

const colorOptions = [
  { value: "emerald", label: "Neon yashil" },
  { value: "violet", label: "Binafsha" },
  { value: "cyan", label: "Cyan" },
];

const AddHabitModal = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("emerald");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Odat nomini kiriting.");
      return;
    }
    onSubmit({ title, description, color });
    setTitle("");
    setDescription("");
    setColor("emerald");
    setError("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-md p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.97 }}
            className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-900/90 p-6 shadow-2xl backdrop-blur-xl glass-surface"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-300" />
                <h3 className="text-lg font-semibold text-slate-50">Yangi odat</h3>
              </div>
              <button
                onClick={onClose}
                className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-300 hover:text-emerald-200"
              >
                Bekor qilish
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-200/80">Odat nomi</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-50 placeholder:text-slate-400 focus:border-emerald-300/60 focus:outline-none"
                  placeholder="Masalan, 10k qadam"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-200/80">Izoh</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-50 placeholder:text-slate-400 focus:border-emerald-300/60 focus:outline-none"
                  placeholder="Nima uchun bu odat muhim?"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-200/80">Aksent rang</label>
                <div className="grid grid-cols-3 gap-3">
                  {colorOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setColor(option.value)}
                      className={`rounded-xl border px-3 py-2 text-sm transition-all ${
                        color === option.value
                          ? "border-emerald-300/70 bg-emerald-400/10 text-emerald-100 shadow-[0_12px_30px_rgba(16,185,129,0.25)]"
                          : "border-white/10 bg-white/5 text-slate-200/80 hover:border-emerald-200/50"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {error && <p className="text-sm text-rose-300">{error}</p>}

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-fuchsia-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_15px_60px_rgba(52,211,153,0.45)]"
              >
                <PlusCircle className="h-5 w-5" />
                Qo‘shish
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddHabitModal;
