import { ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions } from '@nestjs/jwt';
import { EnvKeys } from 'src/shared/constants/envs';

export const jwtModuleConfig = (): JwtModuleAsyncOptions => ({
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    secret: config.get(EnvKeys.JWT_SECRET),
    signOptions: { expiresIn: Number(config.get(EnvKeys.JWT_EXPIRES_IN)) },
  }),
});
