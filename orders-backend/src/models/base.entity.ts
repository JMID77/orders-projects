import { BaseEntity, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";


export abstract class BaseEntityTrack extends BaseEntity {
    @CreateDateColumn({
        name: 'create_at',
        type: 'datetime',
        nullable: false,
        update: false,
    })
    createAt: Date;

    @UpdateDateColumn({
        name: 'update_at',
        type: 'datetime',
        nullable: false,
    })
    updateAt: Date;

    @Column({
        name: 'create_by',
        type: 'int',
        nullable: false,
        update: false,
    })
    createBy: number;
    
    @Column({
        name: 'update_by',
        type: 'int',
        nullable: false,
    })
    updateBy: number;
}