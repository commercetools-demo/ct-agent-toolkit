export const listProductsPrompt = `
This tool will fetch a list of Products from commercetools.

It takes these optional arguments:
- limit (int, optional): The number of products to return (default: 10, range: 1-500).
- offset (int, optional): The number of items to skip before starting to collect the result set.
- sort (string array, optional): Sort criteria for the results. Example: ["name.en asc", "createdAt desc"]
- where (string array, optional): Query predicates specified as strings. Example: ["masterData.current.name.en = \\"Product Name\\""]
- expand (string array, optional): An array of field paths to expand. Example: ["masterData.current.categories[*]"]
`;

export const createProductPrompt = `
This tool will create a new Product in commercetools.

It takes these required arguments:
- productType (string): The ID of the product type to create the product from.
- name (string): The name of the product.
- slug (string): The slug of the product.

It takes these optional arguments:
- description (string, optional): The description of the product.
- categories (string array, optional): The categories of the product.
- masterVariant (object, optional): The master variant of the product.
- variants (object array, optional): The variants of the product.
- key (string, optional): The key of the product.
- metaTitle (string, optional): The meta title of the product.
- metaDescription (string, optional): The meta description of the product.
- metaKeywords (string array, optional): The meta keywords of the product.
- searchKeywords (string array, optional): The search keywords of the product.
- taxCategory (string, optional): The tax category of the product.
- state (string, optional): The state of the product.
`;
