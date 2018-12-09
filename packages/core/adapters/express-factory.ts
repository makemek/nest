import { ExpressAdapter } from './express-adapter';

export class ExpressFactory {
  public static create(): any {
    const noop = () => {}
    return new ExpressAdapter({
      use: noop,
      get: noop,
      post: noop,
      head: noop,
      delete: noop,
      put: noop,
      patch: noop,
      options: noop,
      listen: noop,
      close: noop,
      set: noop,
      enable: noop,
      disable: noop,
      engine: noop,
    });
  }
}
