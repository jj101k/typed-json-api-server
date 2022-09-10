import { AttributeSchema } from "./AttributeSchema"

/**
 *
 */
interface RelationshipSchema<S extends string, M extends string, SR extends string> {
    many?: Record<M, Array<Schema>>
    single?: Partial<Record<S, Array<Schema>>>
    singleRequired?: Partial<Record<SR, Array<Schema>>>
}

/**
 *
 */
export interface Schema<
    A extends string | never = string,
    S extends string | never = string,
    M extends string | never = string,
    SR extends string | never = string,
> {
    /**
     *
     */
    attributeSchema: AttributeSchema<A>

    /**
     *
     */
    relationshipSchema: RelationshipSchema<S, M, SR>

    /**
     *
     */
    readonly type: string
}