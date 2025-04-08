## ***NOTE***: This is NOT an official commercetools code and NOT production ready. Use it at your own risk

# Agent Toolkit

The commercetools Agent Toolkit enables popular agent frameworks including LangChain,
CrewAI, Vercel's AI SDK, and Model Context Protocol (MCP) to integrate with APIs through function calling. The
library is not exhaustive of the entire commercetools API. It includes support for both Python and TypeScript and is built directly on top of the [Python][python-sdk] and [Node][node-sdk] SDKs.

Included below are basic instructions, but refer to the [Python](/python) and [TypeScript](/typescript) packages for more information.

## Python

### Installation

You don't need this source code unless you want to modify the package. If you just
want to use the package run:

```sh
pip install commercetools-agent-toolkit
```

#### Requirements

- Python 3.11+

### Usage

The library needs to be configured with your account's secret key which is
available in your [Dashboard][api-keys].

```python
from commercetools_agent_toolkit.crewai.toolkit import AgentToolkit

commercetools_agent_toolkit = CommercetoolsAgentToolkit(
    secret_key="sk_test_...",
    configuration={
        "actions": {
            "payment_links": {
                "create": True,
            },
        }
    },
)
```

The toolkit works with LangChain and CrewAI and can be passed as a list of tools. For example:

```python
from crewai import Agent

commercetools_agent = Agent(
    role="commercetools Agent",
    goal="Integrate with commercetools API",
    backstory="You are an expert at integrating with commercetools API",
    tools=[*commercetools_agent_toolkit.get_tools()]
)
```

Examples for LangChain and CrewAI are included in [/examples](/python/examples).

#### Context

In some cases you will want to provide values that serve as defaults when making requests. Currently, the `account` context value enables you to make API calls for your [connected accounts](https://docs.stripe.com/connect/authentication).

```python
commercetools_agent_toolkit = CommercetoolsAgentToolkit(
    secret_key="sk_test_...",
    configuration={
        "context": {
            "account": "acct_123"
        }
    }
)
```

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

The library needs to be configured with your account's secret key which is available in your [Dashboard][api-keys]. Additionally, `configuration` enables you to specify the types of actions that can be taken using the toolkit.

```typescript
import { CommercetoolsAgentToolkit } from "@commercetools-demo/commercetools-agent-toolkit/langchain";

const commercetoolsAgentToolkit = new CommercetoolsAgentToolkit({
  secretKey: process.env.API_SECRET_KEY!,
  configuration: {
    actions: {
      paymentLinks: {
        create: true,
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
  secretKey: process.env.API_SECRET_KEY!,
  configuration: {
    context: {
      account: "acct_123",
    },
  },
});
```

#### Metered billing

For Vercel's AI SDK, you can use middleware to submit billing events for usage. All that is required is the customer ID and the input/output meters to bill.

```typescript
import { CommercetoolsAgentToolkit } from "@commercetools-demo/commercetools-agent-toolkit/ai-sdk";
import { openai } from "@ai-sdk/openai";
import {
  generateText,
  experimental_wrapLanguageModel as wrapLanguageModel,
} from "ai";

const commercetoolsAgentToolkit = new CommercetoolsAgentToolkit({
  secretKey: process.env.API_SECRET_KEY!,
  configuration: {
    actions: {
      paymentLinks: {
        create: true,
      },
    },
  },
});

const model = wrapLanguageModel({
  model: openai("gpt-4o"),
  middleware: commercetoolsAgentToolkit.middleware({
    billing: {
      customer: "cus_123",
      meters: {
        input: "input_tokens",
        output: "output_tokens",
      },
    },
  }),
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
