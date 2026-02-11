const Groq = require("groq-sdk");
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function verify() {
  console.log('Using API Key:', process.env.GROQ_API_KEY ? 'Present' : 'Missing');
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are MBABAZI AI assistant." },
        { role: "user", content: "Hello, who are you?" },
      ],
      model: "llama-3.3-70b-versatile",
    });
    console.log('Groq Response:', chatCompletion.choices[0]?.message?.content);
    console.log('SUCCESS: Groq API is working correctly!');
  } catch (error) {
    console.error('FAILED: Groq API error:', error.message);
  }
}

verify();
