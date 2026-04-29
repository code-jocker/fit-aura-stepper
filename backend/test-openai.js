const OpenAI = require('openai');
const dotenv = require('dotenv');
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testChat() {
  try {
    console.log('Testing OpenAI API with key:', process.env.OPENAI_API_KEY ? 'Present' : 'Missing');
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Hello, say 'API is working!'" }
      ],
    });
    console.log('Response:', completion.choices[0].message.content);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testChat();
