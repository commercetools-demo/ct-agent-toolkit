import {z} from 'zod';

export enum AvailableNamespaces {
  Products = 'products',
  Project = 'project',
  ProductSearch = 'product-search',
  Category = 'category',
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
