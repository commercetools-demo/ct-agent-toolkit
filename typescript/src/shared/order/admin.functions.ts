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

// Helper function to handle reading an order by ID without customer context
const readOrderById = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: {
    id: string;
    expand?: string[];
  }
) => {
  const request = apiRoot
    .withProjectKey({projectKey: context.projectKey})
    .orders()
    .withId({ID: params.id});

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
    expand?: string[];
  }
) => {
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

// Helper function to handle querying orders with where conditions (non-customer specific)
const queryOrders = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: {
    where: string[];
    limit?: number;
    offset?: number;
    sort?: string[];
    expand?: string[];
  }
) => {
  // Create a copy of the where conditions
  const whereConditions = [...params.where];

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
  context: {projectKey: string},
  params: z.infer<typeof readOrderParameters>
) => {
  try {
    // If id is provided, get by ID
    if (params.id) {
      return await readOrderById(apiRoot, context, {
        id: params.id,
        expand: params.expand,
      });
    }

    // If orderNumber is provided, get by orderNumber
    if (params.orderNumber) {
      return await readOrderByOrderNumber(apiRoot, context, {
        orderNumber: params.orderNumber,
        expand: params.expand,
      });
    }

    // If where is provided, query orders
    return await queryOrders(apiRoot, context, {
      where: params.where || [],
      limit: params.limit,
      offset: params.offset,
      sort: params.sort,
      expand: params.expand,
    });
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
    // Create without store
    const orderDraft: OrderFromQuoteDraft = {
      quote: {
        id: params.quoteId,
        typeId: 'quote',
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
    // Handle standard (non-store) updates
    if (params.id) {
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
    } else if (params.orderNumber) {
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
    } else {
      throw new Error('Either id or orderNumber must be provided');
    }
  } catch (error: any) {
    throw new SDKError('Failed to update order', error);
  }
};
