#!/usr/bin/env node

import {CommercetoolsAgentToolkit} from '@commercetools-demo/ct-agent-toolkit/modelcontextprotocol';
import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js';
import {green, red, yellow} from 'colors';

type ToolkitConfig = {
  actions: {
    [product: string]: {[action: string]: boolean};
  };
};

type Options = {
  tools?: string[];
};

type EnvVars = {
  clientId?: string;
  clientSecret?: string;
  authUrl?: string;
  projectKey?: string;
  apiUrl?: string;
};

const ACCEPTED_ARGS = [
  'tools',
  'clientId',
  'clientSecret',
  'authUrl',
  'projectKey',
  'apiUrl',
];
const ACCEPTED_TOOLS = ['products.read'];

export function parseArgs(args: string[]): {options: Options; env: EnvVars} {
  const options: Options = {};
  const env: EnvVars = {};

  args.forEach((arg) => {
    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=');

      if (key == 'tools') {
        options.tools = value.split(',');
      } else if (key == 'clientId') {
        env.clientId = value;
      } else if (key == 'clientSecret') {
        env.clientSecret = value;
      } else if (key == 'authUrl') {
        env.authUrl = value;
      } else if (key == 'projectKey') {
        env.projectKey = value;
      } else if (key == 'apiUrl') {
        env.apiUrl = value;
      } else {
        throw new Error(
          `Invalid argument: ${key}. Accepted arguments are: ${ACCEPTED_ARGS.join(
            ', '
          )}`
        );
      }
    }
  });

  // Check if required tools arguments is present
  if (!options.tools) {
    throw new Error('The --tools arguments must be provided.');
  }

  // Validate tools against accepted enum values
  options.tools.forEach((tool: string) => {
    if (tool == 'all') {
      return;
    }
    if (!ACCEPTED_TOOLS.includes(tool.trim())) {
      throw new Error(
        `Invalid tool: ${tool}. Accepted tools are: ${ACCEPTED_TOOLS.join(
          ', '
        )}`
      );
    }
  });

  // Check for commercetools env vars
  env.clientId = env.clientId || process.env.CLIENT_ID;
  env.clientSecret = env.clientSecret || process.env.CLIENT_SECRET;
  env.authUrl = env.authUrl || process.env.AUTH_URL;
  env.projectKey = env.projectKey || process.env.PROJECT_KEY;
  env.apiUrl = env.apiUrl || process.env.API_URL;

  // Validate required commercetools credentials
  if (
    !env.clientId ||
    !env.clientSecret ||
    !env.authUrl ||
    !env.projectKey ||
    !env.apiUrl
  ) {
    throw new Error(
      'Commercetools credentials missing. Please provide all required credentials either via arguments or environment variables (CLIENT_ID, CLIENT_SECRET, AUTH_URL, PROJECT_KEY, API_URL).'
    );
  }

  return {options, env};
}

function handleError(error: any) {
  console.error(red('\n🚨  Error initializing Commercetools MCP server:\n'));
  console.error(yellow(`   ${error.message}\n`));
}

export async function main() {
  const {options, env} = parseArgs(process.argv.slice(2));

  // Create the CommercetoolsAgentToolkit instance
  const selectedTools = options.tools!;
  const configuration: ToolkitConfig = {actions: {}};

  if (selectedTools.includes('all')) {
    ACCEPTED_TOOLS.forEach((tool) => {
      const [product, action] = tool.split('.');
      configuration.actions[product] = {
        ...configuration.actions[product],
        [action]: true,
      };
    });
  } else {
    selectedTools.forEach((tool: any) => {
      const [product, action] = tool.split('.');
      configuration.actions[product] = {
        ...(configuration.actions[product] || {}),
        [action]: true,
      };
    });
  }

  console.log('env', env);

  const server = new CommercetoolsAgentToolkit({
    clientId: env.clientId!,
    clientSecret: env.clientSecret!,
    authUrl: env.authUrl!,
    projectKey: env.projectKey!,
    apiUrl: env.apiUrl!,
    configuration: configuration,
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  // We use console.error instead of console.log since console.log will output to stdio, which will confuse the MCP server
  console.error(green('✅ Commercetools MCP Server running on stdio'));
}

if (require.main === module) {
  main().catch((error) => {
    handleError(error);
  });
}
