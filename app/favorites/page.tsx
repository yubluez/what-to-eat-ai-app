"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getFavoriteFoods, toggleFavorite } from "@/lib/storage";
import type { Food } from "@/database/foods";

export default function FavoritesPage() {
  const [favoriteFoods, setFavoriteFoods] = useState<Food[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setFavoriteFoods(getFavoriteFoods());
  }, []);

  const handleRemove = (e: React.MouseEvent, foodId: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(foodId);
    setFavoriteFoods(getFavoriteFoods());
  };

  return (
    <div className="space-y-6">
      {/* Header matching Mockup 8 */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="text-xl text-red-500">❤️</span>
          <h1 className="text-xl font-bold text-stone-900">
            เมนูโปรดของฉัน
          </h1>
        </div>

        {favoriteFoods.length > 0 && (
          <span className="text-sm text-stone-500 font-medium">
            บันทึกไว้ {favoriteFoods.length} เมนู
          </span>
        )}
      </div>

      {!mounted ? (
        <div className="py-20 text-center text-stone-400 text-sm">
          กำลังโหลดเมนูโปรด...
        </div>
      ) : favoriteFoods.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {favoriteFoods.map((food) => (
            <Link
              key={food.id}
              href={`/food/${food.id}`}
              className="group block overflow-hidden rounded-3xl border border-stone-100 bg-white shadow-xs transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative h-40 bg-orange-50">
                <Image
                  src={food.image}
                  alt={food.name}
                  fill
                  sizes="(max-width: 640px) 50vw, 20vw"
                  className="object-cover group-hover:scale-105 transition duration-300"
                />

                <button
                  type="button"
                  onClick={(e) => handleRemove(e, food.id)}
                  className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-red-500 text-sm shadow-xs hover:scale-110 transition"
                  title="ลบออกจากรายการโปรด"
                >
                  ❤️
                </button>
              </div>

              <div className="p-3.5">
                <h3 className="font-bold text-sm text-stone-800 truncate group-hover:text-orange-600 transition">
                  {food.name}
                </h3>
                <p className="mt-1 font-bold text-sm text-orange-500">
                  ฿{food.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-stone-100 bg-white p-12 text-center">
          <span className="text-4xl">❤️</span>
          <h2 className="mt-3 text-lg font-bold text-stone-800">
            ยังไม่มีเมนูโปรด
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            แตะไอคอนรูปหัวใจที่เมนูอาหารใดก็ได้ เพื่อบันทึกเก็บไว้ดูที่นี่
          </p>
          <Link
            href="/category"
            className="mt-5 inline-block rounded-2xl bg-orange-500 px-6 py-2.5 text-sm font-bold text-white shadow-xs hover:bg-orange-600"
          >
            สำรวจเมนูอาหาร
          </Link>
        </div>
      )}
    </div>
  );
}
