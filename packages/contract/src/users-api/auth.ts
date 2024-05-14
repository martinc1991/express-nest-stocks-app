import { User } from '@prisma/client';
import { Tokens } from '../auth';

export type RegisterEndpointResponse = {
  email: string;
  password: string;
};

export type SignInEndpointResponse = Omit<User, 'password' | 'createdAt' | 'updatedAt'> & Tokens;
