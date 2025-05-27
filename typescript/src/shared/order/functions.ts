import * as customer from './customer.functions';
import * as admin from './admin.functions';
import * as store from './store.functions';
import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {
  readOrderParameters,
  updateOrderParameters,
  createOrderParameters,
} from './parameters';
import {CommercetoolsFuncContext, Context} from '../../types/configuration';

export const contextToOrderFunctionMapping = (
  context?: Context
): Record<
  string,
  (
    apiRoot: ApiRoot,
    context: CommercetoolsFuncContext,
    params: any
  ) => Promise<any>
> => {
  if (context?.customerId) {
    return {
      read_order: customer.readCustomerOrder,
    };
  }
  if (context?.storeKey) {
    return {
      read_order: store.readStoreOrder,
      create_order: store.createOrderInStore,
      update_order: store.updateOrderByIdInStore,
    };
  }
  if (context?.isAdmin) {
    return {
      read_order: admin.readOrder,
      create_order: admin.createOrder,
      update_order: admin.updateOrder,
    };
  }
  return {};
};

// Export the individual CRUD functions for direct use in tests
export const readOrder = (
  apiRoot: ApiRoot,
  context: any,
  params: z.infer<typeof readOrderParameters>
) => {
  if (context?.customerId) {
    return customer.readCustomerOrder(apiRoot, context, params);
  }
  if (context?.storeKey || params?.storeKey) {
    return store.readStoreOrder(apiRoot, context, {
      ...params,
      storeKey: context?.storeKey || params.storeKey,
    });
  }
  return admin.readOrder(apiRoot, context, params);
};

export const createOrderFromCart = (
  apiRoot: ApiRoot,
  context: any,
  params: z.infer<typeof createOrderParameters>
) => {
  if (context?.storeKey || params?.storeKey) {
    return store.createOrderInStore(apiRoot, context, {
      ...params,
      storeKey: context?.storeKey || params.storeKey,
    });
  }
  return admin.createOrder(apiRoot, context, params);
};

export const createOrderFromQuote = (
  apiRoot: ApiRoot,
  context: any,
  params: z.infer<typeof createOrderParameters>
) => {
  if (context?.storeKey || params?.storeKey) {
    return store.createOrderInStore(apiRoot, context, {
      ...params,
      storeKey: context?.storeKey || params.storeKey,
    });
  }
  return admin.createOrder(apiRoot, context, params);
};

export const createOrderByImport = (
  apiRoot: ApiRoot,
  context: any,
  params: any
) => {
  // Only available in admin context
  return admin.createOrder(apiRoot, context, params);
};

export const updateOrder = (
  apiRoot: ApiRoot,
  context: any,
  params: z.infer<typeof updateOrderParameters>
) => {
  if (context?.storeKey || params?.storeKey) {
    const storeKey = context?.storeKey || params.storeKey;

    if (params.id) {
      return store.updateOrderByIdInStore(apiRoot, context, {
        ...params,
        id: params.id,
        storeKey,
      });
    } else if (params.orderNumber) {
      return store.updateOrderByOrderNumberInStore(apiRoot, context, {
        ...params,
        orderNumber: params.orderNumber,
        storeKey,
      });
    } else {
      throw new Error('Either id or orderNumber must be provided');
    }
  }
  return admin.updateOrder(apiRoot, context, params);
};
