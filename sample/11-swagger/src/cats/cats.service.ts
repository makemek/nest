import { Injectable } from '@nestjs-client/common';
import { Cat } from './interfaces/cat.interface';

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];

  create(cat: Cat) {
    this.cats.push(cat);
  }

  findOne(id: number): Cat {
    return this.cats[id];
  }
}
