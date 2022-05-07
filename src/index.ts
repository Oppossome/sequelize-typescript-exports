import { Model } from "sequelize-typescript"
import "reflect-metadata"

export type ExportRule = Export | ((input: any, caller: ExportableModel) => Export | void)
export enum Export { Allowed, Denied }

type RuleStorage = { [key: string | symbol]: ExportRule[] }
function CanExport(caller: ExportableModel, ruleMeta: RuleStorage, param: string | symbol, toCheck: any): boolean {
    const keyRules = ruleMeta[param]
    if (!keyRules) return false

    for (const rawRule of keyRules) {
        const isRuleFunc = typeof rawRule === "function"
        const ruleResult = isRuleFunc ? rawRule(toCheck, caller) : rawRule
        if (ruleResult === Export.Allowed) return true
        if (ruleResult === Export.Denied) return false
    }

    return false
}

export class ExportableModel extends Model {
    CanExport(param: string | symbol, input: any, key = "default") {
        const ruleMeta: RuleStorage = Reflect.getMetadata(`exportsTo: ${key}`, this.constructor) || {}
        return CanExport(this, ruleMeta, param, input)
    }

    Export(input: any, key = "default") {
        const ruleMeta: RuleStorage = Reflect.getMetadata(`exportsTo: ${key}`, this.constructor) || {}
        const results: { [key: string]: any } = {}

        for (const objKey of Object.keys(ruleMeta)) {
            const shouldExport = CanExport(this, ruleMeta, objKey, input)
            let objVal = this.getDataValue(objKey)
            if (!shouldExport) continue

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

            results[objKey] = objVal !== undefined ? objVal : null
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