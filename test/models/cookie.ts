import { AlwaysAllow, AlwaysDeny } from "../utils/exposures";
import { ExposedModel, ExposeTo, Exposure } from "../../src";
import { Table, Column, ForeignKey, BelongsTo } from "sequelize-typescript";
import { User } from "./user";

@Table
export class Cookie extends ExposedModel {
    @Column
    @ExposeTo([AlwaysAllow])
    name: string

    @ExposeTo([AlwaysAllow], "testly")
    @ForeignKey(() => User)
    @Column
    userId: number

    @BelongsTo(() => User)
    user: User
}