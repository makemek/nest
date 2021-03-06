import {
  HttpServer,
  INestApplication,
  INestApplicationContext,
  INestMicroservice,
} from '@nestjs-client/common';
import { MicroserviceOptions } from '@nestjs-client/common/interfaces/microservices/microservice-configuration.interface';
import { NestMicroserviceOptions } from '@nestjs-client/common/interfaces/microservices/nest-microservice-options.interface';
import { NestApplicationContextOptions } from '@nestjs-client/common/interfaces/nest-application-context-options.interface';
import { NestApplicationOptions } from '@nestjs-client/common/interfaces/nest-application-options.interface';
import { INestExpressApplication } from '@nestjs-client/common/interfaces/nest-express-application.interface';
import { INestFastifyApplication } from '@nestjs-client/common/interfaces/nest-fastify-application.interface';
import { Logger } from '@nestjs-client/common/services/logger.service';
import { loadPackage } from '@nestjs-client/common/utils/load-package.util';
import { isFunction, isNil } from '@nestjs-client/common/utils/shared.utils';
import { BrowserAdapter } from './adapters/browser-adapter';
import { ApplicationConfig } from './application-config';
import { MESSAGES } from './constants';
import { ExceptionsZone } from './errors/exceptions-zone';
import { NestContainer } from './injector/container';
import { InstanceLoader } from './injector/instance-loader';
import { MetadataScanner } from './metadata-scanner';
import { NestApplication } from './nest-application';
import { NestApplicationContext } from './nest-application-context';
import { DependenciesScanner } from './scanner';

export class NestFactoryStatic {
  private readonly logger = new Logger('NestFactory', true);
  /**
   * Creates an instance of the NestApplication
   * @returns {Promise}
   */
  public async create(
    module: any,
    options?: NestApplicationOptions,
  ): Promise<INestApplication & INestExpressApplication>;
  public async create(
    module: any,
    httpServer: HttpServer | any,
    options?: NestApplicationOptions,
  ): Promise<INestApplication & INestExpressApplication>;
  public async create(
    module: any,
    serverOrOptions?: any,
    options?: NestApplicationOptions,
  ): Promise<
    INestApplication & (INestExpressApplication | INestFastifyApplication)
  > {
    const isHttpServer = serverOrOptions && serverOrOptions.patch;
    // tslint:disable-next-line:prefer-const
    let [httpServer, appOptions] = isHttpServer
      ? [serverOrOptions, options]
      : [new BrowserAdapter(), serverOrOptions];

    const applicationConfig = new ApplicationConfig();
    const container = new NestContainer(applicationConfig);

    this.applyLogger(appOptions);
    await this.initialize(module, container, applicationConfig, httpServer);
    return this.createNestInstance<NestApplication>(
      new NestApplication(container, httpServer, applicationConfig, appOptions),
    );
  }

  /**
   * Creates an instance of the NestMicroservice
   *
   * @param  {} module Entry (root) application module class
   * @param  {NestMicroserviceOptions & MicroserviceOptions} options Optional microservice configuration
   * @returns {Promise}
   */
  public async createMicroservice(
    module,
    options?: NestMicroserviceOptions & MicroserviceOptions,
  ): Promise<INestMicroservice> {
    const { NestMicroservice } = loadPackage(
      '@nestjs-client/microservices',
      'NestFactory',
    );

    const applicationConfig = new ApplicationConfig();
    const container = new NestContainer(applicationConfig);

    this.applyLogger(options);
    await this.initialize(module, container, applicationConfig);
    return this.createNestInstance<INestMicroservice>(
      new NestMicroservice(container, options, applicationConfig),
    );
  }

  /**
   * Creates an instance of the NestApplicationContext
   *
   * @param  {} module Entry (root) application module class
   * @param  {NestApplicationContextOptions} options Optional Nest application configuration
   * @returns {Promise}
   */
  public async createApplicationContext(
    module,
    options?: NestApplicationContextOptions,
  ): Promise<INestApplicationContext> {
    const container = new NestContainer();

    this.applyLogger(options);
    await this.initialize(module, container);

    const modules = container.getModules().values();
    const root = modules.next().value;
    const context = this.createNestInstance<NestApplicationContext>(
      new NestApplicationContext(container, [], root),
    );
    return context.init();
  }

  private createNestInstance<T>(instance: T): T {
    return this.createProxy(instance);
  }

  private async initialize(
    module,
    container: NestContainer,
    config = new ApplicationConfig(),
    httpServer: HttpServer = null,
  ) {
    const instanceLoader = new InstanceLoader(container);
    const dependenciesScanner = new DependenciesScanner(
      container,
      new MetadataScanner(),
      config,
    );
    container.setApplicationRef(httpServer);
    try {
      this.logger.log(MESSAGES.APPLICATION_START);
      await ExceptionsZone.asyncRun(async () => {
        await dependenciesScanner.scan(module);
        await instanceLoader.createInstancesOfDependencies();
        dependenciesScanner.applyApplicationProviders();
      });
    } catch (e) {
      console.error(e);
    }
  }

  private createProxy(target) {
    const proxy = this.createExceptionProxy();
    return new Proxy(target, {
      get: proxy,
      set: proxy,
    });
  }

  private createExceptionProxy() {
    return (receiver, prop) => {
      if (!(prop in receiver)) return;

      if (isFunction(receiver[prop])) {
        return (...args) => {
          let result;
          ExceptionsZone.run(() => {
            result = receiver[prop](...args);
          });
          return result;
        };
      }
      return receiver[prop];
    };
  }

  private applyLogger(options: NestApplicationContextOptions | undefined) {
    if (!options) {
      return;
    }
    !isNil(options.logger) && Logger.overrideLogger(options.logger);
  }
}

export const NestFactory = new NestFactoryStatic();
