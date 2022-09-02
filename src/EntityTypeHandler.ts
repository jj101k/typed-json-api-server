import { CacheableTypeInfo } from "./CacheableTypeInfo"
import { JsonApiData } from "./JsonApiResponse"
import { OrderedMapArray } from "./OrderedMapArray"
import { RelationIdType, Relation } from "./Relation"
import { RelationFormatter } from "./RelationFormatter"
import { Schema } from "./Schema"
import { SchemaFactory } from "./SchemaFactory"
import { TypeIdSet } from "./TypeIdSet"

/**
 * You _might_ want to do this without an ORM system. That's because really this
 * doesn't want fully formed objects, and just the ID is fine for most cases.
 */
export abstract class EntityTypeHandler<I, E extends {id: I}> {
    /**
     *
     */
    protected abstract schema: Schema<any, any, any, any>

    /**
     *
     */
    protected abstract schemaFactory: SchemaFactory

    /**
     *
     * @param id
     * @param data
     * @throws FIXME if the user has no access
     */
    abstract create(id: I, data: Partial<E>): boolean
    /**
     *
     * @param ids
     * @throws FIXME if the user has no access
     */
    abstract delete(...ids: I[])

    /**
     * Traditionally, this should add further filter rules in the request
     * itself to handle access control. Approaches may include:
     *
     * - Modifying the request in some cases (global read vs no global read)
     * - Immediately returning nothing (no read access at all)
     * - Adding more conditions (scoped read access)
     * - Adding JOINs (explicit per-item read access)
     *
     * @param filter
     * @param objectsSeen
     * @param sort
     * @param page
     * @param include
     */
    abstract getMany(filter: any, objectsSeen: number, sort?: any, page?: any, include?: string[]): {
        data: Partial<E>[],
        included?: any[],
        nextPage?: any,
    }

    /**
     * This defines how relations look locally (ie, an ID in the entity
     * itself, typically defining a single parent relationship). If you provide
     * this and the relation is _not_ already in the response, it'll be
     * injected. If it is already in the response, the type will be set.
     */
    abstract readonly localRelations: Partial<Record<string & keyof E, {field: string, type: string}[]>>

    /**
     * Getting upstream relations for the object _may_ be a little complex for
     * TypeORM. This is part of the whole problem with using an ORM system and
     * not really wanting it.
     *
     * If no include has been specified, you _may_ want to join and shove the
     * related object in `included`, but in general that's not beneficial.
     *
     * If you want child (mostly to-many) relations in here, you might choose to
     * set a default include to follow that relation, because frankly any
     * follow-up searches are likely to be more expensive.
     *
     * If you do provide to-many responses here, the objects should be defined
     * with an unstored (fixed) type field, eg. `readonly type = "book"`.
     *
     * On TypeORM, it's recommended to do find(..., {loadRelationIds: true})
     * rather than eager-loading the relations, unless the relations are to be
     * actually included. You can then use
     * c.getMetadata(e).relations.find(r => r.propertyName == p).type to get
     * back to the original entity type, and potentially c.getMetadata(type)
     * .target
     *
     * @param id
     * @param include Note that this means something different to `included`.
     * This is the fields to include, and `included` are whole objects.
     * @throws FIXME if the user has no access
     * @returns
     */
    abstract getOne(id: I, include?: string[]): {data: Partial<E>, included?: any[]} | null

    /**
     *
     * @param dataInitial
     * @param length
     * @param type
     * @returns
     */
    postProcess(dataInitial: Iterable<{id: string}>, length: number, type: string) {
        if(!length) {
            return {
                data: [] as JsonApiData<any>[],
            }
        }

        const data: JsonApiData<any>[] = []
        const included: JsonApiData<any>[] = []
        let firstRun = true

        const dataToProcess = new OrderedMapArray()

        const seenByType = new TypeIdSet()

        function *addType(typeless: Iterable<{id: string}>, type: string) {
            for(const v of typeless) {
                yield {...v, type}
            }
        }

        const infoForType = new CacheableTypeInfo(this.schemaFactory)

        for(let dataSet: Iterable<{id: string, type: string}> | undefined = addType(dataInitial, type); dataSet; dataSet = dataToProcess.shift()) {
            for(const datum of dataSet) {
                if(firstRun) {
                    // This applies only to the first and second sets. After that
                    // they'll be pre-excluded.
                    //
                    // It might seem surprising that it applies to the _second_, but
                    // in practice included entities can't trump data entities, and
                    // that means we need to build the included list separately and
                    // test it on the subsequent run.

                    // First time we might have duplicates already in the list
                    if(seenByType.has(datum.type, datum.id)) {
                        continue
                    }
                }
                seenByType.add(datum.type, datum.id)

                const info = infoForType.get(datum)

                const singleRelationships: {[r: string]: {data: RelationIdType | null}} = {}
                const multiRelationships: {[r: string]: {data: RelationIdType[]}} = {}
                for(const [field, ft] of Object.entries(info.relations.many)) {
                    const v: Relation[] = datum[field]
                    if(v.length == 0) {
                        multiRelationships[field] = {data: []}
                        continue
                    }
                    const formatter = ft as RelationFormatter<any>
                    const items = v.map(vi => formatter.format(vi))
                    if(formatter.hasData) {
                        dataToProcess.push(...items.filter(item => seenByType.addOnce(item.type, item.id)))
                    }
                    multiRelationships[field] = {data: items.map(item => ({id: item.id, type: item.type}))}
                }
                for(const field of Object.keys(info.relations.manyUnknown)) {
                    multiRelationships[field] = {data: []}
                }
                for(const [field, ft] of Object.entries(info.relations.single)) {
                    if(datum[field] === null) {
                        singleRelationships[field] = {data: null}
                        continue
                    }
                    const v: Relation = datum[field]
                    const formatter = ft as RelationFormatter<any>
                    const item = formatter.format(v)
                    if(formatter.hasData && seenByType.addOnce(item.type, item.id)) {
                        dataToProcess.push(item)
                    }
                    singleRelationships[field] = {data: {id: item.id, type: item.type}}
                }
                for(const field of Object.keys(info.relations.singleUnknown)) {
                    singleRelationships[field] = {data: null}
                }
                const datumOut: JsonApiData<any> = {
                    attributes: <JsonApiData<E>["attributes"]>Object.fromEntries(
                        info.retainedAttributes.map(a => [a, datum[a]])
                    ),
                    id: datum.id,
                    relationships: {
                        ...multiRelationships,
                        ...singleRelationships,
                    },
                    type: datum.type,
                }
                if(firstRun) {
                    data.push(datumOut)
                } else {
                    included.push(datumOut)
                }
            }
            if(firstRun) {
                firstRun = false
            }
        }
        return {
            data: data,
            included,
        }
    }

    /**
     *
     * @param id
     * @param data
     * @throws FIXME if the user has no access
     */
    abstract update(id: I, data: Partial<E>): boolean

    /**
     *
     * @param type
     * @param id
     * @returns
     */
    abstract userHasAccess(type: "read" | "write", id: I)
}