import { Global, Module } from "@nestjs/common";
import { RequestContext } from "./request-context";
import { RequestContextInterceptor } from "./request-context-interceptor";
import { AuditSubscriberService } from "./audit-subscriber";
import { APP_INTERCEPTOR } from "@nestjs/core";

@Global()
@Module({
    providers: [
        RequestContext,
        AuditSubscriberService,
        RequestContextInterceptor,
        {
            provide: APP_INTERCEPTOR,
            useClass: RequestContextInterceptor
        }
    ],
    exports: [
        RequestContext,
        RequestContextInterceptor,
    ],
})
export class DatabaseCommonModule {}