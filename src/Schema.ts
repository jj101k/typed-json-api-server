import { AttributeSchema } from "./AttributeSchema"

interface RelationshipSchema<S extends string, M extends string> {
    many?: Record<M, Array<Schema<any>>>
    single?: Partial<Record<S, Array<Schema<any>>>>
    singleRequired?: Partial<Record<S, Array<Schema<any>>>>
}

/**
 *
 */
export interface Schema<
    T extends {id: any} & Record<A, string | number | null> & Record<S, {id: any} | null> & Record<M, {id: any}[]>,
    A extends string | never = string,
    S extends string | never = string,
    M extends string | never = string,
> {
    /**
     *
     */
    attributeSchema: AttributeSchema<A>

    /**
     *
     */
    relationshipSchema: RelationshipSchema<S, M>

    /**
     *
     */
    readonly type: string
}
