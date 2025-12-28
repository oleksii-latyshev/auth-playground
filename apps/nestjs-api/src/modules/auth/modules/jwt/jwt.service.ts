import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/core/redis/redis.service';
import { TokenBody, TokenPayload } from 'src/modules/auth/modules/jwt/types';
import { getUUID } from 'src/shared/helpers/get-uuid';
import { RedisKeys } from 'src/core/redis/constants';
import { REFRESH_TOKEN_TTL } from 'src/modules/auth/modules/jwt/constants';

@Injectable()
export class JwtService {
  constructor(private readonly redisService: RedisService) {}

  async generateRefreshToken(body: TokenBody): Promise<string> {
    const refreshTokenId = getUUID();
    const now = new Date().toISOString();

    const tokenPayload: TokenPayload = {
      ...body,
      createdAt: now,
      jti: refreshTokenId,
    };

    await this.redisService.setex(
      `${RedisKeys.REFRESH_TOKEN}:${refreshTokenId}`,
      JSON.stringify(tokenPayload),
      REFRESH_TOKEN_TTL,
    );

    return refreshTokenId;
  }
}
