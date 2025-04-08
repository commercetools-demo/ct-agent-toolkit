import {
  AuthMiddlewareOptions,
  Client,
  ClientBuilder,
  HttpMiddlewareOptions,
} from '@commercetools/ts-client';
import {
  ApiRoot,
  createApiBuilderFromCtpClient,
} from '@commercetools/platform-sdk';

import {listProducts} from './functions';

class CommercetoolsAPI {
  private authMiddlewareOptions: AuthMiddlewareOptions;
  private httpMiddlewareOptions: HttpMiddlewareOptions;
  private client: Client;
  private apiRoot: ApiRoot;

  constructor(
    clientId: string,
    clientSecret: string,
    authUrl: string,
    projectKey: string,
    apiUrl: string
  ) {
    this.authMiddlewareOptions = {
      credentials: {
        clientId: clientId,
        clientSecret: clientSecret,
      },
      host: authUrl,
      projectKey: projectKey,
    };
    this.httpMiddlewareOptions = {
      host: apiUrl,
    };
    this.client = new ClientBuilder()
      .withHttpMiddleware(this.httpMiddlewareOptions)
      .withConcurrentModificationMiddleware()
      .withClientCredentialsFlow(this.authMiddlewareOptions)
      .build();
    this.apiRoot = createApiBuilderFromCtpClient(this.client);
  }

  async run(method: string, arg: any) {
    if (method === 'list_products') {
      const output = JSON.stringify(
        await listProducts(
          this.apiRoot,
          {projectKey: this.authMiddlewareOptions.projectKey},
          arg
        )
      );
      return output;
    } else {
      throw new Error('Invalid method ' + method);
    }
  }
}

export default CommercetoolsAPI;
