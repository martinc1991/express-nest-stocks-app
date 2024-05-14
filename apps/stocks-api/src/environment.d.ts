declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PORT: number;
      STOCK_CODE_REPLACE: string;
      STOOQ_API_ENDPOINT: string;
      USERS_API_PORT: string;
      USERS_API_HOST: string;
      USERS_API_URL: string;
    }
  }
}

export {};
