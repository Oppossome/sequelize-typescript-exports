import { Table, Column, ForeignKey, BelongsTo, HasMany, } from "sequelize-typescript"
import { ExportableModel, Exportable, Export } from "../../src"
import { User } from "./user"
import { View } from "./view"

@Table
export class Upload extends ExportableModel {
    @Exportable([Export.Allowed])
    @Column
    fileName: string

    @ForeignKey(() => User)
    @Column
    uploaderId: number

    @Exportable([Export.Allowed])
    @BelongsTo(() => User)
    uploader: User

    @Exportable([Export.Allowed])
    @HasMany(() => View)
    views: View[]
}