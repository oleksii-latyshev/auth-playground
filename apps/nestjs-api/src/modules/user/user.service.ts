import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(data: Prisma.UserCreateInput) {
    return this.userRepository.create(data);
  }

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async findOne(id: string) {
    return this.userRepository.findOne({ id });
  }
}
