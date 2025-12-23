import { Module } from '@nestjs/common';
import { AccountModule } from 'src/modules/account/account.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { UserModule } from 'src/modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { IS_DEV } from 'src/shared/constants';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: !IS_DEV,
      isGlobal: true,
    }),
    PrismaModule,
    AccountModule,
    AuthModule,
    UserModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
