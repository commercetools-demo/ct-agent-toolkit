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

export const readOrder = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof readOrderParameters>
) => {
  try {
    // If id is provided, get by ID
    if (params.id) {
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
    }

    // If orderNumber is provided, get by orderNumber
    if (params.orderNumber) {
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
    }

    // If where is provided, query orders
    if (params.where) {
      // If storeKey is provided, query from store
      if (params.storeKey) {
        const ordersInStore = await apiRoot
          .withProjectKey({projectKey: context.projectKey})
          .inStoreKeyWithStoreKeyValue({storeKey: params.storeKey})
          .orders()
          .get({
            queryArgs: {
              where: params.where,
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
            where: params.where,
            limit: params.limit || 10,
            ...(params.offset && {offset: params.offset}),
            ...(params.sort && {sort: params.sort}),
            ...(params.expand && {expand: params.expand}),
          },
        })
        .execute();
      return orders.body;
    }

    throw new Error(
      'Invalid parameters. Either id, orderNumber, or where must be provided'
    );
  } catch (error: any) {
    throw new Error('Failed to read order: ' + error.message);
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
    throw new Error('Failed to create order from cart: ' + error.message);
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
        throw new Error(
          'Failed to create order from quote in store: ' + error.message
        );
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
        throw new Error('Failed to create order from quote: ' + error.message);
      }
    }
  } catch (error: any) {
    throw new Error('Failed to create order from quote: ' + error.message);
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
    throw new Error('Failed to import order: ' + error.message);
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
    }

    throw new Error(
      'Invalid parameters. Either id or orderNumber must be provided'
    );
  } catch (error: any) {
    throw new Error('Failed to update order: ' + error.message);
  }
};
