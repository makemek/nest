import { Catch, RpcExceptionFilter } from '@nestjs-client/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs-client/microservices';

@Catch(RpcException)
export class ExceptionFilter implements RpcExceptionFilter {
  catch(exception: RpcException): Observable<any> {
    return throwError(exception.getError());
  }
}
