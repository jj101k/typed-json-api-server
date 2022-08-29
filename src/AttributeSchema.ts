type SchemaType = "string" | "number" | "object" | "boolean"

export interface AttributeSchema<A extends string> {
    nullable?: Partial<Record<A, SchemaType>>
    notNullable?: Partial<Record<A, SchemaType>>
}
