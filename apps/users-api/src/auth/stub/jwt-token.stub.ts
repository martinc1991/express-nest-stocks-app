import { Tokens } from 'contract';
import { JwtCompleteToken } from '../types';

export const jwtCompleteTokenStub: JwtCompleteToken = {
  id: 'some-random-id',
  email: 'test@test.com',
  iat: 1000,
  exp: 1000,
  role: 'USER',
};

export const tokensStub: Tokens = {
  access_token: 'test',
  refresh_token: 'test',
};
