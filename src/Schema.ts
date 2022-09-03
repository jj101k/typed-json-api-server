import { AttributeSchema } from "./AttributeSchema"

interface RelationshipSchema<S extends string, M extends string> {
    many?: Record<M, string[]>
    single?: Partial<Record<S, string[]>>
    singleRequired?: Partial<Record<S, string[]>>
}

/**
 *
 */
export abstract class Schema<
    T extends {id: any} & Record<A, string | number | null> & Record<S, {id: any} | null> & Record<M, {id: any}[]>,
    A extends string | never = string,
    S extends string | never = string,
    M extends string | never = string,
> {
    /**
     *
     */
    public abstract attributeSchema: AttributeSchema<A>

    /**
     *
     */
    public abstract relationshipSchema: RelationshipSchema<S, M>

    /**
     *
     */
    public abstract readonly type: string
}
