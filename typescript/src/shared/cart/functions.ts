import * as customer from './customer.functions';
import * as store from './store.functions';
import * as admin from './admin.functions';
import {Context} from '../../types/configuration';
import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {
  readCartParameters,
  createCartParameters,
  updateCartParameters,
  replicateCartParameters,
} from './parameters';

// Context mapping function for cart functions
export const contextToCartFunctionMapping = (context?: Context) => {
  if (context?.customerId) {
    return {
      read_cart: customer.readCart,
      create_cart: customer.createCart,
      update_cart: customer.updateCart,
      replicate_cart: customer.replicateCart,
    };
  }
  if (context?.storeKey) {
    return {
      read_cart: store.readCart,
      create_cart: store.createCart,
      update_cart: store.updateCart,
      replicate_cart: store.replicateCart,
    };
  }
  if (context?.isAdmin) {
    return {
      read_cart: admin.readCart,
      create_cart: admin.createCart,
      update_cart: admin.updateCart,
      replicate_cart: admin.replicateCart,
    };
  }
  return {};
};

// Export the individual CRUD functions for direct use in tests
export const readCart = (
  apiRoot: ApiRoot,
  context: any,
  params: z.infer<typeof readCartParameters>
) => {
  if (context?.customerId) {
    return customer.readCart(apiRoot, context, params);
  }
  if (context?.storeKey) {
    return store.readCart(apiRoot, context, params);
  }
  return admin.readCart(apiRoot, context, params);
};

export const createCart = (
  apiRoot: ApiRoot,
  context: any,
  params: z.infer<typeof createCartParameters>
) => {
  if (context?.customerId) {
    return customer.createCart(apiRoot, context, params);
  }
  if (context?.storeKey || (params?.store?.key && !context?.customerId)) {
    return store.createCart(apiRoot, context, params);
  }
  return admin.createCart(apiRoot, context, params);
};

export const updateCart = (
  apiRoot: ApiRoot,
  context: any,
  params: z.infer<typeof updateCartParameters>
) => {
  if (context?.customerId) {
    return customer.updateCart(apiRoot, context, params);
  }
  if (context?.storeKey) {
    return store.updateCart(apiRoot, context, params);
  }
  return admin.updateCart(apiRoot, context, params);
};

export const replicateCart = (
  apiRoot: ApiRoot,
  context: any,
  params: z.infer<typeof replicateCartParameters>
) => {
  if (context?.customerId) {
    return customer.replicateCart(apiRoot, context, params);
  }
  if (context?.storeKey || params?.storeKey) {
    return store.replicateCart(apiRoot, context, params);
  }
  return admin.replicateCart(apiRoot, context, params);
};
