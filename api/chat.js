async function callGemini(payload, retries = 1) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await geminiRes.json();

    // If it worked, or if it's an error we shouldn't retry (e.g. bad key), return immediately
    if (data?.candidates?.[0]?.content?.parts?.[0]?.text || data?.error?.status !== 'UNAVAILABLE') {
      return data;
    }

    // Only retry on UNAVAILABLE (server overload), and only if attempts remain
    if (attempt < retries) {
      console.log(`Gemini overloaded, retrying... (attempt ${attempt + 1})`);
      await new Promise((resolve) => setTimeout(resolve, 800)); // brief pause before retry
    } else {
      return data; // out of retries, return the error as-is
    }
  }
}

export default async function handler(req, res) {
  // 1. Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 2. Pull the conversation history sent from the frontend
  const { messages } = req.body;

  // 3. Convert our simple {role, content} format into what Gemini expects
  const geminiMessages = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  // 4. Background info Gemini uses to answer as "Ahmad's assistant"
  const SYSTEM_PROMPT = `You are a concise, friendly assistant on Ahmad Hassan's portfolio website.

STRICT RULES:
- Keep greetings and simple questions to 1-2 short sentences.
- For real questions about Ahmad's skills, projects, or experience, give a genuinely helpful answer — 2-5 sentences is fine.
- Never use markdown formatting (no asterisks, no bullet points, no headers). Plain conversational text only.
- If asked something unrelated to Ahmad or his work, politely redirect in one sentence.

Background on Ahmad:
- Web Architect: DevOps, WordPress development, UI/UX design, SEO, and Digital Marketing
- Builds complete, search-optimized business websites — technical implementation plus design plus growth

Recent projects:
- oldfurniturebuyerdubai.com — WordPress site for a used furniture buyer in Dubai
- freejunkremovalservices.com — WordPress site for a junk removal service in the UAE
- scrapinksa.com — bilingual Arabic/English WordPress site for a metal scrap buyer in Makkah, KSA

Contact:
- Email: ahmad_warraich@outlook.com
- WhatsApp: +923026849341`;

  try {
    // 5. Call Gemini with automatic retry on temporary overload
    const data = await callGemini({
      contents: geminiMessages,
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      generationConfig: {
        maxOutputTokens: 300,
        temperature: 0.7,
      },
    });

    // 6. Defensive check — Gemini can return errors or empty responses
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!reply) {
      console.error('Unexpected Gemini response:', JSON.stringify(data));
      return res.status(500).json({ error: 'No reply from model' });
    }

    // 7. Send the reply back to the frontend
    return res.status(200).json({ reply: reply.trim() });
  } catch (err) {
    console.error('Gemini call failed:', err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}