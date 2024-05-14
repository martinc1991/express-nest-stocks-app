import { AuthDto, AuthDtoWithPassword } from 'src/auth/dto';

export const createUserStub: AuthDto = {
  email: 'test@test.com',
  role: 'USER',
};

export const signInUserStub: AuthDtoWithPassword = {
  email: 'test@test.com',
  password: 'test',
};
