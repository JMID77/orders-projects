import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (request.method === 'OPTIONS') {
      return true; // ✅ laisser passer le preflight
    }

    const isPublic =
      this.reflector.getAllAndOverride<boolean>('isPublic', [
        context.getHandler(),
        context.getClass(),
      ]);

    // const isPublic = this.reflector.get<boolean>(
    //   'isPublic',
    //   context.getHandler(),
    // );

    if (isPublic) {
      return true;
    }

    const result = super.canActivate(context);

    if (result instanceof Promise) {
      return result;
    }

    if (typeof (result as any).subscribe === 'function') {
      return firstValueFrom(result as any);
    }

    return result as boolean;
  }
}