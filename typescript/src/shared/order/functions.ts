import * as customer from './customer.functions';
import * as admin from './admin.functions';
import * as store from './store.functions';
import {ApiRoot} from '@commercetools/platform-sdk';

export const contextToOrderFunctionMapping: any = ({
  customerId,
  storeKey,
}: {
  customerId?: string;
  storeKey?: string;
}): Record<
  string,
  (
    apiRoot: ApiRoot,
    context: {projectKey: string; customerId?: string; cartId?: string},
    params: any
  ) => Promise<any>
> => {
  if (customerId) {
    return {
      read_order: customer.readCustomerOrder,
    };
  }
  if (storeKey) {
    return {
      read_order: store.readStoreOrder,
      create_order_from_cart: store.createOrderFromCartInStore,
      create_order_from_quote: store.createOrderFromQuoteInStore,
      update_order: store.updateOrderByIdInStore,
    };
  }
  return {
    read_order: admin.readOrder,
    create_order_from_cart: admin.createOrderFromCart,
    create_order_from_quote: admin.createOrderFromQuote,
    create_order_by_import: admin.createOrderByImport,
    update_order: admin.updateOrder,
  };
};
