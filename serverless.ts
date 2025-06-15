// serverless.ts

import type { AWS } from '@serverless/typescript';

const config: AWS = {
  service: 'rag-ask-api',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-dotenv-plugin'],
  provider: {
    name: 'aws',
    runtime: 'nodejs20.x',
    region: 'us-east-1', 
    memorySize: 256,
    timeout: 10,
    environment: {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY as string,
    },
  },
  functions: {
    askQuestion: {
      handler: 'src/api/askQuestion.handler',
      events: [
        {
          http: {
            path: 'ask',
            method: 'post',
            cors: {
              origin: 'https://www.tonynagy.io',
              headers: ['Content-Type'],
            },
          },
        },
      ],
    },
  },
  package: {
    patterns: ['db/vector-store.json'],
  },
  custom: {
    esbuild: {
      bundle: true,
      target: 'node20',
      platform: 'node',
      sourcemap: false,
      exclude: ['aws-sdk'],
    },
  },
};

module.exports = config;
