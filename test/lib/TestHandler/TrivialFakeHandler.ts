import { EntityTypeHandler } from "../../../src/EntityTypeHandler"

/**
 *
 */
export abstract class TrivialFakeHandler<I extends string | number, T extends {id: any} & Record<A, string | number | null> & Record<S, {id: any} | null> & Record<M, {id: any}[]>,
A extends string | never = string,
S extends string | never = string,
M extends string | never = string> extends EntityTypeHandler<I, T, A, S, M> {
    create(id: I, data: Partial<T>): boolean {
        return false
    }
    delete(...ids: I[]) {
        return false
    }
    getMany(filter: any, objectsSeen: number, sort?: any, page?: any, include?: string[] | undefined): { data: Partial<T>[]; included?: any[] | undefined; nextPage?: any } {
        return {
            data: [],
        }
    }
    getOne(id: I, include?: string[] | undefined): { data: Partial<T>; included?: any[] | undefined } | null {
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