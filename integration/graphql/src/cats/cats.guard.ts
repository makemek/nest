import { CanActivate, ExecutionContext, Injectable } from '@nestjs-client/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class CatsGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    return true;
  }
}
