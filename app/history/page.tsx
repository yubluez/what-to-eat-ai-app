"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getHistory, clearHistory, type HistoryItem } from "@/lib/storage";

export default function HistoryPage() {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  useEffect(() => {
    setMounted(true);
    setHistoryItems(getHistory());
  }, []);

  const handleClear = () => {
    if (confirm("คุณต้องการล้างประวัติการแนะนำทั้งหมดใช่หรือไม่?")) {
      clearHistory();
      setHistoryItems([]);
      setSelectedItem(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 pb-6">
      {/* Header matching Mockup 9 */}
      <div className="flex items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="text-xl text-orange-500">⏱️</span>
          <h1 className="text-xl font-bold text-stone-900 sm:text-2xl">
            ประวัติการแนะนำ
          </h1>
        </div>

        {historyItems.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="shrink-0 px-2 py-2 text-sm font-semibold text-red-600 hover:underline"
          >
            ล้างประวัติ
          </button>
        )}
      </div>

      {!mounted ? (
        <div className="py-20 text-center text-stone-400 text-sm">
          กำลังโหลดประวัติ...
        </div>
      ) : historyItems.length > 0 ? (
        <div className="space-y-6">
          {/* History Group matching Mockup 9 */}
          <div>
            <span className="block text-sm font-bold text-stone-400 mb-2.5">
              ล่าสุด
            </span>

            <div className="space-y-2.5">
              {historyItems.map((item) => {
                const firstFood = item.recommendations[0];
                const count = item.recommendations.length;
                const criteriaStr = [
                  item.preferences.cuisine !== "all" ? item.preferences.cuisine : "ทุกสัญชาติ",
                  item.preferences.budget ? `งบไม่เกิน ${item.preferences.budget} บาท` : null,
                  item.preferences.spicy !== null ? `เผ็ด ${item.preferences.spicy}` : null,
                ]
                  .filter(Boolean)
                  .join(", ");

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(selectedItem?.id === item.id ? null : item)}
                    className="flex flex-col rounded-2xl border border-stone-100 bg-white p-4 sm:p-5 shadow-xs transition hover:border-orange-200 hover:shadow-sm cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      {/* Thumbnail */}
                      <div className="relative h-12 w-12 shrink-0 rounded-xl overflow-hidden bg-orange-100">
                        {firstFood ? (
                          <Image
                            src={firstFood.image}
                            alt={firstFood.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center text-xl">
                            🍲
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <p className="text-base font-bold text-stone-800">
                          แนะนำ {count} เมนู ({criteriaStr})
                        </p>
                        <p className="mt-1 text-sm text-stone-500">
                          {item.dateText} {item.weather && `· ${item.weather.city} ${item.weather.temperature}°C`}
                        </p>
                      </div>

                      {/* Chevron */}
                      <span className="text-stone-400 text-sm font-bold">
                        {selectedItem?.id === item.id ? "▼" : "›"}
                      </span>
                    </div>

                    {/* Expanded details */}
                    {selectedItem?.id === item.id && (
                      <div className="mt-4 pt-3 border-t border-stone-100 grid grid-cols-1 md:grid-cols-3 gap-3 animate-fade-in">
                        {item.recommendations.map((food) => (
                          <Link
                            key={food.id}
                            href={`/food/${food.id}`}
                            className="flex items-center gap-2 p-2 rounded-xl bg-orange-50/50 border border-orange-100 hover:bg-orange-50"
                          >
                            <div className="relative h-10 w-10 shrink-0 rounded-lg overflow-hidden bg-orange-100">
                              <Image
                                src={food.image}
                                alt={food.name}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-base font-bold text-stone-800 break-words">
                                {food.name}
                              </p>
                              <span className="text-xs font-semibold text-orange-500">
                                ฿{food.price}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-stone-100 bg-white px-5 py-10 text-center sm:p-12">
          <span className="text-4xl">📜</span>
          <h2 className="mt-3 text-lg font-bold text-stone-800">
            ยังไม่มีประวัติการแนะนำ
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            เมื่อระบบทำการคัดเลือกอาหารให้คุณ รายการจะถูกบันทึกที่นี่โดยอัตโนมัติ
          </p>
          <Link
            href="/preferences"
            className="mt-5 inline-block rounded-2xl bg-orange-500 px-6 py-2.5 text-sm font-bold text-white shadow-xs hover:bg-orange-600"
          >
            เริ่มต้นค้นหาเมนู
          </Link>
        </div>
      )}
    </div>
  );
}
