import {searchProducts} from '../functions';

describe('searchProducts', () => {
  let mockApiRoot: any;
  let mockHttpClient: any;
  let mockContext: any;
  let mockExecute: jest.Mock;

  beforeEach(() => {
    mockExecute = jest.fn();
    mockHttpClient = {
      execute: mockExecute,
    };
    mockApiRoot = {
      _getHttpClient: jest.fn().mockReturnValue(mockHttpClient),
    };

    mockContext = {
      projectKey: 'test-project',
    };

    // Setup mock response
    mockExecute.mockResolvedValue({
      body: {
        count: 2,
        total: 2,
        offset: 0,
        limit: 20,
        results: [
          {id: 'product-1', key: 'product-key-1'},
          {id: 'product-2', key: 'product-key-2'},
        ],
      },
    });
  });

  it('should search products with minimal parameters', async () => {
    const params = {
      query: {
        fullText: {
          value: 'test product',
          locale: 'en',
        },
      },
    };

    const result = await searchProducts(mockApiRoot, mockContext, params);

    expect(mockApiRoot._getHttpClient).toHaveBeenCalled();
    expect(mockExecute).toHaveBeenCalledWith({
      uri: '/test-project/product-search',
      method: 'POST',
      body: {
        query: params.query,
      },
    });

    expect(result).toEqual({
      count: 2,
      total: 2,
      offset: 0,
      limit: 20,
      results: [
        {id: 'product-1', key: 'product-key-1'},
        {id: 'product-2', key: 'product-key-2'},
      ],
    });
  });

  it('should search products with all available parameters', async () => {
    const params = {
      query: {
        exact: {
          field: 'variants.attributes.color',
          fieldType: 'text',
          value: 'red',
        },
      },
      sort: [
        {
          field: 'variants.prices.centAmount',
          order: 'asc' as const,
          mode: 'min' as const,
        },
      ],
      limit: 10,
      offset: 20,
      markMatchingVariants: true,
      productProjectionParameters: {},
      facets: [
        {
          distinct: {
            name: 'colors',
            field: 'variants.attributes.color',
            fieldType: 'text',
            limit: 10,
          },
        },
      ],
    };

    const result = await searchProducts(mockApiRoot, mockContext, params);

    expect(mockApiRoot._getHttpClient).toHaveBeenCalled();
    expect(mockExecute).toHaveBeenCalledWith({
      uri: '/test-project/product-search',
      method: 'POST',
      body: {
        query: params.query,
        sort: params.sort,
        limit: params.limit,
        offset: params.offset,
        markMatchingVariants: params.markMatchingVariants,
        productProjectionParameters: params.productProjectionParameters,
        facets: params.facets,
      },
    });

    expect(result).toEqual({
      count: 2,
      total: 2,
      offset: 0,
      limit: 20,
      results: [
        {id: 'product-1', key: 'product-key-1'},
        {id: 'product-2', key: 'product-key-2'},
      ],
    });
  });

  it('should throw an error when API request fails', async () => {
    const error = new Error('API Error');
    mockExecute.mockRejectedValue(error);

    const params = {
      query: {
        fullText: {
          value: 'test product',
          locale: 'en',
        },
      },
    };

    await expect(
      searchProducts(mockApiRoot, mockContext, params)
    ).rejects.toThrow('Failed to search products: API Error');
  });
});
