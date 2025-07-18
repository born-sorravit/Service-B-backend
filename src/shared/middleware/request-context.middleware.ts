import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction): void {
    // const requestId = request.headers['x-request-id'] || uuidv4();
    // request['requestId'] = requestId;
    // response.setHeader('X-Request-ID', requestId);
    next();
  }
}
