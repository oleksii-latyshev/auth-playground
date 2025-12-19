import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { AccountModule } from '../account/account.module';

@Module({
  imports: [UserModule, AccountModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
