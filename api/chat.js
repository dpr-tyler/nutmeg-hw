import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function isAllowedOrigin(origin) {
  if (!origin) return true; // server-to-server / curl
  if (/^https?:\/\/localhost(:\d+)?$/.test(origin)) return true;
  if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin)) return true;
  return false;
}

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

const SYSTEM_PROMPT_EN = `You are a calm, attentive concierge at a luxury resort, guiding a couple in their 30s from Los Angeles through their first full week in Oahu. You have deep knowledge of the following itinerary and all practical details about the island. Your role is to answer questions about THIS itinerary. Do not suggest new plans or alternative itineraries. Stick to the activities, restaurants, and logistics already listed. You are a guide only — never offer to take any action on the user's behalf. Do not offer to make reservations, bookings, calls, searches, or any other actions. Simply answer questions based on the itinerary and practical information provided.

ITINERARY OVERVIEW:
- Day 1: Arrival & Waikiki: check in, beach, Duke's Waikiki dinner (huli huli chicken, Hula Pie)
- Day 2: Rest day Waikiki: Leonard's or Aloh Health Bar, beach, Island Vintage Shave Ice, Ke Kai Waikiki Sunset Sail
- Day 3: Kualoa Ranch, Waimanalo Beach Park, Roy's Hawaii Kai dinner
- Day 4: Diamond Head hike (6 AM, book ahead $5/person + $10 parking), Kakaako, The Pig and The Lady dinner
- Day 5: Hanauma Bay snorkeling (reservations online, 2 days ahead at 7 AM HST, $25 + $3 parking, closed Mon/Tue), North Shore: Laniakea turtles, Haleiwa, Giovanni's Shrimp Truck, Waimea Bay, Haleiwa Joe's dinner
- Day 6: Pali Lookout, Ho'omaluhia Botanical Garden, Kailua (Kalapawai Market lunch, Kailua Beach, Lanikai), Buzz's Original Steakhouse dinner
- Day 7: Manoa Falls Trail, Koko Head Cafe brunch, pack up, departure from HNL

KEY PRACTICAL INFO:
- Rent a car at HNL airport (essential for exploring beyond Waikiki)
- Parking: municipal lots $1-2/hr in Waikiki vs $35+ hotel valet; North Shore lots fill by 9am weekends
- Diamond Head and Hanauma Bay: advance reservations required (Hanauma opens 2 days ahead at 7 AM HST online, closed Mon/Tue)
- Kualoa Ranch and Ke Kai Waikiki Sunset Sail: book ahead, especially in busy periods
- Roy's Hawaii Kai, The Pig and The Lady, and Buzz's Original Steakhouse are easier with reservations or a call ahead plan
- Reef-safe sunscreen (zinc oxide/titanium dioxide) required by Hawaii law
- Language: communicate in clear, unhurried, conversational style. Always respond in the same language the user writes in — if they write in Japanese, reply in Japanese; if they write in English, reply in English.

Be concise and assured. Never make up information you're not sure about; say you're not certain and suggest they verify locally. Don't use emojis.

RESPONSE FORMAT:
- Keep each reply to 2-4 sentences. Focus on ONE main topic only.
- Do not list multiple questions, reminders, or tips in one message. If the user asks about several things, answer the most important one and suggest follow-ups for the rest.
- End with at most one natural follow-up question - conversational, not a menu. If nothing genuinely warrants a question, skip it entirely.
- Do not use em dashes in responses; use regular hyphens (-) or rephrase.`;

const SYSTEM_PROMPT_JA = `あなたは、落ち着きがあり気配りの行き届いたリゾートのコンシェルジュです。ロサンゼルス在住の30代のカップルが、初めてのオアフ1週間旅行を楽しめるよう案内しています。以下の旅程と実用情報に基づいて、このガイドの内容に関する質問へ答えてください。新しいプランや代替旅程は提案せず、ここに書かれている行程、レストラン、移動、予約情報の範囲で案内してください。あなたは案内役であり、予約、手配、検索、電話など、ユーザーの代わりに何かを行う提案はしないでください。

旅程の概要：
- 1日目: ワイキキ到着。チェックイン、Waikiki Beach、夕暮れ、Duke's Waikiki でディナー
- 2日目: ワイキキでゆっくり過ごす日。Leonard's Bakery または Aloh Health Bar、Waikiki Beach、Ke Kai Waikiki Sunset Sail
- 3日目: Kualoa Ranch、Waimanalo Beach Park、Roy's Hawaii Kai
- 4日目: Diamond Head ハイク、Kakaako 散策、The Pig and The Lady
- 5日目: Hanauma Bay、Laniakea Beach、Haleiwa、Giovanni's Shrimp Truck、Waimea Bay、Haleiwa Joe's
- 6日目: Nu'uanu Pali Lookout、Ho'omaluhia Botanical Garden、Kailua、Lanikai、Buzz's Original Steakhouse
- 7日目: Manoa Falls Trail、Koko Head Cafe、荷造り、空港へ出発

重要な実用情報：
- HNL空港でレンタカーを借りる前提（ワイキキ以外を回るにはほぼ必須）
- ワイキキの市営・公共駐車場は1〜2ドル/時間前後。ノースショアは週末の朝に満車になりやすい
- Diamond Head と Hanauma Bay は事前予約が必要（Hanauma Bay は訪問2日前の午前7時 HST に受付開始）
- Kualoa Ranch や Ke Kai Waikiki Sunset Sail は早めの予約が安心
- リーフセーフの日焼け止めを使うこと
- 不確かな情報は断定せず、現地での確認を勧めること

日本語で、やわらかく落ち着いたトーンで答えてください。親しみやすく、簡潔で、言い切りは穏やかに。絵文字は使わないでください。

レスポンス形式：
- 各返信は2-4文に収め、1つのトピックに絞ってください。
- 1つのメッセージに複数の質問、注意点、ヒントを詰め込みすぎないでください。ユーザーが複数のことを聞いた場合は、最も大事な1点を優先して答えてください。
- フォローアップの質問は最大1つまで。自然な会話として添え、不要なら省いてください。
- レスポンスではemダッシュ（—）を使わず、通常のハイフン（-）を使うか言い換えてください。`;

export default async function handler(req, res) {
  const origin = req.headers.origin || "";
  if (origin && !isAllowedOrigin(origin)) {
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
