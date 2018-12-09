import { Controller } from '@nestjs-client/common/interfaces/controllers/controller.interface';
import { RuntimeException } from '@nestjs-client/core/errors/exceptions/runtime.exception';
import { GuardsConsumer } from '@nestjs-client/core/guards/guards-consumer';
import { GuardsContextCreator } from '@nestjs-client/core/guards/guards-context-creator';
import { InstanceWrapper } from '@nestjs-client/core/injector/container';
import { InterceptorsConsumer } from '@nestjs-client/core/interceptors/interceptors-consumer';
import { InterceptorsContextCreator } from '@nestjs-client/core/interceptors/interceptors-context-creator';
import { PipesConsumer } from '@nestjs-client/core/pipes/pipes-consumer';
import { PipesContextCreator } from '@nestjs-client/core/pipes/pipes-context-creator';
import { ClientsContainer } from './container';
import { ExceptionFiltersContext } from './context/exception-filters-context';
import { RpcContextCreator } from './context/rpc-context-creator';
import { RpcProxy } from './context/rpc-proxy';
import { CustomTransportStrategy } from './interfaces';
import { ListenersController } from './listeners-controller';
import { Server } from './server/server';

export class MicroservicesModule {
  private readonly clientsContainer = new ClientsContainer();
  private listenersController: ListenersController;

  public register(container, config) {
    const contextCreator = new RpcContextCreator(
      new RpcProxy(),
      new ExceptionFiltersContext(container, config),
      new PipesContextCreator(container, config),
      new PipesConsumer(),
      new GuardsContextCreator(container, config),
      new GuardsConsumer(),
      new InterceptorsContextCreator(container, config),
      new InterceptorsConsumer(),
    );
    this.listenersController = new ListenersController(
      this.clientsContainer,
      contextCreator,
    );
  }

  public setupListeners(container, server: Server & CustomTransportStrategy) {
    if (!this.listenersController) {
      throw new RuntimeException();
    }
    const modules = container.getModules();
    modules.forEach(({ routes }, module) =>
      this.bindListeners(routes, server, module),
    );
  }

  public setupClients(container) {
    if (!this.listenersController) {
      throw new RuntimeException();
    }
    const modules = container.getModules();
    modules.forEach(({ routes, components }) => {
      this.bindClients(routes);
      this.bindClients(components);
    });
  }

  public bindListeners(
    controllers: Map<string, InstanceWrapper<Controller>>,
    server: Server & CustomTransportStrategy,
    module: string,
  ) {
    controllers.forEach(({ instance }) =>
      this.listenersController.bindPatternHandlers(instance, server, module),
    );
  }

  public bindClients(items: Map<string, InstanceWrapper<Controller>>) {
    items.forEach(({ instance, isNotMetatype }) => {
      !isNotMetatype &&
        this.listenersController.bindClientsToProperties(instance);
    });
  }

  public close() {
    const clients = this.clientsContainer.getAllClients();
    clients.forEach(client => client.close());
    this.clientsContainer.clear();
  }
}
