import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsOptional,
  IsString,
} from 'class-validator';
import { User } from 'generated/prisma/client';

export class UserEntity implements User {
  @IsString()
  id: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  name: string | null;

  @IsBoolean()
  emailVerified: boolean;

  @IsString()
  @IsOptional()
  image: string | null;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
