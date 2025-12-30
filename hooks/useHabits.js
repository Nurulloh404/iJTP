"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "maru-habits:v2";

const baseSampleTasks = [
  {
    id: "it-main",
    title: "IT",
    color: "#22d3ee",
    minis: [
      { id: "python", title: "Python" },
      { id: "oop", title: "OOP" },
      { id: "html", title: "HTML" },
    ],
  },
  {
    id: "jp-main",
    title: "Japanese",
    color: "#f472b6",
    minis: [
      { id: "kana", title: "Kana" },
      { id: "vocab", title: "Vocabulary" },
    ],
  },
  {
    id: "fit-main",
    title: "Fitness",
    color: "#22c55e",
    minis: [
      { id: "run", title: "Running" },
      { id: "core", title: "Core" },
    ],
  },
];

const initialState = {
  currentProfileId: "guest",
  profiles: [
    {
      id: "guest",
      name: "Guest",
      email: "guest@example.com",
      tasks: baseSampleTasks,
      completions: {},
      timerTotalSeconds: 0,
    },
  ],
};

export const calculateMaruSlices = (dayData, tasks) => {
  if (!dayData || !tasks?.length) return [];

  const miniToMain = new Map();
  tasks.forEach((main) => {
    main.minis?.forEach((mini) => {
      miniToMain.set(mini.id, main);
    });
  });

  const aggregates = {};
  let total = 0;

  Object.entries(dayData).forEach(([miniId, done]) => {
    if (!done) return;
    const main = miniToMain.get(miniId);
    if (!main) return;
    if (!aggregates[main.id]) {
      aggregates[main.id] = { color: main.color || "#22d3ee", count: 0 };
    }
    aggregates[main.id].count += 1;
    total += 1;
  });

  if (!total) return [];

  return Object.values(aggregates).map((entry) => ({
    color: entry.color,
    percent: Math.round((entry.count / total) * 100),
  }));
};

const useHabits = () => {
  const [state, setState] = useState(() => {
    if (typeof window === "undefined") return initialState;
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const getProfile = useCallback(
    () => state.profiles.find((p) => p.id === state.currentProfileId) || state.profiles[0],
    [state.currentProfileId, state.profiles],
  );

  const updateProfile = useCallback(
    (updater) => {
      setState((prev) => {
        const profile = getProfile();
        if (!profile) return prev;
        const updatedProfile = updater(profile);
        return {
          ...prev,
          profiles: prev.profiles.map((p) => (p.id === profile.id ? updatedProfile : p)),
        };
      });
    },
    [getProfile],
  );

  const addMainTask = useCallback((title, color) => {
    if (!title?.trim()) return;
    const newMain = {
      id: crypto.randomUUID(),
      title: title.trim(),
      color: color || "#22d3ee",
      minis: [],
    };
    updateProfile((profile) => ({ ...profile, tasks: [...profile.tasks, newMain] }));
  }, [updateProfile]);

  const addMiniTask = useCallback(
    (mainId, title) => {
      if (!title?.trim() || !mainId) return;
      updateProfile((profile) => ({
        ...profile,
        tasks: profile.tasks.map((main) =>
          main.id === mainId
            ? { ...main, minis: [...(main.minis || []), { id: crypto.randomUUID(), title: title.trim() }] }
            : main,
        ),
      }));
    },
    [updateProfile],
  );

  const toggleMiniTask = useCallback(
    (date, miniId) => {
      if (!date || !miniId) return;
      updateProfile((profile) => {
        const day = profile.completions[date] || {};
        const updatedDay = { ...day, [miniId]: !day[miniId] };
        return {
          ...profile,
          completions: {
            ...profile.completions,
            [date]: updatedDay,
          },
        };
      });
    },
    [updateProfile],
  );

  const getDayCompletion = useCallback(
    (date) => {
      const profile = getProfile();
      const day = profile.completions[date] || {};
      const totalMinis = profile.tasks.reduce((sum, main) => sum + (main.minis?.length || 0), 0);
      const completed = Object.values(day).filter(Boolean).length;
      const percent = totalMinis ? Math.round((completed / totalMinis) * 100) : 0;
      return { completed, total: totalMinis, percent, day };
    },
    [getProfile],
  );

  const addTimerSeconds = useCallback(
    (seconds) => {
      if (!seconds) return;
      updateProfile((profile) => ({
        ...profile,
        timerTotalSeconds: (profile.timerTotalSeconds || 0) + seconds,
      }));
    },
    [updateProfile],
  );

  const registerProfile = useCallback((name, email) => {
    if (!name?.trim() || !email?.trim()) return;
    const profile = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      tasks: baseSampleTasks,
      completions: {},
      timerTotalSeconds: 0,
    };
    setState((prev) => ({
      ...prev,
      currentProfileId: profile.id,
      profiles: [...prev.profiles, profile],
    }));
  }, []);

  const loginProfile = useCallback((email) => {
    if (!email?.trim()) return;
    setState((prev) => {
      const found = prev.profiles.find((p) => p.email === email.trim().toLowerCase());
      if (!found) return prev;
      return { ...prev, currentProfileId: found.id };
    });
  }, []);

  const profile = getProfile();

  return {
    tasks: profile.tasks,
    completions: profile.completions,
    currentProfile: profile,
    addMainTask,
    addMiniTask,
    toggleMiniTask,
    getDayCompletion,
    addTimerSeconds,
    registerProfile,
    loginProfile,
    profiles: state.profiles,
    setActiveProfile: (id) => setState((prev) => ({ ...prev, currentProfileId: id })),
  };
};

export default useHabits;
