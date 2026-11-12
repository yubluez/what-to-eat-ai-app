"use client";

import { useEffect, useState } from "react";
import { isFavorite, toggleFavorite } from "@/lib/storage";

export default function FavoriteButton({
  foodId,
  foodName,
  compact = false,
}: {
  foodId: string;
  foodName: string;
  compact?: boolean;
}) {
  const [favorite, setFavorite] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setFavorite(isFavorite(foodId));
  }, [foodId]);

  const handleToggle = () => {
    const newState = toggleFavorite(foodId);
    setFavorite(newState);
    setToast(newState ? `บันทึก "${foodName}" แล้ว ❤️` : `ลบออกจากรายการโปรดแล้ว`);
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div className="relative inline-block">
      {compact ? (
        <button
          type="button"
          onClick={handleToggle}
          className={`flex h-10 w-10 items-center justify-center rounded-full border shadow-xs transition hover:scale-110 ${
            favorite
              ? "border-red-200 bg-red-50 text-red-500 text-lg"
              : "border-stone-200 bg-white text-stone-400 hover:text-red-500 text-base"
          }`}
          title={favorite ? "นำออกจากรายการโปรด" : "เพิ่มในรายการโปรด"}
        >
          {favorite ? "❤️" : "🤍"}
        </button>
      ) : (
        <button
          type="button"
          onClick={handleToggle}
          className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-semibold transition ${
            favorite
              ? "border-red-200 bg-red-50 text-red-600 shadow-xs"
              : "border-stone-200 bg-white text-stone-700 hover:border-orange-300 hover:bg-orange-50"
          }`}
        >
          <span>{favorite ? "❤️" : "🤍"}</span>
          <span>{favorite ? "บันทึกในรายการโปรดแล้ว" : "เพิ่มในรายการโปรด"}</span>
        </button>
      )}

      {toast && (
        <div className="absolute right-0 -top-10 whitespace-nowrap rounded-xl bg-stone-900/90 px-3 py-1.5 text-xs font-medium text-white shadow-lg transition z-30">
          {toast}
        </div>
      )}
    </div>
  );
}
