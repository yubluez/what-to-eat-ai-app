"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "หน้าหลัก", href: "/" },
  { name: "หมวดหมู่ & วิธีปรุง", href: "/category" },
  { name: "เลือกความต้องการ", href: "/preferences" },
  { name: "💬 สนทนา AI", href: "/chat" },
  { name: "❤️ เมนูโปรด", href: "/favorites" },
  { name: "📜 ประวัติ", href: "/history" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-orange-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 md:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-2xl shadow-xs">
            🍲
          </span>

          <span className="text-xl font-bold tracking-tight text-stone-800">
            WhatToEat
            <span className="text-orange-500"> AI</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 lg:flex">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition ${
                  isActive
                    ? "font-bold text-orange-600"
                    : "text-stone-600 hover:text-orange-500"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Settings & Mobile toggle */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/settings"
            title="การตั้งค่าระบบ"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-100 bg-white text-stone-600 shadow-xs transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
          >
            ⚙️
          </Link>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-100 bg-white text-stone-700 lg:hidden"
            aria-label="เปิดเมนูนำทาง"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-orange-100 bg-white px-5 py-4 lg:hidden">
          <nav className="flex flex-col space-y-3">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-orange-50 font-bold text-orange-600"
                      : "text-stone-700 hover:bg-orange-50/50"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
            <Link
              href="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2 text-sm font-medium text-stone-700 hover:bg-orange-50/50"
            >
              ⚙️ ตั้งค่าระบบ
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
