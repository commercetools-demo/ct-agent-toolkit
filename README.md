## ***NOTE***: This is NOT an official commercetools code and NOT production ready. Use it at your own risk

# Agent Toolkit

The commercetools Agent Toolkit enables popular agent frameworks including LangChain,
CrewAI, Vercel's AI SDK, and Model Context Protocol (MCP) to integrate with APIs through function calling. The
library is not exhaustive of the entire commercetools API. It includes support for both Python and TypeScript and is built directly on top of the [Python][python-sdk] and [Node][node-sdk] SDKs.

Included below are basic instructions, but refer to the [Python](/python) and [TypeScript](/typescript) packages for more information.

## TypeScript

### Installation

You don't need this source code unless you want to modify the package. If you just
want to use the package run:

```
npm install @commercetools-demo/commercetools-agent-toolkit
```

#### Requirements

- Node 18+

### Usage

The library needs to be configured with your commercetools project API client credentials which is available in your [Merchant center](https://docs.commercetools.com/getting-started/create-api-client). Additionally, `configuration` enables you to specify the types of actions that can be taken using the toolkit.

```typescript
import { CommercetoolsAgentToolkit } from "@commercetools-demo/commercetools-agent-toolkit/langchain";

const commercetoolsAgentToolkit = new CommercetoolsAgentToolkit({
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
  projectKey: process.env.PROJECT_KEY!,
  authUrl: process.env.AUTH_URL!,
  apiUrl: process.env.API_URL!,
  configuration: {
    actions: {
      products: {
        read: true,
        create: true,
        update: true,
      },
      project: {
        read: true,
      },
      'product-search': {
        read: true,
      },
      cart: {
        read: true,
        create: true,
        update: true,
      },
    },
  },
});
```

#### Tools

The toolkit works with LangChain and Vercel's AI SDK and can be passed as a list of tools. For example:

```typescript
import { AgentExecutor, createStructuredChatAgent } from "langchain/agents";

const tools = commercetoolsAgentToolkit.getTools();

const agent = await createStructuredChatAgent({
  llm,
  tools,
  prompt,
});

const agentExecutor = new AgentExecutor({
  agent,
  tools,
});
```

#### Context

In some cases you will want to provide values that serve as defaults when making requests. Currently, the `account` context value enables you to make API calls for your [connected accounts](https://docs.stripe.com/connect/authentication).

```typescript
const commercetoolsAgentToolkit = new CommercetoolsAgentToolkit({
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
  projectKey: process.env.PROJECT_KEY!,
  authUrl: process.env.AUTH_URL!,
  apiUrl: process.env.API_URL!,
  configuration: {
    context: {
      account: "acct_123",
    },
  },
});
```

## Model Context Protocol

The commercetools Agent Toolkit also supports the [Model Context Protocol (MCP)](https://modelcontextprotocol.com/).

To run the commercetools MCP server using npx, use the following command:

```bash
npx -y @commercetools-demo/mcp --tools=all --clientId=CLIENT_ID --clientSecret=CLIENT_SECRET --projectKey=PROJECT_KEY --authUrl=AUTH_URL --apiUrl=API_URL
```

Replace `CLIENT_ID`, `CLIENT_SECRET`, `PROJECT_KEY`, `AUTH_URL`, and `API_URL` with your actual values. Or, you could set the API_SECRET_KEY in your environment variables.

Alternatively, you can set up your own MCP server. For example:

```typescript
import { CommercetoolsAgentToolkit } from "@commercetools-demo/commercetools-agent-toolkit/modelcontextprotocol";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new CommercetoolsAgentToolkit({
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
  projectKey: process.env.PROJECT_KEY!,
  authUrl: process.env.AUTH_URL!,
  apiUrl: process.env.API_URL!,
  configuration: {
    actions: {
      products: {
        read: true,
      },
      cart: {
        read: true,
        create: true,
        update: true,
      }
    },
  },
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Commercetools MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
```

## Supported API methods

- [Read products](https://docs.commercetools.com/api/projects/products#query-products)
- [Create products](https://docs.commercetools.com/api/projects/products#create-product)
- [Update products](https://docs.commercetools.com/api/projects/products#update-product)
- [Read project information](https://docs.commercetools.com/api/projects/project#get-project)
- [Search products](https://docs.commercetools.com/api/projects/products#search-products)
- [Read category information](https://docs.commercetools.com/api/projects/categories#get-category-by-id)
- [Create category](https://docs.commercetools.com/api/projects/categories#create-category)
- [Update category](https://docs.commercetools.com/api/projects/categories#update-category)
- [Read product selection](https://docs.commercetools.com/api/projects/product-selections#get-productselection-by-id)
- [Create product selection](https://docs.commercetools.com/api/projects/product-selections#create-a-productselection)
- [Update product selection](https://docs.commercetools.com/api/projects/product-selections#update-productselection)
- [Read order information](https://docs.commercetools.com/api/projects/orders#get-order-by-id)
- [Create order](https://docs.commercetools.com/api/projects/orders#create-order-from-cart)
- [Update order](https://docs.commercetools.com/api/projects/orders#update-order)
- [Read cart information](https://docs.commercetools.com/api/projects/carts#get-cart-by-id)
- [Create cart](https://docs.commercetools.com/api/projects/carts#create-cart)
- [Replicate cart](https://docs.commercetools.com/api/projects/carts#replicate-cart)
- [Update cart](https://docs.commercetools.com/api/projects/carts#update-cart)
