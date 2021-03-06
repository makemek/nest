import { Transform } from '@nestjs-client/common/interfaces';
import { ParamsTokenFactory } from './params-token-factory';

export class PipesConsumer {
  private readonly paramsTokenFactory = new ParamsTokenFactory();

  public async apply(
    value,
    { metatype, type, data },
    transforms: Transform<any>[],
  ) {
    const token = this.paramsTokenFactory.exchangeEnumForString(type);
    return this.applyPipes(
      value,
      { metatype, type: token, data },
      transforms,
    );
  }

  public async applyPipes(
    value,
    { metatype, type, data }: { metatype; type?; data? },
    transforms: Transform<any>[],
  ) {
    return transforms.reduce(async (defferedValue, fn) => {
      const val = await defferedValue;
      const result = fn(val, { metatype, type, data });
      return result;
    }, Promise.resolve(value));
  }
}
