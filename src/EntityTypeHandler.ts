import { CacheableTypeInfo } from "./CacheableTypeInfo"
import { JsonApiData, JsonApiMultiRelationship, JsonApiResponseMulti, JsonApiResponseSingle, JsonApiSingleRelationship } from "./JsonApiResponse"
import { OrderedTypeMapArray } from "./OrderedTypeMapArray"
import { RelationIdType, Relation } from "./Relation"
import { RelationFormatter } from "./RelationFormatter"
import { Schema } from "./Schema"
import { EntityMatchingSchema } from "./EntityMatchingSchema"
import { ShadowTypeIdSet, TypeIdSet } from "./TypeIdSet"

/**
 * This is the main class for handling entities. This doesn't handle
 * requests/responses, but does include some of the conversion between formats.
 *
 * You _might_ want to do this without an ORM system. That's because really this
 * doesn't want fully formed objects, and just the ID is fine for most cases.
 */
export abstract class EntityTypeHandler<I extends string | number, S extends Schema> {
    /**
     *
     * @param typeless
     */
    private *addType(typeless: Iterable<EntityMatchingSchema<S, Relation>>) {
        for(const v of typeless) {
            yield {...v, id: v.id, type: this.schema.type}
        }
    }

    /**
     *
     */
    protected abstract schema: S

    /**
     *
     * @param id
     * @param data
     * @throws FIXME if the user has no access
     */
    abstract create(id: I, data: Partial<EntityMatchingSchema<S>>): Promise<boolean>
    /**
     *
     * @param ids
     * @throws FIXME if the user has no access
     */
    abstract delete(...ids: I[]): Promise<boolean>

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
    abstract getMany(filter: any, objectsSeen: number, sort?: any, page?: any, include?: string[]): Promise<JsonApiResponseMulti<JsonApiData<S>> & {nextPage?: any}>

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
    abstract getOne(id: I, include?: string[]): Promise<JsonApiResponseSingle<JsonApiData<S>> | null>

    /**
     * Handles data after it's come out of getOne() or getMany().
     *
     * This takes an iterable set of the entity which may have deep
     * relationships. It returns the bulk of a JSON:API response.
     *
     * @param dataInitial
     * @param length
     * @returns
     */
    postProcess(dataInitial: Iterable<EntityMatchingSchema<S, Relation>>, length: number) {
        type J = JsonApiData<S>
        if(!length) {
            return {
                data: [],
            }
        }

        const data: J[] = []
        let included: JsonApiData<Schema>[] = []
        let firstRun = true

        const dataToProcess = new OrderedTypeMapArray()

        const seenByType = new TypeIdSet()

        const infoForType = new CacheableTypeInfo()

        let includeSeenByType: TypeIdSet

        let schema: Schema<any> = this.schema

        for(let dataSet: Iterable<{id: string | number, type: string}> | undefined = this.addType(dataInitial); dataSet; [schema, dataSet] = dataToProcess.shiftEntry()) {
            if(firstRun) {
                includeSeenByType = new ShadowTypeIdSet(seenByType)
            }

            for(const datum of dataSet) {
                if(firstRun) {
                    // This applies only to the first set. After that they'll be
                    // pre-excluded.
                    //
                    // For included entities seen in the first run which happen
                    // to be the same type as the initial data set (ie, peer
                    // relationships), they're dropped if they're already known
                    // and otherwise retained until the end of the first run.

                    // First time we might have duplicates already in the list
                    if(seenByType.has(datum.type, datum.id)) {
                        continue
                    }
                }
                seenByType.add(datum.type, datum.id)

                const info = infoForType.get({schema, item: datum})

                const singleRelationships: Record<string, JsonApiSingleRelationship> = {}
                const multiRelationships: Record<string, JsonApiMultiRelationship> = {}
                for(const [field, ft] of Object.entries(info.relations.many)) {
                    const v: Relation[] | undefined = datum[field]
                    if(!v) {
                        continue
                    } else if(v.length == 0) {
                        multiRelationships[field] = {data: []}
                        continue
                    }
                    const formatter = ft as RelationFormatter<any>
                    const items = v.map(vi => formatter.format(vi))
                    if(formatter.hasData) {
                        dataToProcess.push(ft.schemata, ...items.filter(item => includeSeenByType.addOnce(item.type, item.id)))
                    }
                    multiRelationships[field] = {data: items.map(item => ({id: item.id, type: item.type}))}
                }
                for(const field of Object.keys(info.relations.manyUnknown)) {
                    if(datum[field]) {
                        // It must be empty, otherwise it'd have a format
                        multiRelationships[field] = {data: []}
                    }
                }
                for(const [field, ft] of Object.entries(info.relations.single)) {
                    if(datum[field] === undefined) {
                        continue
                    } else if(datum[field] === null) {
                        singleRelationships[field] = {data: null}
                        continue
                    }
                    const v: Relation = datum[field]
                    const formatter = ft as RelationFormatter<any>
                    const item = formatter.format(v)
                    if(formatter.hasData && includeSeenByType.addOnce(item.type, item.id)) {
                        dataToProcess.push(ft.schemata, item)
                    }
                    singleRelationships[field] = {data: {id: item.id, type: item.type}}
                }
                for(const field of Object.keys(info.relations.singleUnknown)) {
                    if(datum[field] !== undefined) {
                        // It must be null, otherwise it'd have a format
                        singleRelationships[field] = {data: null}
                    }
                }
                if(firstRun) {
                    const datumOut: J = {
                        attributes: <J["attributes"]>Object.fromEntries(
                            info.retainedAttributes.map(a => [a, datum[a]])
                        ),
                        id: "" + datum.id,
                        relationships: <J["relationships"]>{
                            ...multiRelationships,
                            ...singleRelationships,
                        },
                        type: datum.type,
                    }
                    data.push(datumOut as J)
                } else {
                    const datumOut: JsonApiData<Schema> = {
                        attributes: <JsonApiData<Schema>["attributes"]>Object.fromEntries(
                            info.retainedAttributes.map(a => [a, datum[a]])
                        ),
                        id: "" + datum.id,
                        relationships: {
                            ...multiRelationships,
                            ...singleRelationships,
                        },
                        type: datum.type,
                    }
                    included.push(datumOut)
                }
            }
            if(firstRun) {
                firstRun = false
                dataToProcess.keepOnly(i => !seenByType.has(i.type, i.id))
                includeSeenByType = seenByType
            }
        }
        return {
            data,
            included,
        }
    }

    /**
     *
     * @param id
     * @param data
     * @throws FIXME if the user has no access
     */
    abstract update(id: I, data: Partial<EntityMatchingSchema<S>>): Promise<boolean>

    /**
     *
     * @param type
     * @param id
     * @returns
     */
    abstract userHasAccess(type: "read" | "write", id: I): Promise<boolean>
}