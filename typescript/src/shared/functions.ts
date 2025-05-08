import {listProducts, createProduct, updateProduct} from './products/functions';
import {readProject} from './project/functions';
import {searchProducts} from './product-search/functions';
import {
  readCategory,
  createCategory,
  updateCategory,
} from './category/functions';
import {
  readProductSelection,
  createProductSelection,
  updateProductSelection,
} from './product-selection/functions';
import {contextToOrderFunctionMapping} from './order/functions';
import {contextToCartFunctionMapping} from './cart/functions';
import {
  createCustomer,
  createCustomerInStore,
  getCustomerById,
  getCustomerInStoreById,
  queryCustomers,
  updateCustomer,
} from './customer/functions';
import {
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
  readCartDiscount,
  createCartDiscount,
  updateCartDiscount,
} from './cart-discount/functions';
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

export const contextToFunctionMapping = (context?: {
  customerId?: string;
  storeKey?: string;
  cartId?: string;
}) => {
  return {
    ...contextToOrderFunctionMapping(context),
    ...contextToCartFunctionMapping(context),
  };
};
// Initialize function mapping
const functionMapping: {
  [key: string]: (
    apiRoot: ApiRoot,
    context: {projectKey: string; customerId?: string; cartId?: string},
    params: any
  ) => Promise<any>;
} = {
  list_products: listProducts,
  create_product: createProduct,
  update_product: updateProduct,
  read_project: readProject,
  search_products: searchProducts,
  read_category: readCategory,
  create_category: createCategory,
  update_category: updateCategory,
  read_product_selection: readProductSelection,
  create_product_selection: createProductSelection,
  update_product_selection: updateProductSelection,
  create_customer: createCustomer,
  create_customer_in_store: createCustomerInStore,
  get_customer_by_id: getCustomerById,
  get_customer_in_store_by_id: getCustomerInStoreById,
  query_customers: queryCustomers,
  update_customer: updateCustomer,
  read_customer_group: getCustomerGroup,
  create_customer_group: createCustomerGroup,
  update_customer_group: updateCustomerGroup,
  read_standalone_price: readStandalonePrice,
  create_standalone_price: createStandalonePrice,
  update_standalone_price: updateStandalonePrice,
  read_product_discount: readProductDiscount,
  create_product_discount: createProductDiscount,
  update_product_discount: updateProductDiscount,
  read_cart_discount: readCartDiscount,
  create_cart_discount: createCartDiscount,
  update_cart_discount: updateCartDiscount,
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
