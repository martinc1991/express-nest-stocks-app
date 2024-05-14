import { User } from '@prisma/client';

export type Tokens = {
  access_token: string;
  refresh_token: string;
};

export type UserWithTokens = User & Tokens;
