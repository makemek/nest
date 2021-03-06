import { RequestMethod } from '@nestjs-client/common';
import { HttpServer, RequestHandler } from '@nestjs-client/common/interfaces';
import { ServeStaticOptions } from '@nestjs-client/common/interfaces/external/serve-static-options.interface';
import { RouterMethodFactory } from '../helpers/router-method-factory';
import * as Router from "router"
import * as queryString from 'query-string'
import * as root from 'window-or-global'

export class BrowserAdapter implements HttpServer {
  private readonly routerMethodFactory = new RouterMethodFactory();
  private _router

  constructor() {
    this._router = Router()
  }

  use(...args: any[]) {
    return this._router.use(...args);
  }

  get(handler: RequestHandler);
  get(path: any, handler: RequestHandler);
  get(...args: any[]) {
    return this._router.get(...args);
  }

  post(handler: RequestHandler);
  post(path: any, handler: RequestHandler);
  post(...args: any[]) {
    return this._router.post(...args);
  }

  head(handler: RequestHandler);
  head(path: any, handler: RequestHandler);
  head(...args: any[]) {
    return this._router.head(...args);
  }

  delete(handler: RequestHandler);
  delete(path: any, handler: RequestHandler);
  delete(...args: any[]) {
    return this._router.delete(...args);
  }

  put(handler: RequestHandler);
  put(path: any, handler: RequestHandler);
  put(...args: any[]) {
    return this._router.put(...args);
  }

  patch(handler: RequestHandler);
  patch(path: any, handler: RequestHandler);
  patch(...args: any[]) {
    return this._router.patch(...args);
  }

  options(handler: RequestHandler);
  options(path: any, handler: RequestHandler);
  options(...args: any[]) {
    return this._router.options(...args);
  }

  listen(port: string | number, callback?: () => void);
  listen(port: string | number, hostname: string, callback?: () => void);
  listen(port: any, hostname?: any, callback?: any) {
    let window: any
    if(!process['browser']) {
      window = {
        history: {
          push: () => {},
          pushState: () => {},
        },
        location: {
          href: '/'
        }
      }
    }
    else {
      window = root
    }
    this.handleUrlChange(window.location.href)

    const pushState = window.history.pushState
    window.history.pushState = () => {
      pushState.apply(window.history, arguments)
      this.handleUrlChange(window.location.href)
    }
  }
  handleUrlChange(url = '/') {
    const req = {
      query: queryString.parseUrl(url).query,
      url,
      method: 'GET',
    }
    this._router(req, {}, error => error ? console.error(error): null)
  }

  reply(response, body: any, statusCode: number) {

  }

  render(response, view: string, options: any) {

  }

  setErrorHandler(handler: Function) {
    return this.use(handler);
  }

  setNotFoundHandler(handler: Function) {
    return this.use(handler);
  }

  setHeader(response, name: string, value: string) {
    return response.set(name, value);
  }

  getHttpServer<T = any>(): T {
    return null
  }

  setHttpServer(httpServer) {

  }

  getInstance<T = any>(): T {
    return this._router as T;
  }

  close() {
    return this._router.close();
  }

  set(...args) {
    return this._router.set(...args);
  }

  enable(...args) {
    return this._router.enable(...args);
  }

  disable(...args) {
    return this._router.disable(...args);
  }

  engine(...args) {
    return this._router.engine(...args);
  }

  useStaticAssets(path: string, options: ServeStaticOptions) {
    return this
  }

  setBaseViewsDir(path: string) {
    return this.set('views', path);
  }

  setViewEngine(engine: string) {
    return this.set('view engine', engine);
  }

  getRequestMethod(request): string {
    return request.method;
  }

  getRequestUrl(request): string {
    return request.url;
  }

  createMiddlewareFactory(
    requestMethod: RequestMethod,
  ): (path: string, callback: Function) => any {
    return this.routerMethodFactory
      .get(this._router, requestMethod)
      .bind(this._router);
  }
}
