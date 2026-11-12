import Image from "next/image";
import Link from "next/link";
import LiveWeatherCard from "./LiveWeatherCard";

export default function HeroSection() {
  return (
    <section className="relative mt-8 overflow-hidden rounded-[32px] bg-gradient-to-br from-orange-50 via-[#fff7f0] to-orange-100 px-6 py-12 md:px-12 lg:px-16 lg:py-16">
      {/* Decorative background */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-orange-200/30 blur-3xl" />
      <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-yellow-200/30 blur-3xl" />

      <div className="relative grid items-center gap-12 lg:grid-cols-2">
        {/* Left content */}
        <div className="z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-sm font-semibold tracking-wider text-orange-600">
            <span>✦</span>
            YOUR PERSONAL FOOD ASSISTANT
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-stone-800 md:text-5xl lg:text-6xl">
            วันนี้กินอะไรดี?
            <span className="mt-2 block text-orange-500">
              ให้ AI ช่วยเลือก!
            </span>
          </h1>

          <p className="mt-5 max-w-lg text-sm leading-8 text-stone-600 md:text-base">
            หมดปัญหาคิดไม่ออกว่าจะกินอะไร ให้ WhatToEat AI
            ช่วยเลือกเมนูที่เหมาะกับคุณ ตามความชอบ งบประมาณ และสภาพอากาศ
          </p>

          {/* Action buttons */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/preferences"
              className="inline-flex items-center gap-3 rounded-xl bg-orange-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-1 hover:bg-orange-600"
            >
              🎯 เลือกความต้องการ (Preferences)
              <span>→</span>
            </Link>

            <Link
              href="/chat"
              className="inline-flex items-center gap-3 rounded-xl border border-orange-200 bg-white px-6 py-3.5 text-sm font-semibold text-orange-600 transition hover:-translate-y-1 hover:bg-orange-50"
            >
              💬 แชทกับ AI (AI Chat)
            </Link>
          </div>

          {/* Live Weather card */}
          <LiveWeatherCard />
        </div>

        {/* Right food image */}
        <div className="relative mx-auto w-full max-w-lg">
          {/* Decorative circles */}
          <div className="absolute left-1/2 top-1/2 h-[85%] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-orange-200" />
          <div className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-orange-300" />

          {/* Main image */}
          <div className="relative mx-auto aspect-square w-[85%] overflow-hidden rounded-full border-[10px] border-white bg-white shadow-2xl shadow-orange-900/10">
            <Image
              src="/images/krapao1.png"
              alt="ข้าวกะเพราหมู"
              fill
              priority
              sizes="(max-width: 768px) 80vw, 400px"
              className="object-cover"
            />
          </div>

          {/* Floating cards */}
          <div className="absolute -right-2 top-10 rounded-2xl border border-orange-100 bg-white px-4 py-3 shadow-lg md:-right-5">
            <p className="text-sm font-semibold text-stone-700">
              ✨ เมนูที่เหมาะกับคุณ
            </p>
          </div>

          <div className="absolute -bottom-2 left-0 rounded-2xl border border-orange-100 bg-white px-4 py-3 shadow-lg md:-left-5">
            <p className="text-sm font-semibold text-stone-700">
              🍽️ อร่อยได้ในงบ
            </p>
          </div>

          {/* Decorations */}
          <span className="absolute -left-3 top-8 text-4xl text-orange-400">
            ✦
          </span>

          <span className="absolute -bottom-5 right-8 text-4xl text-orange-300">
            ✿
          </span>
        </div>
      </div>
    </section>
  );
}
