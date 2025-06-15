# RAG-Embedding

**RAG-Embedding** is a lightweight, low-cost, serverless Q&A system that uses Retrieval-Augmented Generation (RAG) to answer user queries based on a private knowledge base. It was designed as part of a professional portfolio project to demonstrate expertise in AI-powered chatbot development and AWS serverless infrastructure.

## Features

- Document-based knowledge from JSON files (`/data/content`)
- Semantic search powered by sentence embeddings
- Retrieval-Augmented Generation (RAG) to generate accurate answers
- Deployed as an AWS Lambda function using `serverless.ts`
- Cloudflare Turnstile protection on the frontend
- Entirely developed, trained, and maintained by the author
- Open Source backend available at: [https://github.com/tonynagyeurope/rag-embedding](https://github.com/tonynagyeurope/rag-embedding)

## Use Case

The system answers questions about Tony Nagy's professional background and experience by searching through embedded JSON documents containing career-related data.

## Folder Structure

```bash
rag-embedding/
├── data/
│   └── content/            # JSON documents with embedded content
├── src/
│   ├── embedding/          # Embedding utilities (OpenAI or local models)
│   ├── retrieval/          # Vector search using cosine similarity
│   ├── utils/              # Chunking, cleaning, etc.
│   └── generateAnswer.ts   # RAG-style response generator
├── vector-store.json       # Precomputed embeddings
├── askQuestion.ts          # Lambda function entry point
├── serverless.ts           # Serverless framework configuration
└── README.md

## How It Works

1. User submits a question from the front-end (chat widget).
2. The question is semantically embedded.
3. The system compares it against `vector-store.json` to find relevant document chunks.
4. The top matches are passed into a prompt template.
5. A final answer is generated via OpenAI API and returned to the frontend.

## Deployment

```bash
# Generate document chunks (optional if already done)
npx ts-node src/utils/chunkText.ts

# Deploy the Lambda function
npx serverless deploy
```

Technologies Used

    TypeScript

    Node.js

    AWS Lambda + API Gateway

    OpenAI API (or local embedding model)

    Serverless Framework

    Cloudflare Turnstile (frontend protection)

Author

Developed by Tony Nagy
https://tonynagy.io

This project is part of a growing portfolio focused on practical AI, blockchain, and AWS-based solutions.