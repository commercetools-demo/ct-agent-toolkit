import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import CommercetoolsAPI from '../shared/api';
import {isToolAllowed} from '../shared/configuration';
import {contextToTools} from '../shared/tools';
import type {Configuration} from '../types/configuration';
class CommercetoolsAgentToolkit extends McpServer {
  private _commercetools: CommercetoolsAPI;
  constructor({
    clientId,
    clientSecret,
    authUrl,
    projectKey,
    apiUrl,
    configuration,
  }: {
    clientId: string;
    clientSecret: string;
    authUrl: string;
    projectKey: string;
    apiUrl: string;
    configuration: Configuration;
  }) {
    super({
      name: 'Commercetools',
      version: '0.4.0',
    });

    this._commercetools = new CommercetoolsAPI(
      clientId,
      clientSecret,
      authUrl,
      projectKey,
      apiUrl,
      configuration.context
    );
    const filteredTools = contextToTools(configuration.context).filter((tool) =>
      isToolAllowed(tool, configuration)
    );
    filteredTools.forEach((tool) => {
      this.tool(
        tool.method,
        tool.description,
        tool.parameters.shape,
        async (arg: any) => {
          const result = await this._commercetools.run(tool.method, arg);
          return {
            content: [
              {
                type: 'text' as const,
                text: String(result),
              },
            ],
          };
        }
      );
    });
  }
}

export default CommercetoolsAgentToolkit;
