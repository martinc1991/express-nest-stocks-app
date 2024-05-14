import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtCompleteToken } from 'src/auth/types';

/**
 * Returns the complete user token from the JWT authentication strategy
 * (see jwt.strategy.ts).
 *
 *  Use it for handlers protected by JwtAuthGuard.
 *
 * If the decorator is used without specifying any property of the token,
 * the complete token will be returned.
 *
 **/
export const JwtStrategyUser = createParamDecorator<
  keyof JwtCompleteToken | undefined, // the type of `data`
  ExecutionContext // the type of `ctx`
>((data, ctx) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;
  return typeof data === 'undefined' ? user : user[data];
});

// INFO: it is important for this export to have the same name as the one above
// See: https://dev.to/micalevisk/nestjs-tip-type-safety-on-parameter-decorators-24mn
export type JwtStrategyUser<Prop extends keyof JwtCompleteToken | undefined = undefined> = Prop extends keyof JwtCompleteToken
  ? JwtCompleteToken[Prop]
  : JwtCompleteToken;
