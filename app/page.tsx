"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { foods } from "@/database/foods";
import { getLocalWeather, type WeatherData } from "@/lib/weather";
import { getSettings } from "@/lib/storage";

export default function HomePage() {
  const [weather, setWeather] = useState<WeatherData>(getLocalWeather("กรุงเทพมหานคร"));

  useEffect(() => {
    const settings = getSettings();
    setWeather(getLocalWeather(settings.city));
  }, []);

  // Top 3 popular foods matching mockup (ผัดซีอิ๊ว/ผัดไทย, ราเมง, ต๊อกบกกี/ข้าวผัด)
  const popularThree = [
    foods.find((f) => f.id === "F007") || foods[0], // ผัดซีอิ๊ว / เส้น
    foods.find((f) => f.id === "F009") || foods[1], // ราเมง
    foods.find((f) => f.id === "F006") || foods[2], // ข้าวผัด
  ];

  const quickPrompts = [
    { label: "มีงบ 70 บาท แนะนำหน่อย", icon: "💰" },
    { label: "วันนี้ฝนตก ซดซุปร้อนๆ", icon: "🌧️" },
    { label: "อาหารญี่ปุ่น งบ 150 บาท", icon: "🍱" },
    { label: "ไม่ทานเนื้อสัตว์ใหญ่", icon: "🚫" },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Hero Card matching Mockup 1 */}
      <section className="relative overflow-hidden rounded-3xl border border-orange-100 bg-gradient-to-br from-[#FFF5EC] via-[#FFF1E4] to-[#FFE8D6] p-6 sm:p-8 md:p-10 shadow-xs">
        {/* Decorative Food Stickers */}
        <span className="absolute left-6 bottom-4 text-3xl opacity-80 select-none">🍅</span>
        <span className="absolute right-6 top-6 text-2xl opacity-80 select-none">🍃</span>
        <span className="absolute right-24 bottom-3 text-2xl opacity-80 select-none">🍅</span>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-xl">
            {/* Logo + Title */}
            <div className="flex items-center gap-3">
              <span className="text-4xl">👨‍🍳</span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900">
                WhatToEat<span className="text-orange-500"> AI</span>
              </h1>
            </div>

            <p className="mt-3 text-sm sm:text-base font-medium text-stone-600">
              ไม่รู้จะกินอะไรดี? ให้ AI ช่วยแนะนำเมนูที่ใช่สำหรับคุณจาก 50 เมนูยอดนิยม
            </p>

            {/* Action Buttons */}
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/preferences"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:-translate-y-0.5 hover:from-orange-600 hover:to-amber-600"
              >
                <span>✨</span>
                <span>ให้ AI แนะนำเมนู</span>
              </Link>

              <Link
                href="/chat"
                className="inline-flex items-center gap-2 rounded-2xl border border-orange-200 bg-white/90 px-5 py-3.5 text-sm font-bold text-orange-600 shadow-xs transition hover:-translate-y-0.5 hover:bg-white hover:text-orange-700"
              >
                <span>🤖</span>
                <span>คุยกับ AI แชทบอท</span>
              </Link>

              <Link
                href="/category"
                className="inline-flex items-center gap-2 rounded-2xl border border-stone-200 bg-white/90 px-5 py-3.5 text-sm font-bold text-stone-700 shadow-xs transition hover:-translate-y-0.5 hover:bg-white hover:text-orange-600"
              >
                <span>🍱</span>
                <span>เลือกอาหารเอง</span>
              </Link>
            </div>
          </div>

          {/* Right Hero Food Image in Bowl */}
          <div className="relative mx-auto md:mx-0 w-44 h-44 sm:w-52 sm:h-52 md:w-60 md:h-60 shrink-0">
            <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl shadow-orange-950/10 bg-orange-100">
              <Image
                src="/images/tomyum1.png"
                alt="อาหารแนะนำ WhatToEat AI"
                fill
                priority
                sizes="(max-width: 768px) 200px, 240px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. AI Prompt Teaser Bar ("คำแนะนำที่ใช้คุยกับเอไอ") */}
      <section className="rounded-3xl border border-orange-100/80 bg-white p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-xl border border-orange-200">
            💡
          </span>
          <div>
            <h3 className="text-sm font-bold text-stone-900">
              คำแนะนำคุยกับ AI: ถามได้ทั้งงบประมาณ สภาพอากาศ และข้อจำกัด
            </h3>
            <p className="text-xs text-stone-500">
              แตะคำถามตัวอย่างเพื่อเริ่มคุยกับ AI หรือพิมพ์ถามสิ่งที่คุณอยากทานได้ทันที
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {quickPrompts.map((p, idx) => (
            <Link
              key={idx}
              href="/chat"
              className="flex items-center gap-1.5 rounded-xl border border-orange-100 bg-orange-50/60 px-3 py-1.5 text-sm font-semibold text-orange-700 hover:bg-orange-100 transition"
            >
              <span>{p.icon}</span>
              <span>{p.label}</span>
            </Link>
          ))}
          <Link
            href="/chat"
            className="text-sm font-bold text-orange-500 hover:text-orange-600 hover:underline ml-1"
          >
            ดูเพิ่มเติม &gt;
          </Link>
        </div>
      </section>

      {/* 3. Bottom Row: Weather Widget & Popular Picks Cards */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Weather Card (Mockup bottom left) */}
        <div className="md:col-span-5 rounded-3xl border border-orange-100 bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-sm font-bold text-stone-700">
              <span>📍</span>
              <span>{weather.city}</span>
              <span className="text-amber-400">★</span>
            </span>

            <Link
              href="/settings"
              className="text-xs font-medium text-orange-500 hover:underline"
            >
              เปลี่ยนเมือง
            </Link>
          </div>

          <div className="my-4 flex items-center gap-4">
            <span className="text-4xl">{weather.emoji}</span>
            <div>
              <p className="text-3xl font-extrabold text-stone-900 tracking-tight">
                {weather.temperature}°C
              </p>
              <p className="text-sm text-stone-500 font-medium">
                {weather.conditionText}
              </p>
            </div>
          </div>

          <p className="text-xs text-stone-400">
            สภาพอากาศนำมาวิเคราะห์ร่วมในการแนะนำอาหาร 25%
          </p>
        </div>

        {/* Popular Foods Card (Mockup bottom right) */}
        <div className="md:col-span-7 rounded-3xl border border-orange-100 bg-white p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-stone-800 flex items-center gap-1.5">
              <span>เมนูยอดนิยม</span>
            </h2>

            <Link
              href="/category"
              className="text-sm font-semibold text-orange-500 hover:text-orange-600 transition"
            >
              ดูทั้งหมด &gt;
            </Link>
          </div>

          {/* 3 Circular Food Thumbnails in Row */}
          <div className="grid grid-cols-3 gap-3">
            {popularThree.map((food) => (
              <Link
                key={food.id}
                href={`/food/${food.id}`}
                className="group flex flex-col items-center text-center p-2 rounded-2xl hover:bg-orange-50/60 transition"
              >
                <div className="relative h-18 w-18 sm:h-20 sm:w-20 rounded-full overflow-hidden border-2 border-orange-100 shadow-xs mb-2">
                  <Image
                    src={food.image}
                    alt={food.name}
                    fill
                    sizes="80px"
                    className="object-cover group-hover:scale-110 transition duration-300"
                  />
                </div>
                <span className="text-sm font-bold text-stone-800 truncate max-w-full group-hover:text-orange-600">
                  {food.name}
                </span>
                <span className="text-xs font-semibold text-orange-500">
                  ฿{food.price}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
