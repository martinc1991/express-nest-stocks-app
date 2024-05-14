import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import express, { type Express } from 'express';
import morgan from 'morgan';
import { mainRouter } from './routers';

export const createServer = (): Express => {
  const app = express();
  app
    .use(morgan('dev'))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cors())
    .use('/', mainRouter);

  return app;
};
