import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AccountService } from '../account/account.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly accountService: AccountService,
  ) {}

  async signUp(dto: SignUpDto) {
    const existingUser = await this.userService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await argon2.hash(dto.password);

    const user = await this.userService.create({
      email: dto.email,
      name: dto.name,
    });

    await this.accountService.create({
      provider: 'credential',
      providerId: user.id,
      password: hashedPassword,
      user: {
        connect: {
          id: user.id,
        },
      },
    });

    return user;
  }

  async signIn(dto: SignInDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const account = await this.accountService.findCredentialAccountByUserId(
      user.id,
    );
    if (!account || !account.password) {
      throw new UnauthorizedException('Invalid credentials or no password set');
    }

    const isPasswordValid = await argon2.verify(account.password, dto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
