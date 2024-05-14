declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      JWT_SECRET: string;
      STOCKS_API_URL: string;
      NODE_ENV: 'development' | 'production' | 'test';
      PORT: number;
      MAILTRAP_HOST: string;
      MAILTRAP_USERNAME: string;
      MAILTRAP_PASSWORD: string;
      STOCK_API_PORT: string;
      POSTGRES_USER: string;
      POSTGRES_PASSWORD: string;
      POSTGRES_DB: string;
      DB_PORT: string;
      MAILTRAP_PORT: string;
      MAILTRAP_FROM: string;
      STOCK_API_HOST: string;
      DB_HOST: string;
    }
  }
}

export {};

ENV_NAME;
PORT;
STOCK_API_PORT;
STOCK_API_HOST;
POSTGRES_USER;
POSTGRES_PASSWORD;
POSTGRES_DB;
DB_PORT;
DB_HOST;
DATABASE_URL;
JWT_SECRET;
STOCKS_API_URL;
MAILTRAP_HOST;
MAILTRAP_USERNAME;
MAILTRAP_PASSWORD;
MAILTRAP_PORT;
MAILTRAP_FROM;
DATABASE_URL;
STOCKS_API_URL;
