import productTools from './products/tools';
import projectTools from './project/tools';
import productSearchTools from './product-search/tools';
import categoryTools from './category/tools';
import productSelectionTools from './product-selection/tools';
import orderTools from './order/tools';
import cartTools from './cart/tools';
import customerTools from './customer/tools';

export default [
  ...productTools,
  ...projectTools,
  ...productSearchTools,
  ...categoryTools,
  ...productSelectionTools,
  ...orderTools,
  ...cartTools,
  ...customerTools,
];
