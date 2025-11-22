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
        { role: 'user', content: 'Write a haiku about the artificial intelligence!' },
      ],
    });

    console.log('\n Response from GPT-4o: \n');
    console.log(completion.choices[0].message.content);
  } catch (error) {
    console.error('Error occured: ', error);
  }
}

testChat();
