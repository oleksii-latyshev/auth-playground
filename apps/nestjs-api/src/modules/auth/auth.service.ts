import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AccountService } from 'src/modules/account/account.service';
import { SignInDto } from 'src/modules/auth/dto/sign-in.dto';
import { SignUpDto } from 'src/modules/auth/dto/sign-up.dto';
import { AuthProviders } from 'src/modules/auth/enums';
import { JwtAuthResponseEntity } from 'src/modules/auth/entities/jwt-auth-response.model';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { UserService } from 'src/modules/user/user.service';
import { HashService } from 'src/shared/services/hash.service';
import { JwtAuthResponse } from 'src/modules/auth/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly accountService: AccountService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp({ name, email, password }: SignUpDto): Promise<UserEntity> {
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await this.hashService.hash(password);

    const user = await this.userService.create({
      email,
      name,
    });

    await this.accountService.create({
      provider: AuthProviders.CREDENTIAL,
      password: hashedPassword,
      user: {
        connect: {
          id: user.id,
        },
      },
    });

    return new UserEntity(user);
  }

  async signIn(dto: SignInDto): Promise<UserEntity> {
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

    const isPasswordValid = await this.hashService.verify(
      account.password,
      dto.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return new UserEntity(user);
  }

  async jwtSignUp(dto: SignUpDto): Promise<JwtAuthResponse> {
    const { id, email } = await this.signUp(dto);

    const payload = { sub: id, email: email };

    const {} = await this.jwtService.signAsync(payload);

    const tokens = new JwtAuthResponseEntity({});

    return tokens;
  }
}
