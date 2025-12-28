import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import { JWTPayload } from 'jose';

export const CurrentUser = createParamDecorator(
  (
    key: keyof JWTPayload,
    ctx: ExecutionContext,
  ): JWTPayload | Partial<JWTPayload> => {
    const req = ctx.switchToHttp().getRequest();

    return key ? req.user[key] : req.user;
  },
);
