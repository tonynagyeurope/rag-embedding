import fs from 'fs/promises';
import path from 'path';
import * as dotenv from 'dotenv';
import { RetrievalQAChain } from 'langchain/chains';
import { ChatOpenAI } from '@langchain/openai';
import { OpenAIEmbeddings } from '@langchain/openai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { Document } from 'langchain/document';

dotenv.config();

async function main() {
  const question = process.argv[2] || 'What is the LuckySpin VRF contract?';

  console.log('Loading vector store...');
  const filePath = path.join(__dirname, '..', '..', 'db', 'vector-store.json');
  const raw = await fs.readFile(filePath, 'utf8');
  const parsed: { content: string; embedding: number[] }[] = JSON.parse(raw);

  // Reconstruct documents
  const documents = parsed.map((item) => new Document({ pageContent: item.content }));

  console.log('Rebuilding vector store in memory...');
  const vectorStore = await MemoryVectorStore.fromDocuments(
    documents,
    new OpenAIEmbeddings()
  );

  console.log(`Asking: "${question}"`);
  const model = new ChatOpenAI({ temperature: 0, modelName: 'gpt-4o' });

  const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());

  const response = await chain.call({ query: question });

  console.log('\nAnswer:');
  console.log(response.text);
}

main().catch((err) => {
  console.error('Error:', err);
});
