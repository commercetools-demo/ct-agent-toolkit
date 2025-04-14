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
import {ApiRoot} from '@commercetools/platform-sdk';

// Initialize function mapping
export const functionMapping: {
  [key: string]: (
    apiRoot: ApiRoot,
    context: {projectKey: string},
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
};
