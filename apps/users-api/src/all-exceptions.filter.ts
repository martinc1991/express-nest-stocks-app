import { ArgumentsHost, Catch, HttpException, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';
import { Request, Response } from 'express';
import { getPrismaErrorStatusCode } from 'src/lib/prisma';

type ErrorRes = {
  statusCode: number;
  timestamp: string;
  path: string;
  response: string | object;
};

// TODO: serialize errors
@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const response: ErrorRes = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
      path: req.url,
      response: '',
    };

    if (exception instanceof PrismaClientKnownRequestError) {
      response.statusCode = getPrismaErrorStatusCode(exception);
      response.response = exception.message.replaceAll(/\n/g, ' ');
    } else if (exception instanceof PrismaClientValidationError) {
      response.statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
      response.response = exception.message.replaceAll(/\n/g, ' ');
    } else if (exception instanceof HttpException) {
      response.statusCode = exception.getStatus();
      response.response = exception.getResponse();
    } else {
      response.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      response.response = 'Internal Server Error';
    }

    res.status(response.statusCode).json(response);

    super.catch(exception, host);
  }
}
