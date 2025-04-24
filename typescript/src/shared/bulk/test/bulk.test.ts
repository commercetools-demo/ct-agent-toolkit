import {bulkCreate} from '../functions';
import {ApiRoot} from '@commercetools/platform-sdk';
import {bulkCreateParameters} from '../parameters';
import {z} from 'zod';

// Mock the API Root
const mockExecute = jest.fn();
const mockPost = jest.fn(() => ({execute: mockExecute}));
const mockImportOrder = jest.fn(() => ({post: mockPost}));
const mockOrders = jest.fn(() => ({
  post: mockPost,
  importOrder: mockImportOrder,
}));
const mockWithProjectKey = jest.fn(() => ({
  products: jest.fn(() => ({post: mockPost})),
  customers: jest.fn(() => ({post: mockPost})),
  carts: jest.fn(() => ({post: mockPost})),
  categories: jest.fn(() => ({post: mockPost})),
  discountCodes: jest.fn(() => ({post: mockPost})),
  cartDiscounts: jest.fn(() => ({post: mockPost})),
  productDiscounts: jest.fn(() => ({post: mockPost})),
  customerGroups: jest.fn(() => ({post: mockPost})),
  standalonePrices: jest.fn(() => ({post: mockPost})),
  orders: mockOrders,
}));

const mockApiRoot = {
  withProjectKey: mockWithProjectKey,
} as unknown as ApiRoot;

const mockContext = {projectKey: 'test-project'};

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  mockExecute.mockResolvedValue({body: {id: 'mock-id'}});
});

describe('bulkCreate', () => {
  it('should create multiple products in bulk', async () => {
    const params = {
      items: [
        {
          entityType: 'product' as const,
          data: {
            name: {en: 'Test Product 1'},
            productType: {id: 'type-id-1', typeId: 'product-type' as const},
            slug: {en: 'test-product-1'},
          },
        },
        {
          entityType: 'product' as const,
          data: {
            name: {en: 'Test Product 2'},
            productType: {id: 'type-id-2', typeId: 'product-type' as const},
            slug: {en: 'test-product-2'},
          },
        },
      ],
    } as z.infer<typeof bulkCreateParameters>;

    const result = await bulkCreate(mockApiRoot, mockContext, params);

    expect(result.success).toBe(true);
    expect(result.results).toHaveLength(2);
    expect(mockExecute).toHaveBeenCalledTimes(2);
  });

  it('should create an order from cart in bulk', async () => {
    const params = {
      items: [
        {
          entityType: 'order' as const,
          data: {
            id: 'cart-id-1',
            version: 1,
            orderNumber: 'ORD-001',
          },
        },
      ],
    } as z.infer<typeof bulkCreateParameters>;

    const result = await bulkCreate(mockApiRoot, mockContext, params);

    expect(result.success).toBe(true);
    expect(result.results).toHaveLength(1);
    expect(mockOrders).toHaveBeenCalled();
    expect(mockPost).toHaveBeenCalled();
    expect(mockExecute).toHaveBeenCalledTimes(1);
  });

  it('should create an order from quote in bulk', async () => {
    const params = {
      items: [
        {
          entityType: 'order' as const,
          data: {
            quoteId: 'quote-id-1',
            version: 1,
            orderNumber: 'ORD-002',
          },
        },
      ],
    } as z.infer<typeof bulkCreateParameters>;

    const result = await bulkCreate(mockApiRoot, mockContext, params);

    expect(result.success).toBe(true);
    expect(result.results).toHaveLength(1);
    expect(mockOrders).toHaveBeenCalled();
    expect(mockPost).toHaveBeenCalled();
    expect(mockExecute).toHaveBeenCalledTimes(1);
  });

  it('should create an order by import in bulk', async () => {
    const params = {
      items: [
        {
          entityType: 'order' as const,
          data: {
            orderNumber: 'ORD-003',
            customerId: 'customer-id-1',
            totalPrice: {
              currencyCode: 'USD',
              centAmount: 1000,
            },
            lineItems: [
              {
                id: 'line-item-1',
                productId: 'product-id-1',
                name: {en: 'Test Product'},
                variant: {
                  id: 1,
                  sku: 'SKU-001',
                },
                quantity: 1,
              },
            ],
          },
        },
      ],
    } as z.infer<typeof bulkCreateParameters>;

    const result = await bulkCreate(mockApiRoot, mockContext, params);

    expect(result.success).toBe(true);
    expect(result.results).toHaveLength(1);
    expect(mockOrders).toHaveBeenCalled();
    expect(mockImportOrder).toHaveBeenCalled();
    expect(mockPost).toHaveBeenCalled();
    expect(mockExecute).toHaveBeenCalledTimes(1);
  });

  it('should throw error for invalid order parameters', async () => {
    const params = {
      items: [
        {
          entityType: 'order' as const,
          data: {
            // Missing required parameters for any order type
            someInvalidField: 'value',
          },
        },
      ],
    } as any;

    await expect(bulkCreate(mockApiRoot, mockContext, params)).rejects.toThrow(
      'Bulk creation failed: Invalid order parameters. Could not determine order creation type.'
    );
  });

  it('should throw error for unsupported entity type', async () => {
    const params = {
      items: [
        {
          entityType: 'unsupported-entity',
          data: {},
        },
      ],
    } as any;

    await expect(bulkCreate(mockApiRoot, mockContext, params)).rejects.toThrow(
      'Bulk creation failed: Unsupported entity type: unsupported-entity'
    );
  });
});
