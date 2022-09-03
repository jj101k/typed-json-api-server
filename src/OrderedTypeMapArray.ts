import { OrderedMapArray } from "./OrderedMapArray"

/**
 *
 */
export class OrderedTypeMapArray<T extends { type: string}  = any & { type: string} > extends OrderedMapArray<T> {
    protected getKey(item: T): string {
        return item.type
    }
}
