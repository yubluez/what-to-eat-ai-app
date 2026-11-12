export type WeatherCondition = "hot" | "rain" | "cold" | "clear";

export type WeatherData = {
  city: string;
  temperature: number;
  condition: WeatherCondition;
  conditionText: string;
  emoji: string;
  humidity: number;
  description: string;
};

export const popularCities = [
  { id: "bangkok", name: "กรุงเทพมหานคร", baseTemp: 33, condition: "hot" as WeatherCondition },
  { id: "chiangmai", name: "เชียงใหม่", baseTemp: 26, condition: "clear" as WeatherCondition },
  { id: "phuket", name: "ภูเก็ต", baseTemp: 30, condition: "rain" as WeatherCondition },
  { id: "khonkaen", name: "ขอนแก่น", baseTemp: 32, condition: "hot" as WeatherCondition },
  { id: "chonburi", name: "ชลบุรี", baseTemp: 31, condition: "clear" as WeatherCondition },
];

export function getWeatherConditionInfo(condition: WeatherCondition, temp: number) {
  if (condition === "rain") {
    return {
      text: "ฝนตกปรอยๆ",
      emoji: "🌧️",
      desc: "อากาศชื้น ฝนตก เหมาะกับเมนูซุปร้อนๆ หรืออาหารประเภทน้ำคลายชื้น",
    };
  }
  if (temp >= 32 || condition === "hot") {
    return {
      text: "อากาศร้อนแดดจัด",
      emoji: "☀️",
      desc: "อากาศร้อน อุณหภูมิสูง เหมาะกับเมนูสดชื่น รับประทานง่าย หรือของหวานเย็นๆ",
    };
  }
  if (temp <= 25 || condition === "cold") {
    return {
      text: "อากาศเย็นสบาย",
      emoji: "🍃",
      desc: "อากาศเย็นกำลังดี เหมาะกับอาหารอุ่นๆ แกงร้อน หรือเมนูย่าง",
    };
  }
  return {
    text: "แจ่มใส ปลอดโปร่ง",
    emoji: "⛅",
    desc: "สภาพอากาศแจ่มใส สามารถรับประทานอาหารได้หลากหลายประเภท",
  };
}

export function getLocalWeather(cityName?: string): WeatherData {
  const selectedCity = popularCities.find(
    (c) => c.name === cityName || c.id === cityName?.toLowerCase()
  ) || popularCities[0];

  const info = getWeatherConditionInfo(selectedCity.condition, selectedCity.baseTemp);

  return {
    city: selectedCity.name,
    temperature: selectedCity.baseTemp,
    condition: selectedCity.condition,
    conditionText: info.text,
    emoji: info.emoji,
    humidity: selectedCity.condition === "rain" ? 82 : 58,
    description: info.desc,
  };
}
