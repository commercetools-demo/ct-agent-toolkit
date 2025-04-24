import {readCart, createCart, replicateCart, updateCart} from '../functions';
import {
  readCartParameters,
  createCartParameters,
  replicateCartParameters,
  updateCartParameters,
} from '../parameters';
import {z} from 'zod';

// Mock API Root
const mockExecute = jest.fn();
const mockGet = jest.fn().mockReturnValue({execute: mockExecute});
const mockPost = jest.fn().mockReturnValue({execute: mockExecute});
const mockWithId = jest.fn().mockReturnValue({get: mockGet, post: mockPost});
const mockWithKey = jest.fn().mockReturnValue({get: mockGet, post: mockPost});
const mockReplicate = jest.fn().mockReturnValue({post: mockPost});
const mockCarts = jest.fn().mockReturnValue({
  get: mockGet,
  post: mockPost,
  withId: mockWithId,
  withKey: mockWithKey,
  replicate: mockReplicate,
});
const mockInStore = jest.fn().mockReturnValue({
  carts: mockCarts,
});
const mockWithProjectKey = jest.fn().mockReturnValue({
  carts: mockCarts,
  inStoreKeyWithStoreKeyValue: mockInStore,
});
const mockApiRoot = {
  withProjectKey: mockWithProjectKey,
};

const context = {projectKey: 'test-project'};

describe('Cart Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockExecute.mockResolvedValue({body: {}});
  });

  describe('readCart', () => {
    it('should read a cart by ID', async () => {
      const params = {id: 'cart-id'} as z.infer<typeof readCartParameters>;
      await readCart(mockApiRoot as any, context, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockCarts).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'cart-id'});
      expect(mockGet).toHaveBeenCalled();
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should read a cart by key', async () => {
      const params = {key: 'cart-key'} as z.infer<typeof readCartParameters>;
      await readCart(mockApiRoot as any, context, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockCarts).toHaveBeenCalled();
      expect(mockWithKey).toHaveBeenCalledWith({key: 'cart-key'});
      expect(mockGet).toHaveBeenCalled();
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should read a cart by customer ID', async () => {
      const params = {customerId: 'customer-id'} as z.infer<
        typeof readCartParameters
      >;
      await readCart(mockApiRoot as any, context, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockCarts).toHaveBeenCalled();
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          where: ['customerId="customer-id"'],
          limit: 1,
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should read carts with where query', async () => {
      const params = {where: ['customerId="customer-id"']} as z.infer<
        typeof readCartParameters
      >;
      await readCart(mockApiRoot as any, context, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockCarts).toHaveBeenCalled();
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          where: ['customerId="customer-id"'],
          limit: 10,
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should read a cart in store by ID', async () => {
      const params = {id: 'cart-id', storeKey: 'store-key'} as z.infer<
        typeof readCartParameters
      >;
      await readCart(mockApiRoot as any, context, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockInStore).toHaveBeenCalledWith({storeKey: 'store-key'});
      expect(mockCarts).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'cart-id'});
      expect(mockGet).toHaveBeenCalled();
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should throw an error when no parameters are provided', async () => {
      const params = {} as z.infer<typeof readCartParameters>;
      await expect(
        readCart(mockApiRoot as any, context, params)
      ).rejects.toThrow('Failed to read cart');
    });
  });

  describe('createCart', () => {
    it('should create a cart', async () => {
      const params = {currency: 'EUR'} as z.infer<typeof createCartParameters>;
      await createCart(mockApiRoot as any, context, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockCarts).toHaveBeenCalled();
      expect(mockPost).toHaveBeenCalledWith({
        body: params,
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should create a cart in store', async () => {
      const params = {
        currency: 'EUR',
        store: {key: 'store-key', typeId: 'store'},
      } as z.infer<typeof createCartParameters>;
      await createCart(mockApiRoot as any, context, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockInStore).toHaveBeenCalledWith({storeKey: 'store-key'});
      expect(mockCarts).toHaveBeenCalled();
      expect(mockPost).toHaveBeenCalledWith({
        body: params,
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const params = {currency: 'EUR'} as z.infer<typeof createCartParameters>;
      mockExecute.mockRejectedValueOnce(new Error('Creation failed'));

      await expect(
        createCart(mockApiRoot as any, context, params)
      ).rejects.toThrow('Failed to create cart');
    });
  });

  describe('replicateCart', () => {
    it('should replicate a cart', async () => {
      const params = {
        reference: {id: 'cart-id', typeId: 'cart'},
      } as z.infer<typeof replicateCartParameters>;
      await replicateCart(mockApiRoot as any, context, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockCarts).toHaveBeenCalled();
      expect(mockReplicate).toHaveBeenCalled();
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          reference: {id: 'cart-id', typeId: 'cart'},
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should replicate a cart in store', async () => {
      const params = {
        reference: {id: 'cart-id', typeId: 'cart'},
        storeKey: 'store-key',
      } as z.infer<typeof replicateCartParameters>;
      await replicateCart(mockApiRoot as any, context, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockInStore).toHaveBeenCalledWith({storeKey: 'store-key'});
      expect(mockCarts).toHaveBeenCalled();
      expect(mockReplicate).toHaveBeenCalled();
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          reference: {id: 'cart-id', typeId: 'cart'},
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const params = {
        reference: {id: 'cart-id', typeId: 'cart'},
      } as z.infer<typeof replicateCartParameters>;
      mockExecute.mockRejectedValueOnce(new Error('Replication failed'));

      await expect(
        replicateCart(mockApiRoot as any, context, params)
      ).rejects.toThrow('Failed to replicate cart');
    });
  });

  describe('updateCart', () => {
    it('should update a cart by ID', async () => {
      const params = {
        id: 'cart-id',
        version: 1,
        actions: [
          {action: 'addLineItem', productId: 'product-id', quantity: 1},
        ],
      } as z.infer<typeof updateCartParameters>;
      await updateCart(mockApiRoot as any, context, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockCarts).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'cart-id'});
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          version: 1,
          actions: [
            {action: 'addLineItem', productId: 'product-id', quantity: 1},
          ],
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should update a cart by key', async () => {
      const params = {
        key: 'cart-key',
        version: 1,
        actions: [
          {action: 'addLineItem', productId: 'product-id', quantity: 1},
        ],
      } as z.infer<typeof updateCartParameters>;
      await updateCart(mockApiRoot as any, context, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockCarts).toHaveBeenCalled();
      expect(mockWithKey).toHaveBeenCalledWith({key: 'cart-key'});
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          version: 1,
          actions: [
            {action: 'addLineItem', productId: 'product-id', quantity: 1},
          ],
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should update a cart in store by ID', async () => {
      const params = {
        id: 'cart-id',
        version: 1,
        actions: [
          {action: 'addLineItem', productId: 'product-id', quantity: 1},
        ],
        storeKey: 'store-key',
      } as z.infer<typeof updateCartParameters>;
      await updateCart(mockApiRoot as any, context, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockInStore).toHaveBeenCalledWith({storeKey: 'store-key'});
      expect(mockCarts).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'cart-id'});
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          version: 1,
          actions: [
            {action: 'addLineItem', productId: 'product-id', quantity: 1},
          ],
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should throw an error when neither id nor key is provided', async () => {
      const params = {
        version: 1,
        actions: [
          {action: 'addLineItem', productId: 'product-id', quantity: 1},
        ],
      } as z.infer<typeof updateCartParameters>;

      await expect(
        updateCart(mockApiRoot as any, context, params)
      ).rejects.toThrow('Failed to update cart');
    });

    it('should handle errors', async () => {
      const params = {
        id: 'cart-id',
        version: 1,
        actions: [
          {action: 'addLineItem', productId: 'product-id', quantity: 1},
        ],
      } as z.infer<typeof updateCartParameters>;
      mockExecute.mockRejectedValueOnce(new Error('Update failed'));

      await expect(
        updateCart(mockApiRoot as any, context, params)
      ).rejects.toThrow('Failed to update cart');
    });
  });
});
