import { AttributeSchema } from "./AttributeSchema"
import { JsonApiData } from "./JsonApiResponse"

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
    private readonly cache: {
        attributeNames?: Array<A>
        multiRelationshipNames?: Array<M>
        singleRelationshipNames?: Array<S>
    } = { }

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
    private get attributeNames() {
        if(!this.cache.attributeNames) {
            this.cache.attributeNames = [
                ...Object.keys(this.attributeSchema.notNullable ?? {}),
                ...Object.keys(this.attributeSchema.nullable ?? {}),
            ] as Array<A>
        }
        return this.cache.attributeNames
    }

    /**
     *
     */
    private get multiRelationshipNames() {
        if(!this.cache.multiRelationshipNames) {
            this.cache.multiRelationshipNames = Object.keys(this.relationshipSchema.many ?? {}) as Array<M>
        }
        return this.cache.multiRelationshipNames
    }

    /**
     *
     */
    private get singleRelationshipNames() {
        if(!this.cache.singleRelationshipNames) {
            this.cache.singleRelationshipNames = [
                ...Object.keys(this.relationshipSchema.single ?? {}),
                ...Object.keys(this.relationshipSchema.singleRequired ?? {}),
            ] as Array<S>
        }
        return this.cache.singleRelationshipNames
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
