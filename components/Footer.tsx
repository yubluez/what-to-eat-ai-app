import Link from "next/link";

export default function Footer() {
  return (
    <footer id="about" className="border-t border-orange-100 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-10 md:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-2xl">
              🍲
            </span>

            <span className="text-xl font-bold text-stone-800">
              WhatToEat
              <span className="text-orange-500"> AI</span>
            </span>
          </Link>

          <p className="text-sm text-stone-500 max-w-md">
            ระบบเว็บแอปพลิเคชันแนะนำอาหารอัจฉริยะ (Personal AI Food Recommendation) ด้วยแนวคิด Hybrid Recommendation
          </p>

          <div className="text-sm text-stone-400">
            © 2026 WhatToEat AI · Next.js 16 & Tailwind CSS
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-stone-100 pt-6 text-sm text-stone-500">
          <Link href="/" className="hover:text-orange-600">หน้าหลัก</Link>
          <Link href="/category" className="hover:text-orange-600">หมวดหมู่ & วิธีปรุง</Link>
          <Link href="/preferences" className="hover:text-orange-600">เลือกความต้องการ</Link>
          <Link href="/chat" className="hover:text-orange-600">สนทนา AI (AI Chat)</Link>
          <Link href="/recommendation" className="hover:text-orange-600">เมนูแนะนำล่าสุด</Link>
          <Link href="/favorites" className="hover:text-orange-600">เมนูโปรด</Link>
          <Link href="/history" className="hover:text-orange-600">ประวัติการแนะนำ</Link>
          <Link href="/settings" className="hover:text-orange-600">ตั้งค่าระบบ</Link>
        </div>
      </div>
    </footer>
  );
}
