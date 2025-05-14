import {listProducts, createProduct, updateProduct} from './products/functions';
import {readProject} from './project/functions';
import {searchProducts} from './product-search/functions';
import {contextToCategoryFunctionMapping} from './category/functions';
import {
  readProductSelection,
  createProductSelection,
  updateProductSelection,
} from './product-selection/functions';
import {contextToOrderFunctionMapping} from './order/functions';
import {contextToCartFunctionMapping} from './cart/functions';
import {contextToCartDiscountFunctionMapping} from './cart-discount/functions';
import {
  contextToCustomerFunctionMapping,
  createCustomer,
  createCustomerInStore,
  getCustomerById,
  getCustomerInStoreById,
  queryCustomers,
  updateCustomer,
} from './customer/functions';
import {
  contextToCustomerGroupFunctionMapping,
  getCustomerGroup,
  createCustomerGroup,
  updateCustomerGroup,
} from './customer-group/functions';
import {
  readStandalonePrice,
  createStandalonePrice,
  updateStandalonePrice,
} from './standalone-price/functions';
import {
  readProductDiscount,
  createProductDiscount,
  updateProductDiscount,
} from './product-discount/functions';
import {
  readDiscountCode,
  listDiscountCodes,
  createDiscountCode,
  updateDiscountCode,
} from './discount-code/functions';
import {
  readProductType,
  listProductTypes,
  createProductType,
  updateProductType,
} from './product-type/functions';
import {bulkCreate, bulkUpdate} from './bulk/functions';
import {
  readInventory,
  createInventory,
  updateInventory,
} from './inventory/functions';
import {ApiRoot} from '@commercetools/platform-sdk';
import {Context} from '../types/configuration';

export const contextToFunctionMapping = (context?: Context) => {
  return {
    ...contextToOrderFunctionMapping(context),
    ...contextToCartFunctionMapping(context),
    ...contextToCartDiscountFunctionMapping(context),
    ...contextToCategoryFunctionMapping(context),
    ...contextToCustomerFunctionMapping(context),
    ...contextToCustomerGroupFunctionMapping(context),
    list_products: listProducts,
    create_product: createProduct,
    update_product: updateProduct,
    read_project: readProject,
    search_products: searchProducts,
    read_product_selection: readProductSelection,
    create_product_selection: createProductSelection,
    update_product_selection: updateProductSelection,
    read_standalone_price: readStandalonePrice,
    create_standalone_price: createStandalonePrice,
    update_standalone_price: updateStandalonePrice,
    read_product_discount: readProductDiscount,
    create_product_discount: createProductDiscount,
    update_product_discount: updateProductDiscount,
    read_discount_code: readDiscountCode,
    list_discount_codes: listDiscountCodes,
    create_discount_code: createDiscountCode,
    update_discount_code: updateDiscountCode,
    read_product_type: readProductType,
    list_product_types: listProductTypes,
    create_product_type: createProductType,
    update_product_type: updateProductType,
    bulk_create: bulkCreate,
    bulk_update: bulkUpdate,
    read_inventory: readInventory,
    create_inventory: createInventory,
    update_inventory: updateInventory,
  };
};
