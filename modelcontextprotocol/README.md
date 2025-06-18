# commercetools Model Context Protocol

## Setup

To run the commercetools MCP server using npx, use the following command:

```bash
# To set up all available tools
npx -y @commercetools-demo/mcp --tools=all --clientId=CLIENT_ID --clientSecret=CLIENT_SECRET --projectKey=PROJECT_KEY --authUrl=AUTH_URL --apiUrl=API_URL

# To set up all read-only tools
npx -y @commercetools-demo/mcp --tools=all.read --clientId=CLIENT_ID --clientSecret=CLIENT_SECRET --projectKey=PROJECT_KEY --authUrl=AUTH_URL --apiUrl=API_URL

```

```bash
# To set up specific tools
npx -y @commercetools-demo/mcp --tools=products.read,products.create --clientId=CLIENT_ID --clientSecret=CLIENT_SECRET --projectKey=PROJECT_KEY --authUrl=AUTH_URL --apiUrl=API_URL
```

Make sure to replace `CLIENT_ID`, `CLIENT_SECRET`, `PROJECT_KEY`, `AUTH_URL`, and `API_URL` with your actual values. If using the customerId parameter, replace `CUSTOMER_ID` with the actual customer ID. Alternatively, you could set the API_KEY in your environment variables.

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
```

**Alternative: To use only read-only tools, replace `"--tools=all"` with `"--tools=all.read"`**

## Available tools

### Special Tool Options

| Tool       | Description                                                      |
| ---------- | ---------------------------------------------------------------- |
| `all`      | Enable all available tools (read, create, and update operations) |
| `all.read` | Enable all read-only tools (safe for read-only access)           |

### Individual Tools

| Tool                       | Description                             |
| -------------------------- | --------------------------------------- |
| `products.read`            | [Read product information](https://docs.commercetools.com/api/projects/products#query-products) |
| `products.create`          | [Create product information](https://docs.commercetools.com/api/projects/products#create-product) |
| `products.update`          | [Update product information](https://docs.commercetools.com/api/projects/products#update-product) |
| `project.read`             | [Read project information](https://docs.commercetools.com/api/projects/project#get-project) |
| `product-search.read`      | [Search products](https://docs.commercetools.com/api/projects/products#search-products) |
| `category.read`            | [Read category information](https://docs.commercetools.com/api/projects/categories#get-category-by-id) |
| `category.create`          | [Create category](https://docs.commercetools.com/api/projects/categories#create-category) |
| `category.update`          | [Update category](https://docs.commercetools.com/api/projects/categories#update-category) |
| `channel.read`             | [Read channel information](https://docs.commercetools.com/api/projects/channels#query-channels)                |
| `channel.create`           | [Create channel](https://docs.commercetools.com/api/projects/channels#create-channel)                          |
| `channel.update`           | [Update channel information](https://docs.commercetools.com/api/projects/channels#update-channel)              |
| `product-selection.read`   | [Read product selection](https://docs.commercetools.com/api/projects/product-selections#get-productselection-by-id) |
| `product-selection.create` | [Create product selection](https://docs.commercetools.com/api/projects/product-selections#create-a-productselection) |
| `product-selection.update` | [Update product selection](https://docs.commercetools.com/api/projects/product-selections#update-productselection) |
| `order.read`               | [Read order information](https://docs.commercetools.com/api/projects/orders#get-order-by-id) |
| `order.create`             | [Create order](https://docs.commercetools.com/api/projects/orders#create-order-from-cart) (from cart, quote, import) |
| `order.update`             | [Update order information](https://docs.commercetools.com/api/projects/orders#update-order) |
| `cart.read`                | [Read cart information](https://docs.commercetools.com/api/projects/carts#get-cart-by-id) |
| `cart.create`              | [Create cart](https://docs.commercetools.com/api/projects/carts#create-cart) |
| `cart.update`              | [Update cart information](https://docs.commercetools.com/api/projects/carts#update-cart) |
| `customer.read`            | [Read customer information](https://docs.commercetools.com/api/projects/customers#query-customers)               |
| `customer.create`          | [Create customer](https://docs.commercetools.com/api/projects/customers#create-customer)                         |
| `customer.update`          | [Update customer information](https://docs.commercetools.com/api/projects/customers#update-customer)             |
| `customer-group.read`      | [Read customer group](https://docs.commercetools.com/api/projects/customerGroups#get-customergroup) |
| `customer-group.create`    | [Create customer group](https://docs.commercetools.com/api/projects/customerGroups#create-customergroup) |
| `customer-group.update`    | [Update customer group](https://docs.commercetools.com/api/projects/customerGroups#update-customergroup) |
| `quote.read`               | [Read quote information](https://docs.commercetools.com/api/projects/quotes#get-quote-by-id)                  |
| `quote.create`             | [Create quote](https://docs.commercetools.com/api/projects/quotes#create-quote-from-staged-quote)        |
| `quote.update`             | [Update quote information](https://docs.commercetools.com/api/projects/quotes#update-quote)                |
| `quote-request.read`       | [Read quote request](https://docs.commercetools.com/api/projects/quote-requests#get-quoterequest-by-id) |
| `quote-request.create`     | [Create quote request](https://docs.commercetools.com/api/projects/quote-requests#create-quoterequest) |
| `quote-request.update`     | [Update quote request](https://docs.commercetools.com/api/projects/quote-requests#update-quoterequest) |
| `staged-quote.read`        | [Read staged quote](https://docs.commercetools.com/api/projects/staged-quotes#get-stagedquote-by-id) |
| `staged-quote.create`      | [Create staged quote](https://docs.commercetools.com/api/projects/staged-quotes#create-stagedquote) |
| `staged-quote.update`      | [Update staged quote](https://docs.commercetools.com/api/projects/staged-quotes#update-stagedquote) |
| `standalone-price.read`    | [Read standalone price](https://docs.commercetools.com/api/projects/standalone-prices#get-standaloneprice-by-id) |
| `standalone-price.create`  | [Create standalone price](https://docs.commercetools.com/api/projects/standalone-prices#create-standaloneprice) |
| `standalone-price.update`  | [Update standalone price](https://docs.commercetools.com/api/projects/standalone-prices#update-standaloneprice) |
| `product-discount.read`    | [Read product discount](https://docs.commercetools.com/api/projects/productDiscounts#get-productdiscount-by-id) |
| `product-discount.create`  | [Create product discount](https://docs.commercetools.com/api/projects/productDiscounts#create-productdiscount) |
| `product-discount.update`  | [Update product discount](https://docs.commercetools.com/api/projects/productDiscounts#update-productdiscount) |
| `cart-discount.read`       | [Read cart discount](https://docs.commercetools.com/api/projects/cartDiscounts#get-cartdiscount-by-id) |
| `cart-discount.create`     | [Create cart discount](https://docs.commercetools.com/api/projects/cartDiscounts#create-cartdiscount) |
| `cart-discount.update`     | [Update cart discount](https://docs.commercetools.com/api/projects/cartDiscounts#update-cartdiscount) |
| `discount-code.read`       | [Read discount code information](https://docs.commercetools.com/api/projects/discount-codes#get-discountcode-by-id)          |
| `discount-code.create`     | [Create discount code](https://docs.commercetools.com/api/projects/discount-codes#create-discountcode)                    |
| `discount-code.update`     | [Update discount code information](https://docs.commercetools.com/api/projects/discount-codes#update-discountcode)        |
| `product-type.read`        | [Read product type](https://docs.commercetools.com/api/projects/productTypes#get-producttype-by-id) |
| `product-type.create`      | [Create product type](https://docs.commercetools.com/api/projects/productTypes#create-producttype) |
| `product-type.update`      | [Update product type](https://docs.commercetools.com/api/projects/productTypes#update-producttype) |
| `bulk.create`              | Create entities in bulk                 |
| `bulk.update`              | Update entities in bulk                 |
| `inventory.read`           | [Read inventory information](https://docs.commercetools.com/api/projects/inventory#get-inventoryentry-by-id)              |
| `inventory.create`         | [Create inventory](https://docs.commercetools.com/api/projects/inventory#create-inventoryentry)                        |
| `inventory.update`         | [Update inventory information](https://docs.commercetools.com/api/projects/inventory#update-inventoryentry)            |
| `store.read`               | [Read store](https://docs.commercetools.com/api/projects/stores#get-store-by-id) |
| `store.create`             | [Create store](https://docs.commercetools.com/api/projects/stores#create-store) |
| `store.update`             | [Update store](https://docs.commercetools.com/api/projects/stores#update-store) |
| `business-unit.read`       | [Read business unit](https://docs.commercetools.com/api/projects/business-units#get-businessunit-by-id) |
| `business-unit.create`     | [Create business unit](https://docs.commercetools.com/api/projects/business-units#create-businessunit) |
| `business-unit.update`     | [Update business unit](https://docs.commercetools.com/api/projects/business-units#update-businessunit) |

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
