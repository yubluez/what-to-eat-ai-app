import { notFound } from "next/navigation";
import { foods } from "@/database/foods";
import FoodDetailView from "@/components/FoodDetailView";

export const instant = false;

export function generateStaticParams() {
  return foods.map((food) => ({
    id: food.id,
  }));
}

type FoodDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function FoodDetailPage({ params }: FoodDetailPageProps) {
  const { id } = await params;
  const food = foods.find((item) => item.id === id);

  if (!food) {
    notFound();
  }

  return <FoodDetailView food={food} />;
}
