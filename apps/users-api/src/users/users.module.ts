import { Module } from '@nestjs/common';
import { CryptoModule } from 'src/crypto/crypto.module';
import { CryptoService } from 'src/crypto/crypto.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersService } from './users.service';

@Module({
  imports: [PrismaModule, CryptoModule],
  providers: [UsersService, CryptoService],
  exports: [UsersService],
})
export class UsersModule {}
