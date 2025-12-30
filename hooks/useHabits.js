"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "maru-habits:v1";

const sampleData = {
  tasks: [
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
  ],
  completions: {},
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
    if (typeof window === "undefined") return sampleData;
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : sampleData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addMainTask = useCallback((title, color) => {
    if (!title?.trim()) return;
    const newMain = {
      id: crypto.randomUUID(),
      title: title.trim(),
      color: color || "#22d3ee",
      minis: [],
    };
    setState((prev) => ({ ...prev, tasks: [...prev.tasks, newMain] }));
  }, []);

  const addMiniTask = useCallback((mainId, title) => {
    if (!title?.trim() || !mainId) return;
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((main) =>
        main.id === mainId
          ? { ...main, minis: [...(main.minis || []), { id: crypto.randomUUID(), title: title.trim() }] }
          : main,
      ),
    }));
  }, []);

  const toggleMiniTask = useCallback((date, miniId) => {
    if (!date || !miniId) return;
    setState((prev) => {
      const day = prev.completions[date] || {};
      const updatedDay = { ...day, [miniId]: !day[miniId] };
      return {
        ...prev,
        completions: {
          ...prev.completions,
          [date]: updatedDay,
        },
      };
    });
  }, []);

  const getDayCompletion = useCallback(
    (date) => {
      const day = state.completions[date] || {};
      const totalMinis = state.tasks.reduce((sum, main) => sum + (main.minis?.length || 0), 0);
      const completed = Object.values(day).filter(Boolean).length;
      const percent = totalMinis ? Math.round((completed / totalMinis) * 100) : 0;
      return { completed, total: totalMinis, percent, day };
    },
    [state.completions, state.tasks],
  );

  return {
    tasks: state.tasks,
    completions: state.completions,
    addMainTask,
    addMiniTask,
    toggleMiniTask,
    getDayCompletion,
  };
};

export default useHabits;
