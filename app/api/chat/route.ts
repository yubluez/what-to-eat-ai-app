import { NextResponse } from "next/server";
import { foods } from "@/database/foods";
import { getRecommendations, type Preferences } from "@/lib/recommendation";
import { getLocalWeather } from "@/lib/weather";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message: string = (body.message || "").trim();
    const apiKey: string = (body.apiKey || process.env.GEMINI_API_KEY || "").trim();
    const cityName: string = body.city || "กรุงเทพมหานคร";

    if (!message) {
      return NextResponse.json({ error: "กรุณาระบุข้อความ" }, { status: 400 });
    }

    const weather = getLocalWeather(cityName);

    // 1. เรียกใช้งาน Gemini API เมื่อมีการระบุ API Key
    if (apiKey) {
      try {
        const foodListContext = foods
          .map(
            (f) =>
              `- ID: ${f.id}, ชื่อ: ${f.name} (${f.englishName}), สัญชาติ: ${f.cuisine}, หมวด: ${f.category}, การปรุง: ${f.subCategory || ""}, ราคา: ฿${f.price}, เผ็ด: ${f.spicyLevel}/3, วัตถุดิบ: [${f.ingredients.join(", ")}], สารก่อภูมิแพ้: [${f.allergens.join(", ")}]`
          )
          .join("\n");

        const systemPrompt = `คุณคือ WhatToEat AI ผู้ช่วยแนะนำอาหารอัจฉริยะ อารมณ์ดี และเป็นกันเองมาก
ข้อมูลสภาพอากาศปัจจุบันในเมืองของผู้ใช้ (${weather.city}): อุณหภูมิ ${weather.temperature}°C, สภาพอากาศ: ${weather.conditionText}
กฎเหล็กสำคัญ:
1. คุณต้องเลือกเมนูอาหารจากฐานข้อมูล 50 เมนูที่มีอยู่ด้านล่างนี้เท่านั้น ห้ามแต่งชื่อเมนูหรือราคาขึ้นเองเด็ดขาด
2. ตอบสนองต่อความต้องการของผู้ใช้อย่างใส่ใจ (งบประมาณ, วัตถุดิบที่ไม่กิน, สารก่อภูมิแพ้, สภาพอากาศ, อารมณ์)
3. ให้คำตอบภาษาไทยที่เป็นมิตร ชวนรับประทาน พร้อมบอกเหตุผลที่แนะนำชัดเจน
4. ในตอนท้ายของคำตอบ ให้สรุป RecommendedIDs ในรูปแบบแท็ก [RECOMMENDED_IDS: F001, F004] (1-3 เมนู) เพื่อให้ระบบแสดงเป็นการ์ดอาหาร

ฐานข้อมูลอาหาร 50 เมนู:
${foodListContext}
`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [{ text: `${systemPrompt}\n\nคำขอของผู้ใช้: "${message}"` }],
                },
              ],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 800,
              },
            }),
          }
        );

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const replyText =
            data.candidates?.[0]?.content?.parts?.[0]?.text || "";

          // แยก food IDs ออกจากแท็ก [RECOMMENDED_IDS: ...]
          const match = replyText.match(/\[RECOMMENDED_IDS:\s*([^\]]+)\]/i);
          let matchedFoodIds: string[] = [];
          let cleanReply = replyText;

          if (match) {
            matchedFoodIds = match[1]
              .split(",")
              .map((id: string) => id.trim())
              .filter((id: string) => foods.some((f) => f.id === id));
            cleanReply = replyText.replace(/\[RECOMMENDED_IDS:\s*[^\]]+\]/gi, "").trim();
          }

          const recommendedFoods = foods.filter((f) => matchedFoodIds.includes(f.id));

          return NextResponse.json({
            reply: cleanReply,
            recommendations: recommendedFoods.length > 0 ? recommendedFoods : undefined,
            source: "gemini",
          });
        }
      } catch (geminiError) {
        console.warn("Gemini API call failed, falling back to smart rules engine:", geminiError);
      }
    }

    // 2. Smart Rule-based Engine (Fallback อัจฉริยะ ทำงานทันทีโดยไม่ต้องพึ่งพา API ภายนอก)
    const preferences: Preferences = {
      budget: null,
      spicy: null,
      cuisine: "all",
      excludedFoods: [],
      allergies: [],
    };

    const lower = message.toLowerCase();

    // 1. วิเคราะห์งบประมาณ
    const budgetMatch = message.match(/(?:งบ|ราคา|ไม่เกิน|มีเงิน|มีงบ)\s*([0-9]+)/);
    if (budgetMatch) {
      preferences.budget = parseInt(budgetMatch[1], 10);
    }

    // 2. วิเคราะห์ระดับความเผ็ด
    if (message.includes("ไม่เผ็ด") || message.includes("เผ็ด 0") || message.includes("ไม่เอาเผ็ด") || message.includes("สำหรับเด็ก")) {
      preferences.spicy = 0;
    } else if (message.includes("เผ็ดน้อย") || message.includes("เผ็ด 1")) {
      preferences.spicy = 1;
    } else if (message.includes("เผ็ดปานกลาง") || message.includes("เผ็ดกลาง") || message.includes("เผ็ด 2")) {
      preferences.spicy = 2;
    } else if (message.includes("เผ็ดมาก") || message.includes("จัดจ้าน") || message.includes("แซ่บ") || message.includes("เผ็ด 3")) {
      preferences.spicy = 3;
    }

    // 3. วิเคราะห์สัญชาติอาหาร
    if (message.includes("ญี่ปุ่น")) preferences.cuisine = "อาหารญี่ปุ่น";
    else if (message.includes("เกาหลี")) preferences.cuisine = "อาหารเกาหลี";
    else if (message.includes("ไทย")) preferences.cuisine = "อาหารไทย";
    else if (message.includes("จีน")) preferences.cuisine = "อาหารจีน";
    else if (message.includes("อิตาลี") || message.includes("พิซซ่า") || message.includes("พาสต้า") || message.includes("สปาเกตตี")) preferences.cuisine = "อาหารอิตาลี";
    else if (message.includes("อินเดีย") || message.includes("แกงกะหรี่อินเดีย") || message.includes("บิรยานี")) preferences.cuisine = "อาหารอินเดีย";
    else if (message.includes("อเมริกัน") || message.includes("เบอร์เกอร์")) preferences.cuisine = "อาหารอเมริกัน";
    else if (message.includes("นานาชาติ")) preferences.cuisine = "อาหารนานาชาติ";

    // 4. วิเคราะห์ประเภทการปรุง / หมวดหมู่หลัก
    if (message.includes("เครื่องดื่ม") || message.includes("ดื่ม") || message.includes("ชานม") || message.includes("กาแฟ") || message.includes("มัทฉะ") || message.includes("ชาไทย")) {
      preferences.category = "Drinks";
    } else if (message.includes("ของหวาน") || message.includes("หวาน") || message.includes("ของหวานเย็นๆ") || message.includes("ไอศกรีม") || message.includes("บิงซู") || message.includes("ข้าวเหนียวมะม่วง")) {
      preferences.category = "Dessert";
    } else if (message.includes("ต้ม") || message.includes("ซุป") || message.includes("ซด") || message.includes("ร้อนๆ") || message.includes("แกง")) {
      preferences.subCategory = "ต้ม/แกง";
    } else if (message.includes("ผัด") || message.includes("กระทะ")) {
      preferences.subCategory = "ผัด";
    } else if (message.includes("เส้น") || message.includes("ราเมง") || message.includes("ยากิโซบะ") || message.includes("ก๋วยเตี๋ยว") || message.includes("ผัดไทย")) {
      preferences.subCategory = "เส้น/ผัด";
    } else if (message.includes("ทอด") || message.includes("กรอบ")) {
      preferences.subCategory = "ทอด";
    } else if (message.includes("ย่าง") || message.includes("อบ") || message.includes("บาร์บีคิว") || message.includes("สเต๊ก")) {
      preferences.subCategory = "ย่าง/อบ";
    }

    // 5. วิเคราะห์อาหารที่ไม่รับประทาน
    if (message.includes("ไม่กินอาหารทะเล") || message.includes("ไม่ทานอาหารทะเล") || message.includes("ไม่เอาอาหารทะเล") || message.includes("ไม่กินซีฟู้ด")) {
      preferences.excludedFoods.push("seafood");
    }
    if (message.includes("ไม่กินหมู") || message.includes("ไม่ทานหมู") || message.includes("ไม่เอาหมู") || message.includes("ไม่กินเนื้อหมู")) {
      preferences.excludedFoods.push("pork");
    }
    if (message.includes("ไม่กินเนื้อ") || message.includes("ไม่ทานเนื้อ") || message.includes("ไม่กินวัว") || message.includes("ไม่กินเนื้อวัว")) {
      preferences.excludedFoods.push("beef");
    }
    if (message.includes("ไม่กินไก่") || message.includes("ไม่ทานไก่") || message.includes("ไม่เอาไก่")) {
      preferences.excludedFoods.push("chicken");
    }

    // 6. วิเคราะห์การแพ้อาหาร (Safety first)
    if (message.includes("แพ้สัตว์น้ำเปลือกแข็ง") || message.includes("แพ้กุ้ง") || message.includes("แพ้ปู") || message.includes("แพ้หอย")) {
      preferences.allergies.push("shellfish");
    }
    if (message.includes("แพ้ปลา")) {
      preferences.allergies.push("fish");
    }
    if (message.includes("แพ้ถั่ว") || message.includes("แพ้ถั่วลิสง")) {
      preferences.allergies.push("peanut");
    }
    if (message.includes("แพ้นม") || message.includes("แพ้ผลิตภัณฑ์นม") || message.includes("แพ้ชีส")) {
      preferences.allergies.push("milk");
    }
    if (message.includes("แพ้ไข่")) {
      preferences.allergies.push("egg");
    }
    if (message.includes("แพ้แป้งสาลี") || message.includes("แพ้กลูเตน")) {
      preferences.allergies.push("wheat");
    }

    // คัดกรองและให้คะแนนด้วย Recommendation Engine
    let results = getRecommendations(preferences, weather, 3);

    // หากไม่พบเมนูตรงเงื่อนไข 100% ให้ผ่อนปรน category, subCategory หรือ budget เล็กน้อยเพื่อให้ผู้ใช้ได้รับคำตอบเสมอ
    let isRelaxed = false;
    if (results.length === 0 && preferences.category) {
      const relaxedPrefs = { ...preferences, category: undefined };
      results = getRecommendations(relaxedPrefs, weather, 3);
      isRelaxed = true;
    }
    if (results.length === 0 && preferences.subCategory) {
      const relaxedPrefs = { ...preferences, subCategory: undefined };
      results = getRecommendations(relaxedPrefs, weather, 3);
      isRelaxed = true;
    }
    if (results.length === 0 && preferences.budget) {
      const relaxedPrefs = { ...preferences, budget: null };
      results = getRecommendations(relaxedPrefs, weather, 3);
      isRelaxed = true;
    }

    let reply = "";
    if (results.length > 0) {
      const topFood = results[0];
      const budgetNote = preferences.budget ? `งบไม่เกิน ${preferences.budget} บาท` : "";
      const cuisineNote = preferences.cuisine !== "all" ? `หมวด${preferences.cuisine}` : "";
      const conditionDesc = [cuisineNote, budgetNote].filter(Boolean).join(" ");

      reply = `WhatToEat AI ยินดีจัดให้ครับ! ${conditionDesc ? `สำหรับความต้องการ (${conditionDesc})` : ""} `;
      if (isRelaxed) {
        reply += `เนื่องจากเงื่อนไขบางข้อจำกัดมากในฐานข้อมูล 50 เมนู บอทจึงคัดสรรเมนูที่ใกล้เคียงที่สุดมาให้ครับ:\n\n`;
      }
      reply += `ขอแนะนำ **"${topFood.name}"** (${topFood.price} บาท) เป็นอันดับหนึ่งครับ ${topFood.aiReason}\n\n`;

      if (results.length > 1) {
        reply += `และยังมีตัวเลือกสำรองที่น่าสนใจอีก ${results.length - 1} เมนูด้านล่างนี้ครับ ลองกดดูสูตรและวิธีทำได้เลยครับ! 👇`;
      }
    } else {
      reply = `ขออภัยด้วยครับ ยังไม่พบเมนูในระบบ 50 เมนูที่ตรงกับเงื่อนไขทั้งหมดเป๊ะๆ ลองปรับเพิ่มงบประมาณ หรือลองถามใหม่อีกครั้ง เช่น "งบ 100 บาท แนะนำอาหารไทยหน่อย" หรือ "วันนี้ฝนตก อยากกินอะไรร้อนๆ" ได้เลยครับ!`;
    }

    return NextResponse.json({
      reply,
      recommendations: results,
      source: "local-rules",
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("AI Chat API Error:", errorMsg);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการประมวลผล", details: errorMsg },
      { status: 500 }
    );
  }
}
