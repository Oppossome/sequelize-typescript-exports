import { AlwaysAllow } from "../utils/exposures";
import { ExportableModel, Exportable } from "../../src";
import { Table, Column, ForeignKey, BelongsTo } from "sequelize-typescript";
import { User } from "./user";

@Table
export class Cookie extends ExportableModel {
    @Column
    @Exportable([AlwaysAllow])
    name: string

    @Exportable([AlwaysAllow], "testly")
    @ForeignKey(() => User)
    @Column
    userId: number

    @BelongsTo(() => User)
    user: User
}