import { AlwaysAllow, AlwaysDeny } from "../utils/exposures";
import { ExportableModel, Exportable, Export, ExportRule } from "../../src";
import { Table, Column, HasMany } from "sequelize-typescript";
import { Cookie } from "./cookie";

const OnlySelf: ExportRule = (input: User, caller: ExportableModel) => {
    if (input.name === (caller as User).name) {
        return Export.Allowed
    }
}

@Table
export class User extends ExportableModel {
    @Column
    @Exportable([AlwaysAllow])
    name: string;

    @Column
    @Exportable([AlwaysDeny, AlwaysAllow])
    @Exportable([AlwaysAllow], "testly")
    password: string;

    @Column
    @Exportable([OnlySelf])
    secret: string;

    @HasMany(() => Cookie)
    @Exportable([AlwaysAllow], "testly")
    @Exportable([OnlySelf])
    favcookies: Cookie[]
}
