import {contextToProductsTools} from './products/tools';
import {contextToProjectTools} from './project/tools';
import {contextToProductSearchTools} from './product-search/tools';
import {contextToCategoryTools} from './category/tools';
import {contextToChannelTools} from './channel/tools';
import {contextToProductSelectionTools} from './product-selection/tools';
import {contextToOrderTools} from './order/tools';
import {contextToCartTools} from './cart/tools';
import {contextToCustomerTools} from './customer/tools';
import {contextToCustomerGroupTools} from './customer-group/tools';
import {contextToStandalonePriceTools} from './standalone-price/tools';
import {contextToProductDiscountTools} from './product-discount/tools';
import {contextToCartDiscountTools} from './cart-discount/tools';
import {contextToDiscountCodeTools} from './discount-code/tools';
import {contextToProductTypeTools} from './product-type/tools';
import {contextToBulkTools} from './bulk/tools';
import {contextToInventoryTools} from './inventory/tools';
import {contextToStoreTools} from './store/tools';
import {Context} from '../types/configuration';

export const contextToTools = (context?: Context) => {
  return [
    ...contextToCartTools(context),
    ...contextToCartDiscountTools(context),
    ...contextToCategoryTools(context),
    ...contextToChannelTools(context),
    ...contextToCustomerTools(context),
    ...contextToCustomerGroupTools(context),
    ...contextToDiscountCodeTools(context),
    ...contextToOrderTools(context),
    ...contextToInventoryTools(context),
    ...contextToProductsTools(context),
    ...contextToProjectTools(context),
    ...contextToProductSearchTools(context),
    ...contextToProductSelectionTools(context),
    ...contextToStandalonePriceTools(context),
    ...contextToProductDiscountTools(context),
    ...contextToProductTypeTools(context),
    ...contextToStoreTools(context),
    ...contextToBulkTools(context),
  ];
};
