import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';
import { extractToken, AuthErrors } from '../../lib/auth';
import { AuthService } from './auth.service';
import { GUARDS_METADATA } from '@nestjs/common/constants';
import type { User as UserT } from 'src/schemas';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const tok = extractToken(request.headers);
    if (!tok) {
      throw new UnauthorizedException(AuthErrors.wrongToken);
    }
    const res = await this.auth.verifyToken(tok);
    if (!res.success) {
      throw new UnauthorizedException(res.error);
    }
    const { user } = res.data;
    request['user'] = user;
    return true;
  }
}

export const User = createParamDecorator((data: any, ctx: ExecutionContext) => {
  const handler = ctx.getHandler();
  const guards: object[] = Reflect.getMetadata(GUARDS_METADATA, handler) || [];

  if (!guards.some((guard) => guard === AuthGuard)) {
    throw new Error(
      `Route '${handler.name}' uses @User decorator but missing AuthGuard.\n` +
        `Please add @UseGuards(AuthGuard) to enable user extraction.`,
    );
  }

  const request = ctx.switchToHttp().getRequest();
  const user = request.user as UserT | undefined;

  if (!user) {
    throw new UnauthorizedException('User not found in request');
  }

  return user;
});
