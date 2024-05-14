import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from '@prisma/client';
import { RegisterEndpointResponse, Tokens, UserWithTokens } from 'contract';
import { CryptoService } from 'src/crypto/crypto.service';
import { UsersService } from 'src/users/users.service';
import { AuthDto } from './dto';
import { JWTUserInfo } from './types/jwt-user-info.type';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private usersService: UsersService,
    private cryptoService: CryptoService,
  ) {}

  async register(dto: AuthDto): Promise<RegisterEndpointResponse> {
    const user = await this.usersService.createUser(dto.email, dto.role);

    return { email: user.email, password: user.password };
  }

  async signin({ id, email, role }: { id: string; email: string; role: UserRole }): Promise<UserWithTokens | null> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) return null;

    const tokens = await this.getTokens(id, email, role);

    return { ...user, ...tokens };
  }

  // ------------------------- Utils -------------------------
  async getTokens(userId: string, email: string, role: UserRole): Promise<Tokens> {
    const userJwtInfo: JWTUserInfo = { id: userId, email, role };

    const [at, rt] = await Promise.all([this.jwt.signAsync(userJwtInfo), this.jwt.signAsync(userJwtInfo)]);
    return { access_token: at, refresh_token: rt };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) return null;

    const passwordMatches = await this.cryptoService.compare({
      hashedPassword: user.password,
      password,
    });

    if (!passwordMatches) return null;

    return user;
  }
}
