"use client";

import { LogIn, LogOut, UserPlus } from "lucide-react";
import { useState } from "react";

const AuthBar = ({ currentProfile, profiles, onLogin, onRegister, onSwitch }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-2xl glass-surface">
      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-100">
        <span className="text-xs uppercase tracking-wide text-emerald-100/80">Profil</span>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1">
          <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
          {currentProfile?.name} — {currentProfile?.email}
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="text-xs uppercase tracking-wide text-slate-300/80">Login</div>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:border-emerald-300/60 focus:outline-none"
            placeholder="email@example.com"
          />
          <button
            onClick={() => onLogin?.(email)}
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs font-semibold text-slate-100 hover:border-emerald-300/60"
          >
            <LogIn className="h-4 w-4" />
            Login
          </button>
        </div>

        <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="text-xs uppercase tracking-wide text-slate-300/80">Register</div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:border-emerald-300/60 focus:outline-none"
            placeholder="Ism"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:border-emerald-300/60 focus:outline-none"
            placeholder="email@example.com"
          />
          <button
            onClick={() => onRegister?.(name, email)}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-fuchsia-500 px-3 py-2 text-xs font-semibold text-slate-900"
          >
            <UserPlus className="h-4 w-4" />
            Register
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-200/80">
        <span>Profilni almashtirish:</span>
        {profiles.map((p) => (
          <button
            key={p.id}
            onClick={() => onSwitch?.(p.id)}
            className={`rounded-full border px-3 py-1 ${
              currentProfile?.id === p.id
                ? "border-emerald-300/60 bg-emerald-400/10 text-emerald-100"
                : "border-white/10 bg-white/5 text-slate-200 hover:border-emerald-300/40"
            }`}
          >
            {p.name}
          </button>
        ))}
        <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-slate-300">
          <LogOut className="h-3 w-3" />
          Logout = boshqa profilga o‘tish
        </div>
      </div>
    </div>
  );
};

export default AuthBar;
