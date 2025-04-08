export const listProductsPrompt = `
This tool will fetch a list of Products from commercetools.

It takes these optional arguments:
- limit (int, optional): The number of products to return (default: 10, range: 1-500).
- offset (int, optional): The number of items to skip before starting to collect the result set.
- sort (string array, optional): Sort criteria for the results. Example: ["name.en asc", "createdAt desc"]
- where (string array, optional): Query predicates specified as strings. Example: ["masterData.current.name.en = \\"Product Name\\""]
- expand (string array, optional): An array of field paths to expand. Example: ["masterData.current.categories[*]"]
`;
