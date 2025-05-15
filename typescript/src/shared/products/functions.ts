import {z} from 'zod';
import {
  listProductsParameters,
  createProductParameters,
  updateProductParameters,
} from './parameters';
import {ApiRoot} from '@commercetools/platform-sdk';
import {Context, CommercetoolsFuncContext} from '../../types/configuration';
import * as admin from './admin.functions';

/**
 * Maps context to product functions
 */
export const contextToProductFunctionMapping = (context?: Context) => {
  if (context?.isAdmin) {
    return {
      list_products: admin.listProducts,
      read_product: admin.readProduct,
      create_product: admin.createProduct,
      update_product: admin.updateProduct,
    };
  }
  return {
    list_products: admin.listProducts,
    read_product: admin.readProduct,
  };
};

export const listProducts = (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof listProductsParameters>
) => {
  return admin.listProducts(apiRoot, context, params);
};

export const readProduct = (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {id: string; expand?: string[]}
) => {
  return admin.readProduct(apiRoot, context, params);
};

export const createProduct = (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof createProductParameters>
) => {
  return admin.createProduct(apiRoot, context, params);
};

export const updateProduct = (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof updateProductParameters>
) => {
  return admin.updateProduct(apiRoot, context, params);
};
