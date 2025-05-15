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
import {contextToProjectFunctionMapping} from './project/functions';
import {contextToStandalonePriceFunctionMapping} from './standalone-price/functions';

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
    ...contextToProjectFunctionMapping(context),
    ...contextToStandalonePriceFunctionMapping(context),
    bulk_create: bulkCreate,
    bulk_update: bulkUpdate,
  };
};
