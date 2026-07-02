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
  const SYSTEM_PROMPT = `You are a helpful assistant on Ahmad Hassan's portfolio website.
Answer questions about his skills, projects, and experience as a Web Architect.
Keep answers concise and friendly. If asked something unrelated, politely redirect back to Ahmad's work.

Background on Ahmad:
- Web Architect with expertise in: DevOps, WordPress development, UI/UX design, SEO, and Digital Marketing
- Combines technical implementation (DevOps, WordPress) with design sensibility (UI/UX) and growth skills (SEO, Digital Marketing) — builds and launches complete, search-optimized business websites, not just static designs

Recent projects:
- oldfurniturebuyerdubai.com — a local service-business WordPress site for a used furniture and appliance buyer in Dubai, with call/WhatsApp lead capture and local-area SEO
- freejunkremovalservices.com — a WordPress site for a junk removal service in the UAE, optimized for local search across dozens of Dubai neighborhoods
- scrapinksa.com — a bilingual (Arabic/English) WordPress site for a metal scrap buying company in Makkah, Saudi Arabia, built with Elementor and structured for local SEO in a competitive niche

Contact:
- Email: ahmad_warraich@outlook.com
- WhatsApp/Phone: +923026849341

If asked for contact details, share the email and WhatsApp number above.
If asked about specific past projects, describe the ones listed above.`;

  // 5. Debug line — TEMPORARY, remove once everything works
  //console.log(
    //'Key loaded:',
    //process.env.GEMINI_API_KEY ? `yes, length ${process.env.GEMINI_API_KEY.length}` : 'NO — undefined'
  //);

  try {
    // 6. Call Gemini's API — key goes in a header now, not the URL
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: geminiMessages,
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        }),
      }
    );

    const data = await geminiRes.json();

    // 7. Defensive check — Gemini can return errors or empty responses
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!reply) {
      console.error('Unexpected Gemini response:', JSON.stringify(data));
      return res.status(500).json({ error: 'No reply from model' });
    }

    // 8. Send the reply back to the frontend
    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Gemini call failed:', err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}