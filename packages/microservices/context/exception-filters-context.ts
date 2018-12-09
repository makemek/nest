import { EXCEPTION_FILTERS_METADATA } from '@nestjs-client/common/constants';
import { Controller } from '@nestjs-client/common/interfaces/controllers/controller.interface';
import { isEmpty } from '@nestjs-client/common/utils/shared.utils';
import { ApplicationConfig } from '@nestjs-client/core/application-config';
import { BaseExceptionFilterContext } from '@nestjs-client/core/exceptions/base-exception-filter-context';
import { NestContainer } from '@nestjs-client/core/injector/container';
import { Observable } from 'rxjs';
import { RpcExceptionsHandler } from '../exceptions/rpc-exceptions-handler';

export class ExceptionFiltersContext extends BaseExceptionFilterContext {
  constructor(
    container: NestContainer,
    private readonly config: ApplicationConfig,
  ) {
    super(container);
  }

  public create(
    instance: Controller,
    callback: (data) => Observable<any>,
    module: string,
  ): RpcExceptionsHandler {
    this.moduleContext = module;

    const exceptionHandler = new RpcExceptionsHandler();
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
