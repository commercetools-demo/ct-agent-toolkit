import type {ApiRoot} from '@commercetools/platform-sdk';

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
    const errorMessage = error?.message || 'An unknown error occurred';
    const statusCode = error?.statusCode || 500;
    throw new Error(`Failed to read project: ${errorMessage} (${statusCode})`);
  }
}
