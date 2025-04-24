import type {ApiRoot} from '@commercetools/platform-sdk';
import {SDKError} from '../errors/sdkError';

export async function readProject(
  apiRoot: ApiRoot,
  context: any,
  params: any
): Promise<any> {
  try {
    const projectKey = params.projectKey;
    const requestBuilder = apiRoot.withProjectKey(
      projectKey || context.projectKey
    );
    const response = await requestBuilder.get().execute();
    return response.body;
  } catch (error: any) {
    throw new SDKError('Failed to read project', error);
  }
}
