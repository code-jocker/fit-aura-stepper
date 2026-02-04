const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
dotenv.config();

async function testGemini() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('Testing Gemini API with key:', apiKey ? 'Present' : 'Missing');
    
    if (!apiKey) {
      console.error('Error: GEMINI_API_KEY is missing in .env');
      return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = "Hello, say 'Gemini API is working!'";
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Response:', text);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testGemini();
