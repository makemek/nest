import { RouteParamtypes } from '@nestjs-client/common/enums/route-paramtypes.enum';
import { Paramtype } from '@nestjs-client/common';

export class ParamsTokenFactory {
  public exchangeEnumForString(type: RouteParamtypes): Paramtype {
    switch (type) {
      case RouteParamtypes.BODY:
        return 'body';
      case RouteParamtypes.PARAM:
        return 'param';
      case RouteParamtypes.QUERY:
        return 'query';
      default:
        return 'custom';
    }
  }
}
