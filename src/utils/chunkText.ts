import fs from 'fs/promises';
import path from 'path';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from '@langchain/openai';
import { loadAllDocuments } from '../ingest/loadContent';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  console.log('Loading documents...');
  const rawTexts = await loadAllDocuments();

  console.log('Splitting documents into chunks...');
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 250,
  });

  const documents = await splitter.createDocuments(rawTexts);

  console.log('Generating embeddings...');
  const embeddings = new OpenAIEmbeddings();
  const embeddedVectors = await embeddings.embedDocuments(
    documents.map((doc) => doc.pageContent)
  );

  console.log('Saving text chunks + embeddings...');
  const serialized = documents.map((doc, i) => ({
    content: doc.pageContent,
    embedding: embeddedVectors[i],
  }));

  const outputPath = path.join(__dirname, '..', '..', 'db', 'vector-store.json');
  await fs.writeFile(outputPath, JSON.stringify(serialized, null, 2), 'utf8');

  console.log('Embeddings successfully saved to:', outputPath);
}

main().catch((err) => {
  console.error('Error during embedding:', err);
});
