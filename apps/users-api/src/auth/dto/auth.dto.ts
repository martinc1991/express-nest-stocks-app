import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

export class AuthDto {
  @ApiProperty()
  @IsEmail({}, { message: 'Email must be a valid email' })
  email: string;

  @ApiProperty({ enum: [UserRole.ADMIN, UserRole.USER] })
  @IsEnum(UserRole, { message: 'User must be either user or admin' })
  role: UserRole;
}

export class AuthDtoWithPassword {
  @ApiProperty()
  @IsEmail({}, { message: 'Email must be a valid email' })
  email: string;

  @ApiProperty()
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsEmail({}, { message: 'Email must be a valid email' })
  email: string;
}
