import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class AccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  findOne(where: Prisma.AccountWhereUniqueInput) {
    return this.prisma.account.findUnique({ where });
  }

  findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.AccountWhereUniqueInput;
    where?: Prisma.AccountWhereInput;
    orderBy?: Prisma.AccountOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.account.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  create(data: Prisma.AccountCreateInput) {
    return this.prisma.account.create({ data });
  }

  update(params: {
    where: Prisma.AccountWhereUniqueInput;
    data: Prisma.AccountUpdateInput;
  }) {
    const { where, data } = params;
    return this.prisma.account.update({
      where,
      data,
    });
  }

  delete(where: Prisma.AccountWhereUniqueInput) {
    return this.prisma.account.delete({ where });
  }
}
