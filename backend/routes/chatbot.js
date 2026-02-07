const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Groq = require("groq-sdk");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });

const SYSTEM_INSTRUCTIONS = `You are 'Aura', the premium AI shopping assistant for 'Fit Aura & Steppers' in Rwanda. 
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

router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Try Groq first if available
    if (process.env.GROQ_API_KEY) {
      try {
        const chatCompletion = await groq.chat.completions.create({
          messages: [
            { role: "system", content: SYSTEM_INSTRUCTIONS },
            { role: "user", content: message },
          ],
          model: "llama-3.3-70b-versatile",
        });

        return res.json({
          response: chatCompletion.choices[0]?.message?.content || ""
        });
      } catch (err) {
        console.error('Groq Error, falling back to Gemini:', err.message);
      }
    }

    // Fallback to Gemini if available
    if (process.env.GEMINI_API_KEY) {
      try {
        const chat = model.startChat({
          history: [
            {
              role: "user",
              parts: [{ text: SYSTEM_INSTRUCTIONS }],
            },
            {
              role: "model",
              parts: [{ text: "Understood. I am Aura, the Fit Aura & Steppers assistant. How can I help you today? 👟✨🇷🇼" }],
            },
          ],
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        return res.json({ response: response.text() });
      } catch (err) {
        console.error('Gemini Error:', err.message);
      }
    }

    // Final Fallback: If no AI is configured, provide a helpful static response
    return res.json({
      response: "Hello! I am Aura from Fit Aura & Steppers. 👟✨ My AI brain is currently being updated, but I can tell you that we are based in Kigali and offer FREE delivery within the city! For urgent help, please visit our contact page or reach out via WhatsApp. 🇷🇼"
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
