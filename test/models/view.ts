import { BelongsTo, Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { Upload } from "./upload"

@Table
export class View extends Model {
    @ForeignKey(() => Upload)
    @Column
    uploadId: number

    @BelongsTo(() => Upload)
    upload: Upload
}
