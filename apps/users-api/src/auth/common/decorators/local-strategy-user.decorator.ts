import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtCompleteToken } from 'src/auth/types';

/**
 * Returns the complete user token from the local authentication strategy
 * (see local.strategy.ts).
 *
 *  Use it for handlers protected by LocalAuthGuard.
 *
 * If the decorator is used without specifying any property of the token,
 * the complete token will be returned.
 *
 **/
export const LocalStrategyUser = createParamDecorator<keyof JwtCompleteToken | undefined, ExecutionContext>((data, ctx) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;
  return typeof data === 'undefined' ? user : user[data];
});

// INFO: it is important for this export to have the same name as the one above
// See: https://dev.to/micalevisk/nestjs-tip-type-safety-on-parameter-decorators-24mn
export type LocalStrategyUser<Prop extends keyof JwtCompleteToken | undefined = undefined> = Prop extends keyof JwtCompleteToken
  ? JwtCompleteToken[Prop]
  : JwtCompleteToken;
