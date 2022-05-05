import { Table } from "sequelize-typescript";
import { ExportableModel } from "../../src";

@Table
export class NoExports extends ExportableModel { }