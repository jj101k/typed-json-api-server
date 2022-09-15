import { Schema } from "./Schema"
import { EntityMatchingSchema } from "./EntityMatchingSchema"

/**
 *
 */
interface FilterTree {
    [key: string]: string | number | null | FilterTree
}
/**
 *
 */

export type JsonApiFilter<S extends Schema> = Partial<EntityMatchingSchema<S, FilterTree>>
