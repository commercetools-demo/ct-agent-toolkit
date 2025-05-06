import {z} from 'zod';
import {
  readOrderParameters,
  createOrderFromCartParameters,
  createOrderFromQuoteParameters,
  createOrderByImportParameters,
  updateOrderParameters,
} from './parameters';
import {
  ApiRoot,
  OrderUpdateAction,
  OrderFromCartDraft,
  LineItemImportDraft,
  OrderImportDraft,
  OrderFromQuoteDraft,
} from '@commercetools/platform-sdk';
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

// Helper function to handle reading an order by ID without customer context
const readOrderById = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: {
    id: string;
    storeKey?: string;
    expand?: string[];
  }
) => {
  const request = apiRoot
    .withProjectKey({projectKey: context.projectKey})
    .orders()
    .withId({ID: params.id});

  // Add store key if provided
  if (params.storeKey) {
    const orderInStore = apiRoot
      .withProjectKey({projectKey: context.projectKey})
      .inStoreKeyWithStoreKeyValue({storeKey: params.storeKey})
      .orders()
      .withId({ID: params.id});

    if (params.expand) {
      const response = await orderInStore
        .get({
          queryArgs: {
            expand: params.expand,
          },
        })
        .execute();
      return response.body;
    } else {
      const response = await orderInStore.get().execute();
      return response.body;
    }
  }

  // Add expand if provided
  if (params.expand) {
    const response = await request
      .get({
        queryArgs: {
          expand: params.expand,
        },
      })
      .execute();
    return response.body;
  } else {
    const response = await request.get().execute();
    return response.body;
  }
};

// Helper function to handle reading an order by orderNumber without customer context
const readOrderByOrderNumber = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: {
    orderNumber: string;
    storeKey?: string;
    expand?: string[];
  }
) => {
  // If storeKey is provided, get from store
  if (params.storeKey) {
    const orderInStore = apiRoot
      .withProjectKey({projectKey: context.projectKey})
      .inStoreKeyWithStoreKeyValue({storeKey: params.storeKey})
      .orders()
      .withOrderNumber({orderNumber: params.orderNumber});

    if (params.expand) {
      const response = await orderInStore
        .get({
          queryArgs: {
            expand: params.expand,
          },
        })
        .execute();
      return response.body;
    } else {
      const response = await orderInStore.get().execute();
      return response.body;
    }
  }

  // Get without store
  const request = apiRoot
    .withProjectKey({projectKey: context.projectKey})
    .orders()
    .withOrderNumber({orderNumber: params.orderNumber});

  if (params.expand) {
    const response = await request
      .get({
        queryArgs: {
          expand: params.expand,
        },
      })
      .execute();
    return response.body;
  } else {
    const response = await request.get().execute();
    return response.body;
  }
};

// Helper function to handle querying orders with where conditions
const queryOrders = async (
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

  // If customerId is in context, add it to the where conditions
  if (context.customerId) {
    whereConditions.push(`customerId="${context.customerId}"`);
  }

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

export const readOrder = async (
  apiRoot: ApiRoot,
  context: {projectKey: string; customerId?: string},
  params: z.infer<typeof readOrderParameters>
) => {
  try {
    // If id is provided, get by ID
    if (params.id) {
      // If customerId is in context, we need to verify the order belongs to this customer
      if (context.customerId) {
        return await readOrderByIdForCustomer(apiRoot, context, {
          id: params.id,
          storeKey: params.storeKey,
          expand: params.expand,
        });
      }

      // If no customerId in context, proceed with direct ID lookup
      return await readOrderById(apiRoot, context, {
        id: params.id,
        storeKey: params.storeKey,
        expand: params.expand,
      });
    }

    // If orderNumber is provided, get by orderNumber
    if (params.orderNumber) {
      // If customerId is in context, we need to verify the order belongs to this customer
      if (context.customerId) {
        return await readOrderByOrderNumberForCustomer(apiRoot, context, {
          orderNumber: params.orderNumber,
          storeKey: params.storeKey,
          expand: params.expand,
        });
      }

      // If no customerId in context, proceed with direct orderNumber lookup
      return await readOrderByOrderNumber(apiRoot, context, {
        orderNumber: params.orderNumber,
        storeKey: params.storeKey,
        expand: params.expand,
      });
    }

    // If where is provided, query orders
    if (params.where) {
      return await queryOrders(apiRoot, context, {
        where: params.where,
        storeKey: params.storeKey,
        limit: params.limit,
        offset: params.offset,
        sort: params.sort,
        expand: params.expand,
      });
    }

    throw new Error(
      'Invalid parameters. Either id, orderNumber, or where must be provided'
    );
  } catch (error: any) {
    throw new SDKError('Failed to read order', error);
  }
};

export const createOrderFromCart = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof createOrderFromCartParameters>
) => {
  try {
    // Create order from cart
    if (params.storeKey) {
      // Create in store
      const orderDraft: OrderFromCartDraft = {
        cart: {
          id: params.id || '',
          typeId: 'cart',
        },
        version: params.version,
        ...(params.orderNumber && {orderNumber: params.orderNumber}),
      };

      const response = await apiRoot
        .withProjectKey({projectKey: context.projectKey})
        .inStoreKeyWithStoreKeyValue({storeKey: params.storeKey})
        .orders()
        .post({
          body: orderDraft,
        })
        .execute();

      return response.body;
    } else {
      // Create without store
      const orderDraft: OrderFromCartDraft = {
        cart: {
          id: params.id || '',
          typeId: 'cart',
        },
        version: params.version,
        ...(params.orderNumber && {orderNumber: params.orderNumber}),
      };

      const response = await apiRoot
        .withProjectKey({projectKey: context.projectKey})
        .orders()
        .post({
          body: orderDraft,
        })
        .execute();

      return response.body;
    }
  } catch (error: any) {
    throw new SDKError('Failed to create order from cart', error);
  }
};

export const createOrderFromQuote = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof createOrderFromQuoteParameters>
) => {
  try {
    // Create order from quote
    // Note: This may require additional implementation based on the commercetools SDK
    // The exact API path may differ based on the SDK version
    const orderDraft: OrderFromQuoteDraft = {
      quote: {
        id: params.quoteId,
        typeId: 'quote',
      },
      version: params.version,
      ...(params.orderNumber && {orderNumber: params.orderNumber}),
    };

    if (params.storeKey) {
      // Try to create in store if SDK supports it
      try {
        const response = await apiRoot
          .withProjectKey({projectKey: context.projectKey})
          .inStoreKeyWithStoreKeyValue({storeKey: params.storeKey})
          .orders()
          .post({
            body: orderDraft,
          })
          .execute();

        return response.body;
      } catch (error: any) {
        throw new SDKError('Failed to create order from quote in store', error);
      }
    } else {
      // Create without store
      try {
        const response = await apiRoot
          .withProjectKey({projectKey: context.projectKey})
          .orders()
          .post({
            body: orderDraft,
          })
          .execute();

        return response.body;
      } catch (error: any) {
        throw new SDKError('Failed to create order from quote', error);
      }
    }
  } catch (error: any) {
    throw new SDKError('Failed to create order from quote', error);
  }
};

export const createOrderByImport = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof createOrderByImportParameters>
) => {
  try {
    // Transform line items to match LineItemImportDraft
    const lineItems = params.lineItems?.map((item) => {
      const lineItem: LineItemImportDraft = {
        name: item.name,
        productId: item.productId,
        variant: {
          id: item.variant.id,
          sku: item.variant.sku,
        },
        quantity: item.quantity,
        price: {
          value: {
            type: 'centPrecision',
            currencyCode: params.totalPrice.currencyCode,
            centAmount: params.totalPrice.centAmount,
            fractionDigits: 2,
          },
        },
      };
      return lineItem;
    });

    // Import order
    const orderImport: OrderImportDraft = {
      ...(params.orderNumber && {orderNumber: params.orderNumber}),
      ...(params.customerId && {customerId: params.customerId}),
      ...(params.customerEmail && {customerEmail: params.customerEmail}),
      ...(params.store && {store: params.store}),
      ...(lineItems && {lineItems}),
      totalPrice: {
        type: 'centPrecision',
        currencyCode: params.totalPrice.currencyCode,
        centAmount: params.totalPrice.centAmount,
        fractionDigits: 2,
      },
    };

    const response = await apiRoot
      .withProjectKey({projectKey: context.projectKey})
      .orders()
      .importOrder()
      .post({
        body: orderImport,
      })
      .execute();

    return response.body;
  } catch (error: any) {
    throw new SDKError('Failed to import order', error);
  }
};

export const updateOrder = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof updateOrderParameters>
) => {
  try {
    if (params.id) {
      // Update by ID
      if (params.storeKey) {
        // Update in store
        const response = await apiRoot
          .withProjectKey({projectKey: context.projectKey})
          .inStoreKeyWithStoreKeyValue({storeKey: params.storeKey})
          .orders()
          .withId({ID: params.id})
          .post({
            body: {
              version: params.version,
              actions: params.actions as OrderUpdateAction[],
            },
          })
          .execute();

        return response.body;
      } else {
        // Update without store
        const response = await apiRoot
          .withProjectKey({projectKey: context.projectKey})
          .orders()
          .withId({ID: params.id})
          .post({
            body: {
              version: params.version,
              actions: params.actions as OrderUpdateAction[],
            },
          })
          .execute();

        return response.body;
      }
    } else if (params.orderNumber) {
      // Update by orderNumber
      if (params.storeKey) {
        // Update in store
        const response = await apiRoot
          .withProjectKey({projectKey: context.projectKey})
          .inStoreKeyWithStoreKeyValue({storeKey: params.storeKey})
          .orders()
          .withOrderNumber({orderNumber: params.orderNumber})
          .post({
            body: {
              version: params.version,
              actions: params.actions as OrderUpdateAction[],
            },
          })
          .execute();

        return response.body;
      } else {
        // Update without store
        const response = await apiRoot
          .withProjectKey({projectKey: context.projectKey})
          .orders()
          .withOrderNumber({orderNumber: params.orderNumber})
          .post({
            body: {
              version: params.version,
              actions: params.actions as OrderUpdateAction[],
            },
          })
          .execute();

        return response.body;
      }
    } else {
      throw new Error('Either id or orderNumber must be provided');
    }
  } catch (error: any) {
    throw new SDKError('Failed to update order', error);
  }
};
