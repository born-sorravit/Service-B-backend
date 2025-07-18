import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUserInfoAccessToken } from 'src/interfaces/accessToken.interface';
export const UserInfoAccessToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return request.user as IUserInfoAccessToken;
  },
);
