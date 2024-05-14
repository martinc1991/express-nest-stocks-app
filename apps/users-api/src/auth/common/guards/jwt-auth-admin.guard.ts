import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { jwtAdminStategyName } from 'src/auth/strategies';

@Injectable()
export class JwtAdminAuthGuard extends AuthGuard(jwtAdminStategyName) {}
