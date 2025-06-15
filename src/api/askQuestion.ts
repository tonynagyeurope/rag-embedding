// src/api/askQuestion.ts

import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { Handler } from 'aws-lambda';

import { OpenAIEmbeddings } from '@langchain/openai';
import { ChatOpenAI } from '@langchain/openai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { ConversationalRetrievalQAChain } from 'langchain/chains';

interface EventBody {
  question?: string;
}

export const handler: Handler = async (event, context) => {
  const headers = event.headers || {};
  const origin =
    headers['origin'] ||
    headers['Origin'] || 
    headers['ORIGIN'] || 
    '';

  const allowedOrigins = ['https://www.tonynagy.io', 'https://tonynagy.io'];

  const corsHeaders = {
    'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : '',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  try {
    console.log('Headers received:', JSON.stringify(event.headers, null, 2));

    // Preflight request
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: '',
      };
    }

    const body: EventBody = event.body ? JSON.parse(event.body) : {};
    const question = body.question?.trim();

    if (!question) {
      return {
        statusCode: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Missing "question" field in request body.' }),
      };
    }

    const vectorPath = path.join(__dirname, '..', '..', 'db', 'vector-store.json');
    const raw = await fs.readFile(vectorPath, 'utf-8');
    const parsed = JSON.parse(raw);

    const vectorStore = await MemoryVectorStore.fromTexts(
      parsed.map((entry: any) => entry.content),
      [],
      new OpenAIEmbeddings()
    );

    const model = new ChatOpenAI({
      modelName: 'gpt-4o',
      temperature: 0,
    });

    const chain = ConversationalRetrievalQAChain.fromLLM(
      model,
      vectorStore.asRetriever()
    );

    const result = await chain.call({
      question,
      chat_history: [],
    });

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ answer: result.text }),
    };
  } catch (err: any) {
    console.error('RAG error:', err);
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
