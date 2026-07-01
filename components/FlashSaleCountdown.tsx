"use client";

import { useEffect, useState } from "react";

type TimeLeft = {
  hours: string;
  minutes: string;
  seconds: string;
  expired: boolean;
};

export default function FlashSaleCountdown({ endDate }: { endDate?: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    hours: "00",
    minutes: "00",
    seconds: "00",
    expired: false,
  });

  useEffect(() => {
    if (!endDate) return;

    const updateTimer = () => {
      const end = new Date(endDate).getTime();
      const now = Date.now();
      const diff = end - now;

      if (diff <= 0 || Number.isNaN(end)) {
        setTimeLeft({
          hours: "00",
          minutes: "00",
          seconds: "00",
          expired: true,
        });
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
        expired: false,
      });
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (!endDate) return null;

  const TimeBox = ({ value, label }: { value: string; label: string }) => (
    <div className="flex h-[86px] w-[86px] flex-col items-center justify-center rounded-[24px] bg-[#333]">
      <span className="text-[26px] font-black leading-none text-white">
        {value}
      </span>
      <span className="mt-4 text-sm text-gray-300">{label}</span>
    </div>
  );

  if (timeLeft.expired) {
    return <p className="text-sm font-bold text-red-500">Expired</p>;
  }

  return (
    <div className="flex items-center justify-center gap-4">
      <TimeBox value={timeLeft.hours} label="Hours" />
      <TimeBox value={timeLeft.minutes} label="Minutes" />
      <TimeBox value={timeLeft.seconds} label="Seconds" />
    </div>
  );
}