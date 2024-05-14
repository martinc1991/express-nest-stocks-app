import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CryptoService {
  async hash(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async compare({ password, hashedPassword }: { password: string; hashedPassword: string }): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
