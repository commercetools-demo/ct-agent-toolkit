import {
  readOrder,
  createOrderFromCart,
  createOrderFromQuote,
  createOrderByImport,
  updateOrder,
} from '../functions';
import {ApiRoot} from '@commercetools/platform-sdk';

// Mock the ApiRoot
const mockExecute = jest.fn();
const mockGet = jest.fn(() => ({execute: mockExecute}));
const mockPost = jest.fn(() => ({execute: mockExecute}));
const mockWithOrderNumber = jest.fn(() => ({get: mockGet, post: mockPost}));
const mockWithId = jest.fn(() => ({get: mockGet, post: mockPost}));
const mockImportOrder = jest.fn(() => ({post: mockPost}));
const mockFromQuote = jest.fn(() => ({post: mockPost}));
const mockOrders = jest.fn(() => ({
  get: mockGet,
  post: mockPost,
  withId: mockWithId,
  withOrderNumber: mockWithOrderNumber,
  importOrder: mockImportOrder,
  fromQuote: mockFromQuote,
}));
const mockInStoreKeyWithStoreKeyValue = jest.fn(() => ({
  orders: mockOrders,
}));
const mockWithProjectKey = jest.fn(() => ({
  orders: mockOrders,
  inStoreKeyWithStoreKeyValue: mockInStoreKeyWithStoreKeyValue,
}));

const mockApiRoot = {
  withProjectKey: mockWithProjectKey,
} as unknown as ApiRoot;

const mockContext = {projectKey: 'test-project'};

describe('Order Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockExecute.mockResolvedValue({body: {}});
  });

  describe('readOrder', () => {
    it('should read order by ID', async () => {
      await readOrder(mockApiRoot, mockContext, {
        id: 'test-order-id',
      });

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockOrders).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'test-order-id'});
      expect(mockGet).toHaveBeenCalled();
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should read order by order number', async () => {
      await readOrder(mockApiRoot, mockContext, {
        orderNumber: 'test-order-number',
      });

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockOrders).toHaveBeenCalled();
      expect(mockWithOrderNumber).toHaveBeenCalledWith({
        orderNumber: 'test-order-number',
      });
      expect(mockGet).toHaveBeenCalled();
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should read order in store by ID', async () => {
      await readOrder(mockApiRoot, mockContext, {
        id: 'test-order-id',
        storeKey: 'test-store',
      });

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockInStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
        storeKey: 'test-store',
      });
      expect(mockOrders).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'test-order-id'});
      expect(mockGet).toHaveBeenCalled();
      expect(mockExecute).toHaveBeenCalled();
    });
  });

  describe('createOrderFromCart', () => {
    it('should create order from cart', async () => {
      await createOrderFromCart(mockApiRoot, mockContext, {
        id: 'test-cart-id',
        version: 1,
      });

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockOrders).toHaveBeenCalled();
      expect(mockPost).toHaveBeenCalled();
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should create order from cart in store', async () => {
      await createOrderFromCart(mockApiRoot, mockContext, {
        id: 'test-cart-id',
        version: 1,
        storeKey: 'test-store',
      });

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockInStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
        storeKey: 'test-store',
      });
      expect(mockOrders).toHaveBeenCalled();
      expect(mockPost).toHaveBeenCalled();
      expect(mockExecute).toHaveBeenCalled();
    });
  });

  describe('updateOrder', () => {
    it('should update order by ID', async () => {
      await updateOrder(mockApiRoot, mockContext, {
        id: 'test-order-id',
        version: 1,
        actions: [{action: 'changeOrderState', orderState: 'Complete'}],
      });

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockOrders).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'test-order-id'});
      expect(mockPost).toHaveBeenCalled();
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should update order by order number', async () => {
      await updateOrder(mockApiRoot, mockContext, {
        orderNumber: 'test-order-number',
        version: 1,
        actions: [{action: 'changeOrderState', orderState: 'Complete'}],
      });

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockOrders).toHaveBeenCalled();
      expect(mockWithOrderNumber).toHaveBeenCalledWith({
        orderNumber: 'test-order-number',
      });
      expect(mockPost).toHaveBeenCalled();
      expect(mockExecute).toHaveBeenCalled();
    });
  });
});
