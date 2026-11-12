"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FavoriteButton from "@/components/FavoriteButton";
import type { Food } from "@/database/foods";

export default function FoodDetailView({ food }: { food: Food }) {
  const [activeTab, setActiveTab] = useState<"ingredients" | "instructions">("ingredients");

  const allergenNames: Record<string, string> = {
    peanut: "ถั่วลิสง",
    shellfish: "สัตว์น้ำเปลือกแข็ง",
    fish: "ปลา",
    milk: "นม",
    egg: "ไข่",
    soy: "ถั่วเหลือง",
    wheat: "ข้าวสาลี",
    sesame: "งา",
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4">
      {/* Back button matching Mockup 7 */}
      <Link
        href="/category"
        className="inline-flex items-center gap-2 text-sm font-bold text-stone-600 hover:text-orange-600 transition"
      >
        <span>←</span>
        <span>กลับ</span>
      </Link>

      {/* Main Card (Matching Mockup 7) */}
      <div className="rounded-3xl border border-stone-100 bg-white p-5 sm:p-8 xl:p-10 shadow-xs">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-8 xl:gap-12">
          {/* Left: Food Bowl Image */}
          <div className="flex min-w-0 justify-center">
            <div className="relative aspect-square w-full max-w-64 sm:max-w-80 xl:max-w-96 rounded-3xl overflow-hidden border-4 border-orange-50 shadow-xl shadow-orange-950/10 bg-orange-100">
              <Image
                src={food.image}
                alt={food.name}
                fill
                priority
                sizes="(min-width: 1280px) 384px, (min-width: 640px) 320px, 256px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Right: Food Info & Tabs */}
          <div className="min-w-0 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                  {food.name}
                </h1>
                <p className="mt-1 text-base text-stone-500">
                  {food.englishName}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <span className="text-2xl font-extrabold text-orange-500">
                  ฿{food.price}
                </span>
                <FavoriteButton foodId={food.id} foodName={food.name} compact />
              </div>
            </div>

            {/* Badges: Cuisine, Category, Cooking Method, Spicy */}
            <div className="flex flex-wrap gap-2 text-sm font-semibold">
              <span className="rounded-xl bg-orange-50 px-3 py-1 text-orange-700">
                {food.cuisine}
              </span>
              <span className="rounded-xl bg-stone-100 px-3 py-1 text-stone-700">
                {food.category}
              </span>
              {food.subCategory && (
                <span className="rounded-xl bg-amber-50 px-3 py-1 text-amber-800">
                  {food.subCategory}
                </span>
              )}
              <span className="rounded-xl bg-stone-100 px-3 py-1 text-stone-600">
                🌶️ เผ็ด {food.spicyLevel}/3
              </span>
              <span className="rounded-xl bg-stone-100 px-3 py-1 text-stone-600">
                ⏱️ {food.cookingTime} นาที
              </span>
            </div>

            <p className="text-base leading-7 text-stone-600">
              {food.description}
            </p>

            {/* Tabs matching Mockup 7: [ส่วนประกอบ] [วิธีทำ] */}
            <div className="pt-2">
              <div className="flex shrink-0 items-center gap-3 border-b border-stone-200">
                <button
                  type="button"
                  onClick={() => setActiveTab("ingredients")}
                  className={`py-2.5 text-base font-bold transition border-b-2 ${
                    activeTab === "ingredients"
                      ? "border-orange-500 text-orange-600"
                      : "border-transparent text-stone-400 hover:text-stone-700"
                  }`}
                >
                  ส่วนประกอบ ({food.ingredients.length})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("instructions")}
                  className={`py-2.5 text-base font-bold transition border-b-2 ${
                    activeTab === "instructions"
                      ? "border-orange-500 text-orange-600"
                      : "border-transparent text-stone-400 hover:text-stone-700"
                  }`}
                >
                  วิธีทำ ({food.instructions.length} ขั้นตอน)
                </button>
              </div>

              {/* Tab Content */}
              <div className="mt-4">
                {activeTab === "ingredients" ? (
                  <ul className="grid gap-2 text-base leading-7 text-stone-700 sm:grid-cols-2">
                    {food.ingredients.map((ing, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-orange-400 shrink-0" />
                        <span>{ing}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ol className="space-y-2.5 text-base text-stone-700">
                    {food.instructions.map((step, i) => (
                      <li key={i} className="flex gap-2.5">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-700">
                          {i + 1}
                        </span>
                        <span className="leading-7">{step}</span>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </div>

            {/* Allergens warning */}
            {food.allergens.length > 0 && (
              <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center gap-2 text-sm text-stone-600">
                <span className="text-amber-500">⚠️</span>
                <span>สารก่อภูมิแพ้:</span>
                <div className="flex flex-wrap gap-1.5">
                  {food.allergens.map((a) => (
                    <span
                      key={a}
                      className="rounded-md bg-red-50 px-2 py-0.5 text-red-600 font-semibold"
                    >
                      {allergenNames[a] || a}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
