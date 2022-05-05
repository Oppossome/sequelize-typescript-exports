import { Table, Column, ForeignKey, BelongsTo } from "sequelize-typescript";
import { ExportableModel, Exportable, Export } from "../../src";
import { User } from "./user";

@Table
export class Cookie extends ExportableModel {
    @Column
    @Exportable([Export.Allowed])
    name: string

    @Exportable([Export.Allowed], "testly")
    @ForeignKey(() => User)
    @Column
    userId: number

    @BelongsTo(() => User)
    user: User
}