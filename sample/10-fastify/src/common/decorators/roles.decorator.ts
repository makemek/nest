import { ReflectMetadata } from '@nestjs-client/common';

export const Roles = (...roles: string[]) => ReflectMetadata('roles', roles);
