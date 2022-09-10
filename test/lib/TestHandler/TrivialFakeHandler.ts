import { EntityTypeHandler } from "../../../src/EntityTypeHandler"
import { Schema } from "../../../src/Schema"
import { EntityMatchingSchema } from "../../../src/EntityMatchingSchema"
import { JsonApiData } from "../../../src/JsonApiResponse"

/**
 *
 */
export abstract class TrivialFakeHandler<I extends string | number, S extends Schema> extends EntityTypeHandler<I, S> {
    private store = new Map<I, EntityMatchingSchema<S>>()
    create(id: I, data: Partial<EntityMatchingSchema<S>>): boolean {
        this.store.set(id, {id, ...data})
        return true
    }
    delete(...ids: I[]) {
        for(const id of ids) {
            this.store.delete(id)
        }
        return true
    }
    getMany(filter: any, objectsSeen: number, sort?: any, page?: any, include?: string[] | undefined): { data: Partial<EntityMatchingSchema<S>>[]; included?: any[] | undefined; nextPage?: any } {
        return {
            data: [],
        }
    }
    getOne(id: I, include?: string[] | undefined): { data: JsonApiData<S>, included?: any[] | undefined } | null {
        if(!this.store.has(id)) {
            throw new Error()
        }
        const result = this.postProcess([this.store.get(id)], 1)
        return {
            ...result,
            data: result.data[0] ?? null,
        }
    }
    update(id: I, data: Partial<EntityMatchingSchema<S>>): boolean {
        const existing = this.store.get(id)
        if(existing === undefined) return false
        this.store.set(id, {...existing, ...data, id})
        return true
    }
    userHasAccess(type: "read" | "write", id: I) {
        return true
    }
}