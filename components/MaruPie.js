"use client";

import { motion } from "framer-motion";

const MaruPie = ({ slices, size = 64, strokeWidth = 8 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  if (!slices?.length) {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth={strokeWidth}
          strokeDasharray="4 6"
        />
      </svg>
    );
  }

  const segments = [];
  slices.reduce((offset, slice) => {
    const dash = (slice.percent / 100) * circumference;
    const gap = circumference - dash;
    segments.push({ slice, dash, gap, offset });
    return offset + dash;
  }, 0);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
      {segments.map(({ slice, dash, gap, offset }, idx) => {
        return (
          <motion.circle
            key={`${slice.color}-${idx}`}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={slice.color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset}
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={{ strokeDasharray: `${dash} ${gap}` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        );
      })}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="url(#maruGlow)"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth={strokeWidth / 4}
      />
      <defs>
        <radialGradient id="maruGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
    </svg>
  );
};

export default MaruPie;
