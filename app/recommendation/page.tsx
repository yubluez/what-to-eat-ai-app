"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { getRecommendations, type Preferences } from "@/lib/recommendation";
import { getLocalWeather } from "@/lib/weather";
import { getSettings, addHistory, isFavorite, toggleFavorite } from "@/lib/storage";

type RecommendedFood = ReturnType<typeof getRecommendations>[number];

const defaultPreferences: Preferences = {
  budget: null,
  spicy: null,
  cuisine: "all",
  excludedFoods: [],
  allergies: [],
};

export default function RecommendationPage() {
  const [recommendations, setRecommendations] = useState<RecommendedFood[]>([]);
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);
  const [favMap, setFavMap] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);

  const initialized = useRef(false);

  const runRecommendation = useCallback((prefs: Preferences) => {
    try {
      const settings = getSettings();
      const currentWeather = getLocalWeather(settings.city);

      const results = getRecommendations(prefs, currentWeather, 3);
      setRecommendations(results);

      if (results.length > 0) {
        addHistory(prefs, results, currentWeather);
      }

      const initialFavs: Record<string, boolean> = {};
      results.forEach((f) => {
        initialFavs[f.id] = isFavorite(f.id);
      });
      setFavMap(initialFavs);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    setMounted(true);
    const saved = localStorage.getItem("whatToEatPreferences");

    const defaultBudget = getSettings().defaultBudget;
    let prefs = { ...defaultPreferences, budget: defaultBudget };
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        prefs = {
          budget: parsed.budget === undefined ? defaultBudget : parsed.budget,
          spicy: parsed.spicy ?? null,
          cuisine: parsed.cuisine ?? "all",
          excludedFoods: Array.isArray(parsed.excludedFoods) ? parsed.excludedFoods : [],
          allergies: Array.isArray(parsed.allergies) ? parsed.allergies : [],
          subCategory: parsed.subCategory ?? undefined,
        };
      } catch (e) {
        console.error(e);
      }
    }

    setPreferences(prefs);
    runRecommendation(prefs);
  }, [runRecommendation]);

  const handleToggleFav = (e: React.MouseEvent, foodId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = toggleFavorite(foodId);
    setFavMap((prev) => ({ ...prev, [foodId]: newState }));
  };

  const removeFilter = (filterType: "cuisine" | "budget" | "spicy" | "excluded" | "allergy", value?: string) => {
    const updated: Preferences = { ...preferences };

    if (filterType === "cuisine") updated.cuisine = "all";
    if (filterType === "budget") updated.budget = null;
    if (filterType === "spicy") updated.spicy = null;
    if (filterType === "excluded" && value) {
      updated.excludedFoods = updated.excludedFoods.filter((item) => item !== value);
    }
    if (filterType === "allergy" && value) {
      updated.allergies = updated.allergies.filter((item) => item !== value);
    }

    setPreferences(updated);
    localStorage.setItem("whatToEatPreferences", JSON.stringify(updated));
    runRecommendation(updated);
  };

  const handleRelaxFilters = () => {
    const relaxed: Preferences = {
      budget: null,
      spicy: null,
      cuisine: "all",
      excludedFoods: [],
      allergies: [],
    };
    setPreferences(relaxed);
    localStorage.setItem("whatToEatPreferences", JSON.stringify(relaxed));
    runRecommendation(relaxed);
  };

  const hasCustomFilters =
    (preferences.cuisine && preferences.cuisine !== "all") ||
    preferences.budget !== null ||
    preferences.spicy !== null ||
    preferences.excludedFoods.length > 0 ||
    preferences.allergies.length > 0;

  return (
    <div className="space-y-6">
      {/* Header matching Mockup 6 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-stone-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <h1 className="text-xl font-bold text-stone-900">
              เมนูที่ AI แนะนำสำหรับคุณ
            </h1>
          </div>
          <p className="mt-1 text-sm text-stone-500 font-medium">
            คัดเลือกอย่างฉลาดจากสภาพอากาศ งบประมาณ และความชอบของคุณ
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Link
            href="/chat"
            className="flex items-center gap-1.5 rounded-2xl bg-orange-50 px-3.5 py-2 text-sm font-bold text-orange-600 border border-orange-200 hover:bg-orange-100 transition"
          >
            <span>🤖</span>
            <span>คุยกับ AI เพิ่มเติม</span>
          </Link>

          <Link
            href="/preferences"
            className="flex items-center gap-1.5 rounded-2xl border border-stone-200 bg-white px-3.5 py-2 text-sm font-bold text-stone-700 hover:border-orange-300 hover:text-orange-600 transition"
          >
            <span>⚙️</span>
            <span>ปรับเงื่อนไข</span>
          </Link>
        </div>
      </div>

      {/* Active Filter Pills (Removable) */}
      {hasCustomFilters && (
        <div className="flex flex-wrap items-center gap-2 p-3.5 rounded-2xl bg-[#FFFDFB] border border-orange-100/80">
          <span className="text-sm font-bold text-stone-600 mr-1 flex items-center gap-1">
            <span>🎯</span>
            <span>เงื่อนไขที่ใช้:</span>
          </span>

          {preferences.cuisine && preferences.cuisine !== "all" && (
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-orange-100/70 border border-orange-200 px-2.5 py-1 text-sm font-semibold text-orange-800">
              <span>หมวด: {preferences.cuisine}</span>
              <button
                type="button"
                onClick={() => removeFilter("cuisine")}
                className="hover:text-red-600 text-xs"
                title="ลบตัวกรองนี้"
              >
                ✕
              </button>
            </span>
          )}

          {preferences.budget !== null && (
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-green-100/70 border border-green-200 px-2.5 py-1 text-sm font-semibold text-green-800">
              <span>งบไม่เกิน ฿{preferences.budget}</span>
              <button
                type="button"
                onClick={() => removeFilter("budget")}
                className="hover:text-red-600 text-xs"
                title="ลบตัวกรองนี้"
              >
                ✕
              </button>
            </span>
          )}

          {preferences.spicy !== null && (
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-red-100/70 border border-red-200 px-2.5 py-1 text-sm font-semibold text-red-800">
              <span>
                เผ็ด: {preferences.spicy === 0 ? "ไม่เผ็ด" : `ระดับ ${preferences.spicy}/3`}
              </span>
              <button
                type="button"
                onClick={() => removeFilter("spicy")}
                className="hover:text-red-600 text-xs"
                title="ลบตัวกรองนี้"
              >
                ✕
              </button>
            </span>
          )}

          {preferences.excludedFoods.map((item) => (
            <span
              key={`ex-${item}`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-100/70 border border-amber-200 px-2.5 py-1 text-sm font-semibold text-amber-800"
            >
              <span>ไม่ทาน: {item}</span>
              <button
                type="button"
                onClick={() => removeFilter("excluded", item)}
                className="hover:text-red-600 text-xs"
                title="ลบตัวกรองนี้"
              >
                ✕
              </button>
            </span>
          ))}

          {preferences.allergies.map((item) => (
            <span
              key={`al-${item}`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-red-100/70 border border-red-300 px-2.5 py-1 text-sm font-semibold text-red-800"
            >
              <span>แพ้: {item}</span>
              <button
                type="button"
                onClick={() => removeFilter("allergy", item)}
                className="hover:text-red-600 text-xs"
                title="ลบตัวกรองนี้"
              >
                ✕
              </button>
            </span>
          ))}

          <button
            type="button"
            onClick={handleRelaxFilters}
            className="ml-auto text-sm font-bold text-orange-500 hover:text-orange-600 hover:underline"
          >
            ล้างตัวกรองทั้งหมด
          </button>
        </div>
      )}

      {!mounted ? (
        <div className="py-20 text-center text-stone-400 text-sm">
          กำลังค้นหาเมนูที่เหมาะสม...
        </div>
      ) : recommendations.length > 0 ? (
        /* 3 Cards Matching Mockup 6 */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {recommendations.map((food) => {
            const isFav = favMap[food.id];

            return (
              <Link
                key={food.id}
                href={`/food/${food.id}`}
                className="group flex flex-col overflow-hidden rounded-3xl border border-stone-100 bg-white shadow-xs transition hover:-translate-y-1 hover:shadow-md"
              >
                {/* Food Image with Heart Button on Top Right */}
                <div className="relative h-48 bg-orange-50">
                  <Image
                    src={food.image}
                    alt={food.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition duration-300"
                  />

                  <button
                    type="button"
                    onClick={(e) => handleToggleFav(e, food.id)}
                    className="absolute right-3.5 top-3.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-sm shadow-xs transition hover:scale-110"
                    title={isFav ? "นำออกจากรายการโปรด" : "เพิ่มในรายการโปรด"}
                  >
                    {isFav ? "❤️" : "🤍"}
                  </button>

                  <span className="absolute left-3.5 top-3.5 rounded-full bg-stone-900/75 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-xs">
                    {food.cuisine}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-sm text-stone-800 group-hover:text-orange-600 transition">
                      {food.name}
                    </h3>
                    <span className="font-extrabold text-sm text-orange-500">
                      ฿{food.price}
                    </span>
                  </div>

                  {/* AI Explanation Box */}
                  <p className="mt-2 text-sm text-stone-500 leading-5">
                    {food.aiReason.replace(`แนะนำ ${food.name} เพราะ`, "")}
                  </p>

                  <div className="mt-auto pt-3 border-t border-stone-50 flex items-center justify-between text-xs text-stone-400">
                    <span>🌶️ เผ็ด {food.spicyLevel}/3</span>
                    <span className="font-semibold text-orange-500 group-hover:translate-x-0.5 transition">
                      ดูวิธีทำ &gt;
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        /* Empty State with Helpful Relax Option */
        <div className="rounded-3xl bg-white border border-stone-100 p-10 md:p-14 text-center space-y-4">
          <span className="text-4xl inline-block">🍽️</span>
          <h2 className="text-lg font-bold text-stone-800">
            ยังไม่พบเมนูที่ตรงกับเงื่อนไขทั้งหมดในขณะนี้
          </h2>
          <p className="text-sm text-stone-500 max-w-md mx-auto">
            เงื่อนไขที่คุณเลือก (เช่น สัญชาติอาหาร งบประมาณ หรือข้อจำกัดด้านส่วนผสม) อาจจำกัดเกินไปสำหรับฐานข้อมูล 50 เมนู
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleRelaxFilters}
              className="rounded-2xl bg-orange-500 px-6 py-2.5 text-sm font-bold text-white shadow-xs hover:bg-orange-600 transition"
            >
              ✨ ผ่อนปรนเงื่อนไขและดูเมนูยอดนิยม
            </button>

            <Link
              href="/preferences"
              className="rounded-2xl border border-stone-200 bg-white px-6 py-2.5 text-sm font-bold text-stone-700 hover:border-orange-300 transition"
            >
              ⚙️ ปรับเงื่อนไขใหม่
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
