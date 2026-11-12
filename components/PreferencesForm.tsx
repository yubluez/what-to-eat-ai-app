"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { budgetPresets, meatDislikeOptions, allergenOptions } from "@/lib/foodPreferences";
import { defaultSettings, getSettings, getSavedPreferences } from "@/lib/storage";


const spicyLevels = [
  { value: "any", label: "ทุกระดับ", emoji: "✨" },
  { value: "0", label: "ไม่เผ็ด", emoji: "🌱" },
  { value: "1", label: "เผ็ดน้อย", emoji: "🌶️" },
  { value: "2", label: "เผ็ดกลาง", emoji: "🌶️🌶️" },
  { value: "3", label: "เผ็ดมาก", emoji: "🔥" },
];

const cuisineOptions = [
  { value: "all", label: "ทุกสัญชาติ", emoji: "🌏" },
  { value: "อาหารไทย", label: "อาหารไทย", emoji: "🇹🇭" },
  { value: "อาหารญี่ปุ่น", label: "อาหารญี่ปุ่น", emoji: "🇯🇵" },
  { value: "อาหารเกาหลี", label: "อาหารเกาหลี", emoji: "🇰🇷" },
  { value: "อาหารจีน", label: "อาหารจีน", emoji: "🇨🇳" },
  { value: "อาหารอิตาลี", label: "อาหารอิตาลี", emoji: "🇮🇹" },
  { value: "อาหารอเมริกัน", label: "อาหารอเมริกัน", emoji: "🇺🇸" },
  { value: "อาหารอินเดีย", label: "อาหารอินเดีย", emoji: "🇮🇳" },
  { value: "อาหารนานาชาติ", label: "อาหารนานาชาติ", emoji: "🌐" },
];



export default function PreferencesForm() {
  const router = useRouter();

  const [budget, setBudget] = useState(String(defaultSettings.defaultBudget));
  const [spicy, setSpicy] = useState("any");
  const [cuisine, setCuisine] = useState("all");
  const [excludedFoods, setExcludedFoods] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [selectorOpen, setSelectorOpen] = useState(false);

  useEffect(() => {
    try {
      const parsed = getSavedPreferences();
      const savedBudget = parsed.budget === undefined ? getSettings().defaultBudget : parsed.budget;
      setBudget(savedBudget === null ? "any" : String(savedBudget));
      {
        if (parsed.spicy !== undefined) {
          setSpicy(parsed.spicy === null ? "any" : String(parsed.spicy));
        }
        if (parsed.cuisine) {
          setCuisine(parsed.cuisine);
        }
        if (Array.isArray(parsed.excludedFoods)) {
          setExcludedFoods(parsed.excludedFoods);
        }
        if (Array.isArray(parsed.allergies)) {
          setAllergies(parsed.allergies);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const toggleExcluded = (id: string) => {
    setExcludedFoods((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleAllergy = (id: string) => {
    setAllergies((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const resetAllFilters = () => {
    setBudget("any");
    setSpicy("any");
    setCuisine("all");
    setExcludedFoods([]);
    setAllergies([]);
    localStorage.removeItem("whatToEatPreferences");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const preferences = {
      budget: budget === "any" ? null : Number(budget),
      spicy: spicy === "any" ? null : Number(spicy),
      cuisine: cuisine || "all",
      excludedFoods,
      allergies,
    };

    localStorage.setItem("whatToEatPreferences", JSON.stringify(preferences));
    router.push("/recommendation");
  };

  const totalRestrictionsCount = excludedFoods.length + allergies.length;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-3xl border border-stone-100 bg-white p-6 sm:p-8 md:p-10 shadow-xs space-y-7">
        
        {/* 1. สัญชาติอาหาร (Cuisine) */}
        <div>
          <label className="block text-sm font-bold text-stone-800 mb-2.5">
            สัญชาติอาหารที่ต้องการ
          </label>
          <div className="flex flex-wrap gap-2">
            {cuisineOptions.map((c) => {
              const isSelected = cuisine === c.value;
              return (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setCuisine(c.value)}
                  className={`flex items-center gap-1.5 rounded-2xl border px-3.5 py-2 text-sm font-bold transition ${
                    isSelected
                      ? "border-orange-500 bg-[#FFF0E2] text-orange-600 ring-2 ring-orange-200 shadow-xs"
                      : "border-stone-200 bg-white text-stone-600 hover:border-orange-200 hover:bg-orange-50/40"
                  }`}
                >
                  <span>{c.emoji}</span>
                  <span>{c.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. งบประมาณ (ต่อมื้อ) */}
        <div>
          <label className="block text-sm font-bold text-stone-800 mb-2">
            งบประมาณ (ต่อมื้อ)
          </label>
          <div className="relative">
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full appearance-none rounded-2xl border border-stone-200 bg-white px-5 py-3.5 text-sm font-semibold text-stone-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 cursor-pointer"
            >
              <option value="any">ไม่จำกัดงบประมาณ</option>
              {Array.from(new Set([...budgetPresets, 50, 70, 200, ...(budget === "any" ? [] : [Number(budget)])])).sort((a, b) => a - b).map((amount) => (
                <option key={amount} value={amount}>
                  ไม่เกิน {amount} บาท
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-stone-400 text-sm">
              ▼
            </span>
          </div>
        </div>

        {/* 3. ระดับความเผ็ด */}
        <div>
          <label className="block text-sm font-bold text-stone-800 mb-2.5">
            ระดับความเผ็ด
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {spicyLevels.map((lvl) => {
              const isSelected = spicy === lvl.value;
              return (
                <button
                  key={lvl.value}
                  type="button"
                  onClick={() => setSpicy(lvl.value)}
                  className={`flex items-center justify-center gap-1.5 rounded-2xl border py-3 px-3 text-sm font-bold transition ${
                    isSelected
                      ? "border-orange-500 bg-[#FFF0E2] text-orange-600 ring-2 ring-orange-200 shadow-xs"
                      : "border-stone-200 bg-white text-stone-600 hover:border-orange-200 hover:bg-orange-50/40"
                  }`}
                >
                  <span>{lvl.emoji}</span>
                  <span>{lvl.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. อาหารที่ไม่รับประทาน / สารก่อภูมิแพ้ */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-bold text-stone-800">
              ข้อจำกัดด้านอาหาร & สารก่อภูมิแพ้
            </label>
            {totalRestrictionsCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  setExcludedFoods([]);
                  setAllergies([]);
                }}
                className="text-sm text-stone-400 hover:text-red-500 transition"
              >
                ล้างทั้งหมด ({totalRestrictionsCount})
              </button>
            )}
          </div>

          <div
            onClick={() => setSelectorOpen(!selectorOpen)}
            className="min-h-[52px] rounded-2xl border border-stone-200 bg-white p-2.5 flex flex-wrap items-center gap-2 cursor-pointer transition focus-within:border-orange-500"
          >
            {excludedFoods.map((id) => {
              const item = meatDislikeOptions.find((r) => r.id === id);
              return (
                <span
                  key={`exc-${id}`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-amber-50 border border-amber-200 px-3 py-1 text-sm font-semibold text-amber-800"
                >
                  <span>🚫 ไม่ทาน: {item ? item.label : id}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExcluded(id);
                    }}
                    className="hover:text-red-600 p-0.5 text-xs"
                  >
                    ✕
                  </button>
                </span>
              );
            })}

            {allergies.map((id) => {
              const item = allergenOptions.find((r) => r.id === id);
              return (
                <span
                  key={`all-${id}`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-red-50 border border-red-200 px-3 py-1 text-sm font-semibold text-red-700"
                >
                  <span>⚠️ แพ้: {item ? item.label : id}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAllergy(id);
                    }}
                    className="hover:text-red-600 p-0.5 text-xs"
                  >
                    ✕
                  </button>
                </span>
              );
            })}

            {totalRestrictionsCount === 0 && (
              <span className="text-sm text-stone-400 pl-2">
                แตะเพื่อระบุเนื้อสัตว์ที่ไม่รับประทาน หรือสารก่อภูมิแพ้...
              </span>
            )}

            <span className="ml-auto pr-2 text-stone-400 text-sm select-none">
              ▼
            </span>
          </div>

          {/* Restriction Options Popover */}
          {selectorOpen && (
            <div className="mt-2.5 rounded-2xl border border-orange-100 bg-[#FFFDFB] p-4 shadow-lg z-20 space-y-3.5">
              {/* Meat Dislikes */}
              <div>
                <p className="text-sm font-bold text-stone-700 mb-2 flex items-center gap-1.5">
                  <span>🚫</span>
                  <span>เนื้อสัตว์ที่ไม่รับประทาน (คัดกรองเฉพาะจานที่มีเนื้อสัตว์นี้):</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {meatDislikeOptions.map((opt) => {
                    const isChecked = excludedFoods.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => toggleExcluded(opt.id)}
                        className={`rounded-xl px-3 py-1.5 text-sm font-semibold border transition ${
                          isChecked
                            ? "bg-amber-500 text-white border-amber-500 shadow-xs"
                            : "bg-white text-stone-700 border-stone-200 hover:border-amber-300"
                        }`}
                      >
                        {opt.label} {isChecked && "✓"}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Allergens */}
              <div className="pt-2 border-t border-stone-100">
                <p className="text-sm font-bold text-stone-700 mb-2 flex items-center gap-1.5">
                  <span>⚠️</span>
                  <span>สารก่อภูมิแพ้ (คัดกรองความปลอดภัยสูงสุด 100%):</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {allergenOptions.map((opt) => {
                    const isChecked = allergies.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => toggleAllergy(opt.id)}
                        className={`rounded-xl px-3 py-1.5 text-sm font-semibold border transition ${
                          isChecked
                            ? "bg-red-500 text-white border-red-500 shadow-xs"
                            : "bg-white text-stone-700 border-stone-200 hover:border-red-300"
                        }`}
                      >
                        {opt.label} {isChecked && "✓"}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Buttons: Submit & Reset */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="submit"
            className="flex-1 w-full rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 py-4 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:from-orange-600 hover:to-amber-600 hover:-translate-y-0.5"
          >
            ค้นหาเมนูที่ AI แนะนำ →
          </button>

          <button
            type="button"
            onClick={resetAllFilters}
            className="w-full sm:w-auto px-5 py-4 rounded-2xl border border-stone-200 text-sm font-bold text-stone-500 hover:bg-stone-50 hover:text-stone-700 transition"
          >
            ↺ ล้างค่าทั้งหมด
          </button>
        </div>
      </div>
    </form>
  );
}
