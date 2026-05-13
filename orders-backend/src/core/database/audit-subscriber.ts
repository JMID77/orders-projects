import { Injectable } from '@nestjs/common';
import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent, DataSource } from 'typeorm';
import { BaseEntityTrack } from '../../models/base.entity';
import { RequestContext } from './request-context';

@Injectable()
@EventSubscriber()
export class AuditSubscriberService implements EntitySubscriberInterface<BaseEntityTrack> {
    constructor(private readonly context: RequestContext, private readonly dataSource: DataSource) {
        dataSource.subscribers.push(this);
    }

    listenTo(): Function | string {
        return BaseEntityTrack;
    }

    beforeInsert(event: InsertEvent<BaseEntityTrack>): Promise<any> | void {
        const userId = this.context.get<number>('userId');

        if (event.entity) {
            event.entity.createBy = userId;
            event.entity.updateBy = userId;
        }
    }

    beforeUpdate(event: UpdateEvent<BaseEntityTrack>): Promise<any> | void {
        const userId = this.context.get<number>('userId');

        if (event.entity) {
            event.entity.updateBy = userId;
        }
    }
}
