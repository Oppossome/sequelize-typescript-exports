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
            const objVal = this.getDataValue(objKey)

            for (const rawRule of keyRules) {
                const isRuleFunc = typeof rawRule === "function"
                const rule = isRuleFunc ? rawRule(input, this) : rawRule

                if (rule === Export.Allowed) {
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
                } else if (rule === Export.Denied) {
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