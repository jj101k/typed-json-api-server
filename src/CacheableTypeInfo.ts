import { CacheableData } from "./CacheableData"
import { FetchedTypeInfo } from "./FetchedTypeInfo"
import { Schema } from "./Schema"
import { SchemaFactory } from "./SchemaFactory"
import { Relation } from "./Relation"
import { RelationFormatter, RelationFormatterFullNoType, RelationFormatterFullWithType, RelationFormatterIdOnly, RelationFormatterIdType, RelationFormatterRawId } from "./RelationFormatter"

/**
 *
 */
export class CacheableTypeInfo extends CacheableData<FetchedTypeInfo, { type: string} > {
    /**
     *
     * @param relation
     * @param types
     * @returns
     */
    private autodetectFormat(relation: Relation, types: string[]) {
        if ((typeof relation == "number") || (typeof relation == "string")) {
            return new RelationFormatterRawId(types)
        } else {
            if (!("id" in relation)) {
                throw new Error("Unknown relation format")
            }
            const keys = Object.keys(relation)
            if (keys.length == 1) {
                return new RelationFormatterIdOnly(types)
            } else if (!("type" in relation)) {
                return new RelationFormatterFullNoType(types)
            } else if (keys.length == 2) {
                return new RelationFormatterIdType(types) // Technically this could be full objects, but you shouldn't have those.
            } else {
                return new RelationFormatterFullWithType(types)
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
        const singleFormats: Record<string, RelationFormatter<any> | string[] > = {}
        const manyFormats: Record<string, RelationFormatter<any> | string[] > = {}
        for (const [field, types] of Object.entries(schema.relationshipSchema.many ?? {})) {
            if (field in datum) {
                const d: Relation[] = datum[field]
                if(d.length) {
                    manyFormats[field] = this.autodetectFormat(d[0], types)
                } else {
                    manyFormats[field] = types
                }
            }
        }
        for (const [field, types] of Object.entries(schema.relationshipSchema.singleRequired ?? {})) {
            if (field in datum) {
                const d: Relation = datum[field]
                singleFormats[field] = this.autodetectFormat(d, types)
            }
        }
        for (const [field, types] of Object.entries(schema.relationshipSchema.singleRequired ?? {})) {
            if (field in datum) {
                const d: Relation = datum[field]
                if(d !== null) {
                    singleFormats[field] = this.autodetectFormat(d, types)
                } else {
                    singleFormats[field] = types
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
        const types = v.relationFormats[section][field]
        if(!Array.isArray(types)) {
            throw new Error(`Wrong type for types list: ${types}`)
        }
        v.relationFormats[section][field] = this.autodetectFormat(relation, types)
        return v.relationFormats[section][field]
    }
}
