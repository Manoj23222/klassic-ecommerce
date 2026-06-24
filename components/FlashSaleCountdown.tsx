"use client";

import { useEffect, useState } from "react";

function getLeft(endDate: string) {
  const diff = new Date(endDate).getTime() - Date.now();

  if (diff <= 0) {
    return { hours: "00", minutes: "00", seconds: "00", ended: true };
  }

  const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, "0");
  const minutes = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, "0");
  const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");

  return { hours, minutes, seconds, ended: false };
}

export default function FlashSaleCountdown({ endDate }: { endDate: string }) {
  const [time, setTime] = useState(() => getLeft(endDate));

  useEffect(() => {
    const timer = setInterval(() => {
      const next = getLeft(endDate);
      setTime(next);

      if (next.ended) {
        window.location.reload();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="grid grid-cols-3 gap-2">
      <MiniDarkStat value={time.hours} label="Hours" />
      <MiniDarkStat value={time.minutes} label="Minutes" />
      <MiniDarkStat value={time.seconds} label="Seconds" />
    </div>
  );
}

function MiniDarkStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-white/10 p-3 text-center">
      <p className="text-lg font-black">{value}</p>
      <p className="text-[10px] text-white/50">{label}</p>
    </div>
  );
}