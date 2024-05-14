import { Controller, Get, Req } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { Request } from 'express';

@ApiExcludeController()
@Controller()
export class AppController {
  @Get()
  getDocumentationUrl(@Req() request: Request): string {
    const baseUrl = `${request.protocol}://${request.get('host')}`;
    const documentationUrl = `${baseUrl}/docs`;
    const docsLink = `<a href="${documentationUrl}">${documentationUrl}</a>`;

    return `Please refer to the API documentation at: ${docsLink}`;
  }
}
