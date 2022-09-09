import { Schema, SchemaNullableAttributeKey, SchemaRelationMultiKey, SchemaRelationSingleOptionalKey, SchemaRelationSingleRequiredKey, SchemaRequiredAttributeKey } from "./Schema"

export interface JsonApiIdentity {
    type: string
    id: string
}

export interface JsonApiSingleRelationship {
    data: JsonApiIdentity | null
}

export interface JsonApiMultiRelationship {
    data: JsonApiIdentity[]
}

export type JsonApiAttributeValue = string | number | object | null

/**
 *
 */
export interface JsonApiDataComposed<
    A extends string | never,
    R extends string | never
> {
    id: string,
    type: string,
    attributes: Record<A, JsonApiAttributeValue>
    relationships: Partial<Record<R, JsonApiSingleRelationship | JsonApiMultiRelationship>>
}

/**
 *
 */
export type JsonApiData<S extends Schema> = JsonApiDataComposed<
    SchemaNullableAttributeKey<S> | SchemaRequiredAttributeKey<S>,
    SchemaRelationMultiKey<S> | SchemaRelationSingleOptionalKey<S> | SchemaRelationSingleRequiredKey<S>
>

export interface JsonApiResponseMulti<J extends JsonApiDataComposed<any, any>> {
    data: J[]
}
export interface JsonApiResponseSingle<J extends JsonApiDataComposed<any, any>> {
    data: J | null
}

export type JsonApiResponse<J extends JsonApiDataComposed<any, any>> = JsonApiResponseSingle<J> | JsonApiResponseMulti<J>