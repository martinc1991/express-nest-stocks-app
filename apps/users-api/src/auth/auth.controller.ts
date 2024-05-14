import { Body, Controller, HttpCode, HttpStatus, NotFoundException, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { RegisterEndpointResponse, SignInEndpointResponse } from 'contract';
import { EmailService } from 'src/email/email.service';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LocalStrategyUser } from './common/decorators';
import { LocalAuthGuard } from './common/guards';
import { AuthDto, AuthDtoWithPassword, ResetPasswordDto } from './dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private emailService: EmailService,
    private usersService: UsersService,
  ) {}

  @ApiCreatedResponse({ description: 'The user has been successfully registered.' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() dto: AuthDto): Promise<RegisterEndpointResponse> {
    return this.authService.register(dto);
  }

  @ApiBody({ type: AuthDtoWithPassword })
  @ApiOkResponse({ description: 'The user has successfully signed in.' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(@LocalStrategyUser() user: LocalStrategyUser): Promise<SignInEndpointResponse> {
    const signedInUser = await this.authService.signin({ email: user.email, id: user.id, role: user.role });

    if (!signedInUser) throw new UnauthorizedException('Invalid credentials');

    return {
      id: signedInUser.id,
      email: signedInUser.email,
      role: signedInUser.role,
      access_token: signedInUser.access_token,
      refresh_token: signedInUser.refresh_token,
    };
  }
  @ApiCreatedResponse({ description: 'The user has successfully reset their password and an email has been sent.' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @Post('reset')
  @HttpCode(HttpStatus.CREATED)
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<{ message: string; password: string | null }> {
    const user = await this.usersService.findOneByEmail(dto.email);

    if (!user) throw new NotFoundException('User not found');

    const newPassword = await this.usersService.resetUserPassword(dto.email);
    await this.emailService.sendResetEmail(dto.email, newPassword);

    return { message: 'Password reset email sent', password: newPassword };
  }
}
