import { Table, Column, ForeignKey, BelongsTo } from "sequelize-typescript";
import { ExportableModel } from "../../src";
import { User } from "./user"

@Table
export class NoExports extends ExportableModel {
    @ForeignKey(() => User)
    @Column
    userId: number

    @BelongsTo(() => User)
    user: User
}