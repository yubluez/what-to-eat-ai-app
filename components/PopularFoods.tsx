"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { foods } from "@/database/foods";
import { getFavorites, toggleFavorite } from "@/lib/storage";

export default function PopularFoods() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  function handleToggleFavorite(e: React.MouseEvent, id: string) {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(id);
    setFavorites(getFavorites());
  }

  const popularPicks = foods.slice(0, 6);

  return (
    <section id="popular" className="py-8 md:py-12">
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <span className="text-sm font-bold tracking-[2px] text-orange-500">
            POPULAR PICKS
          </span>

          <h2 className="mt-2 text-2xl font-bold text-stone-800 md:text-3xl">
            เมนูยอดนิยม 🔥
          </h2>

          <p className="mt-2 text-sm text-stone-500">
            เมนูอาหารรสเลิศที่ได้รับความนิยมสูงสุด
          </p>
        </div>

        <Link
          href="/category"
          className="text-sm font-semibold text-orange-500 hover:text-orange-600 md:text-sm"
        >
          ดูทั้งหมด 30 เมนู →
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {popularPicks.map((food) => {
          const isFav = favorites.includes(food.id);

          return (
            <Link
              key={food.id}
              href={`/food/${food.id}`}
              className="group block overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-900/10"
            >
              <div className="relative h-56 overflow-hidden bg-orange-50">
                <Image
                  src={food.image}
                  alt={food.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />

                <button
                  type="button"
                  onClick={(e) => handleToggleFavorite(e, food.id)}
                  aria-label={
                    isFav
                      ? `นำ ${food.name} ออกจากรายการโปรด`
                      : `บันทึก ${food.name} เป็นรายการโปรด`
                  }
                  className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-lg shadow-md transition hover:scale-110 ${
                    isFav ? "text-red-500" : "text-stone-400 hover:text-red-500"
                  }`}
                >
                  {isFav ? "♥" : "♡"}
                </button>

                <div className="absolute bottom-3 left-3 flex gap-2">
                  <span className="rounded-full bg-white/95 px-3 py-1 text-sm font-semibold text-stone-700 shadow-sm">
                    {food.cuisine}
                  </span>
                  {food.subCategory && (
                    <span className="rounded-full bg-stone-900/80 px-2.5 py-1 text-sm font-medium text-white backdrop-blur-sm">
                      {food.subCategory}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-stone-800 group-hover:text-orange-600 transition">
                      {food.name}
                    </h3>

                    <p className="mt-1 text-sm text-stone-400">
                      {food.englishName}
                    </p>
                  </div>

                  <span className="shrink-0 text-lg font-bold text-orange-500">
                    ฿{food.price}
                  </span>
                </div>

                <p className="mt-3 line-clamp-2 text-sm leading-5 text-stone-500">
                  {food.description}
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-orange-50 pt-4 text-sm text-stone-400">
                  <span>🌶️ เผ็ด {food.spicyLevel}/3</span>
                  <span>⏱️ {food.cookingTime} นาที</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
