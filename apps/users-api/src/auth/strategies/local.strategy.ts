import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { getMessageFromClassValidatorError } from 'src/lib/errors/class-validator';
import { AuthService } from '../auth.service';
import { AuthDtoWithPassword } from '../dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    const message = await getMessageFromClassValidatorError(AuthDtoWithPassword, {
      email,
      password,
    });

    if (message) throw new BadRequestException(message);

    const user = await this.authService.validateUser(email, password);

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
