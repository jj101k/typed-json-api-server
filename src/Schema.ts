import { AttributeSchema } from "./AttributeSchema"
import { Relation, RelationIdOnly } from "./Relation"

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

type RecordKey<T> = keyof T & (string | never)

/**
 *
 */
export type SchemaNullableAttributeKey<S extends Schema> = RecordKey<S["attributeSchema"]["nullable"]>

/**
 *
 */
export type SchemaRequiredAttributeKey<S extends Schema> = RecordKey<S["attributeSchema"]["notNullable"]>

/**
 *
 */
export type SchemaRelationSingleOptionalKey<S extends Schema> = RecordKey<S["relationshipSchema"]["single"]>

/**
 *
 */
export type SchemaRelationSingleRequiredKey<S extends Schema> = RecordKey<S["relationshipSchema"]["singleRequired"]>

/**
 *
 */
export type SchemaRelationMultiKey<S extends Schema> = RecordKey<S["relationshipSchema"]["many"]>

/**
 *
 */
export type EntityMatchingSchema<S extends Schema, R = RelationIdOnly> = {id: string | number} & Partial<
    Record<SchemaRequiredAttributeKey<S>, string | number> &
    Record<SchemaNullableAttributeKey<S>, string | number | null> &
    Record<SchemaRelationSingleOptionalKey<S>, R | null> &
    Record<SchemaRelationSingleRequiredKey<S>, R> &
    Record<SchemaRelationMultiKey<S>, R[]>
>