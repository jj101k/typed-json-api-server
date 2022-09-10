import { EntityTypeHandler } from "../../../src/EntityTypeHandler"
import { Schema } from "../../../src/Schema"
import { EntityMatchingSchema } from "../../../src/EntityMatchingSchema"

/**
 *
 */
export abstract class TrivialFakeHandler<I extends string | number, SC extends Schema> extends EntityTypeHandler<I, SC> {
    create(id: I, data: Partial<EntityMatchingSchema<SC>>): boolean {
        return false
    }
    delete(...ids: I[]) {
        return false
    }
    getMany(filter: any, objectsSeen: number, sort?: any, page?: any, include?: string[] | undefined): { data: Partial<EntityMatchingSchema<SC>>[]; included?: any[] | undefined; nextPage?: any } {
        return {
            data: [],
        }
    }
    getOne(id: I, include?: string[] | undefined): { data: Partial<EntityMatchingSchema<SC>>; included?: any[] | undefined } | null {
        return null
    }
    localRelations = {}
    update(id: I, data: Partial<EntityMatchingSchema<SC>>): boolean {
        return false
    }
    userHasAccess(type: "read" | "write", id: I) {
        return true
    }
}