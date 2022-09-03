import { CacheableData } from "./CacheableData"
import { FetchedTypeInfo } from "./FetchedTypeInfo"
import { FetchedRelationsInfo } from "./FetchedRelationsInfo"
import { Schema } from "./Schema"

/**
 *
 */
type CacheableTypeIn = {schema: Schema<any>, item: any & {}}

/**
 *
 */
export class CacheableTypeInfo extends CacheableData<FetchedTypeInfo, CacheableTypeIn> {
    protected calculate(datum: CacheableTypeIn) {
        const relations = FetchedRelationsInfo.build(datum.item, datum.schema)
        const attributes = [
            ...Object.keys(datum.schema.attributeSchema.notNullable ?? {}),
            ...Object.keys(datum.schema.attributeSchema.nullable ?? {}),
        ]
        const retainedAttributes = attributes.filter(a => datum.item[a] !== undefined)

        return { relations, retainedAttributes }
    }

    protected key(u: CacheableTypeIn): string {
        return u.schema.type
    }

    /**
     *
     * @param u
     * @returns
     */
    get(u: CacheableTypeIn): FetchedTypeInfo {
        const fetchedTypeInfo = super.get(u)
        if(fetchedTypeInfo.relations.isIncomplete) {
            fetchedTypeInfo.relations.autodetect(u.item)
        }
        return fetchedTypeInfo
    }
}
