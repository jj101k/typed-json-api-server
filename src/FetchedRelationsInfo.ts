import { Relation } from "./Relation"
import { RelationFormatter, RelationFormatterFullNoType, RelationFormatterFullWithType, RelationFormatterIdOnly, RelationFormatterIdType, RelationFormatterRawId } from "./RelationFormatter"
import { Schema } from "./Schema"

/**
 *
 */

export class FetchedRelationsInfo {
    /**
     *
     * @param relation
     * @param schemata
     * @returns
     */
    static autodetectFormat(relation: Relation, schemata: Array<Schema<any>>): RelationFormatter<any> {
        if ((typeof relation == "number") || (typeof relation == "string")) {
            return new RelationFormatterRawId(schemata)
        } else {
            if (!("id" in relation)) {
                throw new Error("Unknown relation format")
            }
            const keys = Object.keys(relation)
            if (keys.length == 1) {
                return new RelationFormatterIdOnly(schemata)
            } else if (!("type" in relation)) {
                return new RelationFormatterFullNoType(schemata)
            } else if (keys.length == 2) {
                return new RelationFormatterIdType(schemata) // Technically this could be full objects, but you shouldn't have those.
            } else {
                return new RelationFormatterFullWithType(schemata)
            }
        }
    }
    /**
     *
     * @param datum
     * @param schema
     * @returns
     */
    static build<T extends { id: any}  = any>(datum: Partial<T>, schema: Schema): FetchedRelationsInfo {
        const manyKnown: Record<string, RelationFormatter<any>> = {}
        const manyUnknown: Record<string, Array<Schema<any>>> = {}
        const singleKnown: Record<string, RelationFormatter<any>> = {}
        const singleUnknown: Record<string, Array<Schema<any>>> = {}
        for (const [field, types] of Object.entries(schema.relationshipSchema.many ?? {})) {
            if (field in datum) {
                const d: Relation[] = datum[field]
                if(d.length) {
                    manyKnown[field] = this.autodetectFormat(d[0], types)
                } else {
                    manyUnknown[field] = types
                }
            }
        }
        for (const [field, types] of Object.entries(schema.relationshipSchema.singleRequired ?? {})) {
            if (field in datum) {
                const d: Relation = datum[field]
                singleKnown[field] = this.autodetectFormat(d, types)
            }
        }
        for (const [field, types] of Object.entries(schema.relationshipSchema.single ?? {})) {
            if (field in datum) {
                const d: Relation = datum[field]
                if(d !== null) {
                    singleKnown[field] = this.autodetectFormat(d, types)
                } else {
                    singleUnknown[field] = types
                }

            }
        }
        return new FetchedRelationsInfo(manyKnown, singleKnown, manyUnknown, singleUnknown)
    }
    /**
     *
     */
    isIncomplete: boolean

    /**
     *
     * @param many
     * @param single
     * @param manyUnknown
     * @param singleUnknown
     */
    constructor(public many: Record<string, RelationFormatter<any>>,
        public single: Record<string, RelationFormatter<any>>,
        public manyUnknown: Record<string, Array<Schema<any>>> = {},
        public singleUnknown: Record<string, Array<Schema<any>>> = {}
    ) {
        this.isIncomplete = !!(Object.keys(this.manyUnknown).length || Object.keys(this.singleUnknown).length)
    }

    /**
     *
     * @param datum
     */
    autodetect(datum: any) {
        let isComplete = true
        for(const [k, types] of Object.entries(this.singleUnknown)) {
            if(datum[k] !== null) {
                this.single[k] = FetchedRelationsInfo.autodetectFormat(datum[k], types)
                delete this.singleUnknown[k]
            } else {
                isComplete = false
            }
        }
        for(const [k, types] of Object.entries(this.manyUnknown)) {
            if(datum[k].length) {
                this.many[k] = FetchedRelationsInfo.autodetectFormat(datum[k][0], types)
                delete this.manyUnknown[k]
            } else {
                isComplete = false
            }
        }
        this.isIncomplete = !isComplete
    }
}
