import {z} from 'zod';
import {bulkCreateParameters, bulkUpdateParameters} from './parameters';
import {ApiRoot} from '@commercetools/platform-sdk';
import {createProduct} from '../products/functions';
import {createCustomer} from '../customer/functions';
import {createCart} from '../cart/functions';
import {createCategory} from '../category/functions';
import {createDiscountCode} from '../discount-code/functions';
import {createCartDiscount} from '../cart-discount/functions';
import {createProductDiscount} from '../product-discount/functions';
import {createCustomerGroup} from '../customer-group/functions';
import {createStandalonePrice} from '../standalone-price/functions';
import {createInventory} from '../inventory/functions';
import {
  createOrderFromCart,
  createOrderFromQuote,
  createOrderByImport,
} from '../order/functions';

import {updateCart} from '../cart/functions';
import {updateCartDiscount} from '../cart-discount/functions';
import {updateCategory} from '../category/functions';
import {updateCustomer} from '../customer/functions';
import {updateCustomerGroup} from '../customer-group/functions';
import {updateDiscountCode} from '../discount-code/functions';
import {updateInventory} from '../inventory/functions';
import {updateOrder} from '../order/functions';
import {updateProduct} from '../products/functions';
import {updateProductDiscount} from '../product-discount/functions';
import {updateProductSelection} from '../product-selection/functions';
import {updateProductType} from '../product-type/functions';
import {updateStandalonePrice} from '../standalone-price/functions';

type EntityFunctionMap = {
  [key: string]: (
    apiRoot: ApiRoot,
    context: {projectKey: string},
    params: any
  ) => Promise<any>;
};

// Helper function to determine which order creation function to use
const createOrder = (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: any
) => {
  // Check which parameters are provided to determine which function to use
  if (params.id !== undefined || params.version !== undefined) {
    return createOrderFromCart(apiRoot, context, params);
  } else if (params.quoteId !== undefined) {
    return createOrderFromQuote(apiRoot, context, params);
  } else if (params.totalPrice !== undefined) {
    return createOrderByImport(apiRoot, context, params);
  } else {
    throw new Error(
      'Invalid order parameters. Could not determine order creation type.'
    );
  }
};

// Map entity types to their respective create functions
const entityFunctionMap: EntityFunctionMap = {
  cart: createCart,
  'cart-discount': createCartDiscount,
  category: createCategory,
  customer: createCustomer,
  'customer-group': createCustomerGroup,
  'discount-code': createDiscountCode,
  product: createProduct,
  'product-discount': createProductDiscount,
  'standalone-price': createStandalonePrice,
  inventory: createInventory,
  order: createOrder,
};

// Map entity types to their respective update functions
const entityUpdateFunctionMap: EntityFunctionMap = {
  cart: updateCart,
  'cart-discount': updateCartDiscount,
  category: updateCategory,
  customer: updateCustomer,
  'customer-group': updateCustomerGroup,
  'discount-code': updateDiscountCode,
  inventory: updateInventory,
  order: updateOrder,
  product: updateProduct,
  'product-discount': updateProductDiscount,
  'product-selection': updateProductSelection,
  'product-type': updateProductType,
  'standalone-price': updateStandalonePrice,
};

export const bulkCreate = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof bulkCreateParameters>
) => {
  try {
    // Create an array of promises for each entity creation
    const createPromises = params.items.map((item) => {
      const createFunction = entityFunctionMap[item.entityType];
      if (!createFunction) {
        throw new Error(`Unsupported entity type: ${item.entityType}`);
      }
      return createFunction(apiRoot, context, item.data);
    });

    // Execute all create operations in parallel
    const results = await Promise.all(createPromises);

    return {
      success: true,
      results: results,
    };
  } catch (error: any) {
    throw new Error('Bulk creation failed: ' + error.message);
  }
};

export const bulkUpdate = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof bulkUpdateParameters>
) => {
  try {
    // Create an array of promises for each entity update
    const updatePromises = params.items.map((item) => {
      const updateFunction = entityUpdateFunctionMap[item.entityType];
      if (!updateFunction) {
        throw new Error(`Unsupported entity type: ${item.entityType}`);
      }
      return updateFunction(apiRoot, context, item.data);
    });

    // Execute all update operations in parallel
    const results = await Promise.all(updatePromises);

    return {
      success: true,
      results: results,
    };
  } catch (error: any) {
    throw new Error('Bulk update failed: ' + error.message);
  }
};
