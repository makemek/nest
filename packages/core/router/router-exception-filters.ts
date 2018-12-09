import { HttpServer } from '@nestjs-client/common';
import { EXCEPTION_FILTERS_METADATA } from '@nestjs-client/common/constants';
import { Controller } from '@nestjs-client/common/interfaces/controllers/controller.interface';
import { isEmpty } from '@nestjs-client/common/utils/shared.utils';
import { ApplicationConfig } from '../application-config';
import { BaseExceptionFilterContext } from '../exceptions/base-exception-filter-context';
import { ExceptionsHandler } from '../exceptions/exceptions-handler';
import { NestContainer } from '../injector/container';
import { RouterProxyCallback } from './router-proxy';

export class RouterExceptionFilters extends BaseExceptionFilterContext {
  constructor(
    container: NestContainer,
    private readonly config: ApplicationConfig,
    private readonly applicationRef: HttpServer,
  ) {
    super(container);
  }

  public create(
    instance: Controller,
    callback: RouterProxyCallback,
    module: string,
  ): ExceptionsHandler {
    this.moduleContext = module;

    const exceptionHandler = new ExceptionsHandler(this.applicationRef);
    const filters = this.createContext(
      instance,
      callback,
      EXCEPTION_FILTERS_METADATA,
    );
    if (isEmpty(filters)) {
      return exceptionHandler;
    }
    exceptionHandler.setCustomFilters(filters.reverse());
    return exceptionHandler;
  }

  public getGlobalMetadata<T extends any[]>(): T {
    return this.config.getGlobalFilters() as T;
  }
}
