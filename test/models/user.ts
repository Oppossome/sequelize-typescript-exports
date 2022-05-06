import { ExportableModel, Exportable, Export, ExportRule } from "../../src";
import { Table, Column, HasMany } from "sequelize-typescript";
import { NonExportable } from "./nonexportable";
import { Cookie } from "./cookie";

const OnlySelf: ExportRule = (input: any, caller: ExportableModel) => {
    if (input instanceof User) {
        if (input.name === (caller as User).name) {
            return Export.Allowed
        }
    }
}

const IsntDave: ExportRule = (input: any) => {
    if (input instanceof User) {
        if (input.name !== "Dave") {
            return Export.Allowed
        }
    }
}

@Table
export class User extends ExportableModel {
    @Column
    @Exportable([Export.Allowed])
    name: string;

    @Column
    @Exportable([Export.Denied, Export.Allowed])
    @Exportable([Export.Allowed], "testly")
    password: string;

    @Column
    @Exportable([OnlySelf])
    secret: string;

    @HasMany(() => Cookie)
    @Exportable([Export.Allowed], "testly")
    @Exportable([IsntDave])
    favcookies: Cookie[]

    @HasMany(() => NonExportable)
    @Exportable([OnlySelf])
    NonExportables: NonExportable[]
}
