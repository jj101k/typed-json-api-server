import { CacheableData } from "./CacheableData"
import { FetchedRelationFormat } from "./FetchedRelationFormat"
import { FetchedTypeInfo } from "./FetchedTypeInfo"
import { Schema } from "./Schema"
import { SchemaFactory } from "./SchemaFactory"
import { Relation } from "./Relation"

/**
 *
 */
export class CacheableTypeInfo extends CacheableData<FetchedTypeInfo, { type: string} > {
    /**
     *
     * @param relation
     * @returns
     */
    private autodetectFormat(relation: Relation) {
        if (typeof relation == "number") {
            return FetchedRelationFormat.RawId
        } else {
            if (!("id" in relation)) {
                throw new Error("Unknown relation format")
            }
            const keys = Object.keys(relation)
            if (keys.length == 1) {
                return FetchedRelationFormat.IdOnly
            } else if (!("type" in relation)) {
                return FetchedRelationFormat.FullNoType
            } else if (keys.length == 2) {
                return FetchedRelationFormat.IdType // Technically this could be full objects, but you shouldn't have those.
            } else {
                return FetchedRelationFormat.FullWithType
            }
        }
    }
    /**
     *
     * @param datum
     * @param schema
     * @returns
     */
    private autodetectFormats<T extends { id: any}  = any>(datum: Partial<T>, schema: Schema<T>) {
        const singleFormats: Record<string, { format: FetchedRelationFormat | null; types: string[]} > = {}
        const manyFormats: Record<string, { format: FetchedRelationFormat | null; types: string[]} > = {}
        for (const [field, types] of Object.entries(schema.relationshipSchema.many ?? {})) {
            if (field in datum) {
                const d: Relation[] = datum[field]
                manyFormats[field] = {
                    types,
                    format: d.length ? this.autodetectFormat(d[0]) : null,
                }
            }
        }
        for (const [field, types] of Object.entries(schema.relationshipSchema.singleRequired ?? {})) {
            if (field in datum) {
                const d: Relation = datum[field]
                singleFormats[field] = {
                    types,
                    format: this.autodetectFormat(d),
                }
            }
        }
        for (const [field, types] of Object.entries(schema.relationshipSchema.singleRequired ?? {})) {
            if (field in datum) {
                const d: Relation = datum[field]
                singleFormats[field] = {
                    types,
                    format: d !== null ? this.autodetectFormat(d) : null,
                }
            }
        }
        return { single: singleFormats, many: manyFormats }
    }

    protected calculate(datum: { type: string} ) {
        const schema = this.schemaFactory.getSchema(datum.type)
        const attributes = [
            ...Object.keys(schema.attributeSchema.notNullable ?? {}),
            ...Object.keys(schema.attributeSchema.nullable ?? {}),
        ]
        const relationFormats = this.autodetectFormats(datum, schema)
        const retainedAttributes = attributes.filter(a => datum[a] !== undefined)

        return { relationFormats, retainedAttributes }
    }

    protected key(u: { type: string} ): string {
        return u.type
    }

    /**
     *
     */
    constructor(private schemaFactory: SchemaFactory) {
        super()
    }

    /**
     *
     * @param datum
     * @param section
     * @param field
     * @param relation
     * @returns
     */
    redetectFormat(datum: { type: string} , section: "many" | "single", field: string, relation: Relation) {
        const v = this.cache.get(this.key(datum))!
        v.relationFormats[section][field].format = this.autodetectFormat(relation)
        return v.relationFormats[section][field].format
    }
}
