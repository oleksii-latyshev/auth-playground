import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Module({
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
