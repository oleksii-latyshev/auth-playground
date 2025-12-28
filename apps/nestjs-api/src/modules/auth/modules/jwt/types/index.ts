import { CreatedAt } from 'src/shared/types/atoms';

export type TokenBody = {
  sub: string;
  email: string;
};

export type TokenPayload = TokenBody &
  CreatedAt<string> & {
    jti: string;
  };
