import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { EnvKeys } from 'src/shared/constants/envs';

@Injectable()
export class RedisService extends Redis {
  public constructor(private readonly configService: ConfigService) {
    super(configService.getOrThrow<string>(EnvKeys.REDIS_URI));
  }
}
