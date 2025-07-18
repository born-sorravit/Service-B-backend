import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IResponse } from '../interfaces/response.interface';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, IResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IResponse<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    return next.handle().pipe(
      map((response) => {
        // If response is already in the correct format, return it
        if (response?.statusCode && response?.message) {
          return {
            ...response,
            metadata: {
              ...response.metadata,
              path: request.url,
            },
          };
        }

        // Otherwise, format the response
        return {
          statusCode: context.switchToHttp().getResponse().statusCode,
          status: true,
          message: 'Success',
          ...response,
          metadata: {
            timestamp: new Date().toISOString(),
            path: request.url,
          },
        };
      }),
    );
  }
}
