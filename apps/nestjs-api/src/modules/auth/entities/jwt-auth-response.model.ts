import { IsString } from 'class-validator';
import { JwtAuthResponse } from 'src/modules/auth/types';

export class JwtAuthResponseEntity implements JwtAuthResponse {
  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;

  constructor(partial: Partial<JwtAuthResponse>) {
    Object.assign(this, partial);
  }
}
