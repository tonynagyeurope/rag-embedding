import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testChat() {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'user', content: 'Írj egy haikut a mesterséges intelligenciáról.' },
      ],
    });

    console.log('\n✅ Válasz a GPT-4o-tól:\n');
    console.log(completion.choices[0].message.content);
  } catch (error) {
    console.error('❌ Hiba történt:', error);
  }
}

testChat();
