// serverless.ts

import type { AWS } from '@serverless/typescript';

const config: AWS = {
  service: 'rag-ask-api',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs20.x',
    region: 'us-east-1', 
    memorySize: 256,
    timeout: 10,
    environment: {
      OPENAI_API_KEY: '${env:OPENAI_API_KEY}',
    },
  },
  functions: {
    askQuestion: {
      handler: 'src/api/askQuestion.handler',
      events: [
        {
          http: {
            method: 'post',
            path: 'ask',
            cors: true,
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
