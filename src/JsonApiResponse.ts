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

export interface JsonApiData<T> {
    id: string,
    type: string,
    attributes: Partial<T> & Record<string, JsonApiAttributeValue>
    relationships: Partial<Record<keyof T, JsonApiSingleRelationship | JsonApiMultiRelationship>>
}
export interface JsonApiResponseMulti<T> {
    data: JsonApiData<T>[]
}
export interface JsonApiResponseSingle<T> {
    data: JsonApiData<T> | null
}

export type JsonApiResponse<T> = JsonApiResponseSingle<T> | JsonApiResponseMulti<T>