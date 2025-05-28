## ***NOTE***: This is NOT an official commercetools code and NOT production ready. Use it at your own risk

# Agent Toolkit

The commercetools Agent Toolkit enables popular agent frameworks including LangChain, Vercel's AI SDK, and Model Context Protocol (MCP) to integrate with APIs through function calling. The
library is not exhaustive of the entire commercetools API. It includes support for TypeScript and is built directly on top of the [Node][node-sdk] SDK.

Included below are basic instructions, but refer to the [TypeScript](/typescript) package for more information.

## TypeScript

### Installation

You don't need this source code unless you want to modify the package. If you just
want to use the package run:

```
npm install @commercetools-demo/ct-agent-toolkit 
```

#### Requirements

- Node 18+

### Usage

The library needs to be configured with your commercetools project API client credentials which is available in your [Merchant center](https://docs.commercetools.com/getting-started/create-api-client). 
**Important**: Ensure that the API client credentials have the necessary scopes aligned with the actions you configure in the toolkit. For example, if you configure `products: { read: true }`, your API client must have the `view_products` scope.
Additionally, `configuration` enables you to specify the types of actions that can be taken using the toolkit.

```typescript
import { CommercetoolsAgentToolkit } from "@commercetools-demo/ct-agent-toolkit/langchain";

const commercetoolsAgentToolkit = new CommercetoolsAgentToolkit({
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
  projectKey: process.env.PROJECT_KEY!,
  authUrl: process.env.AUTH_URL!,
  apiUrl: process.env.API_URL!,
  configuration: {
    context: {
      isAdmin: true,
    },
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
In some cases you will want to provide values that serve as defaults when making requests. Providing context is required to access the tools.

#### Customer Context

```typescript
    const commercetoolsAgentToolkit = new CommercetoolsAgentToolkit({
      clientId: process.env.CLIENT_ID!,
      clientSecret: process.env.CLIENT_SECRET!,
      projectKey: process.env.PROJECT_KEY!,
      authUrl: process.env.AUTH_URL!,
      apiUrl: process.env.API_URL!,
      configuration: {
        context: {
          customerId: "customer-12345",
          cartId: "cart-12345",
        },
      },
    });
```

#### Admin Context

```typescript
const commercetoolsAgentToolkit = new CommercetoolsAgentToolkit({
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
  projectKey: process.env.PROJECT_KEY!,
  authUrl: process.env.AUTH_URL!,
  apiUrl: process.env.API_URL!,
  configuration: {
    context: {
      isAdmin: true,
    },
  },
});
```

#### Store Context

```typescript

const commercetoolsAgentToolkit = new CommercetoolsAgentToolkit({
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
  projectKey: process.env.PROJECT_KEY!,
  authUrl: process.env.AUTH_URL!,
  apiUrl: process.env.API_URL!,
  configuration: {
    context: {
      storeKey: "store-12345",
    },
  },
});
```

***Note:*** Providing one of the following parameters is required: `--isAdmin`, `--customerId`, `--storeKey`


## Model Context Protocol

The commercetools Agent Toolkit also supports the [Model Context Protocol (MCP)](https://modelcontextprotocol.com/).

If you prefer to install the MCP package directly (for example, to run it via a script or manage it as a project dependency), you can use:

```bash
npm install @commercetools-demo/mcp
```
Then, you might need to configure your PATH or use `npx @commercetools-demo/mcp ...` to run it.

To run the commercetools MCP server directly using npx (which handles downloading the package if needed), use the following command:

```bash
npx -y @commercetools-demo/mcp --tools=all --clientId=CLIENT_ID --clientSecret=CLIENT_SECRET --projectKey=PROJECT_KEY --authUrl=AUTH_URL --apiUrl=API_URL --isAdmin=true
```

Replace `CLIENT_ID`, `CLIENT_SECRET`, `PROJECT_KEY`, `AUTH_URL`, and `API_URL` with your actual values. Or, you could set the API_SECRET_KEY in your environment variables.


Alternatively, you can set up your own MCP server. For example:

```typescript
import { CommercetoolsAgentToolkit } from "@commercetools-demo/ct-agent-toolkit/modelcontextprotocol";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new CommercetoolsAgentToolkit({
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
  projectKey: process.env.PROJECT_KEY!,
  authUrl: process.env.AUTH_URL!,
  apiUrl: process.env.API_URL!,
  configuration: {
    context: {
      isAdmin: true,
    },
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

#### getTools()

Returns the current set of available tools that can be used with LangChain, AI SDK, or other agent frameworks:

```typescript
const tools = commercetoolsAgentToolkit.getTools();
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
- [Read customer group](https://docs.commercetools.com/api/projects/customerGroups#get-customergroup)
- [Create customer group](https://docs.commercetools.com/api/projects/customerGroups#create-customergroup)
- [Update customer group](https://docs.commercetools.com/api/projects/customerGroups#update-customergroup)
- [Read standalone price](https://docs.commercetools.com/api/projects/standalone-prices#get-standaloneprice-by-id)
- [Create standalone price](https://docs.commercetools.com/api/projects/standalone-prices#create-standaloneprice)
- [Update standalone price](https://docs.commercetools.com/api/projects/standalone-prices#update-standaloneprice)
- [Read product discount](https://docs.commercetools.com/api/projects/productDiscounts#get-productdiscount-by-id)
- [Create product discount](https://docs.commercetools.com/api/projects/productDiscounts#create-productdiscount)
- [Update product discount](https://docs.commercetools.com/api/projects/productDiscounts#update-productdiscount)
- [Read cart discount](https://docs.commercetools.com/api/projects/cartDiscounts#get-cartdiscount-by-id)
- [Create cart discount](https://docs.commercetools.com/api/projects/cartDiscounts#create-cartdiscount)
- [Update cart discount](https://docs.commercetools.com/api/projects/cartDiscounts#update-cartdiscount)
- [Read product type](https://docs.commercetools.com/api/projects/productTypes#get-producttype-by-id)
- [List product types](https://docs.commercetools.com/api/projects/productTypes#query-producttypes)
- [Create product type](https://docs.commercetools.com/api/projects/productTypes#create-producttype)
- [Update product type](https://docs.commercetools.com/api/projects/productTypes#update-producttype)
- [Read store](https://docs.commercetools.com/api/projects/stores#get-store-by-id)
- [Create store](https://docs.commercetools.com/api/projects/stores#create-store)
- [Update store](https://docs.commercetools.com/api/projects/stores#update-store)
