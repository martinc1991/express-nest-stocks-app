import { UserWithTokens } from 'contract';

export const userWithTokensStub: UserWithTokens = {
  id: '1',
  email: 'test@test.com',
  role: 'USER',
  access_token: 'test',
  refresh_token: 'test',
  createdAt: new Date(),
  updatedAt: new Date(),
  password: 'test',
};
