import { CacheableTypeInfo } from "./CacheableTypeInfo"
import { JsonApiData } from "./JsonApiResponse"
import { OrderedTypeMapArray } from "./OrderedTypeMapArray"
import { RelationIdType, Relation, RelationIdOnly } from "./Relation"
import { RelationFormatter } from "./RelationFormatter"
import { Schema } from "./Schema"
import { ShadowTypeIdSet, TypeIdSet } from "./TypeIdSet"

/**
 * This is the main class for handling entities. This doesn't handle
 * requests/responses, but does include some of the conversion between formats.
 *
 * You _might_ want to do this without an ORM system. That's because really this
 * doesn't want fully formed objects, and just the ID is fine for most cases.
 */
export abstract class EntityTypeHandler<I extends string | number,
E_NOMINAL extends {id: I} & Record<A, string | number | null> & Record<S, RelationIdOnly | null> & Record<SR, RelationIdOnly> & Record<M, RelationIdOnly[]>,
A extends string | never,
S extends string | never,
M extends string | never,
SR extends string | never,
E_LOW_LEVEL extends {id: I} & Record<A, string | number | null> & Partial<Record<S, Relation | null>> & Partial<Record<SR, Relation>> & Partial<Record<M, Relation[]>> = {id: any} & Record<A, string | number | null> & Partial<Record<S, Relation | null>> & Partial<Record<SR, Relation>> & Partial<Record<M, Relation[]>>,
> {
    /**
     *
     * @param typeless
     */
    private *addType(typeless: Iterable<E_LOW_LEVEL>) {
        for(const v of typeless) {
            yield {...v, id: v.id, type: this.schema.type}
        }
    }

    /**
     *
     */
    protected abstract schema: Schema<E_NOMINAL, A, S, M, SR>

    /**
     *
     * @param id
     * @param data
     * @throws FIXME if the user has no access
     */
    abstract create(id: I, data: Partial<E_NOMINAL>): boolean
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
        data: Partial<E_NOMINAL>[],
        included?: any[],
        nextPage?: any,
    }

    /**
     * This defines how relations look locally (ie, an ID in the entity
     * itself, typically defining a single parent relationship). If you provide
     * this and the relation is _not_ already in the response, it'll be
     * injected. If it is already in the response, the type will be set.
     */
    abstract readonly localRelations: Partial<Record<string & S | M, {field: string, type: string}[]>>

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
    abstract getOne(id: I, include?: string[]): {data: Partial<E_NOMINAL>, included?: any[]} | null

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
    postProcess(dataInitial: Iterable<E_LOW_LEVEL>, length: number) {
        if(!length) {
            return {
                data: [] as JsonApiData<E_NOMINAL, A, S | M>[],
            }
        }

        const data: JsonApiData<E_NOMINAL, A, S | M>[] = []
        let included: JsonApiData<any>[] = []
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

                const singleRelationships: Partial<Record<S, {data: RelationIdType | null}>> = {}
                const multiRelationships: Partial<Record<M, {data: RelationIdType[]}>> = {}
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
                const datumOut: JsonApiData<E_NOMINAL, A, S | M> = {
                    attributes: <JsonApiData<E_NOMINAL, A>["attributes"]>Object.fromEntries(
                        info.retainedAttributes.map(a => [a, datum[a]])
                    ),
                    id: "" + datum.id,
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
                dataToProcess.keepOnly(i => !seenByType.has(i.type, i.id))
                includeSeenByType = seenByType
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
    abstract update(id: I, data: Partial<E_NOMINAL>): boolean

    /**
     *
     * @param type
     * @param id
     * @returns
     */
    abstract userHasAccess(type: "read" | "write", id: I)
}