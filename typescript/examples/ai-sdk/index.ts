import {CommercetoolsAgentToolkit} from '../../src/ai-sdk/index';
import {openai} from '@ai-sdk/openai';
import {
  generateText,
  experimental_wrapLanguageModel as wrapLanguageModel,
} from 'ai';

require('dotenv').config();

const commercetoolsAgentToolkit = new CommercetoolsAgentToolkit({
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
  authUrl: process.env.AUTH_URL!,
  projectKey: process.env.PROJECT_KEY!,
  apiUrl: process.env.API_URL!,
  configuration: {
    actions: {
      products: {
        read: true,
      },
    },
  },
});

const model = openai('gpt-4o');

(async () => {
  const result = await generateText({
    model: model,
    tools: {
      ...commercetoolsAgentToolkit.getTools(),
    },
    maxSteps: 5,
    prompt: 'List all products in the commercetools project',
  });

  console.log(result);
})();
