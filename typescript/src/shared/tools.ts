import productTools from './products/tools';
import projectTools from './project/tools';
import productSearchTools from './product-search/tools';
import categoryTools from './category/tools';
import productSelectionTools from './product-selection/tools';
import orderTools from './order/tools';
import cartTools from './cart/tools';
import customerTools from './customer/tools';
import customerGroupTools from './customer-group/tools';
import standalonePriceTools from './standalone-price/tools';
import productDiscountTools from './product-discount/tools';
import cartDiscountTools from './cart-discount/tools';
import discountCodeTools from './discount-code/tools';
import productTypeTools from './product-type/tools';
import bulkTools from './bulk/tools';

export default [
  ...productTools,
  ...projectTools,
  ...productSearchTools,
  ...categoryTools,
  ...productSelectionTools,
  ...orderTools,
  ...cartTools,
  ...customerTools,
  ...customerGroupTools,
  ...standalonePriceTools,
  ...productDiscountTools,
  ...cartDiscountTools,
  ...discountCodeTools,
  ...productTypeTools,
  ...bulkTools,
];
