import express, { Router } from 'express';
import { getStockController } from '../controllers';

export const stockRouter: Router = express.Router();

stockRouter.get('/', getStockController);
