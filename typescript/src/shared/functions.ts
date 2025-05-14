import {Context} from '../types/configuration';
import {bulkCreate, bulkUpdate} from './bulk/functions';
import {contextToCartDiscountFunctionMapping} from './cart-discount/functions';
import {contextToCartFunctionMapping} from './cart/functions';
import {contextToCategoryFunctionMapping} from './category/functions';
import {contextToCustomerGroupFunctionMapping} from './customer-group/functions';
import {contextToCustomerFunctionMapping} from './customer/functions';
import {contextToDiscountCodeFunctionMapping} from './discount-code/functions';
import {contextToInventoryFunctionMapping} from './inventory/functions';
import {contextToOrderFunctionMapping} from './order/functions';
import {contextToProductDiscountFunctionMapping} from './product-discount/functions';
import {searchProducts} from './product-search/functions';
import {
  createProductSelection,
  readProductSelection,
  updateProductSelection,
} from './product-selection/functions';
import {
  createProductType,
  listProductTypes,
  readProductType,
  updateProductType,
} from './product-type/functions';
import {createProduct, listProducts, updateProduct} from './products/functions';
import {readProject} from './project/functions';
import {
  createStandalonePrice,
  readStandalonePrice,
  updateStandalonePrice,
} from './standalone-price/functions';

export const contextToFunctionMapping = (context?: Context) => {
  return {
    ...contextToOrderFunctionMapping(context),
    ...contextToCartFunctionMapping(context),
    ...contextToCartDiscountFunctionMapping(context),
    ...contextToCategoryFunctionMapping(context),
    ...contextToCustomerFunctionMapping(context),
    ...contextToCustomerGroupFunctionMapping(context),
    ...contextToDiscountCodeFunctionMapping(context),
    ...contextToInventoryFunctionMapping(context),
    ...contextToProductDiscountFunctionMapping(context),
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
    read_product_type: readProductType,
    list_product_types: listProductTypes,
    create_product_type: createProductType,
    update_product_type: updateProductType,
    bulk_create: bulkCreate,
    bulk_update: bulkUpdate,
  };
};
