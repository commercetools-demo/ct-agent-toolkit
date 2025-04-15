import {
  createCustomer,
  createCustomerInStore,
  getCustomerById,
  getCustomerInStoreById,
  queryCustomers,
  updateCustomer,
} from '../functions';

// Mock ApiRoot
const mockExecute = jest.fn();
const mockApiRoot = {
  withProjectKey: jest.fn().mockReturnValue({
    customers: jest.fn().mockReturnValue({
      post: jest.fn().mockReturnValue({
        execute: mockExecute,
      }),
      get: jest.fn().mockReturnValue({
        execute: mockExecute,
      }),
      withId: jest.fn().mockReturnValue({
        get: jest.fn().mockReturnValue({
          execute: mockExecute,
        }),
        post: jest.fn().mockReturnValue({
          execute: mockExecute,
        }),
      }),
    }),
    inStoreKeyWithStoreKeyValue: jest.fn().mockReturnValue({
      customers: jest.fn().mockReturnValue({
        post: jest.fn().mockReturnValue({
          execute: mockExecute,
        }),
        get: jest.fn().mockReturnValue({
          execute: mockExecute,
        }),
        withId: jest.fn().mockReturnValue({
          get: jest.fn().mockReturnValue({
            execute: mockExecute,
          }),
          post: jest.fn().mockReturnValue({
            execute: mockExecute,
          }),
        }),
      }),
    }),
  }),
};

describe('Customer Functions', () => {
  const context = {projectKey: 'test-project'};

  beforeEach(() => {
    jest.clearAllMocks();
    mockExecute.mockReset();
  });

  describe('createCustomer', () => {
    const params = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    };

    it('should create a customer successfully', async () => {
      const mockResponse = {
        body: {
          id: 'customer-id',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
        },
      };
      mockExecute.mockResolvedValueOnce(mockResponse);

      const result = await createCustomer(mockApiRoot as any, context, params);

      expect(result).toEqual(mockResponse.body);
      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
    });

    it('should throw an error when creation fails', async () => {
      mockExecute.mockRejectedValueOnce(new Error('API error'));

      await expect(
        createCustomer(mockApiRoot as any, context, params)
      ).rejects.toThrow('Failed to create customer: API error');
    });
  });

  describe('createCustomerInStore', () => {
    const params = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      storeKey: 'store-key',
    };

    it('should create a customer in store successfully', async () => {
      const mockResponse = {
        body: {
          id: 'customer-id',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
        },
      };
      mockExecute.mockResolvedValueOnce(mockResponse);

      const result = await createCustomerInStore(
        mockApiRoot as any,
        context,
        params
      );

      expect(result).toEqual(mockResponse.body);
      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
    });

    it('should throw an error when creation fails', async () => {
      mockExecute.mockRejectedValueOnce(new Error('API error'));

      await expect(
        createCustomerInStore(mockApiRoot as any, context, params)
      ).rejects.toThrow('Failed to create customer in store: API error');
    });
  });

  // Add similar tests for other functions
  describe('getCustomerById', () => {
    const params = {
      id: 'customer-id',
    };

    it('should get a customer by id successfully', async () => {
      const mockResponse = {
        body: {
          id: 'customer-id',
          email: 'test@example.com',
        },
      };
      mockExecute.mockResolvedValueOnce(mockResponse);

      const result = await getCustomerById(mockApiRoot as any, context, params);

      expect(result).toEqual(mockResponse.body);
    });
  });

  describe('updateCustomer', () => {
    const params = {
      id: 'customer-id',
      version: 1,
      actions: [
        {
          action: 'setFirstName',
          firstName: 'Jane',
        },
      ],
    };

    it('should update a customer successfully', async () => {
      const mockResponse = {
        body: {
          id: 'customer-id',
          version: 2,
          firstName: 'Jane',
        },
      };
      mockExecute.mockResolvedValueOnce(mockResponse);

      const result = await updateCustomer(mockApiRoot as any, context, params);

      expect(result).toEqual(mockResponse.body);
    });
  });
});
