"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "glow-habits:v1";

const sampleHabits = [
  {
    id: "hydrate",
    title: "1L suv ichish",
    description: "Kunning birinchi qismida suv balansi.",
    createdAt: new Date().toISOString(),
    completedDates: [],
    streak: 0,
    lastCompleted: null,
    color: "emerald",
  },
  {
    id: "focus",
    title: "25 daqiqalik fokus",
    description: "Pomodoro sessiyasi + qisqa tanaffus.",
    createdAt: new Date().toISOString(),
    completedDates: [],
    streak: 0,
    lastCompleted: null,
    color: "violet",
  },
];

const getToday = () => new Date().toISOString().slice(0, 10);

const differenceInDays = (a, b) => {
  const first = new Date(a);
  const second = new Date(b);
  const msInDay = 1000 * 60 * 60 * 24;
  return Math.round((first - second) / msInDay);
};

const calculateStreak = (dates) => {
  const unique = Array.from(new Set(dates)).sort();
  if (!unique.length) return 0;

  let streak = 1;
  let cursor = unique[unique.length - 1];

  // Walk backwards until the chain breaks
  for (let i = unique.length - 2; i >= 0; i -= 1) {
    const gap = differenceInDays(cursor, unique[i]);
    if (gap === 1) {
      streak += 1;
      cursor = unique[i];
    } else {
      break;
    }
  }

  return streak;
};

const useHabits = () => {
  const [habits, setHabits] = useState(() => {
    if (typeof window === "undefined") return sampleHabits;
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : sampleHabits;
  });

  // Persist changes
  useEffect(() => {
    if (!habits.length) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  }, [habits]);

  const addHabit = useCallback(({ title, description, color }) => {
    const newHabit = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description?.trim() || "Odat tafsiloti",
      createdAt: new Date().toISOString(),
      completedDates: [],
      streak: 0,
      lastCompleted: null,
      color: color || "emerald",
    };
    setHabits((prev) => [...prev, newHabit]);
  }, []);

  const toggleHabit = useCallback((habitId) => {
    const today = getToday();
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id !== habitId) return habit;

        const existing = habit.completedDates || [];
        const completedToday = existing.includes(today);
        const updatedDates = completedToday
          ? existing.filter((date) => date !== today)
          : [...existing, today];

        updatedDates.sort();

        return {
          ...habit,
          completedDates: updatedDates,
          lastCompleted: updatedDates[updatedDates.length - 1] || null,
          streak: calculateStreak(updatedDates),
        };
      }),
    );
  }, []);

  const deleteHabit = useCallback((habitId) => {
    setHabits((prev) => prev.filter((habit) => habit.id !== habitId));
  }, []);

  const completedTodayCount = useMemo(() => {
    const today = getToday();
    return habits.filter((habit) => habit.completedDates?.includes(today)).length;
  }, [habits]);

  return {
    habits,
    addHabit,
    toggleHabit,
    deleteHabit,
    completedTodayCount,
    today: getToday(),
  };
};

export default useHabits;
