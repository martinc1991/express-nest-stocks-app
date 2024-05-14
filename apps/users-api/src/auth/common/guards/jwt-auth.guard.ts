import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { jwtStategyName } from 'src/auth/strategies';

@Injectable()
export class JwtAuthGuard extends AuthGuard(jwtStategyName) {}
