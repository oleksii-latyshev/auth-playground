import {
  Body,
  Controller,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { JwtAuthResponseEntity } from 'src/modules/auth/entities/jwt-auth-response.model';
import { SignUpDto } from 'src/modules/auth/dto/sign-up.dto';
import { SignInDto } from 'src/modules/auth/dto/sign-in.dto';
import { Public } from 'src/modules/auth/decorators/is-public.decorator';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import type { JWTPayload } from 'jose';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ================================
  // JWT Auth Endpoints
  // ================================

  @Public()
  jwtSignUp(@Body() dto: SignUpDto): Promise<JwtAuthResponseEntity> {
    return this.authService.jwtSignUp(dto);
  }

  @Public()
  jwtSignIn(@Body() dto: SignInDto): Promise<JwtAuthResponseEntity> {
    return this.authService.jwtSignIn(dto);
  }

  jwtAuthMe(@CurrentUser() { sub: userId }: JWTPayload): Promise<UserEntity> {
    if (!userId) {
      throw new UnauthorizedException();
    }

    return this.authService.jwtAuthMe(userId);
  }

  @Post('sign-up')
  @ApiOperation({ summary: 'User Sign Up' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully signed up.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'User with this email already exists.',
  })
  signUp(@Body() dto: SignUpDto): Promise<UserEntity> {
    return this.authService.signUp(dto);
  }

  @Post('sign-in')
  @ApiOperation({ summary: 'User Sign In' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully signed in.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials.',
  })
  signIn(@Body() dto: SignInDto): Promise<UserEntity> {
    return this.authService.signIn(dto);
  }
}
