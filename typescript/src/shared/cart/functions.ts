import * as customer from './customer.functions';
import * as store from './store.functions';
import * as admin from './admin.functions';

// Context mapping function for cart functions
export const contextToCartFunctionMapping = (context?: {
  customerId?: string;
  storeKey?: string;
  cartId?: string;
}): Record<string, Function> => {
  if (context?.customerId) {
    return {
      read_cart: customer.readCustomerCart,
      create_cart: customer.createCustomerCart,
      update_cart: customer.updateCustomerCart,
      replicate_cart: customer.replicateCustomerCart,
    };
  }
  if (context?.storeKey) {
    return {
      read_cart: store.readStoreCart,
      create_cart: store.createStoreCart,
      update_cart: store.updateStoreCart,
      replicate_cart: store.replicateStoreCart,
    };
  }
  return {
    read_cart: admin.readAdminCart,
    create_cart: admin.createAdminCart,
    update_cart: admin.updateAdminCart,
    replicate_cart: admin.replicateAdminCart,
  };
};
