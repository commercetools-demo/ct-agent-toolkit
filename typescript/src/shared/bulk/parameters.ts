import {z} from 'zod';
import {createProductParameters} from '../products/parameters';
import {createCustomerParameters} from '../customer/parameters';
import {createCartParameters} from '../cart/parameters';
import {createCategoryParameters} from '../category/parameters';
import {createChannelParameters} from '../channel/parameters';
import {createDiscountCodeParameters} from '../discount-code/parameters';
import {createCartDiscountParameters} from '../cart-discount/parameters';
import {createProductDiscountParameters} from '../product-discount/parameters';
import {createCustomerGroupParametersSchema} from '../customer-group/parameters';
import {createStandalonePriceParameters} from '../standalone-price/parameters';
import {createInventoryParameters} from '../inventory/parameters';
import {createOrderParameters} from '../order/parameters';

import {updateProductParameters} from '../products/parameters';
import {updateCustomerParameters} from '../customer/parameters';
import {updateCartParameters} from '../cart/parameters';
import {updateCategoryParameters} from '../category/parameters';
import {updateChannelParameters} from '../channel/parameters';
import {updateDiscountCodeParameters} from '../discount-code/parameters';
import {updateCartDiscountParameters} from '../cart-discount/parameters';
import {updateProductDiscountParameters} from '../product-discount/parameters';
import {updateCustomerGroupByIdParametersSchema} from '../customer-group/parameters';
import {updateStandalonePriceParameters} from '../standalone-price/parameters';
import {updateInventoryParameters} from '../inventory/parameters';
import {updateOrderParameters} from '../order/parameters';
import {updateProductSelectionParameters} from '../product-selection/parameters';
import {updateProductTypeParameters} from '../product-type/parameters';

// Define the bulk create parameters for products
export const bulkCreateParameters = z.object({
  items: z.array(
    z.object({
      entityType: z.enum([
        'product',
        'customer',
        'cart',
        'category',
        'channel',
        'discount-code',
        'cart-discount',
        'product-discount',
        'customer-group',
        'standalone-price',
        'order',
        'inventory',
      ]),
      data: z.union([
        createProductParameters,
        createCustomerParameters,
        createCartParameters,
        createCategoryParameters,
        createChannelParameters,
        createDiscountCodeParameters,
        createCartDiscountParameters,
        createProductDiscountParameters,
        createCustomerGroupParametersSchema,
        createStandalonePriceParameters,
        createInventoryParameters,
        createOrderParameters,
      ]),
    })
  ),
});

// Define the bulk update parameters
export const bulkUpdateParameters = z.object({
  items: z.array(
    z.object({
      entityType: z.enum([
        'product',
        'customer',
        'cart',
        'category',
        'channel',
        'discount-code',
        'cart-discount',
        'product-discount',
        'customer-group',
        'standalone-price',
        'inventory',
        'order',
        'product-selection',
        'product-type',
      ]),
      data: z.union([
        updateProductParameters,
        updateCustomerParameters,
        updateCartParameters,
        updateCategoryParameters,
        updateChannelParameters,
        updateDiscountCodeParameters,
        updateCartDiscountParameters,
        updateProductDiscountParameters,
        updateCustomerGroupByIdParametersSchema,
        updateStandalonePriceParameters,
        updateInventoryParameters,
        updateOrderParameters,
        updateProductSelectionParameters,
        updateProductTypeParameters,
      ]),
    })
  ),
});
