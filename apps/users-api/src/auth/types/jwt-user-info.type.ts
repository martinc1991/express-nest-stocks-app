import { UserRole } from '@prisma/client';

type JwtTokenBasicInfo = {
  iat: number;
  exp: number;
};

export type JWTUserInfoWithToken<T> = T & JwtTokenBasicInfo;

// The basic info that is stored in the JWT along with iat and exp
export type JWTUserInfo = {
  id: string;
  email: string;
  role: UserRole;
};

export type JwtCompleteToken = JWTUserInfoWithToken<JWTUserInfo>;
export type JwtCompleteTokenWithRefresh = JWTUserInfoWithToken<JWTUserInfo> & {
  refreshToken: string;
};
