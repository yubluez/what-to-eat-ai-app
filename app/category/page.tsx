"use client";

import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { categories, foods } from "@/database/foods";

const categoryImages: Record<string, string> = {
  "main-course": "/images/ramen.png",
  dessert: "/images/pancake.png",
  drinks: "/images/bobatea.jpg",
  snacks: "/images/shumai.jpg",
};

const mainCategories = categories.filter((category) => category.id in categoryImages);
// ข้อมูล 6 ประเภทการปรุง (ตรงตามรูปที่ 2: 3. หน้า Subcategory)
const cookingMethods = [
  { id: "ต้ม", name: "ต้ม", icon: "🍲", image: "/images/tomyum1.png" },
  { id: "ผัด", name: "ผัด", icon: "🍳", image: "/images/padkrapao.png" },
  { id: "ทอด", name: "ทอด", icon: "🍗", image: "/images/tonkatsu.jpg" },
  { id: "ย่าง", name: "ย่าง", icon: "🥩", image: "/images/grilledchicken.jpg" },
  { id: "แกง", name: "แกง", icon: "🥘", image: "/images/japancurry.png" },
  { id: "อบ", name: "อบ", icon: "🥧", image: "/images/pizza.png" },
];

function CategoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedCat = mainCategories.find((category) => category.id === searchParams.get("cat"));
  const isMainCourse = selectedCat?.id === "main-course";
  const methodParam = searchParams.get("method");
  const selectedMethodId =
    isMainCourse && (methodParam === "all" || cookingMethods.some((method) => method.id === methodParam))
      ? methodParam
      : null;

  const handleSelectCategory = (catId: string) => {
    router.push(`/category?cat=${encodeURIComponent(catId)}`);
  };

  const handleSelectMethod = (methodId: string) => {
    router.push(`/category?cat=main-course&method=${encodeURIComponent(methodId)}`);
  };

  const handleBackToStep1 = () => router.push("/category");
  const handleBackToStep2 = () => handleSelectCategory("main-course");

  const categoryFoods = foods.filter((food) => food.category === selectedCat?.englishName);
  const filteredFoods =
    selectedMethodId && selectedMethodId !== "all"
      ? categoryFoods.filter((food) => (food.subCategory === "เส้น/ผัด" ? "ผัด" : food.subCategory) === selectedMethodId)
      : categoryFoods;

  // =========================================================================
  // STEP 1: หน้าเลือกหมวดหมู่หลัก (ตรงตามรูปที่ 1: 2. หน้า Category)
  // =========================================================================
  if (!selectedCat) {
    return (
      <div className="space-y-6">
        <div className="rounded-3xl border border-stone-100 bg-white p-6 sm:p-8 md:p-10 shadow-xs space-y-7">
          {/* Header matching Image 1 */}
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-100 text-xl text-orange-600 border border-orange-200">
              🍱
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
              เลือกหมวดหมู่อาหาร
            </h1>
          </div>


          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {mainCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleSelectCategory(cat.id)}
                className="group flex flex-col items-center justify-center min-w-0 px-3 py-5 sm:px-5 sm:py-6 rounded-3xl border border-stone-100 bg-[#FFFDFB] shadow-xs hover:border-orange-400 hover:shadow-lg hover:-translate-y-1 hover:bg-white transition-all duration-200 cursor-pointer text-center"
              >
                <div className="relative aspect-square w-full max-w-24 sm:max-w-28 mb-3.5 rounded-2xl overflow-hidden bg-orange-50/50 flex items-center justify-center group-hover:scale-108 transition duration-300">
                  <Image
                    src={categoryImages[cat.id]}
                    alt={cat.name}
                    fill
                    sizes="112px"
                    className="object-contain p-2"
                  />
                </div>
                <span className="text-sm sm:text-base font-extrabold text-stone-800 group-hover:text-orange-600 transition">
                  {cat.name}
                </span>
                <span className="text-xs text-stone-400 mt-0.5">
                  {cat.id === "main-course" ? "เลือกวิธีปรุง →" : "ดูเมนู →"}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // STEP 2: หน้าเลือกประเภทการปรุง (ตรงตามรูปที่ 2: 3. หน้า Subcategory)
  // =========================================================================
  if (isMainCourse && !selectedMethodId) {
    return (
      <div className="space-y-6">
        <div className="rounded-3xl border border-stone-100 bg-white p-6 sm:p-8 md:p-10 shadow-xs space-y-7">
          {/* Header with Back Button matching Image 2 */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-100 pb-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleBackToStep1}
                className="flex items-center gap-1.5 rounded-2xl border border-stone-200 bg-stone-50 px-3.5 py-2 text-sm font-bold text-stone-700 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300 transition"
                title="ย้อนกลับไปเลือกหมวดหมู่หลัก"
              >
                <span>←</span>
                <span>ย้อนกลับ</span>
              </button>

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
                {selectedCat?.name}
              </span>
            </div>
          </div>

          {/* 6 Cooking Method Cards matching Image 2 */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
            {cookingMethods.map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => handleSelectMethod(method.id)}
                className="group flex flex-col items-center justify-center min-w-0 px-3 py-5 sm:px-5 sm:py-6 rounded-3xl border border-stone-100 bg-[#FFFDFB] shadow-xs hover:border-orange-400 hover:shadow-lg hover:-translate-y-1 hover:bg-white transition-all duration-200 cursor-pointer text-center"
              >
                <div className="relative aspect-square w-full max-w-24 sm:max-w-28 mb-3.5 rounded-2xl overflow-hidden bg-orange-50/50 flex items-center justify-center group-hover:scale-108 transition duration-300">
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
          </div>

          <div className="flex justify-center border-t border-stone-100 pt-5 sm:justify-end">
            <button
              type="button"
              onClick={() => handleSelectMethod("all")}
              className="w-full rounded-2xl border border-orange-200 bg-orange-50 px-5 py-3 text-sm font-bold text-orange-700 transition hover:bg-orange-100 sm:w-auto"
            >
              ดูทุกเมนูจานหลัก →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // STEP 3: หน้ารายการอาหาร (ตรงตามรูปที่ 3: Food Items Grid)
  // =========================================================================
  const displayCategoryName = selectedCat?.name || "ทั้งหมด";
  const displayMethodName =
    selectedMethodId && selectedMethodId !== "all"
      ? ` (ประเภท "${selectedMethodId}")`
      : "";

  return (
    <div className="space-y-6">
      {/* Top Header & Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-stone-200 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {isMainCourse && (
            <button
              type="button"
              onClick={handleBackToStep2}
              className="flex items-center gap-1.5 rounded-2xl border border-stone-200 bg-white px-3.5 py-2 text-sm font-bold text-stone-700 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50 transition"
            >
              <span>←</span>
              <span>เลือกประเภทการปรุงใหม่</span>
            </button>
          )}

          {/* Reset to Step 1 */}
          <button
            type="button"
            onClick={handleBackToStep1}
            className="flex items-center gap-1.5 rounded-2xl border border-stone-200 bg-white px-3 py-2 text-sm font-semibold text-stone-500 hover:text-stone-700 hover:bg-stone-50 transition"
          >
            <span>🍱</span>
            <span>เลือกหมวดหมู่หลัก</span>
          </button>
        </div>

        {/* AI Shortcut */}
        <Link
          href="/recommendation"
          className="text-sm font-bold text-orange-600 bg-orange-50 px-3.5 py-2 rounded-2xl border border-orange-200 hover:bg-orange-100 transition self-start sm:self-auto"
        >
          ✨ ให้ AI แนะนำในหมวดนี้
        </Link>
      </div>

      {/* Title bar exactly matching Image 3 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-1">
        <h2 className="text-sm font-bold text-stone-800">
          รายการอาหารหมวด &quot;{displayCategoryName}&quot;{displayMethodName}{" "}
          <span className="text-orange-500 font-extrabold">
            ({filteredFoods.length} เมนู)
          </span>
        </h2>

        <span className="text-sm text-stone-400">
          คลิกที่เมนูเพื่อดูสูตรและวิธีทำ
        </span>
      </div>

      {/* Food Cards Grid matching Image 3 */}
      {filteredFoods.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredFoods.map((food) => (
            <Link
              key={food.id}
              href={`/food/${food.id}`}
              className="group block overflow-hidden rounded-3xl border border-stone-100 bg-white shadow-xs transition hover:-translate-y-1 hover:shadow-md"
            >
              {/* Food Image with Badges */}
              <div className="relative h-44 bg-orange-50 overflow-hidden">
                <Image
                  src={food.image}
                  alt={food.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition duration-300"
                />

                {/* Cuisine Badge (Top-left) */}
                <span className="absolute left-3 top-3 rounded-full bg-stone-900/75 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-xs">
                  {food.cuisine}
                </span>

                {/* Price Badge in Orange (Top-right) */}
                <span className="absolute right-3 top-3 rounded-full bg-orange-500 px-2.5 py-0.5 text-xs font-extrabold text-white shadow-xs">
                  ฿{food.price}
                </span>
              </div>

              {/* Food Details */}
              <div className="p-3.5">
                <h3 className="font-bold text-sm text-stone-800 group-hover:text-orange-600 transition truncate">
                  {food.name}
                </h3>
                <p className="mt-1 text-sm text-stone-400 line-clamp-1">
                  {food.description}
                </p>

                {/* Bottom Bar: Spicy Level & Cooking Time */}
                <div className="mt-3 flex items-center justify-between text-xs text-stone-400 pt-2 border-t border-stone-50">
                  <span className="flex items-center gap-1">
                    <span>🌶️</span>
                    <span>เผ็ด {food.spicyLevel}/3</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span>⏱️</span>
                    <span>{food.cookingTime} นาที</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* Empty State with Fallback */
        <div className="rounded-3xl bg-white border border-stone-100 p-10 text-center space-y-3">
          <span className="text-4xl inline-block">🍽️</span>
          <h3 className="text-base font-bold text-stone-800">
            ยังไม่มีเมนูที่ตรงกับประเภทการปรุง &quot;{selectedMethodId}&quot; ในหมวดนี้
          </h3>
          <p className="text-sm text-stone-500">
            ลองเลือกประเภทการปรุงอื่น หรือกดดูทุกเมนูในหมวด &quot;{displayCategoryName}&quot;
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => handleSelectMethod("all")}
              className="rounded-2xl bg-orange-500 px-5 py-2 text-sm font-bold text-white shadow-xs hover:bg-orange-600"
            >
              ดูทุกเมนูในหมวดนี้ ({categoryFoods.length} เมนู)
            </button>
            <button
              type="button"
              onClick={handleBackToStep2}
              className="rounded-2xl border border-stone-200 px-5 py-2 text-sm font-bold text-stone-700 hover:bg-stone-50"
            >
              เลือกประเภทการปรุงใหม่
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CategoryPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-stone-400 text-sm">
          กำลังโหลดข้อมูลหมวดหมู่อาหาร...
        </div>
      }
    >
      <CategoryContent />
    </Suspense>
  );
}
