import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
})

async function sendContactEmail(contact, messages) {
  if (!contact || !contact.name || !contact.email || !contact.phone) return
  const notifyEmail = process.env.CHAT_NOTIFY_EMAIL || process.env.GMAIL_USER
  const body = [
    'New chat lead received from portfolio chatbot:',
    '',
    `Name: ${contact.name}`,
    `Email: ${contact.email}`,
    `Mobile: ${contact.phone}`,
    '',
    'Conversation:',
    ...messages.map((m) => `${m.role.toUpperCase()}: ${m.content}`),
  ].join('\n')

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: notifyEmail,
    subject: 'New portfolio chatbot contact',
    text: body,
  })
}

async function callGroq(payload, retries = 1) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await groqRes.json();

    // If it worked, or if it's an error we shouldn't retry (e.g. bad key), return immediately
    if (data?.choices?.[0]?.message?.content || groqRes.status !== 429) {
      return data;
    }

    // Only retry on 429 (rate limited), and only if attempts remain
    if (attempt < retries) {
      console.log(`Groq rate limited, retrying... (attempt ${attempt + 1})`);
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
  const { messages, contact } = req.body;
  const shouldSendEmail = contact && messages?.length === 1

  // 3. Convert our simple {role, content} format into what Groq (OpenAI-compatible) expects
  const groqMessages = messages.map((m) => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: m.content,
  }))

  if (shouldSendEmail) {
    try {
      await sendContactEmail(contact, messages)
    } catch (err) {
      console.error('Email delivery failed:', err)
    }
  }

  // 4. Background info Groq uses to answer as "Ahmad's assistant"
  const SYSTEM_PROMPT = `You are a concise, friendly assistant on Ahmad Hassan's portfolio website.

STRICT RULES:
- Keep greetings and simple questions to 1-2 short sentences.
- For real questions about Ahmad's skills, projects, or experience, give a genuinely helpful answer — 2-5 sentences is fine.
- Never use markdown formatting (no asterisks, no bullet points, no headers). Plain conversational text only.
- If asked something unrelated to Ahmad or his work, politely redirect in one sentence.

Background on Ahmad:
- Web Architect and AI Engineer: DevOps, WordPress development, UI/UX design, SEO, and Digital Marketing, plus building AI agents and LLM-powered tools
- Builds complete, search-optimized business websites — technical implementation plus design plus growth
- Builds autonomous AI agents: multi-step tool-calling, multi-LLM fallback/reliability, and agentic workflows

Recent projects:
- opspilot-ai (github.com/ahmad2474/opspilot-ai) — autonomous AI agent (OpenAI Agents SDK) that investigates live AWS infrastructure via multi-step tool-calling and reasoning, with a hypothesis → evidence → conclusion trace and automatic fallback across Groq, Gemini, and NVIDIA NIM
- AI Resume Builder Agent (ai-resume-builder-tau-five.vercel.app) — conversational AI agent that builds tailored, professional resumes
- oldfurniturebuyerdubai.com — WordPress site for a used furniture buyer in Dubai
- freejunkremovalservices.com — WordPress site for a junk removal service in the UAE
- scrapinksa.com — bilingual Arabic/English WordPress site for a metal scrap buyer in Makkah, KSA

Contact:
- Email: ahmad_warraich@outlook.com
- WhatsApp: +923026849341`;

  try {
    // 5. Call Groq with automatic retry on temporary rate limiting
    const data = await callGroq({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...groqMessages],
      max_tokens: 300,
      temperature: 0.7,
    });

    // 6. Defensive check — Groq can return errors or empty responses
    const reply = data?.choices?.[0]?.message?.content;
    if (!reply) {
      console.error('Unexpected Groq response:', JSON.stringify(data));
      return res.status(500).json({ error: 'No reply from model' });
    }

    // 7. Send the reply back to the frontend
    return res.status(200).json({ reply: reply.trim() });
  } catch (err) {
    console.error('Groq call failed:', err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}