import { CacheableData } from "./CacheableData"
import { FetchedTypeInfo } from "./FetchedTypeInfo"
import { FetchedRelationsInfo } from "./FetchedRelationsInfo"
import { SchemaFactory } from "./SchemaFactory"

/**
 *
 */
export class CacheableTypeInfo extends CacheableData<FetchedTypeInfo, { type: string} > {
    protected calculate(datum: { type: string} ) {
        const schema = this.schemaFactory.getSchema(datum.type)
        const attributes = [
            ...Object.keys(schema.attributeSchema.notNullable ?? {}),
            ...Object.keys(schema.attributeSchema.nullable ?? {}),
        ]
        const relations = FetchedRelationsInfo.build(datum, schema)
        const retainedAttributes = attributes.filter(a => datum[a] !== undefined)

        return { relations, retainedAttributes }
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
     * @param u
     * @returns
     */
    get(u: { type: string }): FetchedTypeInfo {
        const fetchedTypeInfo = super.get(u)
        if(fetchedTypeInfo.relations.isIncomplete) {
            fetchedTypeInfo.relations.autodetect(u)
        }
        return fetchedTypeInfo
    }
}
