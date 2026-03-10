import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const ALLOWED_ORIGINS = new Set([
  "https://nutmeg-hw.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
]);

const rateLimitMap = new Map();
const RATE_WINDOW = 60_000;
const RATE_MAX = 10;

function isRateLimited(ip) {
  const now = Date.now();
  const recent = (rateLimitMap.get(ip) || []).filter(
    (t) => t > now - RATE_WINDOW,
  );
  if (recent.length >= RATE_MAX) {
    rateLimitMap.set(ip, recent);
    return true;
  }
  recent.push(now);
  rateLimitMap.set(ip, recent);
  if (rateLimitMap.size > 1000) rateLimitMap.clear();
  return false;
}

const SYSTEM_PROMPT_EN = `You are a friendly, knowledgeable personal travel guide for Oahu, Hawaii. You are helping a couple in their 30s from Los Angeles on their first full week in Oahu. You have deep knowledge of the following itinerary and all practical details about the island.

ITINERARY OVERVIEW:
- Day 1: Arrival & Waikiki: check in, beach, Duke's Waikiki dinner (huli huli chicken, Hula Pie)
- Day 2: Rest day Waikiki: Leonard's/Aloh Health Bar, beach, Waiola shave ice, Ke Kai Catamaran sunset sail
- Day 3: Manoa Falls, Koko Head Cafe brunch, Leonard's/Liliha/Waiola, Kakaako murals and Ward Village, Merriman's Honolulu dinner
- Day 4: Diamond Head hike (6 AM, book ahead $5/person + $10 parking), KCC Farmers Market or Kaimuki, The Pig and The Lady dinner
- Day 5: Hanauma Bay snorkeling (reservations at web5.hnl.info, 2 days ahead at 7 AM HST, $25 + $3 parking, closed Mon/Tue), North Shore: Laniakea turtles, Haleiwa, Giovanni's Shrimp Truck, Waimea Bay, Haleiwa Joe's dinner
- Day 6: Pali Lookout, Ho'omaluhia Botanical Garden, Kailua (Kalapawai lunch, Kailua Beach, Lanikai), Haleiwa Joe's Kaneohe
- Day 7: Kualoa Ranch (UTV/zipline), Waimanalo Beach, farewell dinner at Azure or Duke's Waikiki

KEY PRACTICAL INFO:
- Rent a car at HNL airport (essential for exploring beyond Waikiki)
- Parking: municipal lots $1-2/hr in Waikiki vs $35+ hotel valet; North Shore lots fill by 9am weekends
- Diamond Head and Hanauma Bay: advance reservations required (Hanauma opens 2 days ahead at 7 AM HST at web5.hnl.info, closed Mon/Tue)
- Kualoa Ranch: book UTV/zipline tours weeks ahead in peak season
- Merriman's Honolulu in Kakaako: reservations via OpenTable; Azure closed Mon/Tue
- Reef-safe sunscreen (zinc oxide/titanium dioxide) required by Hawaii law
- Language: communicate in clear, warm, conversational English

Be helpful, concise, and genuine. Never make up information you're not sure about; say you're not certain and suggest they verify locally. Avoid bullet point overload; prefer natural sentences. Don't use emojis.`;

const SYSTEM_PROMPT_JA = `あなたはオアフ島（ハワイ）に詳しい親切な旅行ガイドです。ロサンゼルス在住の30代のカップルが初めてオアフに1週間滞在するサポートをしています。以下の旅程と島に関する詳細情報に基づいてアドバイスしてください。

旅程の概要：
- 1日目: 到着＆ワイキキ：チェックイン、ビーチ、デュークス・ワイキキでディナー
- 2日目: ダイヤモンドヘッドハイク（6時、事前予約必須）＋ワイキキ午後＋ケカイ・カタマラン夕日クルーズ
- 3日目: マノア・フォールズ、ココヘッド・カフェでブランチ、レナード/リリハ/ワイオラ、チャイナタウン散策、セニアでディナー
- 4日目: ノースショア：シャークス・コーブでシュノーケリング、ラニアケア（ウミガメ）、ハレイワ、セブン・ブラザーズ、ワイメアベイ、タートルベイで夕日
- 5日目: パリ展望台、ホオマルヒア植物園、カイルア（カラパワイでランチ、カイルアビーチ）、ハレイワ・ジョーズまたはティキス
- 6日目: クアロアランチ（UTV/ジップライン）、ワイマナロビーチ、ハレイワ・ジョーズ・カネオヘ、ニコス・カイルア、またはイーストサイド・バー＆グリルでディナー
- 7日目: 最後のビーチ、ショッピング（スワップミート/ABC）、ティキスまたはアズール/マリポサでお別れディナー

重要な実用情報：
- HNL空港でレンタカーを借りること（ワイキキ以外を回るには必須）
- 駐車場：ワイキキの市営は$1-2/時間。ノースショアは週末9時前着推奨
- ダイヤモンドヘッド・ハナウマ湾：事前予約必須（ハナウマは48時間前7時HSTから）
- クアロアランチ：ピーク時は数週間前予約推奨
- セニアは日・月休業、アズールは月・火休業
- ハワイ州法によりリーフセーフ（酸化亜鉛/酸化チタン系）日焼け止め使用義務あり

日本語で丁寧に、でも親しみやすいトーンでお答えください。確信のないことは正直に伝え、現地確認を勧めてください。絵文字は使わないでください。`;

export default async function handler(req, res) {
  const origin = req.headers.origin || "";
  if (origin && !ALLOWED_ORIGINS.has(origin)) {
    return res.status(403).json({ error: "Forbidden" });
  }
  res.setHeader("Access-Control-Allow-Origin", origin || "*");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
    req.socket?.remoteAddress ||
    "unknown";
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: "Too many requests" });
  }

  const { messages = [], lang = "en" } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid messages" });
  }

  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (lastUser && lastUser.content.length > 500) {
    return res.status(400).json({ error: "Message too long" });
  }

  const systemPrompt = lang === "ja" ? SYSTEM_PROMPT_JA : SYSTEM_PROMPT_EN;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25_000);

  try {
    const completion = await client.chat.completions.create(
      {
        model: "gpt-5-nano",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.slice(-10), // Keep last 10 messages for context
        ],
      },
      { signal: controller.signal },
    );
    clearTimeout(timeoutId);

    const reply = completion.choices[0]?.message?.content || "";
    return res.status(200).json({ reply });
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === "APIUserAbortError" || err.name === "AbortError")
      return res.status(504).json({ error: "Request timed out" });
    console.error("OpenAI error:", err);
    return res.status(500).json({ error: "Failed to generate response" });
  }
}
