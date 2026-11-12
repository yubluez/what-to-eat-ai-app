import { foods, type Food } from "@/database/foods";
import type { WeatherData } from "./weather";

function matchesSubCategory(food: Food, subCategory: string) {
  switch (subCategory) {
    case "ต้ม/แกง":
      return ["ต้ม/แกง", "ต้ม", "แกง"].includes(food.subCategory ?? "");
    case "ย่าง/อบ":
      return ["ย่าง/อบ", "ย่าง", "อบ"].includes(food.subCategory ?? "");
    case "เส้น/ผัด":
      return food.subCategory === "เส้น/ผัด" || food.id === "F038";
    default:
      return food.subCategory === subCategory;
  }
}
export type Preferences = {
  budget: number | null;
  spicy: number | null;
  cuisine: string;
  excludedFoods: string[];
  allergies: string[];
  subCategory?: string;
  category?: string;
};

// แปลงค่าที่อาจได้รับจากหน้า Preferences ให้เป็นรูปแบบมาตรฐาน
function normalizePreference(value: string): string {
  return value.trim().toLowerCase();
}

// คำที่ใช้ตรวจสอบอาหารที่ผู้ใช้ไม่รับประทาน (กรองเฉพาะเมนูที่มีเนื้อสัตว์ประเภทนั้นเป็นหลัก ไม่กรองเครื่องปรุงรส)
const excludedKeywords: Record<string, string[]> = {
  beef: ["เนื้อวัว", "เนื้อวัวบด", "เนื้อสเต๊ก", "เบอร์เกอร์เนื้อ", "beef"],
  pork: ["หมู", "เนื้อหมู", "หมูสับ", "หมูกรอบ", "ขาหมู", "หมูทอด", "pork"],
  chicken: ["ไก่", "เนื้อไก่", "อกไก่", "สะโพกไก่", "chicken"],

  seafood: [
    "กุ้ง",
    "ปู",
    "หอย",
    "ปลาหมึก",
    "ปลาแซลมอน",
    "ปลาทูน่า",
    "เนื้อปลา",
    "อาหารทะเล",
    "seafood",
    "shrimp",
    "prawn",
    "crab",
    "squid",
    "salmon",
  ],

  fish: ["ปลา", "เนื้อปลา", "ปลาแซลมอน", "ปลาทูน่า", "fish", "salmon", "tuna"],
  peanut: ["ถั่วลิสง", "peanut"],
};

// รองรับค่าที่อาจส่งมาจากหน้า Preferences ทั้งภาษาไทยและอังกฤษ
const excludedAliases: Record<string, string> = {
  seafood: "seafood",
  อาหารทะเล: "seafood",
  ไม่กินอาหารทะเล: "seafood",
  ไม่รับประทานอาหารทะเล: "seafood",

  fish: "fish",
  ปลา: "fish",
  ไม่กินปลา: "fish",
  ไม่รับประทานปลา: "fish",

  beef: "beef",
  เนื้อวัว: "beef",
  ไม่กินเนื้อ: "beef",
  ไม่กินเนื้อวัว: "beef",

  pork: "pork",
  หมู: "pork",
  เนื้อหมู: "pork",
  ไม่กินหมู: "pork",

  chicken: "chicken",
  ไก่: "chicken",
  เนื้อไก่: "chicken",
  ไม่กินไก่: "chicken",

  peanut: "peanut",
  ถั่วลิสง: "peanut",
  ไม่กินถั่ว: "peanut",
};

// แมปชื่อสารก่อภูมิแพ้ทั้งภาษาไทยและอังกฤษเป็น Canonical ID
const allergyAliases: Record<string, string> = {
  peanut: "peanut",
  ถั่วลิสง: "peanut",
  แพ้ถั่วลิสง: "peanut",

  shellfish: "shellfish",
  สัตว์น้ำเปลือกแข็ง: "shellfish",
  แพ้สัตว์น้ำเปลือกแข็ง: "shellfish",
  กุ้ง: "shellfish",
  ปู: "shellfish",
  หอย: "shellfish",

  fish: "fish",
  ปลา: "fish",
  แพ้ปลา: "fish",

  milk: "milk",
  นม: "milk",
  แพ้นม: "milk",

  egg: "egg",
  ไข่: "egg",
  แพ้ไข่: "egg",

  soy: "soy",
  ถั่วเหลือง: "soy",
  แพ้ถั่วเหลือง: "soy",

  wheat: "wheat",
  ข้าวสาลี: "wheat",
  แป้งสาลี: "wheat",
  กลูเตน: "wheat",
  gluten: "wheat",

  sesame: "sesame",
  งา: "sesame",
};

// คำที่บ่งบอกสารก่อภูมิแพ้ในวัตถุดิบ (Secondary Safety Check)
const allergenSafetyKeywords: Record<string, string[]> = {
  shellfish: [
    "กุ้ง",
    "ปู",
    "หอย",
    "ปลาหมึก",
    "น้ำมันหอย",
    "ซอสหอยนางรม",
    "กะปิ",
    "shrimp",
    "prawn",
    "crab",
    "shellfish",
    "oyster",
    "squid",
  ],
  fish: ["ปลา", "น้ำปลา", "fish", "fish sauce", "salmon", "tuna"],
  peanut: ["ถั่วลิสง", "peanut"],
  milk: ["นม", "ชีส", "เนย", "ครีม", "โยเกิร์ต", "milk", "cheese", "butter"],
  egg: ["ไข่", "egg"],
  soy: ["ถั่วเหลือง", "ซีอิ๊ว", "เต้าหู้", "เต้าเจี้ยว", "soy", "tofu"],
  wheat: [
    "ข้าวสาลี",
    "แป้งสาลี",
    "เส้นสปาเกตตี",
    "เส้นราเมง",
    "แป้งพิซซ่า",
    "wheat",
    "flour",
  ],
  sesame: ["งา", "น้ำมันงา", "sesame"],
};

function normalizeExcludedFood(value: string): string {
  const normalized = normalizePreference(value);
  return excludedAliases[normalized] ?? normalized;
}

function normalizeAllergy(value: string): string {
  const normalized = normalizePreference(value);
  return allergyAliases[normalized] ?? normalized;
}

// ตรวจสอบว่าเมนูมีส่วนผสมที่ผู้ใช้ไม่รับประทานหรือไม่ (เน้นที่ชื่ออาหาร วัตถุดิบหลัก)
function containsExcludedFood(food: Food, excluded: string[]) {
  const text = [
    food.name,
    food.englishName,
    food.description,
    ...food.ingredients,
  ]
    .join(" ")
    .toLowerCase();

  return excluded.some((item) => {
    const normalizedItem = normalizeExcludedFood(item);
    const keywords = excludedKeywords[normalizedItem] ?? [normalizedItem];

    return keywords.some((keyword) => text.includes(keyword.toLowerCase()));
  });
}

// ตรวจสอบสารก่อภูมิแพ้
function hasAllergen(food: Food, allergies: string[]) {
  const foodAllergens = food.allergens.map(normalizePreference);
  const text = [
    food.name,
    food.englishName,
    food.description,
    ...food.ingredients,
  ]
    .join(" ")
    .toLowerCase();

  return allergies.some((allergy) => {
    const canonical = normalizeAllergy(allergy);

    // 1. ตรวจสอบจาก tags สารก่อภูมิแพ้โดยตรง
    if (foodAllergens.includes(canonical)) {
      return true;
    }

    // 2. ตรวจสอบเชิงลึกจากชื่อและวัตถุดิบ (Secondary Safety Check)
    const safetyKeywords = allergenSafetyKeywords[canonical] ?? [];
    return safetyKeywords.some((keyword) =>
      text.includes(keyword.toLowerCase()),
    );
  });
}

// ตรวจสอบว่าเมนูผ่านเงื่อนไขทั้งหมดหรือไม่
function isEligible(food: Food, preferences: Preferences) {
  // 1. กรองงบประมาณ
  if (preferences.budget !== null && food.price > preferences.budget) {
    return false;
  }

  // 2. กรองอาหารที่ไม่รับประทาน
  if (containsExcludedFood(food, preferences.excludedFoods)) {
    return false;
  }

  // 3. กรองสารก่อภูมิแพ้
  if (preferences.allergies.length > 0) {
    if (hasAllergen(food, preferences.allergies)) {
      return false;
    }

    // ไม่แนะนำเมนูที่ยังไม่มีข้อมูลสารก่อภูมิแพ้ครบถ้วน
    if (food.allergenInfoComplete !== true) {
      return false;
    }
  }

  // 4. กรองระดับความเผ็ด
  if (preferences.spicy !== null && food.spicyLevel > preferences.spicy) {
    return false;
  }

  // 5. กรองประเภทอาหาร
  if (preferences.cuisine !== "all" && food.cuisine !== preferences.cuisine) {
    return false;
  }

  // 6. กรองประเภทอาหารย่อย (ถ้ามีการระบุ)
  if (
    preferences.subCategory &&
    preferences.subCategory !== "all" &&
    !matchesSubCategory(food, preferences.subCategory)
  ) {
    return false;
  }

  // 7. กรองหมวดหมู่หลัก (ถ้ามีการระบุ เช่น Drinks, Dessert)
  if (
    preferences.category &&
    preferences.category !== "all" &&
    food.category !== preferences.category
  ) {
    return false;
  }

  return true;
}

// คำนวณคะแนนตามสัดส่วนน้ำหนัก 5 ปัจจัย (หัวข้อที่ 4 ในเอกสาร):
// 1. ประเภทอาหาร 30%
// 2. สภาพอากาศ 25%
// 3. ความชอบส่วนบุคคล (ระดับความเผ็ด) 20%
// 4. ช่วงเวลา 10%
// 5. ราคา 15%
function calculateScore(
  food: Food,
  preferences: Preferences,
  weather?: WeatherData
) {
  let score = 0;

  // 1. คะแนนประเภทอาหาร (30%)
  if (preferences.cuisine !== "all" && food.cuisine === preferences.cuisine) {
    score += 30;
  } else if (preferences.cuisine === "all") {
    score += 24;
  } else {
    score += 10;
  }

  // คะแนนประเภทอาหารย่อย (Subcategory โบนัส)
  if (preferences.subCategory && preferences.subCategory !== "all") {
    if (matchesSubCategory(food, preferences.subCategory)) {
      score += 10;
    }
  }

  // 2. คะแนนสภาพอากาศ (25%)
  if (weather) {
    const isSoupOrWarm =
      matchesSubCategory(food, "ต้ม/แกง") ||
      food.subCategory === "เส้น/ผัด" ||
      food.name.includes("ต้ม") ||
      food.name.includes("ซุป") ||
      food.name.includes("ราเมง");

    const isRefreshingOrDessert =
      food.category === "Dessert" ||
      food.subCategory === "ของว่าง" ||
      food.name.includes("ส้มตำ") ||
      food.name.includes("ยำ") ||
      food.name.includes("ซูชิ") ||
      food.name.includes("บิงซู");

    if (weather.condition === "rain") {
      // ฝนตก: เน้นอาหารร้อน อาหารน้ำ ซดคล่องคอ
      score += isSoupOrWarm ? 25 : isRefreshingOrDessert ? 8 : 16;
    } else if (weather.condition === "hot" || weather.temperature >= 32) {
      // อากาศร้อน: เน้นสดชื่น ทานง่าย ไม่ร้อนเหงื่อแตก
      score += isRefreshingOrDessert ? 25 : isSoupOrWarm ? 12 : 20;
    } else if (weather.condition === "cold" || weather.temperature <= 26) {
      // อากาศเย็น: เมนูซุป รสจัด อุ่นท้อง
      score += isSoupOrWarm ? 25 : 18;
    } else {
      score += 20;
    }
  } else {
    score += 20;
  }

  // 3. ความชอบส่วนบุคคล (20%) - ระดับความเผ็ด
  if (preferences.spicy !== null) {
    if (food.spicyLevel === preferences.spicy) {
      score += 20;
    } else if (Math.abs(food.spicyLevel - preferences.spicy) === 1) {
      score += 14;
    } else {
      score += 8;
    }
  } else {
    score += 18;
  }

  // 4. ช่วงเวลา (10%)
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) {
    // ช่วงเช้า: อาหารเช้า ของว่าง โจ๊ก ข้าวผัด แพนเค้ก
    const isBreakfast =
      food.subCategory === "ของว่าง" ||
      food.name.includes("แพนเค้ก") ||
      food.name.includes("เกี๊ยว") ||
      food.cookingTime <= 15;
    score += isBreakfast ? 10 : 6;
  } else if (hour >= 11 && hour < 15) {
    // กลางวัน: จานด่วน ข้าว กะเพรา ราเมง
    const isLunch = food.category === "Main Course" && food.cookingTime <= 25;
    score += isLunch ? 10 : 7;
  } else {
    // เย็น/ค่ำ: อาหารมื้อหนัก อิ่มอร่อย
    score += 10;
  }

  // 5. ความเหมาะสมของราคา (15%)
  if (preferences.budget !== null) {
    const diff = preferences.budget - food.price;
    if (diff >= 0) {
      // อยู่ในงบ: ยิ่งราคาสมเหตุสมผลยิ่งได้คะแนนดี
      const ratio = 1 - food.price / (preferences.budget * 1.5);
      score += Math.max(8, Math.min(15, Math.round(ratio * 15)));
    } else {
      score += 0;
    }
  } else {
    score += 15;
  }

  return score;
}

// สร้างคำอธิบายเหตุผลการแนะนำแบบ Generative AI Style (หัวข้อที่ 4 ส่วนที่ 3)
export function generateRecommendationReason(
  food: Food,
  preferences: Preferences,
  weather?: WeatherData
): string {
  const reasons: string[] = [];

  // เหตุผลด้านงบประมาณ
  if (preferences.budget !== null) {
    reasons.push(`ราคา ฿${food.price} อยู่ในงบที่คุณตั้งไว้ (ไม่เกิน ${preferences.budget} บาท)`);
  } else {
    reasons.push(`ราคาคุ้มค่าเพียง ฿${food.price}`);
  }

  // เหตุผลด้านรสชาติ/ความเผ็ด
  const spicyLabels = ["ไม่เผ็ด ทานง่าย", "เผ็ดน้อยกำลังดี", "เผ็ดปานกลางกลมกล่อม", "รสชาติเผ็ดจัดจ้าน"];
  reasons.push(spicyLabels[food.spicyLevel] ?? "รสชาติกลมกล่อม");

  // เหตุผลด้านสภาพอากาศ
  if (weather) {
    if (weather.condition === "rain") {
      if (matchesSubCategory(food, "ต้ม/แกง") || food.name.includes("ซุป") || food.name.includes("ต้ม")) {
        reasons.push(`เหมาะกับช่วงฝนตกที่ต้องการซุปร้อนๆ คลายชื้น`);
      }
    } else if (weather.condition === "hot" || weather.temperature >= 32) {
      if (food.category === "Dessert" || food.subCategory === "ของว่าง" || food.spicyLevel <= 1) {
        reasons.push(`เหมาะกับวันที่อากาศร้อน ช่วยให้สดชื่นทานสบาย`);
      }
    } else if (weather.condition === "cold") {
      reasons.push(`เหมาะกับอากาศเย็น ช่วยให้อุ่นสบายท้อง`);
    }
  }

  // เหตุผลด้านความปลอดภัยและข้อจำกัด
  if (preferences.allergies.length > 0) {
    reasons.push("ปลอดภัยจากสารก่อภูมิแพ้ที่คุณระบุ");
  }
  if (preferences.excludedFoods.length > 0) {
    reasons.push("ไม่มีวัตถุดิบที่คุณต้องการหลีกเลี่ยง");
  }

  return `แนะนำ ${food.name} เพราะ${reasons.join(" ")}`;
}

// ฟังก์ชันหลักสำหรับแนะนำอาหาร
export function getRecommendations(
  preferences: Preferences,
  weather?: WeatherData,
  limit: number = 3
) {
  return foods
    .filter((food) => isEligible(food, preferences))
    .map((food) => ({
      ...food,
      score: calculateScore(food, preferences, weather),
      aiReason: generateRecommendationReason(food, preferences, weather),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
