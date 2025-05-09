import CommercetoolsAgentToolkit from '../toolkit';
import * as customerFunctions from '../../shared/customer/functions';

jest.mock('../../shared/customer/functions');

describe('CommercetoolsAgentToolkit', () => {
  let toolkit: CommercetoolsAgentToolkit;
  const mockConfig = {
    clientId: 'test-client-id',
    clientSecret: 'test-client-secret',
    authUrl: 'https://auth.test',
    projectKey: 'test-project',
    apiUrl: 'https://api.test',
    configuration: {
      actions: {
        products: {
          read: true,
        },
        categories: {
          read: true,
        },
      },
      context: {
        customerId: 'test-customer-id',
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    toolkit = new CommercetoolsAgentToolkit(mockConfig);
    // Mock private methods that aren't directly testable
    (toolkit as any).registerAllTools = jest.fn();
  });

  describe('authenticateCustomer', () => {
    it('should authenticate a valid customer', async () => {
      // Mock getCustomerById to return a customer
      const mockCustomer = {
        id: 'test-customer-id',
        firstName: 'Test',
        lastName: 'Customer',
      };
      (customerFunctions.getCustomerById as jest.Mock).mockResolvedValue(
        mockCustomer
      );

      await toolkit.authenticateCustomer();

      expect(customerFunctions.getCustomerById).toHaveBeenCalledWith(
        expect.anything(),
        {projectKey: 'test-project'},
        {id: 'test-customer-id'}
      );
      expect((toolkit as any).registerAllTools).toHaveBeenCalled();
    });

    it('should throw an error when customer is not found', async () => {
      // Mock getCustomerById to return null (customer not found)
      (customerFunctions.getCustomerById as jest.Mock).mockResolvedValue(null);

      await expect(toolkit.authenticateCustomer()).rejects.toThrow(
        'Customer not found'
      );

      expect((toolkit as any).registerAllTools).not.toHaveBeenCalled();
    });

    it('should do nothing if customerId is not provided', async () => {
      // Create toolkit without customerId
      const toolkitWithoutCustomer = new CommercetoolsAgentToolkit({
        ...mockConfig,
        configuration: {
          actions: {
            products: {
              read: true,
            },
          },
          context: {},
        },
      });

      const result = await toolkitWithoutCustomer.authenticateCustomer();

      expect(result).toBeUndefined();
      expect(customerFunctions.getCustomerById).not.toHaveBeenCalled();
    });
  });
});
