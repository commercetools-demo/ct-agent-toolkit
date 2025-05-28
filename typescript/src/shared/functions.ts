import {ApiRoot} from '@commercetools/platform-sdk';
import {CommercetoolsFuncContext, Context} from '../types/configuration';
import {contextToBulkFunctionMapping} from './bulk/functions';
import {contextToCartDiscountFunctionMapping} from './cart-discount/functions';
import {contextToCartFunctionMapping} from './cart/functions';
import {contextToCategoryFunctionMapping} from './category/functions';
import {contextToChannelFunctionMapping} from './channel/functions';
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
import {contextToStoreFunctionMapping} from './store/functions';

export const contextToFunctionMapping = (
  context?: Context
): Record<
  string,
  (
    apiRoot: ApiRoot,
    context: CommercetoolsFuncContext,
    params: any
  ) => Promise<any>
> => {
  return {
    ...contextToOrderFunctionMapping(context),
    ...contextToCartFunctionMapping(context),
    ...contextToCartDiscountFunctionMapping(context),
    ...contextToCategoryFunctionMapping(context),
    ...contextToChannelFunctionMapping(context),
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
    ...contextToStoreFunctionMapping(context),
    ...contextToBulkFunctionMapping(context),
  };
};
