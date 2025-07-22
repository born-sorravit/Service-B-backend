import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { IRateResponse } from 'src/interfaces/rate.interface';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { BaseService } from 'src/shared/services/base.service';

@Injectable()
export class RatesService extends BaseService {
  private readonly urlServiceA: string;

  constructor(
    // Services
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    super();
    this.urlServiceA = this.configService.get('urlServiceA');
  }

  async getRate() {
    try {
      // Call api login จาก service-a
      const response: AxiosResponse<IResponse<IRateResponse[]>> =
        await firstValueFrom(
          this.httpService.get(`${this.urlServiceA}/common/rates/all`),
        );
      console.log({ response: response.data.data });

      if (!response.data.data) {
        return this.error(`Can't get rate`);
      }

      return this.success([...response.data.data]);
    } catch (error) {
      return this.error('Failed to get rate', error.message);
    }
  }
}
