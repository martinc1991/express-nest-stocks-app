import { INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { AllExceptionsFilter } from 'src/all-exceptions.filter';
import { AuthDto } from 'src/auth/dto';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';

const userOne: AuthDto = { email: 'nLsDv@example.com', role: 'USER' };
const invalidUser = { email: 'not-an-email', role: 'NOT-VALID-ROLE' };

const SIGNUP_ROUTE = '/auth/register';
const SIGNIN_ROUTE = '/auth/signin';
const RESET_ROUTE = '/auth/reset';

describe('Auth flow', () => {
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
  });

  describe('User signup', () => {
    beforeEach(async () => {
      await prisma.user.deleteMany();
    });

    it('should not be able to sign up, if invalid email is provided', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post(SIGNUP_ROUTE)
        .send({
          ...userOne,
          email: invalidUser.email,
        });

      expect(status).toBe(400);
      expect(body.response.message).toContain('Email must be a valid email');
    });
    it('should not be able to sign up, if invalid role is provided', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post(SIGNUP_ROUTE)
        .send({
          ...userOne,
          role: invalidUser.role,
        });

      expect(status).toBe(400);
      expect(body.response.message).toContain('User must be either user or admin');
    });
    it('should be able to sign up, if valid email and role are provided get its email and password credentials', async () => {
      const { status, body } = await request(app.getHttpServer()).post(SIGNUP_ROUTE).send(userOne);

      expect(status).toBe(201);
      expect(body.email).toBe(userOne.email);
      expect(body.password).toBeDefined();
    });

    it('should not be able to sign up if email is already taken', async () => {
      const user = await request(app.getHttpServer()).post(SIGNUP_ROUTE).send(userOne);
      expect(user.status).toBe(201);

      const alreadyTakenUser = await request(app.getHttpServer()).post(SIGNUP_ROUTE).send(userOne);

      expect(alreadyTakenUser.status).toBe(409);
      expect(alreadyTakenUser.body.response.message).toContain('Email already taken');
    });
  });

  describe('A user', () => {
    let validPassword = '';

    beforeAll(async () => {
      await prisma.user.deleteMany();
      const user = await request(app.getHttpServer()).post(SIGNUP_ROUTE).send(userOne);

      validPassword = user.body.password;
    });

    it('should not be able to signin, if invalid email or password are provided', async () => {
      const invalidEmailReq = await request(app.getHttpServer())
        .post(SIGNIN_ROUTE)
        .send({ ...userOne, email: invalidUser.email });
      const invalidPasswordReq = await request(app.getHttpServer())
        .post(SIGNIN_ROUTE)
        .send({ ...userOne, role: invalidUser.role });

      expect(invalidEmailReq.status).toBe(401);
      expect(invalidPasswordReq.status).toBe(401);
    });
    it('should not be able to signin, if valid email and password are provided but password doesnt match', async () => {
      const invalidPasswordReq = await request(app.getHttpServer())
        .post(SIGNIN_ROUTE)
        .send({ ...userOne, password: 'invalid-password' });

      expect(invalidPasswordReq.status).toBe(401);
    });
    it('should be able to signin, if valid email and password are provided and they match', async () => {
      const validReq = await request(app.getHttpServer())
        .post(SIGNIN_ROUTE)
        .send({ ...userOne, password: validPassword });

      expect(validReq.status).toBe(200);
    });
    it('that successfully signs in should get an access token and a refresh token', async () => {
      const validReq = await request(app.getHttpServer())
        .post(SIGNIN_ROUTE)
        .send({ ...userOne, password: validPassword });

      expect(validReq.status).toBe(200);
      expect(validReq.body.access_token).toBeDefined();
      expect(validReq.body.refresh_token).toBeDefined();
    });
    it('should be able to reset its password', async () => {
      const resetReq = await request(app.getHttpServer()).post(RESET_ROUTE).send({ email: userOne.email });

      expect(resetReq.status).toBe(201);
      expect(resetReq.body.password).toBeDefined();
      expect(resetReq.body.message).toBeDefined();

      const newPassword = resetReq.body.password;

      const signWithOldPasswordReq = await request(app.getHttpServer())
        .post(SIGNIN_ROUTE)
        .send({ ...userOne, password: validPassword });

      expect(signWithOldPasswordReq.status).toBe(401);

      const signWithNewPasswordReq = await request(app.getHttpServer())
        .post(SIGNIN_ROUTE)
        .send({ ...userOne, password: newPassword });

      expect(signWithNewPasswordReq.status).toBe(200);
    });
  });
});
