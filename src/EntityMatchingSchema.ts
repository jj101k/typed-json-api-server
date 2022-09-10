import { RelationIdOnly } from "./Relation"
import { Schema } from "./Schema"

/**
 *
 */
export type RecordKey<T> = keyof T & (string | never)

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
export type EntityMatchingSchema<S extends Schema, R = RelationIdOnly> = { id: string | number}  & Partial<
    Record<SchemaRequiredAttributeKey<S>, string | number> &
    Record<SchemaNullableAttributeKey<S>, string | number | null> &
    Record<SchemaRelationSingleOptionalKey<S>, R | null> &
    Record<SchemaRelationSingleRequiredKey<S>, R> &
    Record<SchemaRelationMultiKey<S>, R[]>
>
