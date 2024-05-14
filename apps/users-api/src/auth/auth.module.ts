import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CryptoModule } from 'src/crypto/crypto.module';
import { CryptoService } from 'src/crypto/crypto.service';
import { EmailModule } from 'src/email/email.module';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAdminStrategy, JwtStrategy, LocalStrategy } from './strategies';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
    UsersModule,
    PassportModule,
    CryptoModule,
    EmailModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtAdminStrategy, CryptoService],
  controllers: [AuthController],
})
export class AuthModule {}
