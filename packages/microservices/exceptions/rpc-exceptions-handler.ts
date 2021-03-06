import { RpcExceptionFilterMetadata } from '@nestjs-client/common/interfaces/exceptions';
import { ArgumentsHost } from '@nestjs-client/common/interfaces/features/arguments-host.interface';
import { isEmpty } from '@nestjs-client/common/utils/shared.utils';
import { InvalidExceptionFilterException } from '@nestjs-client/core/errors/exceptions/invalid-exception-filter.exception';
import { Observable } from 'rxjs';
import { BaseRpcExceptionFilter } from './base-rpc-exception-filter';
import { RpcException } from './rpc-exception';

export class RpcExceptionsHandler extends BaseRpcExceptionFilter {
  private filters: RpcExceptionFilterMetadata[] = [];

  public handle(
    exception: Error | RpcException | any,
    host: ArgumentsHost,
  ): Observable<any> {
    const filterResult$ = this.invokeCustomFilters(exception, host);
    if (filterResult$) {
      return filterResult$;
    }
    return super.catch(exception, host);
  }

  public setCustomFilters(filters: RpcExceptionFilterMetadata[]) {
    if (!Array.isArray(filters)) {
      throw new InvalidExceptionFilterException();
    }
    this.filters = filters;
  }

  public invokeCustomFilters(
    exception,
    host: ArgumentsHost,
  ): Observable<any> | null {
    if (isEmpty(this.filters)) return null;

    const filter = this.filters.find(({ exceptionMetatypes, func }) => {
      const hasMetatype =
        !exceptionMetatypes.length ||
        exceptionMetatypes.some(
          ExceptionMetatype => exception instanceof ExceptionMetatype,
        );
      return hasMetatype;
    });
    return filter ? filter.func(exception, host) : null;
  }
}
