import { EntityTypeHandler } from "../../../src/EntityTypeHandler"
import { Schema } from "../../../src/Schema"
import { EntityMatchingSchema } from "../../../src/EntityMatchingSchema"
import { JsonApiData, JsonApiResponseMulti, JsonApiResponseSingle } from "../../../src/JsonApiResponse"
import { JsonApiFilter } from "../../../src/JsonApiFilter"

interface RecordLike {
    [key: string]: RecordLike | RecordLike[] | string | number | null
}

/**
 *
 */
export abstract class TrivialFakeHandler<I extends string | number, S extends Schema> extends EntityTypeHandler<I, S> {
    private store = new Map<I, EntityMatchingSchema<S>>()

    /**
     * Performs a trivial filter. This is the traditional SQL-style approach,
     * where all conditions are simply ANDed together, and multi-relationships
     * are treated as if single.
     *
     * The implementation here has an aspect of traditional nosql-style approaches,
     * where you get the whole object if it matches.
     *
     * @param filter
     * @param entity
     * @returns
     */
    private filterEntity<T extends RecordLike>(
        filter: JsonApiFilter<S>,
        entity: T
    ): boolean {
        for(const [k, v] of Object.entries(filter)) {
            const ev = entity[k]
            if(typeof ev == "string" || typeof ev == "number") {
                if(v !== ev) {
                    return false
                }
            } else {
                if(typeof v != "object") {
                    return false
                }
                if(Array.isArray(ev)) {
                    if(ev.every(evi => !this.filterEntity(v, evi))) {
                        return false
                    }
                } else {
                    if(!this.filterEntity(v, ev)) {
                        return false
                    }
                }
            }
        }
        return true
    }

    async create(id: I, data: Partial<EntityMatchingSchema<S>>): Promise<boolean> {
        this.store.set(id, {id, ...data})
        return true
    }
    async delete(...ids: I[]) {
        for(const id of ids) {
            this.store.delete(id)
        }
        return true
    }
    async getMany(filter: JsonApiFilter<S>, objectsSeen: number, sort?: any, page?: any, include?: string[] | undefined): Promise<JsonApiResponseMulti<JsonApiData<S>> & {nextPage?: any}> {
        const entities = [...this.store.values()].filter(f => this.filterEntity(filter, f))
        return this.postProcess(entities, entities.length)
    }
    async getOne(id: I, include?: string[] | undefined): Promise<JsonApiResponseSingle<JsonApiData<S>> | null> {
        if(!this.store.has(id)) {
            throw new Error()
        }
        const result = this.postProcess([this.store.get(id)], 1)
        return {
            ...result,
            data: result.data[0] ?? null,
        }
    }
    async update(id: I, data: Partial<EntityMatchingSchema<S>>): Promise<boolean> {
        const existing = this.store.get(id)
        if(existing === undefined) return false
        this.store.set(id, {...existing, ...data, id})
        return true
    }
    async userHasAccess(type: "read" | "write", id: I) {
        return true
    }
}