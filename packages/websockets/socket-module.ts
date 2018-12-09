import { Injectable } from '@nestjs-client/common/interfaces/injectable.interface';
import { ApplicationConfig } from '@nestjs-client/core/application-config';
import { GuardsConsumer } from '@nestjs-client/core/guards/guards-consumer';
import { GuardsContextCreator } from '@nestjs-client/core/guards/guards-context-creator';
import { InstanceWrapper } from '@nestjs-client/core/injector/container';
import { InterceptorsConsumer } from '@nestjs-client/core/interceptors/interceptors-consumer';
import { InterceptorsContextCreator } from '@nestjs-client/core/interceptors/interceptors-context-creator';
import { PipesConsumer } from '@nestjs-client/core/pipes/pipes-consumer';
import { PipesContextCreator } from '@nestjs-client/core/pipes/pipes-context-creator';
import iterate from 'iterare';
import { GATEWAY_METADATA } from './constants';
import { SocketsContainer } from './container';
import { ExceptionFiltersContext } from './context/exception-filters-context';
import { WsContextCreator } from './context/ws-context-creator';
import { WsProxy } from './context/ws-proxy';
import { NestGateway } from './interfaces/nest-gateway.interface';
import { SocketServerProvider } from './socket-server-provider';
import { WebSocketsController } from './web-sockets-controller';

export class SocketModule {
  private readonly socketsContainer = new SocketsContainer();
  private applicationConfig: ApplicationConfig;
  private webSocketsController: WebSocketsController;

  public register(container, config) {
    this.applicationConfig = config;
    this.webSocketsController = new WebSocketsController(
      new SocketServerProvider(this.socketsContainer, config),
      config,
      this.getContextCreator(container),
    );
    const modules = container.getModules();
    modules.forEach(({ components }, moduleName) =>
      this.hookGatewaysIntoServers(components, moduleName),
    );
  }

  public hookGatewaysIntoServers(
    components: Map<string, InstanceWrapper<Injectable>>,
    moduleName: string,
  ) {
    components.forEach(wrapper =>
      this.hookGatewayIntoServer(wrapper, moduleName),
    );
  }

  public hookGatewayIntoServer(
    wrapper: InstanceWrapper<Injectable>,
    moduleName: string,
  ) {
    const { instance, metatype, isNotMetatype } = wrapper;
    if (isNotMetatype) {
      return;
    }
    const metadataKeys = Reflect.getMetadataKeys(metatype);
    if (!metadataKeys.includes(GATEWAY_METADATA)) {
      return;
    }
    this.webSocketsController.hookGatewayIntoServer(
      instance as NestGateway,
      metatype,
      moduleName,
    );
  }

  public async close(): Promise<any> {
    if (!this.applicationConfig) {
      return undefined;
    }
    const adapter = this.applicationConfig.getIoAdapter();
    const servers = this.socketsContainer.getAllServers();
    await Promise.all(
      iterate(servers.values()).map(
        async ({ server }) => server && adapter.close(server),
      ),
    );
    this.socketsContainer.clear();
  }

  private getContextCreator(container): WsContextCreator {
    return new WsContextCreator(
      new WsProxy(),
      new ExceptionFiltersContext(container),
      new PipesContextCreator(container),
      new PipesConsumer(),
      new GuardsContextCreator(container),
      new GuardsConsumer(),
      new InterceptorsContextCreator(container),
      new InterceptorsConsumer(),
    );
  }
}
