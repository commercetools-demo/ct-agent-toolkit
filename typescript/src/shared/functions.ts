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
import {contextToProductSearchFunctionMapping} from './product-search/functions';
import {contextToProductSelectionFunctionMapping} from './product-selection/functions';
import {contextToProductTypeFunctionMapping} from './product-type/functions';
import {contextToProductFunctionMapping} from './products/functions';
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
    ...contextToProductSearchFunctionMapping(context),
    ...contextToProductSelectionFunctionMapping(context),
    ...contextToProductTypeFunctionMapping(context),
    ...contextToProductFunctionMapping(context),
    read_project: readProject,
    read_standalone_price: readStandalonePrice,
    create_standalone_price: createStandalonePrice,
    update_standalone_price: updateStandalonePrice,
    bulk_create: bulkCreate,
    bulk_update: bulkUpdate,
  };
};
