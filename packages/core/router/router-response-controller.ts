import { RequestMethod, HttpStatus, HttpServer } from '@nestjs-client/common';
import { isFunction } from '@nestjs-client/common/utils/shared.utils';

export interface CustomHeader {
  name: string;
  value: string;
}

export class RouterResponseController {
  constructor(private readonly applicationRef: HttpServer) {}

  public async apply(resultOrDeffered, response, httpStatusCode: number) {
    const result = await this.transformToResult(resultOrDeffered);
    return this.applicationRef.reply(response, result, httpStatusCode);
  }

  public async render(resultOrDeffered, response, template: string) {
    const result = await this.transformToResult(resultOrDeffered);
    this.applicationRef.render(response, template, result);
  }

  public async transformToResult(resultOrDeffered) {
    if (resultOrDeffered && isFunction(resultOrDeffered.subscribe)) {
      return resultOrDeffered.toPromise();
    }
    return resultOrDeffered;
  }

  public getStatusByMethod(requestMethod: RequestMethod): number {
    switch (requestMethod) {
      case RequestMethod.POST:
        return HttpStatus.CREATED;
      default:
        return HttpStatus.OK;
    }
  }

  public setHeaders(response, headers: CustomHeader[]) {
    headers.forEach(({ name, value }) =>
      this.applicationRef.setHeader(response, name, value),
    );
  }
}
