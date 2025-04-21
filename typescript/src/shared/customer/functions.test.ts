import {
  createCustomer,
  createCustomerInStore,
  getCustomerById,
  getCustomerInStoreById,
  queryCustomers,
  updateCustomer,
  updateCustomerInStore,
} from './functions';
import {ApiRoot} from '@commercetools/platform-sdk';

// Mock the ApiRoot and its methods
const mockExecute = jest.fn();
const mockPost = jest.fn(() => ({execute: mockExecute}));
const mockGet = jest.fn(() => ({execute: mockExecute}));
const mockWithId = jest.fn(() => ({
  get: mockGet,
  post: mockPost,
}));
const mockInStoreKeyWithStoreKeyValue = jest.fn(() => ({
  customers: jest.fn(() => ({
    post: mockPost,
    withId: mockWithId,
  })),
}));
const mockCustomers = jest.fn(() => ({
  post: mockPost,
  get: mockGet,
  withId: mockWithId,
}));
const mockWithProjectKey = jest.fn(() => ({
  customers: mockCustomers,
  inStoreKeyWithStoreKeyValue: mockInStoreKeyWithStoreKeyValue,
}));

const apiRootMock = {
  withProjectKey: mockWithProjectKey,
} as unknown as ApiRoot;

const context = {projectKey: 'test-project'};

describe('Customer Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Set up successful response mock
    mockExecute.mockResolvedValue({
      body: {id: 'customer-id', version: 1},
    });
  });

  describe('createCustomer', () => {
    it('should create a customer successfully', async () => {
      const params = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = await createCustomer(apiRootMock, context, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({projectKey: 'test-project'});
      expect(mockCustomers).toHaveBeenCalled();
      expect(mockPost).toHaveBeenCalledWith({
        body: params,
      });
      expect(mockExecute).toHaveBeenCalled();
      expect(result).toEqual({id: 'customer-id', version: 1});
    });

    it('should throw an error when creation fails', async () => {
      mockExecute.mockRejectedValueOnce(new Error('API error'));
      
      const params = {
        email: 'test@example.com',
        password: 'password123',
      };

      await expect(createCustomer(apiRootMock, context, params)).rejects.toThrow(
        'Failed to create customer: API error'
      );
    });
  });

  describe('createCustomerInStore', () => {
    it('should create a customer in store successfully', async () => {
      const params = {
        email: 'test@example.com',
        password: 'password123',
        storeKey: 'store-key',
      };

      const result = await createCustomerInStore(apiRootMock, context, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({projectKey: 'test-project'});
      expect(mockInStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({storeKey: 'store-key'});
      expect(mockPost).toHaveBeenCalledWith({
        body: expect.objectContaining({
          email: 'test@example.com',
          password: 'password123',
        }),
      });
      expect(mockExecute).toHaveBeenCalled();
      expect(result).toEqual({id: 'customer-id', version: 1});
    });

    it('should throw an error when creation fails', async () => {
      mockExecute.mockRejectedValueOnce(new Error('API error'));
      
      const params = {
        email: 'test@example.com',
        password: 'password123',
        storeKey: 'store-key',
      };

      await expect(createCustomerInStore(apiRootMock, context, params)).rejects.toThrow(
        'Failed to create customer in store: API error'
      );
    });
  });

  describe('getCustomerById', () => {
    it('should get a customer by ID successfully', async () => {
      const params = {
        id: 'customer-id',
      };

      const result = await getCustomerById(apiRootMock, context, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({projectKey: 'test-project'});
      expect(mockCustomers).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'customer-id'});
      expect(mockGet).toHaveBeenCalled();
      expect(mockExecute).toHaveBeenCalled();
      expect(result).toEqual({id: 'customer-id', version: 1});
    });

    it('should include expand parameter when provided', async () => {
      const params = {
        id: 'customer-id',
        expand: ['customerGroup'],
      };

      await getCustomerById(apiRootMock, context, params);

      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {expand: ['customerGroup']},
      });
    });

    it('should throw an error when retrieval fails', async () => {
      mockExecute.mockRejectedValueOnce(new Error('API error'));
      
      const params = {
        id: 'customer-id',
      };

      await expect(getCustomerById(apiRootMock, context, params)).rejects.toThrow(
        'Failed to get customer: API error'
      );
    });
  });

  describe('getCustomerInStoreById', () => {
    it('should get a customer in store by ID successfully', async () => {
      const params = {
        id: 'customer-id',
        storeKey: 'store-key',
      };

      const result = await getCustomerInStoreById(apiRootMock, context, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({projectKey: 'test-project'});
      expect(mockInStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({storeKey: 'store-key'});
      expect(mockWithId).toHaveBeenCalledWith({ID: 'customer-id'});
      expect(mockGet).toHaveBeenCalled();
      expect(mockExecute).toHaveBeenCalled();
      expect(result).toEqual({id: 'customer-id', version: 1});
    });

    it('should include expand parameter when provided', async () => {
      const params = {
        id: 'customer-id',
        storeKey: 'store-key',
        expand: ['customerGroup'],
      };

      await getCustomerInStoreById(apiRootMock, context, params);

      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {expand: ['customerGroup']},
      });
    });

    it('should throw an error when retrieval fails', async () => {
      mockExecute.mockRejectedValueOnce(new Error('API error'));
      
      const params = {
        id: 'customer-id',
        storeKey: 'store-key',
      };

      await expect(getCustomerInStoreById(apiRootMock, context, params)).rejects.toThrow(
        'Failed to get customer in store: API error'
      );
    });
  });

  describe('queryCustomers', () => {
    it('should query customers successfully with default parameters', async () => {
      const params = {};

      const result = await queryCustomers(apiRootMock, context, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({projectKey: 'test-project'});
      expect(mockCustomers).toHaveBeenCalled();
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {limit: 10},
      });
      expect(mockExecute).toHaveBeenCalled();
      expect(result).toEqual({id: 'customer-id', version: 1});
    });

    it('should include all query parameters when provided', async () => {
      const params = {
        limit: 20,
        offset: 10,
        sort: ['firstName asc'],
        where: ['email = "test@example.com"'],
        expand: ['customerGroup'],
      };

      await queryCustomers(apiRootMock, context, params);

      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          limit: 20,
          offset: 10,
          sort: ['firstName asc'],
          where: ['email = "test@example.com"'],
          expand: ['customerGroup'],
        },
      });
    });

    it('should throw an error when query fails', async () => {
      mockExecute.mockRejectedValueOnce(new Error('API error'));
      
      await expect(queryCustomers(apiRootMock, context, {})).rejects.toThrow(
        'Failed to query customers: API error'
      );
    });
  });

  describe('updateCustomer', () => {
    it('should update a customer successfully', async () => {
      const params = {
        id: 'customer-id',
        version: 1,
        actions: [
          {
            action: 'setFirstName',
            firstName: 'John',
          },
        ],
      };

      const result = await updateCustomer(apiRootMock, context, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({projectKey: 'test-project'});
      expect(mockCustomers).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'customer-id'});
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          version: 1,
          actions: [
            {
              action: 'setFirstName',
              firstName: 'John',
            },
          ],
        },
      });
      expect(mockExecute).toHaveBeenCalled();
      expect(result).toEqual({id: 'customer-id', version: 1});
    });

    it('should throw an error when update fails', async () => {
      mockExecute.mockRejectedValueOnce(new Error('API error'));
      
      const params = {
        id: 'customer-id',
        version: 1,
        actions: [
          {
            action: 'setFirstName',
            firstName: 'John',
          },
        ],
      };

      await expect(updateCustomer(apiRootMock, context, params)).rejects.toThrow(
        'Failed to update customer: API error'
      );
    });
  });

  describe('updateCustomerInStore', () => {
    it('should update a customer in store successfully', async () => {
      const params = {
        id: 'customer-id',
        version: 1,
        storeKey: 'store-key',
        actions: [
          {
            action: 'setFirstName',
            firstName: 'John',
          },
        ],
      };

      const result = await updateCustomerInStore(apiRootMock, context, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({projectKey: 'test-project'});
      expect(mockInStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({storeKey: 'store-key'});
      expect(mockWithId).toHaveBeenCalledWith({ID: 'customer-id'});
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          version: 1,
          actions: [
            {
              action: 'setFirstName',
              firstName: 'John',
            },
          ],
        },
      });
      expect(mockExecute).toHaveBeenCalled();
      expect(result).toEqual({id: 'customer-id', version: 1});
    });

    it('should throw an error when update fails', async () => {
      mockExecute.mockRejectedValueOnce(new Error('API error'));
      
      const params = {
        id: 'customer-id',
        version: 1,
        storeKey: 'store-key',
        actions: [
          {
            action: 'setFirstName',
            firstName: 'John',
          },
        ],
      };

      await expect(updateCustomerInStore(apiRootMock, context, params)).rejects.toThrow(
        'Failed to update customer in store: API error'
      );
    });
  });
}); 