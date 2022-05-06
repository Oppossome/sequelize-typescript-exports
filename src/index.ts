import { Model } from "sequelize-typescript"
import "reflect-metadata"

type RuleStorage = { [key: string | symbol]: ExportRule[] }
export type ExportRule = Export | ((input: any, caller: ExportableModel) => Export | void)
export enum Export { Allowed, Denied }

export class ExportableModel extends Model {
    Export(input: any, key = "default") {
        const ruleMeta: RuleStorage = Reflect.getMetadata(`exportsTo: ${key}`, this.constructor) || {}
        const results: { [key: string]: any } = {}

        for (const [objKey, keyRules] of Object.entries(ruleMeta)) {
            let objVal = this.getDataValue(objKey)

            for (const rawRule of keyRules) {
                const isRuleFunc = typeof rawRule === "function"
                const rule = isRuleFunc ? rawRule(input, this) : rawRule

                // If denied exit progression, If not allowed continue
                if (rule === Export.Denied) break;
                if (rule !== Export.Allowed) continue;

                if (Array.isArray(objVal)) {
                    let childArray: any[] = []
                    for (const child of objVal) {
                        if (child instanceof ExportableModel) {
                            const childExport = child.Export(input, key)
                            if (Object.keys(childExport).length) {
                                childArray = [...childArray, childExport]
                            }
                        }
                    }

                    objVal = childArray
                } else if (objVal instanceof ExportableModel) {
                    const connectedExport = objVal.Export(input, key)
                    objVal = connectedExport
                }

                if (objVal === undefined) objVal = null
                results[objKey] = objVal
                break
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