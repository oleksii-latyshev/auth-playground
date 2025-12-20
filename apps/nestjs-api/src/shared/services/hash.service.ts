import * as argon2 from 'argon2';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HashService {
  async hash(rawValue: Buffer | string): Promise<string> {
    const hashed = await argon2.hash(rawValue);

    return hashed;
  }

  async verify(
    hashedValue: string,
    rawValue: Buffer | string,
  ): Promise<boolean> {
    const isValid = await argon2.verify(hashedValue, rawValue);

    return isValid;
  }
}
