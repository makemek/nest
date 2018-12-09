import {
  CanActivate,
  ExceptionFilter,
  INestMicroservice,
  NestInterceptor,
  PipeTransform,
  WebSocketAdapter,
} from '@nestjs-client/common';
import { Logger } from '@nestjs-client/common/services/logger.service';
import { ApplicationConfig } from '@nestjs-client/core/application-config';
import { MESSAGES } from '@nestjs-client/core/constants';
import { NestContainer } from '@nestjs-client/core/injector/container';
import { NestApplicationContext } from '@nestjs-client/core/nest-application-context';
import * as optional from 'optional';
import { Transport } from './enums/transport.enum';
import { CustomTransportStrategy } from './interfaces/custom-transport-strategy.interface';
import { MicroserviceOptions } from './interfaces/microservice-configuration.interface';
import { MicroservicesModule } from './microservices-module';
import { Server } from './server/server';
import { ServerFactory } from './server/server-factory';

const { SocketModule } =
  optional('@nestjs-client/websockets/socket-module') || ({} as any);
const { IoAdapter } =
  optional('@nestjs-client/websockets/adapters/io-adapter') || ({} as any);

export class NestMicroservice extends NestApplicationContext
  implements INestMicroservice {
  private readonly logger = new Logger(NestMicroservice.name, true);
  private readonly microservicesModule = new MicroservicesModule();
  private readonly socketModule = SocketModule ? new SocketModule() : null;
  private microserviceConfig: MicroserviceOptions;
  private server: Server & CustomTransportStrategy;
  private isTerminated = false;
  private isInitialized = false;
  private isInitHookCalled = false;

  constructor(
    container: NestContainer,
    config: MicroserviceOptions = {},
    private readonly applicationConfig: ApplicationConfig,
  ) {
    super(container, [], null);

    this.registerWsAdapter();
    this.microservicesModule.register(container, this.applicationConfig);
    this.createServer(config);
    this.selectContextModule();
  }

  public registerWsAdapter() {
    const ioAdapter = IoAdapter ? new IoAdapter() : null;
    this.applicationConfig.setIoAdapter(ioAdapter);
  }

  public createServer(config: MicroserviceOptions) {
    try {
      this.microserviceConfig = {
        transport: Transport.TCP,
        ...config,
      } as any;
      const { strategy } = config as any;
      this.server = strategy
        ? strategy
        : ServerFactory.create(this.microserviceConfig);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async registerModules(): Promise<any> {
    this.socketModule &&
      this.socketModule.register(this.container, this.applicationConfig);
    this.microservicesModule.setupClients(this.container);

    this.registerListeners();
    this.setIsInitialized(true);

    if (!this.isInitHookCalled) {
      await this.callInitHook();
      await this.callBootstrapHook();
    }
  }

  public registerListeners() {
    this.microservicesModule.setupListeners(this.container, this.server);
  }

  public useWebSocketAdapter(adapter: WebSocketAdapter): this {
    this.applicationConfig.setIoAdapter(adapter);
    return this;
  }

  public useGlobalFilters(...filters: ExceptionFilter[]): this {
    this.applicationConfig.useGlobalFilters(...filters);
    return this;
  }

  public useGlobalPipes(...pipes: PipeTransform<any>[]): this {
    this.applicationConfig.useGlobalPipes(...pipes);
    return this;
  }

  public useGlobalInterceptors(...interceptors: NestInterceptor[]): this {
    this.applicationConfig.useGlobalInterceptors(...interceptors);
    return this;
  }

  public useGlobalGuards(...guards: CanActivate[]): this {
    this.applicationConfig.useGlobalGuards(...guards);
    return this;
  }

  public listen(callback: () => void) {
    !this.isInitialized && this.registerModules();

    this.logger.log(MESSAGES.MICROSERVICE_READY);
    this.server.listen(callback);
  }

  public async listenAsync(): Promise<any> {
    return new Promise(resolve => this.listen(resolve));
  }

  public async close(): Promise<any> {
    await this.server.close();
    !this.isTerminated && (await this.closeApplication());
  }

  public setIsInitialized(isInitialized: boolean) {
    this.isInitialized = isInitialized;
  }

  public setIsTerminated(isTerminaed: boolean) {
    this.isTerminated = isTerminaed;
  }

  public setIsInitHookCalled(isInitHookCalled: boolean) {
    this.isInitHookCalled = isInitHookCalled;
  }

  protected async closeApplication(): Promise<any> {
    this.socketModule && (await this.socketModule.close());
    await super.close();
    this.setIsTerminated(true);
  }
}
