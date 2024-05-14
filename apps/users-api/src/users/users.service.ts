import { ConflictException, Injectable } from '@nestjs/common';
import { User, UserRole } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CryptoService } from 'src/crypto/crypto.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private cryptoService: CryptoService,
  ) {}

  async findOneByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async createUser(email: string, role: UserRole): Promise<User> {
    try {
      const password = this.generateRandomPassword(20); // INFO: project requirement
      const hashedPassword = await this.cryptoService.hash(password);

      const user = await this.prisma.user.create({
        data: { email, password: hashedPassword, role },
      });
      return { ...user, password };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Email already taken');
        }
      }
      throw error;
    }
  }

  async resetUserPassword(email: string): Promise<string> {
    const password = this.generateRandomPassword(20); // INFO: project requirement
    const hashedPassword = await this.cryptoService.hash(password);

    await this.prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    return password;
  }

  // ------------------------- Utils -------------------------

  generateRandomPassword(length: number) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  }
}
