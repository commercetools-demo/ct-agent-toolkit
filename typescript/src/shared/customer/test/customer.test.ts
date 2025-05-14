import {
  createCustomer,
  createCustomerInStore,
  getCustomerById,
  getCustomerInStoreById,
  queryCustomers,
  updateCustomer,
} from '../functions';
import {CommercetoolsFuncContext} from '../../../types/configuration';
import * as baseFunctions from '../base.functions';

// Mock base functions
jest.mock('../base.functions', () => ({
  readCustomerById: jest.fn(),
  queryCustomers: jest.fn(),
  createCustomer: jest.fn(),
  updateCustomer: jest.fn(),
}));

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
  const adminContext: CommercetoolsFuncContext = {
    projectKey: 'test-project',
    isAdmin: true,
  };

  // Use a more specific type to ensure storeKey is required
  const storeContext: {projectKey: string; storeKey: string} = {
    projectKey: 'test-project',
    storeKey: 'store-key',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockExecute.mockReset();
    (baseFunctions.readCustomerById as jest.Mock).mockReset();
    (baseFunctions.updateCustomer as jest.Mock).mockReset();
    (baseFunctions.createCustomer as jest.Mock).mockReset();
    (baseFunctions.queryCustomers as jest.Mock).mockReset();
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
        id: 'customer-id',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };

      (baseFunctions.createCustomer as jest.Mock).mockResolvedValueOnce(
        mockResponse
      );

      const result = await createCustomer(
        mockApiRoot as any,
        adminContext,
        params
      );

      expect(result).toEqual(mockResponse);
      expect(baseFunctions.createCustomer).toHaveBeenCalled();
    });

    it('should throw an error when creation fails', async () => {
      (baseFunctions.createCustomer as jest.Mock).mockRejectedValueOnce(
        new Error('API error')
      );

      await expect(
        createCustomer(mockApiRoot as any, adminContext, params)
      ).rejects.toThrow('Failed to create customer');
    });
  });

  describe('createCustomerInStore', () => {
    const params = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    };

    it('should create a customer in store successfully', async () => {
      const mockResponse = {
        id: 'customer-id',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };

      (baseFunctions.createCustomer as jest.Mock).mockResolvedValueOnce(
        mockResponse
      );

      const result = await createCustomerInStore(
        mockApiRoot as any,
        storeContext,
        params
      );

      expect(result).toEqual(mockResponse);
      expect(baseFunctions.createCustomer).toHaveBeenCalled();
    });

    it('should throw an error when creation fails', async () => {
      (baseFunctions.createCustomer as jest.Mock).mockRejectedValueOnce(
        new Error('API error')
      );

      await expect(
        createCustomerInStore(mockApiRoot as any, storeContext, params)
      ).rejects.toThrow('Failed to create customer in store');
    });
  });

  describe('getCustomerById', () => {
    const params = {
      id: 'customer-id',
    };

    it('should get a customer by id successfully', async () => {
      const mockResponse = {
        id: 'customer-id',
        email: 'test@example.com',
      };

      (baseFunctions.readCustomerById as jest.Mock).mockResolvedValueOnce(
        mockResponse
      );

      const result = await getCustomerById(
        mockApiRoot as any,
        adminContext,
        params
      );

      expect(result).toEqual(mockResponse);
      expect(baseFunctions.readCustomerById).toHaveBeenCalled();
    });
  });

  describe('getCustomerInStoreById', () => {
    const params = {
      id: 'customer-id',
    };

    it('should get a customer in store by id successfully', async () => {
      const mockResponse = {
        id: 'customer-id',
        email: 'test@example.com',
      };

      (baseFunctions.readCustomerById as jest.Mock).mockResolvedValueOnce(
        mockResponse
      );

      const result = await getCustomerInStoreById(
        mockApiRoot as any,
        storeContext,
        params
      );

      expect(result).toEqual(mockResponse);
      expect(baseFunctions.readCustomerById).toHaveBeenCalled();
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
      const mockCustomer = {
        id: 'customer-id',
        version: 1,
      };

      const mockResponse = {
        id: 'customer-id',
        version: 2,
        firstName: 'Jane',
      };

      // Mock the readCustomerById call inside updateCustomer
      (baseFunctions.readCustomerById as jest.Mock).mockResolvedValueOnce(
        mockCustomer
      );
      (baseFunctions.updateCustomer as jest.Mock).mockResolvedValueOnce(
        mockResponse
      );

      const result = await updateCustomer(
        mockApiRoot as any,
        adminContext,
        params
      );

      expect(result).toEqual(mockResponse);
      expect(baseFunctions.updateCustomer).toHaveBeenCalled();
    });
  });
});
