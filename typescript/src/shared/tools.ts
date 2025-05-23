import {contextToProductsTools} from './products/tools';
import {contextToProjectTools} from './project/tools';
import productSearchTools from './product-search/tools';
import {contextToCategoryTools} from './category/tools';
import {contextToChannelTools} from './channel/tools';
import productSelectionTools from './product-selection/tools';
import {contextToOrderTools} from './order/tools';
import {contextToCartTools} from './cart/tools';
import {contextToCustomerTools} from './customer/tools';
import {contextToCustomerGroupTools} from './customer-group/tools';
import standalonePriceTools from './standalone-price/tools';
import productDiscountTools from './product-discount/tools';
import {contextToCartDiscountTools} from './cart-discount/tools';
import {contextToDiscountCodeTools} from './discount-code/tools';
import productTypeTools from './product-type/tools';
import bulkTools from './bulk/tools';
import {contextToInventoryTools} from './inventory/tools';
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
  ];
};

export default [
  ...productSearchTools,
  ...productSelectionTools,
  ...standalonePriceTools,
  ...productDiscountTools,
  ...productTypeTools,
  ...bulkTools,
];
