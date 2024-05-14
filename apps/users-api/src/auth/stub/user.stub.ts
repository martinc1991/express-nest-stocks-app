import { User } from '@prisma/client';

export const userStub: User = {
  id: '1',
  email: 'test@test.com',
  role: 'USER',
  createdAt: new Date(),
  updatedAt: new Date(),
  password: 'test',
};
