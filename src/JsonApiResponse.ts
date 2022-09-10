import { Schema } from "./Schema"
import { SchemaNullableAttributeKey, SchemaRelationMultiKey, SchemaRelationSingleOptionalKey, SchemaRelationSingleRequiredKey, SchemaRequiredAttributeKey } from "./EntityMatchingSchema"

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
    attributes: Partial<Record<A, JsonApiAttributeValue>>
    relationships: Partial<Record<R, JsonApiSingleRelationship | JsonApiMultiRelationship>>
}

/**
 *
 */
export type JsonApiData<S extends Schema> = JsonApiDataComposed<
    SchemaNullableAttributeKey<S> | SchemaRequiredAttributeKey<S>,
    SchemaRelationMultiKey<S> | SchemaRelationSingleOptionalKey<S> | SchemaRelationSingleRequiredKey<S>
>

type JsonApiPossibleArray<J extends JsonApiDataComposed<any, any>> = J[] | J | null

interface JsonApiResponseAny<D extends JsonApiPossibleArray<JsonApiDataComposed<any, any>>> {
    data: D
    included?: Array<JsonApiDataComposed<any, any>>
}

export type JsonApiResponseMulti<J extends JsonApiDataComposed<any, any>> = JsonApiResponseAny<J[]>

export type JsonApiResponseSingle<J extends JsonApiDataComposed<any, any>> = JsonApiResponseAny<J | null>