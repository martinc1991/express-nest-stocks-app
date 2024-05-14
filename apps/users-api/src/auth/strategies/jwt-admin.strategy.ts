import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserRole } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { JwtCompleteToken } from '../types';

export const jwtAdminStategyName = 'jwt-admin';

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, jwtAdminStategyName) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtCompleteToken) {
    const user = await this.usersService.findOneByEmail(payload.email);

    if (!user) throw new UnauthorizedException();

    if (payload.role !== UserRole.ADMIN) throw new UnauthorizedException('Only admins can access this route');

    return payload;
  }
}
