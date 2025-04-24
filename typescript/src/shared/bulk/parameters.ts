import {z} from 'zod';
import {createProductParameters} from '../products/parameters';
import {createCustomerParameters} from '../customer/parameters';
import {createCartParameters} from '../cart/parameters';
import {createCategoryParameters} from '../category/parameters';
import {createDiscountCodeParameters} from '../discount-code/parameters';
import {createCartDiscountParameters} from '../cart-discount/parameters';
import {createProductDiscountParameters} from '../product-discount/parameters';
import {createCustomerGroupParametersSchema} from '../customer-group/parameters';
import {createStandalonePriceParameters} from '../standalone-price/parameters';
import {
  createOrderFromCartParameters,
  createOrderFromQuoteParameters,
  createOrderByImportParameters,
} from '../order/parameters';

// Define the bulk create parameters for products
export const bulkCreateParameters = z.object({
  items: z.array(
    z.object({
      entityType: z.enum([
        'product',
        'customer',
        'cart',
        'category',
        'discount-code',
        'cart-discount',
        'product-discount',
        'customer-group',
        'standalone-price',
        'order',
      ]),
      data: z.union([
        createProductParameters,
        createCustomerParameters,
        createCartParameters,
        createCategoryParameters,
        createDiscountCodeParameters,
        createCartDiscountParameters,
        createProductDiscountParameters,
        createCustomerGroupParametersSchema,
        createStandalonePriceParameters,
        createOrderFromCartParameters,
        createOrderFromQuoteParameters,
        createOrderByImportParameters,
      ]),
    })
  ),
});
