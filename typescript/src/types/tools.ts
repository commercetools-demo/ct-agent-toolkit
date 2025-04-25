import {z} from 'zod';

export enum AvailableNamespaces {
  Products = 'products',
  Project = 'project',
  ProductSearch = 'product-search',
  Category = 'category',
  ProductSelection = 'product-selection',
  Order = 'order',
  Cart = 'cart',
  Customer = 'customer',
  CustomerGroup = 'customer-group',
  StandalonePrice = 'standalone-price',
  DiscountCode = 'discount-code',
  ProductType = 'product-type',
  Bulk = 'bulk',
}

export type Tool = {
  method: string;
  name: string;
  description: string;
  parameters: z.ZodObject<any, any, any, any>;
  actions: {
    [key: string]: {
      [action: string]: boolean;
    };
  };
};
