import { Injectable } from '@nestjs-client/common';

@Injectable()
export class UsersService {
  findById(id: string) {
    return { id };
  }
}
