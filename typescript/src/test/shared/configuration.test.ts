import {z} from 'zod';
import {isToolAllowed} from '../../shared/configuration';

describe('isToolAllowed', () => {
  it('should return true if all permissions are allowed', () => {
    const tool = {
      method: 'test',
      name: 'Test',
      description: 'Test',
      parameters: z.object({
        foo: z.string(),
      }),
      actions: {
        products: {
          read: true,
        },
      },
    };

    const configuration = {
      actions: {
        products: {
          read: true,
        },
      },
    };

    expect(isToolAllowed(tool, configuration)).toBe(true);
  });

  it('should return false if any permission is denied', () => {
    const tool = {
      method: 'test',
      name: 'Test',
      description: 'Test',
      parameters: z.object({
        foo: z.string(),
      }),
      actions: {
        products: {
          read: true,
        },
      },
    };

    const configuration = {
      actions: {
        products: {
          read: false,
        },
      },
    };

    expect(isToolAllowed(tool, configuration)).toBe(false);
  });

  it('should return false if permission is missing', () => {
    const tool = {
      method: 'test',
      name: 'Test',
      description: 'Test',
      parameters: z.object({
        foo: z.string(),
      }),
      actions: {
        products: {
          read: true,
        },
      },
    };

    const configuration = {
      actions: {
        products: {},
      },
    };

    expect(isToolAllowed(tool, configuration)).toBe(false);
  });
});
