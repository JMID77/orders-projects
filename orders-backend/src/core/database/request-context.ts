import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class RequestContext {
    private readonly storage = new AsyncLocalStorage<Map<string, any>>();

    run(callback: () => void) {
        this.storage.run(new Map(), callback);
    }

    set(key: string, value: any) {
        this.storage.getStore()?.set(key, value);
    }

    get<T>(key: string): T | undefined {
        return this.storage.getStore()?.get(key);
    }
}
