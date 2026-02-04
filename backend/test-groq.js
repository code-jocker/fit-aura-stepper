const Groq = require("groq-sdk");
const dotenv = require('dotenv');
dotenv.config();

async function testGroq() {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    console.log('Testing Groq API with key:', apiKey ? 'Present' : 'Missing');
    
    if (!apiKey) {
      console.error('Error: GROQ_API_KEY is missing in .env');
      return;
    }

    const groq = new Groq({ apiKey });

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "user", content: "Hello, say 'Groq API is working!'" },
      ],
      model: "llama-3.3-70b-versatile",
    });

    console.log('Response:', chatCompletion.choices[0]?.message?.content);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testGroq();
