import { INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRole } from '@prisma/client';
import { AllExceptionsFilter } from 'src/all-exceptions.filter';
import { AuthDto } from 'src/auth/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

const userOne: AuthDto = { email: 'nLsDv@example.com', role: UserRole.USER };

const SIGNUP_ROUTE = '/auth/register';
const SIGNIN_ROUTE = '/auth/signin';
const FETCH_STOCK_ROUTE = '/stock';

const validStockSymbol = 'AAPL.US';

describe('User fetch stock flow', () => {
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

  describe('User fetching a stock', () => {
    let access_token = '';
    const invalid_access_token = 'invalid_access_token';

    beforeAll(async () => {
      const signUpResponse = await request(app.getHttpServer()).post(SIGNUP_ROUTE).send(userOne);

      const signInResponse = await request(app.getHttpServer())
        .post(SIGNIN_ROUTE)
        .send({ email: signUpResponse.body.email, password: signUpResponse.body.password });

      access_token = signInResponse.body.access_token;
    });

    it('A user should not be able to fetch a stock if he does not have an access token', async () => {
      const response = await request(app.getHttpServer()).get(FETCH_STOCK_ROUTE).query({ q: validStockSymbol });

      expect(response.status).toBe(401);
    });
    it('A user should not be able to fetch a stock if he has an invalid access token', async () => {
      const response = await request(app.getHttpServer())
        .get(FETCH_STOCK_ROUTE)
        .query({ q: validStockSymbol })
        .set('Authorization', `Bearer ${invalid_access_token}`);

      expect(response.status).toBe(401);
    });

    it('A user should be able to fetch a stock if he has an access token', async () => {
      const response = await request(app.getHttpServer())
        .get(FETCH_STOCK_ROUTE)
        .query({ q: validStockSymbol })
        .set('Authorization', `Bearer ${access_token}`);

      expect(response.status).toBe(200);
    });
  });
});
