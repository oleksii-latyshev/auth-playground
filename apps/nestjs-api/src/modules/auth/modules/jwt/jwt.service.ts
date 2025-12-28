import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/core/redis/redis.service';
import { TokenBody, TokenPayload } from 'src/modules/auth/modules/jwt/types';
import { getUUID } from 'src/shared/helpers/get-uuid';
import { RedisKeys } from 'src/core/redis/constants';
import { SignJWT } from 'jose';
import { SERVICE_NAME } from 'src/shared/constants';
import { ConfigService } from '@nestjs/config';
import { EnvKeys } from 'src/shared/constants/envs';

@Injectable()
export class JwtService {
  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}

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
      this.configService.getOrThrow<number>(EnvKeys.REFRESH_JWT_EXPIRES_IN),
    );

    return refreshTokenId;
  }

  async generateAccessToken(body: TokenBody): Promise<string> {
    return new SignJWT(body)
      .setJti(getUUID())
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(body.sub)
      .setIssuedAt()
      .setIssuer(SERVICE_NAME)
      .setExpirationTime(
        this.configService.getOrThrow<number>(EnvKeys.ACCESS_JWT_EXPIRES_IN),
      )
      .sign(
        new TextEncoder().encode(
          this.configService.getOrThrow<string>(EnvKeys.ACCESS_JWT_SECRET),
        ),
      );
  }

  async generatePair(
    body: TokenBody,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(body),
      this.generateRefreshToken(body),
    ]);

    return { accessToken, refreshToken };
  }
}
