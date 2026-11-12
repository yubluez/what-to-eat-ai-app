import Link from "next/link";
import { categories } from "@/database/foods";

export default function CategorySection() {
  return (
    <section id="categories" className="py-16 md:py-20">
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <span className="text-sm font-bold tracking-[2px] text-orange-500">
            FIND YOUR FAVORITE
          </span>

          <h2 className="mt-2 text-2xl font-bold text-stone-800 md:text-3xl">
            อยากกินอะไรวันนี้?
          </h2>

          <p className="mt-2 text-sm text-stone-500">
            เลือกหมวดหมู่อาหารที่คุณสนใจได้เลย
          </p>
        </div>

        <Link
          href="/category"
          className="shrink-0 text-sm font-semibold text-orange-500 transition hover:text-orange-700 md:text-sm"
        >
          ดูเมนูทั้งหมด →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        {categories.map((category) => (
          <Link
            href={category.id === "world-food" ? "/category" : `/category?cat=${category.id}`}
            key={category.id}
            className={`${category.color} group flex min-h-[105px] items-center gap-3 rounded-2xl border border-white p-3 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-900/5 md:gap-4 md:p-5`}
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/80 text-2xl md:h-14 md:w-14 md:text-3xl">
              {category.emoji}
            </div>

            <div className="min-w-0">
              <h3 className="text-sm font-bold text-stone-800 md:text-sm">
                {category.name}
              </h3>

              <p className="mt-1 text-xs text-stone-500 md:text-sm">
                {category.englishName}
              </p>
            </div>

            <span className="ml-auto text-sm text-stone-400 transition group-hover:translate-x-1 group-hover:text-orange-500">
              ↗
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
