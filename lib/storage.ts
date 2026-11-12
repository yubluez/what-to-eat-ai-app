import { foods, type Food } from "@/database/foods";
import type { Preferences } from "./recommendation";
import type { WeatherData } from "./weather";

export type HistoryItem = {
  id: string;
  timestamp: number;
  dateText: string;
  preferences: Preferences;
  recommendations: Food[];
  weather?: WeatherData;
};

export type UserSettings = {
  city: string;
  defaultBudget: number | null;
  defaultSpicy: number | null;
  defaultCuisine: string;
  geminiApiKey: string;
};

const FAVORITES_KEY = "whatToEatFavorites";
const HISTORY_KEY = "whatToEatHistory";
const SETTINGS_KEY = "whatToEatSettings";

// ===== FAVORITES =====
export function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getFavoriteFoods(): Food[] {
  const ids = getFavorites();
  return foods.filter((f) => ids.includes(f.id));
}

export function isFavorite(foodId: string): boolean {
  return getFavorites().includes(foodId);
}

export function toggleFavorite(foodId: string): boolean {
  if (typeof window === "undefined") return false;
  const current = getFavorites();
  const exists = current.includes(foodId);
  const updated = exists
    ? current.filter((id) => id !== foodId)
    : [...current, foodId];

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return !exists;
}

// ===== HISTORY =====
export function getHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const history: HistoryItem[] = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(history)) return [];

    // Coalesce duplicate writes from older versions.
    return history.filter((item, index) => {
      const newer = history[index - 1];
      if (!newer) return true;
      if (item.id === newer.id) return false;
      if (item.id.includes("_", 5) || newer.id.includes("_", 5)) return true;

      return Math.abs(newer.timestamp - item.timestamp) > 1000 ||
        JSON.stringify(newer.preferences) !== JSON.stringify(item.preferences) ||
        JSON.stringify(newer.recommendations) !== JSON.stringify(item.recommendations) ||
        JSON.stringify(newer.weather) !== JSON.stringify(item.weather);
    });
  } catch {
    return [];
  }
}

export function addHistory(
  preferences: Preferences,
  recommendedFoods: Food[],
  weather?: WeatherData
) {
  if (typeof window === "undefined") return;
  try {
    const history = getHistory();
    const now = new Date();
    const newItem: HistoryItem = {
      id: "hist_" + now.getTime() + "_" + Math.random().toString(36).slice(2),
      timestamp: now.getTime(),
      dateText: now.toLocaleDateString("th-TH", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      preferences,
      recommendations: recommendedFoods,
      weather,
    };

    // Keep latest 20 items
    const updated = [newItem, ...history].slice(0, 20);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to add history", e);
  }
}

export function clearHistory() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(HISTORY_KEY);
}

// ===== SETTINGS =====
export const defaultSettings: UserSettings = {
  city: "กรุงเทพมหานคร",
  defaultBudget: 100,
  defaultSpicy: null,
  defaultCuisine: "all",
  geminiApiKey: "",
};

export function getSettings(): UserSettings {
  if (typeof window === "undefined") return defaultSettings;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return defaultSettings;
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: Partial<UserSettings>) {
  if (typeof window === "undefined") return;
  try {
    const current = getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save settings", e);
  }
}

export function getSavedPreferences(): Partial<import("./recommendation").Preferences> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem("whatToEatPreferences");
    return raw ? JSON.parse(raw) ?? {} : {};
  } catch {
    return {};
  }
}

export function updateSavedPreferences(patch: Partial<import("./recommendation").Preferences>) {
  localStorage.setItem("whatToEatPreferences", JSON.stringify({ ...getSavedPreferences(), ...patch }));
}