import type {Tool} from 'ai';
import CommercetoolsAPI from '../shared/api';
import {isToolAllowed} from '../shared/configuration';
import {contextToTools} from '../shared/tools';
import type {Configuration} from '../types/configuration';
import CommercetoolsTool from './tool';
class CommercetoolsAgentToolkit {
  private _commercetools: CommercetoolsAPI;

  tools: {[key: string]: Tool};

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
    this._commercetools = new CommercetoolsAPI(
      clientId,
      clientSecret,
      authUrl,
      projectKey,
      apiUrl,
      configuration.context
    );
    this.tools = {};

    const filteredTools = contextToTools(configuration.context).filter((tool) =>
      isToolAllowed(tool, configuration)
    );

    filteredTools.forEach((tool) => {
      this.tools[tool.method] = CommercetoolsTool(
        this._commercetools,
        tool.method,
        tool.description,
        tool.parameters
      );
    });
  }

  getTools(): {[key: string]: Tool} {
    return this.tools;
  }
}

export default CommercetoolsAgentToolkit;
