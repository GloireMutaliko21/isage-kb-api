import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Allows to get the req.user from express request
export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (data) {
      return request.user[data];
    }
    return request.user;
  },
);
