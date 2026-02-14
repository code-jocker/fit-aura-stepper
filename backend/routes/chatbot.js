const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Groq = require("groq-sdk");
const OpenAI = require("openai");

// Initialize AI clients
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

const SYSTEM_INSTRUCTIONS = `You are 'MBABAZI AI', the premium AI shopping assistant for 'MBABAZI CLOSET' in Rwanda. 
Your goal is to provide comprehensive, expert assistance on ALL topics related to our store and products.

CORE KNOWLEDGE:
- PRODUCTS: We sell 100% authentic premium sneakers (Nike, Jordan, Adidas, New Balance, Yeezy) and athleisure wear.
- QUALITY: Guaranteed original products. No fakes.
- DELIVERY: 
  * Kigali: FREE delivery, typically within 2-4 hours.
  * Outside Kigali (Provinces): 5,000 RWF fee, 24-48 hours delivery.
- PAYMENTS: We primarily use Flutterwave (Card, Mobile Money, USSD), MTN Mobile Money (MoMo), and Airtel Money. Cash on delivery is also accepted in Kigali.
- LOCATION: We are based in Kigali, Rwanda, but deliver nationwide.
- RETURNS: 48-hour return policy if the size doesn't fit or if there's a defect, provided the item is unworn.
- SIZING: We follow standard US/EU/UK sizing. Advise customers to check our size guide.

BEHAVIOR:
- Be professional, energetic, and highly helpful.
- If a user asks a general question (e.g., about fashion or sports), answer it while subtly relating it back to our premium collection.
- Use emojis occasionally to maintain a friendly, modern vibe (👟, ✨, 🇷🇼).
- ALWAYS be ready to answer ANY question. If you don't know a specific internal detail, offer to connect them to a human manager via our contact page.
- Encourage customers to complete their purchase and explain how easy the payment process is with Flutterwave or MoMo.`;

router.post('/', async (req, res) => {
  try {
    const { messages, context } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: 'Messages array is required' });
    }

    const lastMessage = messages[messages.length - 1]?.content;
    
    // Construct dynamic system prompt with context
    let dynamicSystemPrompt = SYSTEM_INSTRUCTIONS;
    if (context) {
      dynamicSystemPrompt += `\n\nCURRENT DASHBOARD CONTEXT:\n${JSON.stringify(context, null, 2)}`;
    }

    // 1. Try OpenAI if available
    if (openai) {
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: dynamicSystemPrompt },
            ...messages.map(m => ({ role: m.role, content: m.content }))
          ],
        });

        if (completion.choices[0]?.message?.content) {
          return res.json({ content: completion.choices[0].message.content });
        }
      } catch (err) {
        console.error('OpenAI Error:', err.message);
      }
    }

    // 2. Try Groq if available
    if (groq) {
      try {
        const groqMessages = [
          { role: "system", content: dynamicSystemPrompt },
          ...messages.map(m => ({ role: m.role, content: m.content }))
        ];

        const chatCompletion = await groq.chat.completions.create({
          messages: groqMessages,
          model: "llama-3.3-70b-versatile",
        });

        if (chatCompletion.choices[0]?.message?.content) {
          return res.json({ content: chatCompletion.choices[0].message.content });
        }
      } catch (err) {
        console.error('Groq Error:', err.message);
      }
    }

    // 3. Fallback to Gemini if available
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const history = messages.slice(0, -1).map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        }));

        const chat = model.startChat({
          history: [
            {
              role: "user",
              parts: [{ text: dynamicSystemPrompt }],
            },
            {
              role: "model",
              parts: [{ text: "Understood. I am MBABAZI AI, the MBABAZI CLOSET assistant. I have access to the store's current data and context. How can I help you today? 👟✨🇷🇼" }],
            },
            ...history
          ],
        });

        const result = await chat.sendMessage(lastMessage);
        const response = await result.response;
        return res.json({ content: response.text() });
      } catch (err) {
        console.error('Gemini Error:', err.message);
      }
    }

    // Final Fallback: If no AI is configured or all fail
    return res.json({
      content: `Hello! I am MBABAZI AI. 👟✨ I am here to help you manage the ${context?.activeTab || "dashboard"}. How can I assist you today? 🇷🇼`
    });

  } catch (error) {
    console.error('Chatbot API Error:', error);
    res.status(500).json({ 
      message: 'Failed to get response from AI assistant',
      error: error.message 
    });
  }
});

module.exports = router;
