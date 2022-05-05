import { Model } from "sequelize-typescript"
import "reflect-metadata"

export type ExportRule = (input: any, caller: ExportableModel) => Export | void
export enum Export { Allowed, Denied }

type RuleStorage = { [key: string | symbol]: ExportRule[] }

export class ExportableModel extends Model {
    Export(input: any, key = "default") {
        const ruleMeta: RuleStorage = Reflect.getMetadata(`exportsTo: ${key}`, this.constructor) || {}
        const results: { [key: string]: any } = {}

        for (const [objKey, keyRules] of Object.entries(ruleMeta)) {
            const objVal = this.getDataValue(objKey)

            for (const rule of keyRules) {
                const rResult = rule(input, this)
                if (rResult === Export.Allowed) {
                    if (!Array.isArray(objVal)) {
                        results[objKey] = objVal
                        break;
                    }

                    results[objKey] = objVal.map((child) => {
                        if (child instanceof ExportableModel) {
                            const childData = child.Export(input, key)
                            return Object.keys(childData).length ? childData : null
                        }
                    })

                } else if (rResult === Export.Denied) {
                    break
                }
            }
        }

        return results
    }
}


export function Exportable(rules: ExportRule[], key = "default") {
    return function (target: ExportableModel, ind: string | symbol) {
        const ruleMeta: RuleStorage = Reflect.getMetadata(`exportsTo: ${key}`, target.constructor) || {}
        Reflect.defineMetadata(`exportsTo: ${key}`, { ...ruleMeta, [ind]: rules }, target.constructor)
    }
}