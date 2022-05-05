import { Model } from "sequelize-typescript"
import "reflect-metadata"

export type ExposureRule = (input: any, caller: ExposedModel) => Exposure | void
export enum Exposure { Allowed, Denied }

type RuleStorage = { [key: string | symbol]: ExposureRule[] }



export class ExposedModel extends Model {
    Expose(input: any, key: any = "default") {
        const ruleMeta: RuleStorage = Reflect.getMetadata(`exposedTo: ${key}`, this.constructor) || {}
        const results: { [key: string]: any } = {}

        for (const [objKey, keyRules] of Object.entries(ruleMeta)) {
            const objVal = this.getDataValue(objKey)

            for (const rule of keyRules) {
                const rResult = rule(input, this)
                if (rResult === Exposure.Allowed) {
                    if (!Array.isArray(objVal)) {
                        results[objKey] = objVal
                        break;
                    }

                    results[objKey] = objVal.map((child) => {
                        if (child instanceof ExposedModel) {
                            const childData = child.Expose(input, key)
                            return Object.keys(childData).length ? childData : null
                        }
                    })

                } else if (rResult === Exposure.Denied) {
                    break
                }
            }
        }

        return results
    }
}


export function ExposeTo(rules: ExposureRule[], key: any = "default") {
    return function (target: ExposedModel, ind: string | symbol) {
        const ruleMeta: RuleStorage = Reflect.getMetadata(`exposedTo: ${key}`, target.constructor) || {}
        Reflect.defineMetadata(`exposedTo: ${key}`, { ...ruleMeta, [ind]: rules }, target.constructor)
    }
}