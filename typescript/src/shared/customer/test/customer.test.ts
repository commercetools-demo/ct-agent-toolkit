import {
  createCustomer,
  createCustomerInStore,
  getCustomerById,
  getCustomerInStoreById,
  queryCustomers,
  updateCustomer,
} from '../functions';
import {
  getCustomerByIdParameters,
  queryCustomersParameters,
} from '../parameters';
import {z} from 'zod';

// Mock ApiRoot
const mockExecute = jest.fn();
const mockCustomersGet = jest.fn().mockReturnValue({execute: mockExecute});
const mockCustomersPost = jest.fn().mockReturnValue({execute: mockExecute});
const mockCustomersWithIdGet = jest
  .fn()
  .mockReturnValue({execute: mockExecute});
const mockCustomersWithIdPost = jest
  .fn()
  .mockReturnValue({execute: mockExecute});

const mockCustomersWithId = jest.fn().mockReturnValue({
  get: mockCustomersWithIdGet,
  post: mockCustomersWithIdPost,
});

const mockCustomersCollection = jest.fn().mockReturnValue({
  post: mockCustomersPost,
  get: mockCustomersGet,
  withId: mockCustomersWithId,
});

const mockInStoreCustomersWithIdGet = jest
  .fn()
  .mockReturnValue({execute: mockExecute});
const mockInStoreCustomersWithId = jest.fn().mockReturnValue({
  get: mockInStoreCustomersWithIdGet,
});
const mockInStoreCustomersPost = jest
  .fn()
  .mockReturnValue({execute: mockExecute});
const mockInStoreCustomersCollection = jest.fn().mockReturnValue({
  post: mockInStoreCustomersPost,
  withId: mockInStoreCustomersWithId,
});

const mockApiRoot = {
  withProjectKey: jest.fn().mockReturnValue({
    customers: mockCustomersCollection,
    inStoreKeyWithStoreKeyValue: jest.fn().mockReturnValue({
      customers: mockInStoreCustomersCollection,
    }),
  }),
};

describe('Customer Functions', () => {
  const context = {projectKey: 'test-project'};
  const storeKey = 'test-store';

  beforeEach(() => {
    jest.clearAllMocks();
    mockExecute.mockReset();
    mockCustomersGet.mockClear();
    mockCustomersPost.mockClear();
    mockCustomersWithIdGet.mockClear();
    mockCustomersWithIdPost.mockClear();
    mockCustomersWithId.mockClear();
    mockCustomersCollection.mockClear();
    mockInStoreCustomersWithIdGet.mockClear();
    mockInStoreCustomersWithId.mockClear();
    mockInStoreCustomersPost.mockClear();
    mockInStoreCustomersCollection.mockClear();
    (
      mockApiRoot.withProjectKey().inStoreKeyWithStoreKeyValue as jest.Mock
    ).mockClear();
    (mockApiRoot.withProjectKey as jest.Mock).mockClear();
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
      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith(context);
      expect(mockCustomersCollection).toHaveBeenCalled();
      expect(mockCustomersPost).toHaveBeenCalledWith({body: params});
      expect(mockExecute).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when creation fails', async () => {
      mockExecute.mockRejectedValueOnce(new Error('API error'));

      await expect(
        createCustomer(mockApiRoot as any, context, params)
      ).rejects.toThrow('Failed to create customer');
      expect(mockExecute).toHaveBeenCalledTimes(1);
    });
  });

  describe('createCustomerInStore', () => {
    const baseParams = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    };
    const params = {
      ...baseParams,
      storeKey,
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
      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith(context);
      expect(
        mockApiRoot.withProjectKey().inStoreKeyWithStoreKeyValue
      ).toHaveBeenCalledWith({storeKey});
      expect(mockInStoreCustomersCollection).toHaveBeenCalled();
      expect(mockInStoreCustomersPost).toHaveBeenCalledWith({body: baseParams});
      expect(mockExecute).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when creation fails', async () => {
      mockExecute.mockRejectedValueOnce(new Error('API error'));

      await expect(
        createCustomerInStore(mockApiRoot as any, context, params)
      ).rejects.toThrow('Failed to create customer in store');
      expect(mockExecute).toHaveBeenCalledTimes(1);
    });
  });

  describe('getCustomerById', () => {
    const baseParams: z.infer<typeof getCustomerByIdParameters> = {
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

      const result = await getCustomerById(
        mockApiRoot as any,
        context,
        baseParams
      );
      expect(result).toEqual(mockResponse.body);
      expect(mockCustomersWithIdGet).toHaveBeenCalledWith({queryArgs: {}});
      expect(mockExecute).toHaveBeenCalledTimes(1);
    });

    it('should get a customer by id with expand successfully (covers line 78)', async () => {
      const params = {...baseParams, expand: ['addresses[*].id']};
      const mockResponse = {body: {id: 'customer-id', expandData: {}}};
      mockExecute.mockResolvedValueOnce(mockResponse);

      await getCustomerById(mockApiRoot as any, context, params);

      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith(context);
      expect(mockCustomersCollection).toHaveBeenCalled();
      expect(mockCustomersWithId).toHaveBeenCalledWith({ID: params.id});
      expect(mockCustomersWithIdGet).toHaveBeenCalledWith({
        queryArgs: {expand: params.expand},
      });
      expect(mockExecute).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when retrieval fails', async () => {
      mockExecute.mockRejectedValueOnce(new Error('API error'));
      await expect(
        getCustomerById(mockApiRoot as any, context, baseParams)
      ).rejects.toThrow('Failed to get customer');
      expect(mockExecute).toHaveBeenCalledTimes(1);
    });
  });

  describe('getCustomerInStoreById', () => {
    const baseParams = {id: 'customer-id', storeKey};

    it('should get a customer in store by id successfully', async () => {
      const mockResponse = {body: {id: 'customer-id', storeData: 'test'}};
      mockExecute.mockResolvedValueOnce(mockResponse);

      const result = await getCustomerInStoreById(
        mockApiRoot as any,
        context,
        baseParams
      );
      expect(result).toEqual(mockResponse.body);
      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith(context);
      expect(
        mockApiRoot.withProjectKey().inStoreKeyWithStoreKeyValue
      ).toHaveBeenCalledWith({storeKey});
      expect(mockInStoreCustomersCollection).toHaveBeenCalled();
      expect(mockInStoreCustomersWithId).toHaveBeenCalledWith({
        ID: baseParams.id,
      });
      expect(mockInStoreCustomersWithIdGet).toHaveBeenCalledWith({
        queryArgs: {},
      });
      expect(mockExecute).toHaveBeenCalledTimes(1);
    });

    it('should get a customer in store by id with expand successfully', async () => {
      const params = {...baseParams, expand: ['paymentMethods[*]']};
      const mockResponse = {body: {id: 'customer-id', expanded: true}};
      mockExecute.mockResolvedValueOnce(mockResponse);

      await getCustomerInStoreById(mockApiRoot as any, context, params);
      expect(mockInStoreCustomersWithIdGet).toHaveBeenCalledWith({
        queryArgs: {expand: params.expand},
      });
      expect(mockExecute).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when retrieval fails in store', async () => {
      mockExecute.mockRejectedValueOnce(new Error('API error in store'));
      await expect(
        getCustomerInStoreById(mockApiRoot as any, context, baseParams)
      ).rejects.toThrow('Failed to get customer in store');
      expect(mockExecute).toHaveBeenCalledTimes(1);
    });
  });

  describe('queryCustomers', () => {
    const mockCustomerListResponse = {
      body: {
        results: [{id: '1'}, {id: '2'}],
        limit: 10,
        offset: 0,
        count: 2,
        total: 2,
      },
    };

    it('should query customers with default limit', async () => {
      mockExecute.mockResolvedValueOnce(mockCustomerListResponse);
      const params: z.infer<typeof queryCustomersParameters> = {};
      await queryCustomers(mockApiRoot as any, context, params);
      expect(mockCustomersGet).toHaveBeenCalledWith({queryArgs: {limit: 10}});
      expect(mockExecute).toHaveBeenCalledTimes(1);
    });

    it('should query customers with specified limit', async () => {
      mockExecute.mockResolvedValueOnce(mockCustomerListResponse);
      const params: z.infer<typeof queryCustomersParameters> = {limit: 5};
      await queryCustomers(mockApiRoot as any, context, params);
      expect(mockCustomersGet).toHaveBeenCalledWith({queryArgs: {limit: 5}});
    });

    it('should query customers with offset', async () => {
      mockExecute.mockResolvedValueOnce(mockCustomerListResponse);
      const params: z.infer<typeof queryCustomersParameters> = {offset: 10};
      await queryCustomers(mockApiRoot as any, context, params);
      expect(mockCustomersGet).toHaveBeenCalledWith({
        queryArgs: {limit: 10, offset: 10},
      });
    });

    it('should query customers with sort', async () => {
      mockExecute.mockResolvedValueOnce(mockCustomerListResponse);
      const params: z.infer<typeof queryCustomersParameters> = {
        sort: ['email asc'],
      };
      await queryCustomers(mockApiRoot as any, context, params);
      expect(mockCustomersGet).toHaveBeenCalledWith({
        queryArgs: {limit: 10, sort: ['email asc']},
      });
    });

    it('should query customers with where', async () => {
      mockExecute.mockResolvedValueOnce(mockCustomerListResponse);
      const params: z.infer<typeof queryCustomersParameters> = {
        where: ['firstName = "John"'],
      };
      await queryCustomers(mockApiRoot as any, context, params);
      expect(mockCustomersGet).toHaveBeenCalledWith({
        queryArgs: {limit: 10, where: ['firstName = "John"']},
      });
    });

    it('should query customers with expand', async () => {
      mockExecute.mockResolvedValueOnce(mockCustomerListResponse);
      const params: z.infer<typeof queryCustomersParameters> = {
        expand: ['orders[*]'],
      };
      await queryCustomers(mockApiRoot as any, context, params);
      expect(mockCustomersGet).toHaveBeenCalledWith({
        queryArgs: {limit: 10, expand: ['orders[*]']},
      });
    });

    it('should throw an error when query fails', async () => {
      mockExecute.mockRejectedValueOnce(new Error('API query error'));
      const params: z.infer<typeof queryCustomersParameters> = {};
      await expect(
        queryCustomers(mockApiRoot as any, context, params)
      ).rejects.toThrow('Failed to query customers');
      expect(mockExecute).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateCustomer', () => {
    const params = {
      id: 'customer-id',
      version: 1,
      actions: [
        {
          action: 'setFirstName' as const,
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

      const result = await updateCustomer(
        mockApiRoot as any,
        context,
        params as any
      );

      expect(result).toEqual(mockResponse.body);
      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith(context);
      expect(mockCustomersCollection).toHaveBeenCalled();
      expect(mockCustomersWithId).toHaveBeenCalledWith({ID: params.id});
      expect(mockCustomersWithIdPost).toHaveBeenCalledWith({
        body: {version: params.version, actions: params.actions},
      });
      expect(mockExecute).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when update fails (covers line 155)', async () => {
      mockExecute.mockRejectedValueOnce(new Error('API update error'));
      await expect(
        updateCustomer(mockApiRoot as any, context, params as any)
      ).rejects.toThrow('Failed to update customer');
      expect(mockExecute).toHaveBeenCalledTimes(1);
    });
  });
});
