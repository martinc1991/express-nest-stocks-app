import express, { Router } from 'express';
import { stockRouter } from './stocks.router';

export const mainRouter: Router = express.Router();

mainRouter.use('/stock', stockRouter);
