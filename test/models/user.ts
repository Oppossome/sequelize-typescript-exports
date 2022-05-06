import { Table, Column, HasMany } from "sequelize-typescript"
import { ExportableModel, Exportable, ExportRule, Export } from "../../src"
import { Upload } from "./upload"

const IsOwner: ExportRule = (input: any, caller: ExportableModel) => {
    if (input instanceof User) {
        if (input.id === (caller as User).id) {
            return Export.Allowed
        }
    }
}

const ReturnNothing: ExportRule = () => {
    return
}

@Table
export class User extends ExportableModel {
    @Exportable([ReturnNothing], "instOf")
    @Exportable([Export.Allowed])
    @Column
    name: string

    @Exportable([Export.Denied], "instOf")
    @Exportable([IsOwner])
    @Column
    password: string

    @Exportable([Export.Allowed], "instOf")
    @Exportable([IsOwner])
    @HasMany(() => Upload)
    uploads: Upload[]
}