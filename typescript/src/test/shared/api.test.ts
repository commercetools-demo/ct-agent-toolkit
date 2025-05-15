import CommercetoolsAPI from '../../shared/api';

// Mock the product and project functions
jest.mock('../../shared/products/functions', () => ({
  listProducts: jest.fn().mockResolvedValue({result: 'list-products-success'}),
  createProduct: jest
    .fn()
    .mockResolvedValue({result: 'create-product-success'}),
  updateProduct: jest
    .fn()
    .mockResolvedValue({result: 'update-product-success'}),
}));

jest.mock('../../shared/project/functions', () => ({
  readProject: jest.fn().mockResolvedValue({result: 'read-project-success'}),
}));

jest.mock('../../shared/product-search/functions', () => {
  // Create function inside the mock
  const searchProductsFn = jest
    .fn()
    .mockResolvedValue({result: 'search-products-success'});
  return {
    searchProducts: searchProductsFn,
    contextToProductSearchFunctionMapping: jest.fn().mockReturnValue({
      search_products: searchProductsFn,
    }),
  };
});

// Mock the client construction
jest.mock('@commercetools/ts-client', () => {
  const mockBuild = jest.fn().mockReturnValue('mock-client');
  const mockWithClientCredentialsFlow = jest.fn().mockReturnValue({
    build: mockBuild,
  });
  const mockWithConcurrentModificationMiddleware = jest.fn().mockReturnValue({
    withClientCredentialsFlow: mockWithClientCredentialsFlow,
  });
  const mockWithHttpMiddleware = jest.fn().mockReturnValue({
    withConcurrentModificationMiddleware:
      mockWithConcurrentModificationMiddleware,
  });
  return {
    ClientBuilder: jest.fn().mockReturnValue({
      withHttpMiddleware: mockWithHttpMiddleware,
    }),
  };
});

jest.mock('@commercetools/platform-sdk', () => ({
  createApiBuilderFromCtpClient: jest.fn().mockReturnValue('mock-api-root'),
}));

describe('CommercetoolsAPI', () => {
  let api: CommercetoolsAPI;

  beforeEach(() => {
    api = new CommercetoolsAPI(
      'test-client-id',
      'test-client-secret',
      'test-auth-url',
      'test-project-key',
      'test-api-url'
    );
  });

  describe('run', () => {
    it('should execute list_products method', async () => {
      const result = await api.run('list_products', {limit: 5});
      expect(result).toBe(JSON.stringify({result: 'list-products-success'}));

      // Import the actual function to verify it was called
      const {listProducts} = require('../../shared/products/functions');
      expect(listProducts).toHaveBeenCalledWith(
        'mock-api-root',
        {projectKey: 'test-project-key'},
        {limit: 5}
      );
    });

    it('should execute create_product method', async () => {
      const result = await api.run('create_product', {
        name: {en: 'Test Product'},
      });
      expect(result).toBe(JSON.stringify({result: 'create-product-success'}));

      const {createProduct} = require('../../shared/products/functions');
      expect(createProduct).toHaveBeenCalledWith(
        'mock-api-root',
        {projectKey: 'test-project-key'},
        {name: {en: 'Test Product'}}
      );
    });

    it('should execute update_product method', async () => {
      const result = await api.run('update_product', {
        id: 'prod-123',
        version: 1,
        actions: [{action: 'changeName', name: {en: 'Updated Name'}}],
      });
      expect(result).toBe(JSON.stringify({result: 'update-product-success'}));

      const {updateProduct} = require('../../shared/products/functions');
      expect(updateProduct).toHaveBeenCalledWith(
        'mock-api-root',
        {projectKey: 'test-project-key'},
        {
          id: 'prod-123',
          version: 1,
          actions: [{action: 'changeName', name: {en: 'Updated Name'}}],
        }
      );
    });

    it('should execute read_project method', async () => {
      const result = await api.run('read_project', {});
      expect(result).toBe(JSON.stringify({result: 'read-project-success'}));

      const {readProject} = require('../../shared/project/functions');
      expect(readProject).toHaveBeenCalledWith(
        'mock-api-root',
        {projectKey: 'test-project-key'},
        {}
      );
    });

    it('should execute search_products method', async () => {
      const searchParams = {
        query: {
          fullText: {
            value: 'test product',
            locale: 'en',
          },
        },
      };
      const result = await api.run('search_products', searchParams);
      expect(result).toBe(JSON.stringify({result: 'search-products-success'}));

      // Get the mock function from the module
      const {searchProducts} = require('../../shared/product-search/functions');
      expect(searchProducts).toHaveBeenCalledWith(
        'mock-api-root',
        {projectKey: 'test-project-key'},
        searchParams
      );
    });

    it('should throw error for invalid method', async () => {
      await expect(api.run('invalid_method', {})).rejects.toThrow(
        'Invalid method invalid_method'
      );
    });
  });
});
