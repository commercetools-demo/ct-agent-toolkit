import type {CoreTool} from 'ai';
import {tool} from 'ai';
import {z} from 'zod';
import CommercetoolsAPI from '../shared/api';

export default function CommercetoolsTool(
  commercetoolsAPI: CommercetoolsAPI,
  method: string,
  description: string,
  schema: z.ZodObject<any, any, any, any, {[x: string]: any}>
): CoreTool {
  return tool({
    description: description,
    parameters: schema,
    execute: (arg: z.output<typeof schema>) => {
      return commercetoolsAPI.run(method, arg);
    },
  });
}
