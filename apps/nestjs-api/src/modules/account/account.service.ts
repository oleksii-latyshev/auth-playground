import { Injectable } from '@nestjs/common';
import { AccountRepository } from 'src/modules/account/account.repository';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class AccountService {
  constructor(private readonly accountRepository: AccountRepository) {}

  create(data: Prisma.AccountCreateInput) {
    return this.accountRepository.create(data);
  }

  findAll() {
    return this.accountRepository.findAll();
  }

  findOne(id: string) {
    return this.accountRepository.findOne({
      id,
    });
  }

  findByProvider(provider: string, providerId: string) {
    return this.accountRepository.findOne({
      provider_providerId: {
        provider,
        providerId,
      },
    });
  }

  findCredentialAccountByUserId(userId: string) {
    return this.accountRepository.findFirst({
      userId,
      provider: 'credential',
    });
  }
}
