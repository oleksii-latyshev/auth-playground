import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserEntity } from 'src/modules/user/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  jwtSignUp(@Body() dto: SignUpDto): Promise<{ token: string }> {
    return this.authService.jwtSignUp(dto);
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
