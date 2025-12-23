import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { AccountModule } from '../account/account.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtModuleConfig } from 'src/modules/auth/configs/jwt-module.config';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    UserModule,
    AccountModule,
    PassportModule,
    JwtModule.register(jwtModuleConfig()),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
