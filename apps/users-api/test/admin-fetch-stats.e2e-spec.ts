import { INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRole } from '@prisma/client';
import { AllExceptionsFilter } from 'src/all-exceptions.filter';
import { AuthDto } from 'src/auth/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

const regularUser: AuthDto = { email: 'regular@user.com', role: UserRole.USER };
const adminUser: AuthDto = { email: 'admin@user.com', role: UserRole.ADMIN };

const SIGNUP_ROUTE = '/auth/register';
const SIGNIN_ROUTE = '/auth/signin';
const FETCH_STATS = '/stats';

describe('Admin fetch stats flow', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

    // Config for the e2e test only
    app.useLogger(false); // Just for the console to be cleaner

    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);

    // Restart db
    await prisma.history.deleteMany();
    await prisma.stats.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('A regular user', () => {
    let access_token = '';

    beforeAll(async () => {
      const signUpResponse = await request(app.getHttpServer()).post(SIGNUP_ROUTE).send(regularUser);

      const signInResponse = await request(app.getHttpServer())
        .post(SIGNIN_ROUTE)
        .send({ email: signUpResponse.body.email, password: signUpResponse.body.password });

      access_token = signInResponse.body.access_token;
    });

    it('without a token should not be able to fetch stats', async () => {
      const response = await request(app.getHttpServer()).get(FETCH_STATS);

      expect(response.status).toBe(401);
    });
    it('with a token should not be able to fetch stats', async () => {
      const response = await request(app.getHttpServer()).get(FETCH_STATS).set('Authorization', `Bearer ${access_token}`);

      expect(response.status).toBe(401);
    });
  });

  describe('An admin user', () => {
    let access_token = '';
    const invalid_access_token = 'invalid_access_token';

    beforeAll(async () => {
      const signUpResponse = await request(app.getHttpServer()).post(SIGNUP_ROUTE).send(adminUser);

      const signInResponse = await request(app.getHttpServer())
        .post(SIGNIN_ROUTE)
        .send({ email: signUpResponse.body.email, password: signUpResponse.body.password });

      access_token = signInResponse.body.access_token;
    });

    it('without a token should not be able to fetch stats', async () => {
      const response = await request(app.getHttpServer()).get(FETCH_STATS);

      expect(response.status).toBe(401);
    });

    it('should not be able to fetch stats if he has an invalid access token', async () => {
      const response = await request(app.getHttpServer()).get(FETCH_STATS).set('Authorization', `Bearer ${invalid_access_token}`);

      expect(response.status).toBe(401);
    });

    it('should be able to fetch stats if he has an access token', async () => {
      const response = await request(app.getHttpServer()).get(FETCH_STATS).set('Authorization', `Bearer ${access_token}`);

      expect(response.status).toBe(200);

      expect(response.body).toHaveLength(0);
    });
  });
});
