import Link from "next/link";

export default function AIBanner() {
  return (
    <section
      id="ai-chat"
      className="relative my-12 overflow-hidden rounded-3xl border border-orange-100 bg-gradient-to-r from-orange-50 via-[#fff3e9] to-amber-50 px-6 py-9 md:my-16 md:px-10 md:py-11"
    >
      <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-orange-200/30 blur-3xl" />

      <div className="relative flex flex-col gap-6 md:flex-row md:items-center">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
          ✨
        </div>

        <div className="flex-1">
          <span className="text-sm font-bold tracking-[2px] text-orange-500">
            HYBRID AI FOOD RECOMMENDATION
          </span>

          <h2 className="mt-2 text-xl font-bold text-stone-800 md:text-2xl">
            คิดไม่ออก ให้ WhatToEat AI ช่วยตัดสินใจ!
          </h2>

          <p className="mt-2 text-sm leading-7 text-stone-600">
            ไม่ว่าคุณจะชอบคุยแบบธรรมชาติกับ AI หรืออยากเลือกปรับงบประมาณและเงื่อนไขด้วยตัวเอง เราพร้อมคัดเลือกเมนูที่ดีที่สุดจาก 30 เมนูให้คุณทันที
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-3">
          <Link
            href="/chat"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-1 hover:bg-orange-600"
          >
            💬 สนทนากับ AI
          </Link>

          <Link
            href="/preferences"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-orange-200 bg-white px-5 py-3.5 text-sm font-semibold text-orange-600 transition hover:-translate-y-1 hover:bg-orange-50"
          >
            🎯 ระบุเงื่อนไขเอง
          </Link>
        </div>
      </div>
    </section>
  );
}
