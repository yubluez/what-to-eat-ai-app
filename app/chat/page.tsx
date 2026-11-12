"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Food } from "@/database/foods";
import { getSettings } from "@/lib/storage";

type Message = {
  id: string;
  sender: "user" | "ai";
  text: string;
  recommendations?: Food[];
  timestamp?: string;
};

// ข้อมูลคำแนะนำและประโยคตัวอย่างสำหรับคุยกับ AI
const promptCategories = [
  { id: "all", label: "🌟 ทั้งหมด" },
  { id: "budget", label: "💰 งบประมาณ" },
  { id: "weather", label: "🌧️ อากาศ & อารมณ์" },
  { id: "restrictions", label: "🚫 ข้อจำกัด & แพ้อาหาร" },
  { id: "taste", label: "🌶️ รสชาติ & หมวดหมู่" },
  { id: "health", label: "🥗 สุขภาพ & จานด่วน" },
];

const promptSuggestions = [
  // Budget
  {
    category: "budget",
    icon: "💵",
    title: "งบ 70 บาท",
    prompt: "มีงบ 70 บาท แนะนำอาหารจานเดียวมื้อเที่ยงที่คุ้มค่าให้อิ่มอร่อยหน่อย",
  },
  {
    category: "budget",
    icon: "🍱",
    title: "งบ 150 บาท อาหารญี่ปุ่น",
    prompt: "มีงบ 150 บาท อยากกินอาหารญี่ปุ่น มีเมนูไหนแนะนำบ้าง",
  },
  {
    category: "budget",
    icon: "🍕",
    title: "งบไม่เกิน 200 บาท",
    prompt: "มีงบไม่เกิน 200 บาท อยากทานอาหารนานาชาติสไตล์พรีเมียม",
  },
  {
    category: "budget",
    icon: "🪙",
    title: "ประหยัด ไม่เกิน 60 บาท",
    prompt: "ช่วงนี้ต้องประหยัด มีงบไม่เกิน 60 บาท แนะนำเมนูให้หน่อย",
  },

  // Weather & Mood
  {
    category: "weather",
    icon: "🌧️",
    title: "วันฝนตก ซดซุปร้อนๆ",
    prompt: "วันนี้ฝนตก อากาศชื้น อยากกินอะไรร้อนๆ ซดคล่องคอ สบายท้อง",
  },
  {
    category: "weather",
    icon: "☀️",
    title: "วันแดดจัด เมนูสดชื่น",
    prompt: "อากาศร้อนอบอ้าวมาก ขอเมนูอาหารสดชื่น รับประทานง่าย ไม่เลี่ยน",
  },
  {
    category: "weather",
    icon: "💆",
    title: "เหนื่อยล้า ฮีลใจ",
    prompt: "ทำงานมาเหนื่อยๆ อยากกินของอร่อยรสกลมกล่อม ฮีลใจสักมื้อ",
  },
  {
    category: "weather",
    icon: "🍧",
    title: "ของหวานปิดท้าย",
    prompt: "ทานของคาวเสร็จแล้ว อยากกินของหวานเย็นๆ ปิดท้ายมื้ออาหาร",
  },

  // Restrictions & Allergies
  {
    category: "restrictions",
    icon: "🦐",
    title: "แพ้สัตว์น้ำเปลือกแข็ง",
    prompt: "ฉันแพ้สัตว์น้ำเปลือกแข็ง (กุ้ง ปู หอย) ขอเมนูที่ปลอดภัย 100%",
  },
  {
    category: "restrictions",
    icon: "🥩",
    title: "ไม่กินเนื้อและหมู",
    prompt: "ฉันไม่กินเนื้อวัวและเนื้อหมู ช่วยแนะนำเมนูไก่ ไข่ หรือผักหน่อย",
  },
  {
    category: "restrictions",
    icon: "🥜",
    title: "แพ้ถั่วลิสง",
    prompt: "แพ้ถั่วลิสงอย่างรุนแรง แนะนำเมนูอาหารไทยที่ปลอดภัยไร้ถั่วลิสง",
  },
  {
    category: "restrictions",
    icon: "🐟",
    title: "ไม่ทานอาหารทะเล",
    prompt: "ไม่รับประทานอาหารทะเลเลย แนะนำเมนูอาหารไทยรสเด็ดให้หน่อย",
  },

  // Taste & Category
  {
    category: "taste",
    icon: "🌶️",
    title: "รสจัดจ้าน แซ่บ",
    prompt: "วันนี้อยากกินอะไรเผ็ดๆ รสจัดจ้าน แซ่บตื่นตาแก้ง่วงยามบ่าย",
  },
  {
    category: "taste",
    icon: "🌱",
    title: "ไม่เผ็ด สำหรับเด็ก",
    prompt: "ขอเมนูรสชาติกลมกล่อม ไม่เผ็ดเลย เหมาะสำหรับเด็กหรือคนไม่ทานเผ็ด",
  },
  {
    category: "taste",
    icon: "🍜",
    title: "เมนูเส้น ผัดหอมๆ",
    prompt: "อยากกินเมนูเส้น ผัดหอมกลิ่นกระทะ เส้นเหนียวนุ่ม มีเมนูอะไรบ้าง",
  },
  {
    category: "taste",
    icon: "🍗",
    title: "เมนูทอดกรอบๆ",
    prompt: "วันนี้อยากกินเมนูทอดกรอบๆ จิ้มซอสอร่อยฟินๆ แนะนำหน่อย",
  },

  // Health & Fast
  {
    category: "health",
    icon: "🥗",
    title: "เมนูคลีน ผักเยอะ",
    prompt: "ช่วงนี้กำลังคุมน้ำหนัก ขอเมนูคลีนๆ มีผักเยอะ โปรตีนดี แคลอรีต่ำ",
  },
  {
    category: "health",
    icon: "⚡",
    title: "จานด่วน เร่งรีบ 15 นาที",
    prompt: "มีเวลาพักเที่ยงจำกัด 15 นาที ขอเมนูทำง่าย เสิร์ฟไว อิ่มเร็ว",
  },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "สวัสดีครับ! ผมคือ WhatToEat AI ผู้ช่วยแนะนำอาหารส่วนตัวของคุณ 🍽️\n\nบอกผมได้เลยว่าวันนี้อยากทานอะไร เช่น งบประมาณ, สภาพอากาศ, สัญชาติอาหาร, หรือข้อจำกัดที่คุณมี หรือแตะเลือก 'คำแนะนำประโยค' ด้านบนเพื่อเริ่มคุยได้ทันทีครับ!",
      timestamp: "ตอนนี้",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [showTips, setShowTips] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (customText?: string) => {
    const text = (customText || input).trim();
    if (!text || loading) return;

    const timeStr = new Date().toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const userMsg: Message = {
      id: "user_" + Date.now(),
      sender: "user",
      text,
      timestamp: timeStr,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const settings = getSettings();
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          city: settings.city,
          apiKey: settings.geminiApiKey,
        }),
      });

      const data = await res.json();
      const aiMsg: Message = {
        id: "ai_" + Date.now(),
        sender: "ai",
        text: data.reply || "ขออภัยครับ ไม่สามารถประมวลผลคำตอบได้ในขณะนี้",
        recommendations: data.recommendations,
        timestamp: new Date().toLocaleTimeString("th-TH", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: "err_" + Date.now(),
          sender: "ai",
          text: "ขออภัยครับ เกิดปัญหาในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง",
          timestamp: new Date().toLocaleTimeString("th-TH", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "welcome_" + Date.now(),
        sender: "ai",
        text: "เริ่มการสนทนาใหม่แล้วครับ! วันนี้คุณอยากรับประทานอะไรดีครับ?",
        timestamp: "ตอนนี้",
      },
    ]);
  };

  const filteredPrompts =
    activeCategory === "all"
      ? promptSuggestions
      : promptSuggestions.filter((p) => p.category === activeCategory);

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* 1. Header with Status & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-stone-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-2xl border border-orange-200">
            🤖
          </div>
          <div>
            <h1 className="text-xl font-bold text-stone-900">
              WhatToEat AI Chat Assistant
            </h1>
            <p className="text-sm text-stone-500 font-medium flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
              <span>ระบบอัจฉริยะแนะนำอาหารจากฐานข้อมูล 50 เมนู</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setShowTips(!showTips)}
            className="flex items-center gap-1.5 rounded-2xl border border-orange-200 bg-orange-50/80 px-3.5 py-2 text-sm font-bold text-orange-600 hover:bg-orange-100 transition"
          >
            <span>💡</span>
            <span>{showTips ? "ซ่อนคำแนะนำคุยกับ AI" : "ดูคำแนะนำคุยกับ AI"}</span>
          </button>

          <button
            type="button"
            onClick={handleClearChat}
            className="flex items-center gap-1.5 rounded-2xl border border-stone-200 bg-white px-3 py-2 text-sm font-bold text-stone-500 hover:text-stone-700 hover:bg-stone-50 transition"
            title="ล้างประวัติการคุย"
          >
            <span>🗑️</span>
            <span>ล้างแชท</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive AI Prompt Guide Section ("คำแนะนำที่ใช้คุยกับเอไอ") */}
      {showTips && (
        <section className="rounded-3xl border border-orange-100 bg-gradient-to-br from-[#FFFDF9] via-[#FFF9F2] to-[#FFF4E8] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">✨</span>
              <h2 className="text-sm font-extrabold text-stone-900">
                คำแนะนำและตัวอย่างประโยคที่ใช้คุยกับ AI
              </h2>
            </div>
            <span className="text-xs font-semibold text-orange-600 bg-orange-100/70 px-2.5 py-0.5 rounded-full">
              แตะประโยคเพื่อถามทันที
            </span>
          </div>

          {/* Prompt Category Pills */}
          <div className="flex flex-wrap gap-1.5">
            {promptCategories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`rounded-xl px-3 py-1.5 text-sm font-bold transition ${
                    isActive
                      ? "bg-orange-500 text-white shadow-xs"
                      : "bg-white text-stone-600 border border-stone-200/80 hover:border-orange-300"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Quick Clickable Prompt Chips Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
            {filteredPrompts.slice(0, 6).map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(item.prompt)}
                disabled={loading}
                className="group flex items-start gap-2 text-left p-3 rounded-2xl border border-orange-100 bg-white hover:border-orange-400 hover:shadow-xs transition duration-200"
              >
                <span className="text-base shrink-0 group-hover:scale-110 transition">
                  {item.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-stone-800 group-hover:text-orange-600 transition truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-stone-400 line-clamp-2 mt-0.5 leading-snug">
                    {item.prompt}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* 4 Golden Tips */}
          <div className="pt-2 border-t border-orange-200/50 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-stone-600">
            <span className="font-bold text-orange-700 flex items-center gap-1">
              <span>🎯</span>
              <span>เคล็ดลับให้ AI แนะนำได้แม่นยำที่สุด:</span>
            </span>
            <span>1. ระบุงบประมาณ</span>
            <span>2. ระบุสัญชาติหรือหมวด</span>
            <span>3. ระบุรสชาติ/ความเผ็ด</span>
            <span>4. ระบุสิ่งที่ไม่ทานหรือแพ้</span>
          </div>
        </section>
      )}

      {/* 3. Main Chat Conversation Box */}
      <div className="rounded-3xl border border-stone-100 bg-white p-5 md:p-6 shadow-xs flex flex-col h-[560px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "ai" && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-xl border border-orange-200 shadow-xs">
                  🤖
                </div>
              )}

              <div className="max-w-[85%] sm:max-w-[78%] space-y-3">
                <div
                  className={`rounded-3xl px-4 sm:px-5 py-3 text-sm leading-6 whitespace-pre-wrap ${
                    msg.sender === "user"
                      ? "bg-[#FFEAD7] text-stone-900 font-medium rounded-tr-xs"
                      : "bg-[#F7F7F8] text-stone-800 border border-stone-100 rounded-tl-xs"
                  }`}
                >
                  {msg.text}

                  {msg.timestamp && (
                    <div
                      className={`text-xs mt-1.5 text-stone-400 ${
                        msg.sender === "user" ? "text-right" : "text-left"
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  )}
                </div>

                {/* Recommended Dish Cards inside Chat */}
                {msg.recommendations && msg.recommendations.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {msg.recommendations.map((food) => (
                      <Link
                        key={food.id}
                        href={`/food/${food.id}`}
                        className="group flex items-center gap-3 rounded-2xl border border-orange-100 bg-[#FFFDFB] p-2.5 transition hover:border-orange-300 hover:shadow-sm"
                      >
                        <div className="relative h-16 w-16 shrink-0 rounded-xl overflow-hidden bg-orange-50">
                          <Image
                            src={food.image}
                            alt={food.name}
                            fill
                            sizes="64px"
                            className="object-cover group-hover:scale-105 transition"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-xs font-semibold text-stone-400">
                            {food.cuisine}
                          </span>
                          <p className="text-sm font-bold text-stone-800 truncate group-hover:text-orange-600 transition">
                            {food.name}
                          </p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-sm font-extrabold text-orange-500">
                              ฿{food.price}
                            </span>
                            <span className="text-xs text-orange-600 font-bold group-hover:underline">
                              ดูสูตร &gt;
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {msg.sender === "user" && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-lg border border-amber-200 shadow-xs">
                  👤
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 items-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-orange-100 text-lg animate-pulse">
                🤖
              </div>
              <div className="rounded-2xl bg-stone-100 px-4 py-2 text-sm text-stone-500">
                WhatToEat AI กำลังคิดและเลือกเมนูที่ตรงใจที่สุดให้คุณ...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="พิมพ์บอกความต้องการ เช่น 'มีงบ 80 บาท อยากกินอาหารไทยรสจัด' หรือแตะคำแนะนำด้านบน..."
            className="flex-1 rounded-2xl border border-stone-200 bg-[#FAF8F5] px-4 py-3.5 text-sm text-stone-800 outline-none transition focus:border-orange-500 focus:bg-white"
          />

          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25 transition hover:from-orange-600 hover:to-amber-600 disabled:opacity-40"
            title="ส่งข้อความ"
          >
            ➤
          </button>
        </form>
      </div>
    </div>
  );
}
