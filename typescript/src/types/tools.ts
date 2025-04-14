import {z} from 'zod';

export enum AvailableNamespaces {
  Products = 'products',
  Project = 'project',
  ProductSearch = 'product-search',
  Category = 'category',
  ProductSelection = 'product-selection',
}

export type Tool = {
  method: string;
  name: string;
  description: string;
  parameters: z.ZodObject<any, any, any, any> | z.ZodEffects<any>;
  actions: {
    [key: string]: {
      [action: string]: boolean;
    };
  };
};
