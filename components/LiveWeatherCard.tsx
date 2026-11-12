"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getLocalWeather, type WeatherData } from "@/lib/weather";
import { getSettings } from "@/lib/storage";

export default function LiveWeatherCard() {
  const [weather, setWeather] = useState<WeatherData>(getLocalWeather("กรุงเทพมหานคร"));

  useEffect(() => {
    const settings = getSettings();
    setWeather(getLocalWeather(settings.city));
  }, []);

  return (
    <div className="mt-8 inline-flex items-center gap-4 rounded-2xl border border-white bg-white/95 px-5 py-3.5 shadow-sm">
      <span className="text-3xl">{weather.emoji}</span>

      <div>
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-stone-800">{weather.city}</p>
          <span className="rounded-md bg-orange-100 px-1.5 py-0.5 text-xs font-bold text-orange-700">
            {weather.temperature}°C
          </span>
        </div>
        <p className="text-sm text-stone-500">{weather.conditionText}</p>
      </div>

      <Link
        href="/settings"
        title="เปลี่ยนเมืองที่ตั้งค่า"
        className="ml-2 border-l border-stone-200 pl-3 text-xs text-orange-500 hover:underline"
      >
        เปลี่ยนเมือง
      </Link>
    </div>
  );
}
