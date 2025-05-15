import {z} from 'zod';
import {
  getCustomerByIdParameters,
  queryCustomersParameters,
} from './parameters';
import {ApiRoot} from '@commercetools/platform-sdk';
import {SDKError} from '../errors/sdkError';
import {readCustomerById, queryCustomers} from './base.functions';

// Helper function to verify that a customer can read their own profile
export const readCustomerProfile = async (
  apiRoot: ApiRoot,
  context: {projectKey: string; customerId: string},
  params: z.infer<typeof getCustomerByIdParameters>
) => {
  try {
    // Customer can only access their own profile
    if (params.id !== context.customerId) {
      throw new SDKError(
        'Access denied: Customers can only view their own profile',
        {
          statusCode: 403,
        }
      );
    }

    return await readCustomerById(
      apiRoot,
      context.projectKey,
      params.id,
      params.expand
    );
  } catch (error: any) {
    throw new SDKError('Failed to read customer profile', error);
  }
};
