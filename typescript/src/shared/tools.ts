import productTools from './products/tools';
import projectTools from './project/tools';
import productSearchTools from './product-search/tools';
import categoryTools from './category/tools';
import productSelectionTools from './product-selection/tools';

export default [
  ...productTools,
  ...projectTools,
  ...productSearchTools,
  ...categoryTools,
  ...productSelectionTools,
];
