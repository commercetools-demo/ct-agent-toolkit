import tools from '../../shared/tools';
import productSearchTools from '../../shared/product-search/tools';

describe('tools', () => {
  it('should include product-search tools', () => {
    // Find search_products tool in the combined tools array
    const searchProductsTool = tools.find(
      (tool) => tool.method === 'search_products'
    );

    expect(searchProductsTool).toBeDefined();
    expect(searchProductsTool).toEqual(productSearchTools[0]);
  });

  it('should have correct structure for search_products tool', () => {
    const searchProductsTool = tools.find(
      (tool) => tool.method === 'search_products'
    );

    expect(searchProductsTool).toMatchObject({
      method: 'search_products',
      name: 'Search Products',
      actions: {
        'product-search': {
          read: true,
        },
      },
    });

    // Verify that parameters and description exist
    expect(searchProductsTool?.parameters).toBeDefined();
    expect(searchProductsTool?.description).toBeDefined();
  });
});
