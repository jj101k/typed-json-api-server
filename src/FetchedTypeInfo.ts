import { FetchedRelationsInfo } from "./FetchedRelationsInfo"

/**
 * Information about a datum as fetched.
 */
export interface FetchedTypeInfo {
    /**
     * Which relations are included, how many, what format
     */
    relations: FetchedRelationsInfo
    /**
     * Which attributes are included
     */
    retainedAttributes: string[]
}
