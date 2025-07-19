import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/services/base.service';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { AxiosResponse } from 'axios';

@Injectable()
export class UsersService extends BaseService {
  private readonly urlServiceA: string;

  constructor(
    // Services
    private readonly httpService: HttpService,
  ) {
    super();
    this.urlServiceA = process.env.URL_SERVICE_A;
  }

  async login(username: string, password: string) {
    try {
      // Call api login จาก service-a
      const response: AxiosResponse<IResponse<any>> = await firstValueFrom(
        this.httpService.post(`${this.urlServiceA}/common/users/login`, {
          username,
          password,
        }),
      );

      console.log(response.data);

      if (!response.data.data) {
        return this.error('Invalid username or password');
      }

      return this.success(response.data.data);
    } catch (error) {
      return this.error('Failed to login', error.message);
    }
  }
}
