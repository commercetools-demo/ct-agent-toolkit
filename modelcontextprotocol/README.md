# Commercetools Model Context Protocol

## Setup

To run the commercetools MCP server using npx, use the following command:

```bash
# To set up all available tools
npx -y @commercetools-demo/mcp --tools=all --clientId=CLIENT_ID --clientSecret=CLIENT_SECRET --projectKey=PROJECT_KEY --authUrl=AUTH_URL --apiUrl=API_URL --isAdmin=true

```

```bash
# To set up specific tools
npx -y @commercetools-demo/mcp --tools=products.read,products.create --clientId=CLIENT_ID --clientSecret=CLIENT_SECRET --projectKey=PROJECT_KEY --authUrl=AUTH_URL --apiUrl=API_URL --isAdmin=true

# Additional optional parameters (providing one of the following parameters is required)
# --isAdmin           Enable admin access for backend operations (not restricted to a specific customer)
# --customerId        Restrict operations to a specific customer (e.g., --customerId=CUSTOMER_ID)
# --cartId            Restrict operations to a specific cart (e.g., --cartId=CART_ID)
# --storeKey          Restrict operations to a specific store (e.g., --storeKey=STORE_KEY)
# --businessUnitKey   Restrict operations to a specific business unit (e.g., --businessUnitKey=BUSINESS_UNIT_KEY)
#                     Note: When using businessUnitKey, customerId is also required for associate operations

```

Make sure to replace `CLIENT_ID`, `CLIENT_SECRET`, `PROJECT_KEY`, `AUTH_URL`, and `API_URL` with your actual values. If using the customerId parameter, replace `CUSTOMER_ID` with the actual customer ID. Alternatively, you could set the API_KEY in your environment variables.

**_Note:_** Providing one of the following parameters is required: `--isAdmin`, `--customerId`, `--storeKey`, or both `--customerId` and `--businessUnitKey` for associate operations

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
        // Optional: add "--isAdmin" for admin access
        // Optional: add "--customerId=CUSTOMER_ID" to restrict to a specific customer
        // Optional: add "--cartId=CART_ID" to restrict to a specific cart
        // Optional: add "--storeKey=STORE_KEY" to restrict to a specific store
        // Optional: add "--businessUnitKey=BUSINESS_UNIT_KEY" to restrict to a specific business unit
        //          Note: When using businessUnitKey, customerId is also required for associate operations
      ]
    }
  }
}
```

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
| `channel.read`             | Read channel information                |
| `channel.create`           | Create channel                          |
| `channel.update`           | Update channel information              |
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
| `quote-request.read`       | Read quote request information          |
| `quote-request.create`     | Create quote request                    |
| `quote-request.update`     | Update quote request information        |
| `staged-quote.read`        | Read staged quote information           |
| `staged-quote.create`      | Create staged quote                     |
| `staged-quote.update`      | Update staged quote information         |
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
| `store.read`               | Read store information                  |
| `store.create`             | Create store                            |
| `store.update`             | Update store information                |
| `business-unit.read`       | Read business unit information          |
| `business-unit.create`     | Create business unit                    |
| `business-unit.update`     | Update business unit information        |

## Debugging locally

```bash
#  navigate to ../typescript
pnpm run build
# navigate to ../modelcontextprotocol

# link the local package
pnpm add link:../typescript

# run the server in terminal
npx ts-node src/index.ts --tools=products.read --clientId=CLIENT_ID --clientSecret=CLIENT_SECRET --authUrl=AUTH_URL --projectKey=PROJECT_KEY --apiUrl=API_URL
# Optional: add --isAdmin for admin access
# Optional: add --customerId=CUSTOMER_ID to restrict to a specific customer
# Optional: add --businessUnitKey=BUSINESS_UNIT_KEY to restrict to a specific business unit
#          Note: When using businessUnitKey, customerId is also required for associate operations

# test using mcptools : Install mcptools from https://github.com/f/mcptools
mcp call list_products --params '{"limit": 2}' npx ts-node /<absolute-path>/ct-agent-toolkit/modelcontextprotocol/src/index.ts --tools=all \
--projectKey="PROJECT_KEY" \
--clientSecret="CLIENT_SECRET" \
--clientId="CLIENT_ID" \
--authUrl="AUTH_URL" \
--apiUrl="API_URL"
# Optional: add --isAdmin for admin access
# Optional: add --customerId="CUSTOMER_ID" to restrict to a specific customer
# Optional: add --cartId="CART_ID" to restrict to a specific cart
# Optional: add --businessUnitKey="BUSINESS_UNIT_KEY" to restrict to a specific business unit
#          Note: When using businessUnitKey, customerId is also required for associate operations
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
        // Optional: add "--isAdmin" for admin access
        // Optional: add "--customerId=CUSTOMER_ID" to restrict to a specific customer
        // Optional: add "--cartId=CART_ID" to restrict to a specific cart
        // Optional: add "--storeKey=STORE_KEY" to restrict to a specific store
        // Optional: add "--businessUnitKey=BUSINESS_UNIT_KEY" to restrict to a specific business unit
        //          Note: When using businessUnitKey, customerId is also required for associate operations
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
# Optional: add --isAdmin for admin access
# Optional: add --customerId=CUSTOMER_ID to restrict to a specific customer
# Optional: add --cartId=CART_ID to restrict to a specific cart
# Optional: add --storeKey=STORE_KEY to restrict to a specific store
# Optional: add --businessUnitKey=BUSINESS_UNIT_KEY to restrict to a specific business unit
#          Note: When using businessUnitKey, customerId is also required for associate operations
```

### Instructions

1. Replace `CLIENT_ID`, `CLIENT_SECRET`, `PROJECT_KEY`, `AUTH_URL`, and `API_URL` with your actual values.
2. Run the command to start the MCP Inspector.
3. Open the MCP Inspector UI in your browser and click Connect to start the MCP server.
4. You can see the list of tools you selected and test each tool individually.
