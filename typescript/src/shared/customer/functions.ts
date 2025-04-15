import {z} from 'zod';
import {
  createCustomerParameters,
  createCustomerInStoreParameters,
  getCustomerByIdParameters,
  getCustomerInStoreByIdParameters,
  queryCustomersParameters,
  updateCustomerParameters,
} from './parameters';
import {
  ApiRoot,
  CustomerDraft,
  CustomerUpdateAction,
} from '@commercetools/platform-sdk';

export const createCustomer = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof createCustomerParameters>
) => {
  try {
    const customer = await apiRoot
      .withProjectKey({projectKey: context.projectKey})
      .customers()
      .post({
        body: params as CustomerDraft,
      })
      .execute();

    return customer.body;
  } catch (error: any) {
    throw new Error('Failed to create customer: ' + error.message);
  }
};

export const createCustomerInStore = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof createCustomerInStoreParameters>
) => {
  try {
    const {storeKey, ...customerDraft} = params;
    const customer = await apiRoot
      .withProjectKey({projectKey: context.projectKey})
      .inStoreKeyWithStoreKeyValue({storeKey})
      .customers()
      .post({
        body: customerDraft as CustomerDraft,
      })
      .execute();

    return customer.body;
  } catch (error: any) {
    throw new Error('Failed to create customer in store: ' + error.message);
  }
};

export const getCustomerById = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof getCustomerByIdParameters>
) => {
  try {
    const customer = await apiRoot
      .withProjectKey({projectKey: context.projectKey})
      .customers()
      .withId({ID: params.id})
      .get({
        queryArgs: {
          ...(params.expand && {expand: params.expand}),
        },
      })
      .execute();

    return customer.body;
  } catch (error: any) {
    throw new Error('Failed to get customer: ' + error.message);
  }
};

export const getCustomerInStoreById = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof getCustomerInStoreByIdParameters>
) => {
  try {
    const customer = await apiRoot
      .withProjectKey({projectKey: context.projectKey})
      .inStoreKeyWithStoreKeyValue({storeKey: params.storeKey})
      .customers()
      .withId({ID: params.id})
      .get({
        queryArgs: {
          ...(params.expand && {expand: params.expand}),
        },
      })
      .execute();

    return customer.body;
  } catch (error: any) {
    throw new Error('Failed to get customer in store: ' + error.message);
  }
};

export const queryCustomers = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof queryCustomersParameters>
) => {
  try {
    const customers = await apiRoot
      .withProjectKey({projectKey: context.projectKey})
      .customers()
      .get({
        queryArgs: {
          limit: params.limit || 10,
          ...(params.offset && {offset: params.offset}),
          ...(params.sort && {sort: params.sort}),
          ...(params.where && {where: params.where}),
          ...(params.expand && {expand: params.expand}),
        },
      })
      .execute();

    return customers.body;
  } catch (error: any) {
    throw new Error('Failed to query customers: ' + error.message);
  }
};

export const updateCustomer = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof updateCustomerParameters>
) => {
  try {
    const customer = await apiRoot
      .withProjectKey({projectKey: context.projectKey})
      .customers()
      .withId({ID: params.id})
      .post({
        body: {
          version: params.version,
          actions: params.actions as CustomerUpdateAction[],
        },
      })
      .execute();

    return customer.body;
  } catch (error: any) {
    throw new Error('Failed to update customer: ' + error.message);
  }
};
