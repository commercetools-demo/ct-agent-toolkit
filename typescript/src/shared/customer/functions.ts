import {ApiRoot} from '@commercetools/platform-sdk';
import {Context, CommercetoolsFuncContext} from '../../types/configuration';
import * as admin from './admin.functions';
import * as customer from './customer.functions';
import * as store from './store.functions';

// Context-to-function mapping
export const contextToCustomerFunctionMapping = (
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
      read_customer: customer.readCustomerProfile,
    };
  }
  if (context?.storeKey) {
    return {
      read_customer: store.readCustomerInStore,
      query_customers: store.queryCustomersInStore,
      create_customer: store.createCustomerInStore,
      update_customer: store.updateCustomerInStore,
    };
  }
  if (context?.isAdmin) {
    return {
      read_customer: admin.readCustomer,
      query_customers: admin.queryCustomersAsAdmin,
      create_customer: admin.createCustomerAsAdmin,
      update_customer: admin.updateCustomerAsAdmin,
    };
  }
  return {};
};

// Re-export functions from admin for backward compatibility
export const createCustomer = admin.createCustomerAsAdmin;
export const getCustomerById = admin.readCustomer;
export const queryCustomers = admin.queryCustomersAsAdmin;
export const updateCustomer = admin.updateCustomerAsAdmin;

// Re-export store functions for backward compatibility
export const createCustomerInStore = store.createCustomerInStore;
export const getCustomerInStoreById = store.readCustomerInStore;
