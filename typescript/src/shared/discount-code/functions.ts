import {z} from 'zod';
import {
  readDiscountCodeParameters,
  listDiscountCodesParameters,
  createDiscountCodeParameters,
  updateDiscountCodeParameters,
} from './parameters';
import {ApiRoot} from '@commercetools/platform-sdk';
import * as admin from './admin.functions';
import {Context} from '../../types/configuration';

export const contextToDiscountCodeFunctionMapping = (context?: Context) => {
  if (context?.isAdmin) {
    return {
      read_discount_code: admin.readDiscountCode,
      list_discount_codes: admin.listDiscountCodes,
      create_discount_code: admin.createDiscountCode,
      update_discount_code: admin.updateDiscountCode,
    };
  }

  return {};
};

// Legacy function exports to maintain backward compatibility
export const readDiscountCode = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof readDiscountCodeParameters>
) => {
  return admin.readDiscountCode(
    apiRoot,
    {...context, projectKey: context.projectKey},
    params
  );
};

export const listDiscountCodes = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof listDiscountCodesParameters>
) => {
  return admin.listDiscountCodes(
    apiRoot,
    {...context, projectKey: context.projectKey},
    params
  );
};

export const createDiscountCode = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof createDiscountCodeParameters>
) => {
  return admin.createDiscountCode(
    apiRoot,
    {...context, projectKey: context.projectKey},
    params
  );
};

export const updateDiscountCode = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof updateDiscountCodeParameters>
) => {
  return admin.updateDiscountCode(
    apiRoot,
    {...context, projectKey: context.projectKey},
    params
  );
};
