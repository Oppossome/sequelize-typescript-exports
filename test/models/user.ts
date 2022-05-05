import { AlwaysAllow, AlwaysDeny } from "../utils/exposures";
import { ExposedModel, ExposeTo, Exposure, ExposureRule } from "../../src";
import { Table, Column, HasMany } from "sequelize-typescript";
import { Cookie } from "./cookie";

const OnlySelf: ExposureRule = (input: User, caller: ExposedModel) => {
    if (input.name === (caller as User).name) {
        return Exposure.Allowed
    }
}

@Table
export class User extends ExposedModel {
    @Column
    @ExposeTo([AlwaysAllow])
    name: string;

    @Column
    @ExposeTo([AlwaysDeny, AlwaysAllow])
    @ExposeTo([AlwaysAllow], "testly")
    password: string;

    @Column
    @ExposeTo([OnlySelf])
    secret: string;

    @HasMany(() => Cookie)
    @ExposeTo([AlwaysAllow], "testly")
    @ExposeTo([OnlySelf])
    favcookies: Cookie[]
}
