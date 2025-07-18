import { Injectable } from '@nestjs/common';
import { BaseService } from './shared/services/base.service';

@Injectable()
export class AppService extends BaseService {
  constructor() {
    super();
  }
  getHello() {
    return this.healthCheck('App Service');
  }
}
