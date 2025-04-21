#!/usr/bin/env node

import {
  CommercetoolsAgentToolkit,
  Configuration,
  AvailableNamespaces,
} from '@commercetools-demo/ct-agent-toolkit/modelcontextprotocol';
import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js';
import {red, yellow} from 'colors';

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
const ACCEPTED_TOOLS = [
  'products.view',
  'products.modify',
  'project.read',
  'product-search.read',
  'category.read',
  'category.create',
  'category.update',
  'product-selection.read',
  'product-selection.create',
  'product-selection.update',
  'order.read',
  'order.create',
  'order.update',
  'cart.read',
  'cart.create',
  'cart.update',
  'customer.view',
  'customer.modify',
  'customer.create',
  'customer.read',
  'customer.update',
  'customer-group.view',
  'customer-group.modify',
  'customer-group.read',
  'customer-group.create',
  'customer-group.update',
  'standalone-price.read',
  'standalone-price.create',
  'standalone-price.update',
  'product-discount.read',
  'product-discount.create',
  'product-discount.update',
  'cart-discount.read',
  'cart-discount.create',
  'cart-discount.update',
  'discount-code.read',
  'discount-code.create',
  'discount-code.update',
];

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
  const configuration: Configuration = {actions: {}};

  if (selectedTools.includes('all')) {
    ACCEPTED_TOOLS.forEach((tool) => {
      if (!configuration.actions) {
        configuration.actions = {};
      }
      const [namespace, action] = tool.split('.');

      configuration.actions[namespace as AvailableNamespaces] = {
        ...configuration.actions[namespace as AvailableNamespaces],
        [action]: true,
      };
    });
  } else {
    selectedTools.forEach((tool: any) => {
      if (!configuration.actions) {
        configuration.actions = {};
      }
      const [namespace, action] = tool.split('.');
      configuration.actions[namespace as AvailableNamespaces] = {
        ...(configuration.actions[namespace as AvailableNamespaces] || {}),
        [action]: true,
      };
    });
  }

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
}

if (require.main === module) {
  main().catch((error) => {
    handleError(error);
  });
}
