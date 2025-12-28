import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from 'src/core/redis/redis.service';
import { TokenBody, TokenPayload } from 'src/modules/auth/modules/jwt/types';
import { getUUID } from 'src/shared/helpers/get-uuid';
import { RedisKeys } from 'src/core/redis/constants';
import { SignJWT, jwtVerify } from 'jose';
import { ConfigService } from '@nestjs/config';
import { EnvKeys } from 'src/shared/constants/envs';

@Injectable()
export class JwtService {
  private logger: Logger = new Logger(JwtService.name);

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
      .setIssuer(this.configService.getOrThrow<string>(EnvKeys.SERVICE_NAME))
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

  async validateRefreshToken(refreshTokenId: string): Promise<TokenPayload> {
    const tokenData = await this.redisService.get(
      `${RedisKeys.REFRESH_TOKEN}:${refreshTokenId}`,
    );

    if (!tokenData) {
      throw new Error('Invalid refresh token');
    }

    return JSON.parse(tokenData) as TokenPayload;
  }

  async invalidateRefreshToken(refreshTokenId: string): Promise<void> {
    await this.redisService.del(`${RedisKeys.REFRESH_TOKEN}:${refreshTokenId}`);
  }

  async validateAccessToken(token: string): Promise<TokenBody> {
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(
          this.configService.getOrThrow<string>(EnvKeys.ACCESS_JWT_SECRET),
        ),
        {
          issuer: this.configService.getOrThrow<string>(EnvKeys.SERVICE_NAME),
        },
      );

      return payload as TokenBody;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.warn(`Access token validation failed: ${error.message}`);
      } else {
        this.logger.warn(
          `Access token validation failed: Unknown error (${JSON.stringify(error)})`,
        );
      }

      throw new Error('Invalid access token');
    }
  }
}
