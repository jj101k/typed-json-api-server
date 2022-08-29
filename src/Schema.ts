import { AttributeSchema } from "./AttributeSchema"
import { JsonApiData } from "./JsonApiResponse"

interface RelationshipSchema<S extends string, M extends string> {
    many?: Record<M, string[]>
    single?: Record<S, string[]>
    singleRequired?: Record<S, string[]>
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
    private attributeNames: Array<A>
    /**
     *
     */
    private multiRelationshipNames: Array<M>
    /**
     *
     */
    private singleRelationshipNames: Array<S>
    /**
     *
     * @param attributeSchema
     * @param relationshipSchema
     */
    constructor(public attributeSchema: AttributeSchema<A>, public relationshipSchema: RelationshipSchema<S, M>) {
        this.attributeNames = [
            ...Object.keys(this.attributeSchema.notNullable ?? {}),
            ...Object.keys(this.attributeSchema.nullable ?? {}),
        ] as Array<A>
        this.singleRelationshipNames = [
            ...Object.keys(this.relationshipSchema.single ?? {}),
            ...Object.keys(this.relationshipSchema.singleRequired ?? {}),
        ] as Array<S>
        this.multiRelationshipNames = Object.keys(this.relationshipSchema.many ?? {}) as Array<M>
    }

    /**
     *
     * @param relationship
     */
    abstract objectType(relationship: any): string

    /**
     *
     * @param e
     * @returns
     */
    convert(e: Partial<T>) {
        return {
            id: "" + e.id,
            attributes: Object.fromEntries(this.attributeNames.map(
                a => [a, e[a]]
            )) as unknown as JsonApiData<T>["attributes"],
            relationships: Object.fromEntries([
                ...this.singleRelationshipNames.filter(r => e[r] !== undefined).map(r => [r, {data: {
                    type: this.objectType(e[r]),
                    id: "" + e[r]!.id,
                }}]),
                // There's a question about how exactly relationships are
                // returned at a lower level and whether multi-relationships
                // will/should be returned here outside of single and/or
                // explicit contexts.
                //
                // Also, comprehension of includes for this case are meaningful,
                // as the handler may optimise into a single JOIN.
                ...this.multiRelationshipNames.filter(r => e[r]).map(r => [r, {data: e[r]!.map(
                    ri => ({
                        type: this.objectType(ri),
                        id: "" + ri.id,
                    })
                )}])
            ]),
        } as JsonApiData<T>
    }
}
