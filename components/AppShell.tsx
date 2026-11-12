"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "หน้าแรก", href: "/", icon: "🏠" },
  { name: "เลือกอาหาร", href: "/category", icon: "🍲", matchPrefixes: ["/category", "/subcategory"] },
  { name: "แชทกับ AI", href: "/chat", icon: "💬" },
  { name: "เมนูโปรด", href: "/favorites", icon: "❤️" },
  { name: "ประวัติ", href: "/history", icon: "📜" },
  { name: "ตั้งค่า", href: "/settings", icon: "⚙️" },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-stone-800 flex">
      {/* ===== Desktop Sidebar (Screen left) ===== */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-[#F0EBE1] bg-white px-5 py-6 shrink-0 sticky top-0 h-screen overflow-y-auto">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 px-2 mb-8">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-2xl shadow-xs">
            👨‍🍳
          </div>
          <span className="text-xl font-bold tracking-tight text-stone-900">
            WhatToEat<span className="text-orange-500"> AI</span>
          </span>
        </Link>

        {/* Navigation List */}
        <nav className="flex-1 space-y-1.5">
          {navigation.map((item) => {
            const isMatch =
              pathname === item.href ||
              (item.matchPrefixes &&
                item.matchPrefixes.some((p) => pathname.startsWith(p)));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-semibold transition ${
                  isMatch
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20"
                    : "text-stone-600 hover:bg-orange-50/70 hover:text-orange-600"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer info */}
        <div className="mt-auto border-t border-stone-100 pt-4 px-2">
          <p className="text-xs text-stone-400">
            WhatToEat AI · Personal Food
          </p>
        </div>
      </aside>

      {/* ===== Mobile Navigation Drawer ===== */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative flex w-64 flex-col bg-white p-6 shadow-2xl z-10">
            <div className="flex items-center justify-between mb-6">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2"
              >
                <span className="text-2xl">👨‍🍳</span>
                <span className="text-lg font-bold text-stone-900">
                  WhatToEat<span className="text-orange-500"> AI</span>
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="text-stone-400 hover:text-stone-600 p-1 text-lg"
              >
                ✕
              </button>
            </div>

            <nav className="space-y-1.5">
              {navigation.map((item) => {
                const isMatch =
                  pathname === item.href ||
                  (item.matchPrefixes &&
                    item.matchPrefixes.some((p) => pathname.startsWith(p)));

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition ${
                      isMatch
                        ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20"
                        : "text-stone-600 hover:bg-orange-50/70 hover:text-orange-600"
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* ===== Main Content Area ===== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#F0EBE1] bg-[#FBF9F5]/90 px-5 md:px-8 backdrop-blur-md">
          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-700 shadow-xs lg:hidden"
            aria-label="เปิดเมนูนำทาง"
          >
            ☰
          </button>

          {/* Title or breadcrumb on left */}
          <div className="hidden lg:flex items-center gap-2 text-sm font-medium text-stone-400">
            <span>WhatToEat AI</span>
            <span>/</span>
            <span className="text-stone-600 font-semibold capitalize">
              {pathname === "/" ? "หน้าแรก" : pathname.replace("/", "")}
            </span>
          </div>

          {/* Right actions: Bell Notification + User Avatar */}
          <div className="ml-auto flex items-center gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-600 shadow-xs transition hover:border-orange-300 hover:text-orange-500"
                title="การแจ้งเตือน"
              >
                🔔
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-orange-500" />
              </button>

              {notificationOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-orange-100 bg-white p-4 shadow-xl z-50 text-sm">
                  <p className="font-bold text-stone-800">การแจ้งเตือน 🔔</p>
                  <p className="mt-2 text-stone-500">
                    ยินดีต้อนรับสู่ WhatToEat AI! วันนี้คุณมีเมนูที่อยากทานแล้วหรือยัง? ลองให้ AI ช่วยแนะนำได้เลยครับ
                  </p>
                </div>
              )}
            </div>

            {/* User Profile Avatar */}
            <Link
              href="/settings"
              className="flex items-center gap-2 rounded-full p-0.5 border border-orange-200 bg-orange-50 transition hover:ring-2 hover:ring-orange-200"
              title="ตั้งค่าผู้ใช้"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-orange-400 to-amber-300 text-base font-bold text-white shadow-xs">
                👤
              </div>
            </Link>
          </div>
        </header>

        {/* Main Content Body */}
        <div className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
