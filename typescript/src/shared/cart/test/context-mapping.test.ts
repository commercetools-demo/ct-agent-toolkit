import {
  readCart,
  createCart,
  updateCart,
  replicateCart,
  contextToCartFunctionMapping,
} from '../functions';
import * as customer from '../customer.functions';
import * as store from '../store.functions';
import * as admin from '../admin.functions';
import {
  ApiRoot,
  Cart,
  CartPagedQueryResponse,
} from '@commercetools/platform-sdk';
import {readCartParameters} from '../parameters';
import {z} from 'zod';

// Mock ApiRoot
const mockApiRoot = {} as ApiRoot;

// Mock return values
const mockCustomerRead = {id: 'mock-cart-id', customerId: 'customer-1'} as Cart;
const mockCustomerCreate = {
  id: 'mock-cart-id',
  customerId: 'customer-1',
} as Cart;
const mockCustomerUpdate = {
  id: 'mock-cart-id',
  customerId: 'customer-1',
} as Cart;
const mockCustomerReplicate = {
  id: 'mock-cart-id',
  customerId: 'customer-1',
} as Cart;

const mockStoreRead = {id: 'mock-cart-id', store: {key: 'store-1'}} as Cart;
const mockStoreCreate = {id: 'mock-cart-id', store: {key: 'store-1'}} as Cart;
const mockStoreUpdate = {id: 'mock-cart-id', store: {key: 'store-1'}} as Cart;
const mockStoreReplicate = {
  id: 'mock-cart-id',
  store: {key: 'store-1'},
} as Cart;

const mockAdminRead = {id: 'mock-cart-id'} as Cart;
const mockAdminCreate = {id: 'mock-cart-id'} as Cart;
const mockAdminUpdate = {id: 'mock-cart-id'} as Cart;
const mockAdminReplicate = {id: 'mock-cart-id'} as Cart;

describe('Cart Function Context Mapping', () => {
  // Mock the scope functions
  beforeEach(() => {
    jest
      .spyOn(customer, 'readCustomerCart')
      .mockResolvedValue(mockCustomerRead);
    jest
      .spyOn(customer, 'createCustomerCart')
      .mockResolvedValue(mockCustomerCreate);
    jest
      .spyOn(customer, 'updateCustomerCart')
      .mockResolvedValue(mockCustomerUpdate);
    jest
      .spyOn(customer, 'replicateCustomerCart')
      .mockResolvedValue(mockCustomerReplicate);

    jest.spyOn(store, 'readStoreCart').mockResolvedValue(mockStoreRead);
    jest.spyOn(store, 'createStoreCart').mockResolvedValue(mockStoreCreate);
    jest.spyOn(store, 'updateStoreCart').mockResolvedValue(mockStoreUpdate);
    jest
      .spyOn(store, 'replicateStoreCart')
      .mockResolvedValue(mockStoreReplicate);

    jest.spyOn(admin, 'readAdminCart').mockResolvedValue(mockAdminRead);
    jest.spyOn(admin, 'createAdminCart').mockResolvedValue(mockAdminCreate);
    jest.spyOn(admin, 'updateAdminCart').mockResolvedValue(mockAdminUpdate);
    jest
      .spyOn(admin, 'replicateAdminCart')
      .mockResolvedValue(mockAdminReplicate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('contextToCartFunctionMapping', () => {
    it('returns customer functions when customerId is provided', () => {
      const functionMap = contextToCartFunctionMapping({
        customerId: 'customer-1',
      });

      expect(functionMap.read_cart).toBe(customer.readCustomerCart);
      expect(functionMap.create_cart).toBe(customer.createCustomerCart);
      expect(functionMap.update_cart).toBe(customer.updateCustomerCart);
      expect(functionMap.replicate_cart).toBe(customer.replicateCustomerCart);
    });

    it('returns store functions when storeKey is provided', () => {
      const functionMap = contextToCartFunctionMapping({storeKey: 'store-1'});

      expect(functionMap.read_cart).toBe(store.readStoreCart);
      expect(functionMap.create_cart).toBe(store.createStoreCart);
      expect(functionMap.update_cart).toBe(store.updateStoreCart);
      expect(functionMap.replicate_cart).toBe(store.replicateStoreCart);
    });

    it('returns admin functions when neither customerId nor storeKey is provided', () => {
      const functionMap = contextToCartFunctionMapping({});

      expect(functionMap.read_cart).toBe(admin.readAdminCart);
      expect(functionMap.create_cart).toBe(admin.createAdminCart);
      expect(functionMap.update_cart).toBe(admin.updateAdminCart);
      expect(functionMap.replicate_cart).toBe(admin.replicateAdminCart);
    });

    it('prioritizes customerId over storeKey when both are provided', () => {
      const functionMap = contextToCartFunctionMapping({
        customerId: 'customer-1',
        storeKey: 'store-1',
      });

      expect(functionMap.read_cart).toBe(customer.readCustomerCart);
      expect(functionMap.create_cart).toBe(customer.createCustomerCart);
      expect(functionMap.update_cart).toBe(customer.updateCustomerCart);
      expect(functionMap.replicate_cart).toBe(customer.replicateCustomerCart);
    });
  });

  describe('readCart', () => {
    it('uses customer scope when customerId is provided in context', async () => {
      const result = await readCart(
        mockApiRoot,
        {
          projectKey: 'test-project',
          customerId: 'customer-1',
        },
        {} as z.infer<typeof readCartParameters>
      );

      expect(result).toBe(mockCustomerRead);
      expect(customer.readCustomerCart).toHaveBeenCalled();
      expect(store.readStoreCart).not.toHaveBeenCalled();
      expect(admin.readAdminCart).not.toHaveBeenCalled();
    });

    it('uses store scope when storeKey is provided in context', async () => {
      const result = await readCart(
        mockApiRoot,
        {
          projectKey: 'test-project',
          storeKey: 'store-1',
        },
        {} as z.infer<typeof readCartParameters>
      );

      expect(result).toBe(mockStoreRead);
      expect(store.readStoreCart).toHaveBeenCalled();
      expect(customer.readCustomerCart).not.toHaveBeenCalled();
      expect(admin.readAdminCart).not.toHaveBeenCalled();
    });

    it('uses store scope when storeKey is provided in params', async () => {
      const result = await readCart(
        mockApiRoot,
        {
          projectKey: 'test-project',
        },
        {storeKey: 'store-1'} as z.infer<typeof readCartParameters>
      );

      expect(result).toBe(mockStoreRead);
      expect(store.readStoreCart).toHaveBeenCalled();
      expect(customer.readCustomerCart).not.toHaveBeenCalled();
      expect(admin.readAdminCart).not.toHaveBeenCalled();
    });

    it('uses admin scope when neither customerId nor storeKey is provided', async () => {
      const result = await readCart(
        mockApiRoot,
        {
          projectKey: 'test-project',
        },
        {} as z.infer<typeof readCartParameters>
      );

      expect(result).toBe(mockAdminRead);
      expect(admin.readAdminCart).toHaveBeenCalled();
      expect(customer.readCustomerCart).not.toHaveBeenCalled();
      expect(store.readStoreCart).not.toHaveBeenCalled();
    });
  });

  // Similar tests for createCart, updateCart, and replicateCart
  describe('createCart', () => {
    it('uses customer scope when customerId is provided in context', async () => {
      const result = await createCart(
        mockApiRoot,
        {
          projectKey: 'test-project',
          customerId: 'customer-1',
        },
        {} as any
      );

      expect(result).toBe(mockCustomerCreate);
      expect(customer.createCustomerCart).toHaveBeenCalled();
    });

    it('uses store scope when storeKey is provided via params.store.key', async () => {
      const result = await createCart(
        mockApiRoot,
        {
          projectKey: 'test-project',
        },
        {store: {key: 'store-1', typeId: 'store'}} as any
      );

      expect(result).toBe(mockStoreCreate);
      expect(store.createStoreCart).toHaveBeenCalled();
    });
  });

  describe('updateCart', () => {
    it('uses customer scope when customerId is provided in context', async () => {
      const result = await updateCart(
        mockApiRoot,
        {
          projectKey: 'test-project',
          customerId: 'customer-1',
        },
        {} as any
      );

      expect(result).toBe(mockCustomerUpdate);
      expect(customer.updateCustomerCart).toHaveBeenCalled();
    });
  });

  describe('replicateCart', () => {
    it('uses store scope when storeKey is provided in params', async () => {
      const result = await replicateCart(
        mockApiRoot,
        {
          projectKey: 'test-project',
        },
        {storeKey: 'store-1'} as any
      );

      expect(result).toBe(mockStoreReplicate);
      expect(store.replicateStoreCart).toHaveBeenCalled();
    });
  });
});
