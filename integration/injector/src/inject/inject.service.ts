import { Injectable } from '@nestjs-client/common';
import { CoreService } from './core.service';

@Injectable()
export class InjectService {
  constructor(private readonly coreService: CoreService) {}
}
