import { useEffect, useState } from 'react';

function computeRemaining(targetIso) {
  const diff = new Date(targetIso).getTime() - Date.now();
  if (Number.isNaN(diff) || diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds, expired: false };
}

// Ticks a live countdown to `targetIso`, updating every second and stopping
// cleanly at zero. Never hardcode a duration - it is always derived from the
// server-provided timestamp.
export function useCountdown(targetIso) {
  const [remaining, setRemaining] = useState(() => computeRemaining(targetIso));

  useEffect(() => {
    if (!targetIso) return undefined;

    setRemaining(computeRemaining(targetIso));
    const interval = setInterval(() => {
      setRemaining((prev) => {
        const next = computeRemaining(targetIso);
        if (prev.expired && next.expired) {
          clearInterval(interval);
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetIso]);

  return remaining;
}
