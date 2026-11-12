"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const cookingMethods = [
  { id: "ต้ม", name: "ต้ม", image: "/images/tomyum1.png" },
  { id: "ผัด", name: "ผัด", image: "/images/padkrapao.png" },
  { id: "ทอด", name: "ทอด", image: "/images/tonkatsu.jpg" },
  { id: "ย่าง", name: "ย่าง", image: "/images/grilledchicken.jpg" },
  { id: "แกง", name: "แกง", image: "/images/japancurry.png" },
  { id: "อบ", name: "อบ", image: "/images/pizza.png" },
];

export default function SubcategoryPage() {
  const router = useRouter();

  const handleSelectMethod = (methodId: string) => {
    router.push(`/category?cat=main-course&method=${encodeURIComponent(methodId)}`);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-stone-100 bg-white p-6 sm:p-8 md:p-10 shadow-xs space-y-7">
        {/* Header with Back Button matching Image 2 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-100 pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/category"
              className="flex items-center gap-1.5 rounded-2xl border border-stone-200 bg-stone-50 px-3.5 py-2 text-sm font-bold text-stone-700 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300 transition"
              title="ย้อนกลับไปเลือกหมวดหมู่หลัก"
            >
              <span>←</span>
              <span>ย้อนกลับ</span>
            </Link>

            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-orange-100 text-lg text-orange-600">
                🍳
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
                เลือกประเภทการปรุง
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-stone-400">
              หมวดที่เลือก:
            </span>
            <span className="rounded-xl bg-orange-50 px-3 py-1 text-sm font-bold text-orange-700 border border-orange-200">
              อาหารจานหลัก
            </span>
          </div>
        </div>

        {/* 6 Cooking Method Cards matching Image 2 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl">
          {cookingMethods.map((method) => (
            <button
              key={method.id}
              type="button"
              onClick={() => handleSelectMethod(method.id)}
              className="group flex flex-col items-center justify-center p-5 sm:p-7 rounded-3xl border border-stone-100 bg-[#FFFDFB] shadow-xs hover:border-orange-400 hover:shadow-lg hover:-translate-y-1 hover:bg-white transition-all duration-200 cursor-pointer text-center"
            >
              <div className="relative h-24 w-24 sm:h-28 sm:w-28 mb-3.5 rounded-2xl overflow-hidden bg-orange-50/50 flex items-center justify-center group-hover:scale-108 transition duration-300">
                <Image
                  src={method.image}
                  alt={method.name}
                  fill
                  sizes="112px"
                  className="object-contain p-2"
                />
              </div>
              <span className="text-base font-extrabold text-stone-800 group-hover:text-orange-600 transition">
                {method.name}
              </span>
              <span className="text-xs text-stone-400 mt-0.5">
                แตะเพื่อดูเมนู →
              </span>
            </button>
          ))}

          {/* Extra Card: ทุกประเภทการปรุง */}
          <button
            type="button"
            onClick={() => handleSelectMethod("all")}
            className="group flex flex-col items-center justify-center p-5 sm:p-7 rounded-3xl border border-dashed border-orange-300 bg-orange-50/40 shadow-xs hover:border-orange-500 hover:shadow-md hover:-translate-y-1 hover:bg-orange-50 transition-all duration-200 cursor-pointer text-center"
          >
            <div className="flex h-24 w-24 sm:h-28 sm:w-28 mb-3.5 rounded-2xl items-center justify-center bg-white text-3xl shadow-xs group-hover:scale-110 transition">
              ✨
            </div>
            <span className="text-base font-extrabold text-orange-600 transition">
              ทุกประเภทการปรุง
            </span>
            <span className="text-xs text-orange-400 mt-0.5">
              ดูทั้งหมดในหมวดนี้ →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
