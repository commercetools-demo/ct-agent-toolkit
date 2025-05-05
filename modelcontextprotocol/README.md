# Commercetools Model Context Protocol

## Setup

To run the commercetools MCP server using npx, use the following command:

````bash
# To set up all available tools
npx -y @commercetools-demo/mcp --tools=all --clientId=CLIENT_ID --clientSecret=CLIENT_SECRET --projectKey=PROJECT_KEY --authUrl=AUTH_URL --apiUrl=API_URL

# To set up specific tools
npx -y @commercetools-demo/mcp --tools=products.read --clientId=CLIENT_ID --clientSecret=CLIENT_SECRET --projectKey=PROJECT_KEY --authUrl=AUTH_URL --apiUrl=API_URL


Make sure to replace `CLIENT_ID`, `CLIENT_SECRET`, `PROJECT_KEY`, `AUTH_URL`, and `API_URL` with your actual values. Alternatively, you could set the API_KEY in your environment variables.

### Usage with Claude Desktop

Add the following to your `claude_desktop_config.json`. See [here](https://modelcontextprotocol.io/quickstart/user) for more details.

```json
{
  "mcpServers": {
    "commercetools": {
      "command": "npx",
      "args": [
        "-y",
        "@commercetools-demo/mcp@latest",
        "--tools=all",
        "--clientId=CLIENT_ID",
        "--clientSecret=CLIENT_SECRET",
        "--authUrl=AUTH_URL",
        "--projectKey=PROJECT_KEY",
        "--apiUrl=API_URL"
      ]
    }
  }
}
````

## Available tools

| Tool                       | Description                             |
| -------------------------- | --------------------------------------- |
| `products.read`            | Read product information                |
| `products.create`          | Create product information              |
| `products.update`          | Update product information              |
| `project.read`             | Read project information                |
| `product-search.read`      | Read product search information         |
| `category.read`            | Read category information               |
| `category.create`          | Create category information             |
| `category.update`          | Update category information             |
| `product-selection.read`   | Read product selection information      |
| `product-selection.create` | Create product selection information    |
| `product-selection.update` | Update product selection information    |
| `order.read`               | Read order information                  |
| `order.create`             | Create order (from cart, quote, import) |
| `order.update`             | Update order information                |
| `cart.read`                | Read cart information                   |
| `cart.create`              | Create cart                             |
| `cart.update`              | Update cart information                 |
| `customer.read`            | Read customer information               |
| `customer.create`          | Create customer                         |
| `customer.update`          | Update customer information             |
| `customer-group.read`      | Read customer group information         |
| `customer-group.create`    | Create customer group                   |
| `customer-group.update`    | Update customer group information       |
| `standalone-price.read`    | Read standalone price information       |
| `standalone-price.create`  | Create standalone price                 |
| `standalone-price.update`  | Update standalone price information     |
| `product-discount.read`    | Read product discount information       |
| `product-discount.create`  | Create product discount                 |
| `product-discount.update`  | Update product discount information     |
| `cart-discount.read`       | Read cart discount information          |
| `cart-discount.create`     | Create cart discount                    |
| `cart-discount.update`     | Update cart discount information        |
| `discount-code.read`       | Read discount code information          |
| `discount-code.create`     | Create discount code                    |
| `discount-code.update`     | Update discount code information        |
| `product-type.read`        | Read product type information           |
| `product-type.create`      | Create product type                     |
| `product-type.update`      | Update product type information         |
| `bulk.create`              | Create bulk entities                    |
| `bulk.update`              | Update bulk entities                    |
| `inventory.read`           | Read inventory information              |
| `inventory.create`         | Create inventory                        |
| `inventory.update`         | Update inventory information            |

## Debugging locally

```bash
#  navigate to ../typescript
pnpm run build
# navigate to ../modelcontextprotocol

# link the local package
pnpm add link:../typescript

# run the server in terminal
npx ts-node src/index.ts --tools=products.read --clientId=CLIENT_ID --clientSecret=CLIENT_SECRET --authUrl=AUTH_URL --projectKey=PROJECT_KEY --apiUrl=API_URL

# test using mcptools : Install mcptools from https://github.com/f/mcptools
mcp call list_products --params '{"limit": 2}' npx ts-node /<absolute-path>/ct-agent-toolkit/modelcontextprotocol/src/index.ts --tools=all \
--projectKey="PROJECT_KEY" \
--clientSecret="CLIENT_SECRET" \
--clientId="CLIENT_ID" \
--authUrl="AUTH_URL" \
--apiUrl="API_URL"

```

**_Do not commit the linked package in package.json to the repo_**

## Testing Using Claude Desktop

NOTE: This will not work with Claude Desktop unless you uninstall node v16 from your machine!

```bash
#  navigate to ../typescript
pnpm run build

# navigate to ../modelcontextprotocol

# link the local package
pnpm add link:../typescript
```

Configure MCP servers in Claude Desktop

```json
{
  "mcpServers": {
    "commercetools": {
      "command": "npx",
      "args": [
        "ts-node",
        "/<absolute-path>/ct-agent-toolkit/modelcontextprotocol/src/index.ts",
        "--tools=all",
        "--projectKey=PROJECT_KEY",
        "--clientSecret=CLIENT_SECRET",
        "--clientId=CLIENT_ID",
        "--authUrl=AUTH_URL",
        "--apiUrl=API_URL"
      ]
    }
  }
}
```

## Debugging the Server

To debug your server, you can use the [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector).

First build the server

```
npm run build
```

Run the following command in your terminal:

```bash
# Start MCP Inspector and server with all tools
npx @modelcontextprotocol/inspector node dist/index.js --tools=all --clientId=CLIENT_ID --clientSecret=CLIENT_SECRET --projectKey=PROJECT_KEY --authUrl=AUTH_URL --apiUrl=API_URL
```

### Instructions

1. Replace `CLIENT_ID`, `CLIENT_SECRET`, `PROJECT_KEY`, `AUTH_URL`, and `API_URL` with your actual values.
2. Run the command to start the MCP Inspector.
3. Open the MCP Inspector UI in your browser and click Connect to start the MCP server.
4. You can see the list of tools you selected and test each tool individually.
