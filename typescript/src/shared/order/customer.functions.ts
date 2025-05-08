import {z} from 'zod';
import {readOrderParameters} from './parameters';
import {ApiRoot} from '@commercetools/platform-sdk';
import {SDKError} from '../errors/sdkError';

// Helper function to handle reading an order by ID for a specific customer
const readOrderByIdForCustomer = async (
  apiRoot: ApiRoot,
  context: {projectKey: string; customerId?: string},
  params: {
    id: string;
    storeKey?: string;
    expand?: string[];
  }
) => {
  const whereConditions = [
    `id="${params.id}"`,
    `customerId="${context.customerId}"`,
  ];

  // Create API request with or without store
  const ordersRequest = params.storeKey
    ? apiRoot
        .withProjectKey({projectKey: context.projectKey})
        .inStoreKeyWithStoreKeyValue({storeKey: params.storeKey})
        .orders()
    : apiRoot.withProjectKey({projectKey: context.projectKey}).orders();

  // Execute the query with where conditions
  const response = await ordersRequest
    .get({
      queryArgs: {
        where: whereConditions,
        limit: 1,
        ...(params.expand && {expand: params.expand}),
      },
    })
    .execute();

  if (response.body.count === 0) {
    throw new Error(
      `Order with ID ${params.id} not found for customer ${context.customerId}`
    );
  }
  return response.body.results[0];
};

// Helper function to handle reading an order by orderNumber for a specific customer
const readOrderByOrderNumberForCustomer = async (
  apiRoot: ApiRoot,
  context: {projectKey: string; customerId?: string},
  params: {
    orderNumber: string;
    storeKey?: string;
    expand?: string[];
  }
) => {
  const whereConditions = [
    `orderNumber="${params.orderNumber}"`,
    `customerId="${context.customerId}"`,
  ];

  // Create API request with or without store
  const ordersRequest = params.storeKey
    ? apiRoot
        .withProjectKey({projectKey: context.projectKey})
        .inStoreKeyWithStoreKeyValue({storeKey: params.storeKey})
        .orders()
    : apiRoot.withProjectKey({projectKey: context.projectKey}).orders();

  // Execute the query with where conditions
  const response = await ordersRequest
    .get({
      queryArgs: {
        where: whereConditions,
        limit: 1,
        ...(params.expand && {expand: params.expand}),
      },
    })
    .execute();

  if (response.body.count === 0) {
    throw new Error(
      `Order with number ${params.orderNumber} not found for customer ${context.customerId}`
    );
  }
  return response.body.results[0];
};

// Helper function to handle querying orders for a specific customer
const queryOrdersForCustomer = async (
  apiRoot: ApiRoot,
  context: {projectKey: string; customerId?: string},
  params: {
    where: string[];
    storeKey?: string;
    limit?: number;
    offset?: number;
    sort?: string[];
    expand?: string[];
  }
) => {
  // Create a copy of the where conditions
  const whereConditions = [...params.where];

  // Add customerId to the where conditions
  whereConditions.push(`customerId="${context.customerId}"`);

  // If storeKey is provided, query from store
  if (params.storeKey) {
    const ordersInStore = await apiRoot
      .withProjectKey({projectKey: context.projectKey})
      .inStoreKeyWithStoreKeyValue({storeKey: params.storeKey})
      .orders()
      .get({
        queryArgs: {
          where: whereConditions,
          limit: params.limit || 10,
          ...(params.offset && {offset: params.offset}),
          ...(params.sort && {sort: params.sort}),
          ...(params.expand && {expand: params.expand}),
        },
      })
      .execute();
    return ordersInStore.body;
  }

  // Query without store
  const orders = await apiRoot
    .withProjectKey({projectKey: context.projectKey})
    .orders()
    .get({
      queryArgs: {
        where: whereConditions,
        limit: params.limit || 10,
        ...(params.offset && {offset: params.offset}),
        ...(params.sort && {sort: params.sort}),
        ...(params.expand && {expand: params.expand}),
      },
    })
    .execute();
  return orders.body;
};

export const readCustomerOrder = async (
  apiRoot: ApiRoot,
  context: {projectKey: string; customerId?: string},
  params: z.infer<typeof readOrderParameters>
) => {
  try {
    // If id is provided, get by ID
    if (params.id) {
      return await readOrderByIdForCustomer(apiRoot, context, {
        id: params.id,
        storeKey: params.storeKey,
        expand: params.expand,
      });
    }

    // If orderNumber is provided, get by orderNumber
    if (params.orderNumber) {
      return await readOrderByOrderNumberForCustomer(apiRoot, context, {
        orderNumber: params.orderNumber,
        storeKey: params.storeKey,
        expand: params.expand,
      });
    }

    // If where is provided, query orders
    return await queryOrdersForCustomer(apiRoot, context, {
      where: params.where || [],
      storeKey: params.storeKey,
      limit: params.limit,
      offset: params.offset,
      sort: params.sort,
      expand: params.expand,
    });
  } catch (error: any) {
    throw new SDKError('Failed to read customer order', error);
  }
};
