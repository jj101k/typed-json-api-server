import { EntityTypeHandler } from "../../../src/EntityTypeHandler"

/**
 *
 */
export abstract class TrivialFakeHandler<I, E extends {id: I}> extends EntityTypeHandler<I, E> {
    create(id: I, data: Partial<E>): boolean {
        return false
    }
    delete(...ids: I[]) {
        return false
    }
    getMany(filter: any, objectsSeen: number, sort?: any, page?: any, include?: string[] | undefined): { data: Partial<E>[]; included?: any[] | undefined; nextPage?: any } {
        return {
            data: [],
        }
    }
    getOne(id: I, include?: string[] | undefined): { data: Partial<E>; included?: any[] | undefined } | null {
        return null
    }
    localRelations = {}
    update(id: I, data: Partial<{ id: I }>): boolean {
        return false
    }
    userHasAccess(type: "read" | "write", id: I) {
        return true
    }
}