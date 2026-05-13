import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { RequestContext } from './request-context';
import { Observable } from 'rxjs';

@Injectable()
export class RequestContextInterceptor implements NestInterceptor {
    constructor(private readonly context: RequestContext) {}

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const req = context.switchToHttp().getRequest();

        return new Observable((subscriber) => {
            this.context.run(() => {
                if (req.user) {
                    this.context.set('userId', req.user.userId);
                }

                next.handle().subscribe(subscriber);
            });
        });
    }
}
