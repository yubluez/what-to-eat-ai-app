"use client";

import { useEffect, useState } from "react";
import { defaultSettings, getSettings, saveSettings, getSavedPreferences, updateSavedPreferences, type UserSettings } from "@/lib/storage";
import { budgetPresets, meatDislikeOptions, allergenOptions } from "@/lib/foodPreferences";
import { popularCities } from "@/lib/weather";

export default function SettingsPage() {
  const [settings, setSettingsState] = useState<UserSettings>(defaultSettings);
  const [budgetDraft, setBudgetDraft] = useState("");
  const [restrictions, setRestrictions] = useState({ excludedFoods: [] as string[], allergies: [] as string[] });
  const [restrictionDraft, setRestrictionDraft] = useState(restrictions);
  const [notifications, setNotifications] = useState(true);
  const [activeModal, setActiveModal] = useState<"city" | "budget" | "restrictions" | "api" | null>(null);
  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => {
    setSettingsState(getSettings());
    const saved = getSavedPreferences();
    setRestrictions({ excludedFoods: Array.isArray(saved.excludedFoods) ? saved.excludedFoods : [], allergies: Array.isArray(saved.allergies) ? saved.allergies : [] });
  }, []);

  const handleUpdateSetting = (patch: Partial<UserSettings>) => {
    const updated = { ...settings, ...patch };
    setSettingsState(updated);
    saveSettings(patch);
    setActiveModal(null);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  const handleReset = () => {
    if (confirm("คุณต้องการล้างข้อมูลความต้องการและประวัติทั้งหมดใช่หรือไม่?")) {
      localStorage.removeItem("whatToEatPreferences");
      localStorage.removeItem("whatToEatHistory");
      setRestrictions({ excludedFoods: [], allergies: [] });
      alert("ล้างข้อมูลเรียบร้อยแล้ว");
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 pb-6">
      {/* Header matching Mockup 10 */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="text-xl text-stone-700">⚙️</span>
          <h1 className="text-xl font-bold text-stone-900 sm:text-2xl">
            ตั้งค่า
          </h1>
        </div>

        {savedToast && (
          <span className="text-sm font-bold text-green-600 animate-fade-in">
            ✓ บันทึกแล้ว
          </span>
        )}
      </div>

      {/* Settings List Container matching Mockup 10 */}
      <div className="rounded-3xl border border-stone-100 bg-white shadow-xs divide-y divide-stone-100 overflow-hidden">
        {/* Row 1: ตำแหน่ง / เมือง */}
        <div
          onClick={() => setActiveModal("city")}
          className="flex items-center justify-between gap-3 p-4 sm:px-6 sm:py-5 hover:bg-orange-50/40 cursor-pointer transition"
        >
          <div className="flex items-center gap-3.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-base">
              📍
            </span>
            <span className="text-base font-bold text-stone-800">
              ตำแหน่ง / เมือง
            </span>
          </div>

          <div className="flex min-w-0 items-center gap-2 text-right">
            <span className="text-sm font-semibold text-stone-500">
              {settings.city}
            </span>
            <span className="text-stone-400 font-bold text-sm">›</span>
          </div>
        </div>

        {/* Row 2: งบประมาณเริ่มต้น */}
        <button type="button"
          onClick={() => { setBudgetDraft(settings.defaultBudget?.toString() ?? ""); setActiveModal("budget"); }}
          className="flex w-full items-center justify-between gap-3 text-left p-4 sm:px-6 sm:py-5 hover:bg-orange-50/40 cursor-pointer transition"
        >
          <div className="flex items-center gap-3.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-base">
              💰
            </span>
            <span className="text-base font-bold text-stone-800">
              งบประมาณเริ่มต้น
            </span>
          </div>

          <div className="flex min-w-0 items-center gap-2 text-right">
            <span className="text-sm font-semibold text-stone-500">
              {settings.defaultBudget ? `ไม่เกิน ${settings.defaultBudget} บาท` : "ไม่จำกัดงบ"}
            </span>
            <span className="text-stone-400 font-bold text-sm">›</span>
          </div>
        </button>

        {/* Row 3: ข้อจำกัดด้านอาหาร */}
        <button type="button"
          onClick={() => { setRestrictionDraft(restrictions); setActiveModal("restrictions"); }}
          className="flex w-full items-center justify-between gap-3 text-left p-4 sm:px-6 sm:py-5 hover:bg-orange-50/40 cursor-pointer transition"
        >
          <div className="flex items-center gap-3.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-base">
              🍲
            </span>
            <span className="text-base font-bold text-stone-800">
              ข้อจำกัดด้านอาหาร
            </span>
          </div>

          <div className="flex min-w-0 items-center gap-2 text-right">
            <span className="text-sm font-semibold text-stone-500">
              {[restrictions.excludedFoods.length ? `เลี่ยง ${restrictions.excludedFoods.length} รายการ` : "", restrictions.allergies.length ? `แพ้ ${restrictions.allergies.length} รายการ` : ""].filter(Boolean).join(" · ") || "ยังไม่ได้ระบุ"}
            </span>
            <span className="text-stone-400 font-bold text-sm">›</span>
          </div>
        </button>

        {/* Row 4: การแจ้งเตือน (Toggle switch) */}
        <div className="flex items-center justify-between gap-3 p-4 sm:px-6 sm:py-5">
          <div className="flex items-center gap-3.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-base">
              🔔
            </span>
            <span className="text-base font-bold text-stone-800">
              การแจ้งเตือน
            </span>
          </div>

          <button
            type="button"
            onClick={() => setNotifications(!notifications)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
              notifications ? "bg-orange-500" : "bg-stone-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                notifications ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Row 5: Gemini AI Key */}
        <div
          onClick={() => setActiveModal("api")}
          className="flex items-center justify-between gap-3 p-4 sm:px-6 sm:py-5 hover:bg-orange-50/40 cursor-pointer transition"
        >
          <div className="flex items-center gap-3.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-base">
              ✨
            </span>
            <span className="text-base font-bold text-stone-800">
              การเชื่อมต่อ Gemini AI API
            </span>
          </div>

          <div className="flex min-w-0 items-center gap-2 text-right">
            <span className="text-sm font-semibold text-stone-400 font-mono">
              {settings.geminiApiKey ? "••••••••" : "ใช้ Smart Local Engine"}
            </span>
            <span className="text-stone-400 font-bold text-sm">›</span>
          </div>
        </div>
      </div>

      {/* Reset Link */}
      <div className="text-center pt-2">
        <button
          type="button"
          onClick={handleReset}
          className="text-sm text-stone-400 hover:text-red-500 underline"
        >
          รีเซ็ตข้อมูลความต้องการและประวัติทั้งหมด
        </button>
      </div>

      {/* ===== Modals for settings items ===== */}
      {activeModal === "city" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-xs">
          <div className="max-h-[90dvh] w-full max-w-sm overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl space-y-4 animate-fade-in">
            <h3 className="font-bold text-stone-800 text-sm">เลือกตำแหน่ง / เมือง</h3>
            <div className="space-y-2">
              {popularCities.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleUpdateSetting({ city: c.name })}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl text-sm font-bold border transition ${
                    settings.city === c.name
                      ? "border-orange-500 bg-orange-50 text-orange-600"
                      : "border-stone-100 bg-white text-stone-700 hover:border-orange-200"
                  }`}
                >
                  <span>{c.name}</span>
                  <span>~{c.baseTemp}°C</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="w-full rounded-xl bg-stone-100 py-2.5 text-sm font-bold text-stone-600"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      )}

      {(activeModal === "budget" || activeModal === "restrictions") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-xs">
          <form
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-editor-title"
            className="max-h-[90dvh] w-full max-w-lg space-y-5 overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
            onSubmit={(event) => {
              event.preventDefault();
              if (activeModal === "budget") {
                const budget = budgetDraft === "" ? null : Number(budgetDraft);
                if (budget !== null && (!Number.isSafeInteger(budget) || budget <= 0)) return;
                updateSavedPreferences({ budget });
                handleUpdateSetting({ defaultBudget: budget });
              } else {
                updateSavedPreferences(restrictionDraft);
                setRestrictions(restrictionDraft);
                handleUpdateSetting({});
              }
            }}
          >
            <h2 id="settings-editor-title" className="text-lg font-bold text-stone-900">
              {activeModal === "budget" ? "กำหนดงบประมาณเริ่มต้น" : "ข้อจำกัดด้านอาหาร"}
            </h2>
            {activeModal === "budget" ? (
              <div className="space-y-3">
                <label className="block text-sm font-semibold" htmlFor="default-budget">งบสูงสุดต่อมื้อ (บาท)</label>
                <input
                  id="default-budget"
                  type="number"
                  min={1}
                  step={1}
                  placeholder="เว้นว่างเพื่อไม่จำกัดงบ"
                  value={budgetDraft}
                  onChange={(event) => setBudgetDraft(event.target.value)}
                  className="w-full rounded-xl border border-stone-300 p-3"
                />
                <div className="flex flex-wrap gap-2">
                  {[...budgetPresets.map(String), ""].map((value) => (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={budgetDraft === value}
                      onClick={() => setBudgetDraft(value)}
                      className="rounded-xl border border-stone-200 px-3 py-2 text-sm aria-pressed:border-orange-500 aria-pressed:bg-orange-50"
                    >
                      {value ? `${value} บาท` : "ไม่จำกัดงบ"}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              ([
                ["excludedFoods", "อาหารที่ไม่รับประทาน", meatDislikeOptions],
                ["allergies", "สารก่อภูมิแพ้", allergenOptions],
              ] as const).map(([key, title, options]) => (
                <fieldset key={key} className="space-y-2">
                  <legend className="mb-2 font-semibold text-stone-800">{title}</legend>
                  {options.map(({ id, label }) => (
                    <label key={id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-stone-100 px-3 py-2 text-sm">
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-orange-600"
                        checked={restrictionDraft[key].includes(id)}
                        onChange={(event) => {
                          const checked = event.target.checked;
                          setRestrictionDraft((draft) => ({
                            ...draft,
                            [key]: checked ? [...draft[key], id] : draft[key].filter((item) => item !== id),
                          }));
                        }}
                      />
                      {label}
                    </label>
                  ))}
                </fieldset>
              ))
            )}
            <div className="flex gap-2">
              <button type="button" onClick={() => setActiveModal(null)} className="flex-1 rounded-xl bg-stone-100 py-2.5 text-sm font-bold text-stone-700">
                ยกเลิก
              </button>
              <button type="submit" className="flex-1 rounded-xl bg-orange-600 py-2.5 text-sm font-bold text-white">
                บันทึก
              </button>
            </div>
          </form>
        </div>
      )}
      {activeModal === "api" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-xs">
          <div className="max-h-[90dvh] w-full max-w-sm overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl space-y-4 animate-fade-in">
            <h3 className="font-bold text-stone-800 text-sm">Gemini API Key</h3>
            <p className="text-sm text-stone-500">
              ใส่ Google Gemini API Key เพื่อเปิดใช้งานโมเดล GenAI ตอบคำถามในแชท
            </p>
            <input
              type="password"
              defaultValue={settings.geminiApiKey}
              id="apiKeyInput"
              placeholder="AIzaSy..."
              className="w-full rounded-xl border border-stone-200 p-3 text-sm outline-none focus:border-orange-500 font-mono"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="flex-1 rounded-xl bg-stone-100 py-2.5 text-sm font-bold text-stone-600"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={() => {
                  const val = (document.getElementById("apiKeyInput") as HTMLInputElement)?.value || "";
                  handleUpdateSetting({ geminiApiKey: val.trim() });
                }}
                className="flex-1 rounded-xl bg-orange-500 py-2.5 text-sm font-bold text-white shadow-xs"
              >
                บันทึก Key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
