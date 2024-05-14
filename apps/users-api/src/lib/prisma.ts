import { HttpStatus } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export function getPrismaErrorStatusCode(exception: PrismaClientKnownRequestError): number {
  switch (exception.code) {
    case 'P2002':
      return HttpStatus.CONFLICT;
    case 'P2015':
    case 'P2025':
      return HttpStatus.NOT_FOUND;

    default:
      return HttpStatus.BAD_REQUEST;
  }
}
