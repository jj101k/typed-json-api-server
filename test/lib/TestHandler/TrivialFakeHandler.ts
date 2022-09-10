import { EntityTypeHandler } from "../../../src/EntityTypeHandler"
import { Schema } from "../../../src/Schema"
import { EntityMatchingSchema } from "../../../src/EntityMatchingSchema"
import { JsonApiData, JsonApiResponseMulti, JsonApiResponseSingle } from "../../../src/JsonApiResponse"

/**
 *
 */
export abstract class TrivialFakeHandler<I extends string | number, S extends Schema> extends EntityTypeHandler<I, S> {
    private store = new Map<I, EntityMatchingSchema<S>>()
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
    async getMany(filter: any, objectsSeen: number, sort?: any, page?: any, include?: string[] | undefined): Promise<JsonApiResponseMulti<JsonApiData<S>> & {nextPage?: any}> {
        return {
            data: [],
        }
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