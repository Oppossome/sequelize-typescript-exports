import { Table, Column, Model, ForeignKey, BelongsTo } from "sequelize-typescript";
import { User } from "./user"

@Table
export class NonExportable extends Model {
    @Column
    name: string;

    @ForeignKey(() => User)
    @Column
    userId: number

    @BelongsTo(() => User)
    user: User
}