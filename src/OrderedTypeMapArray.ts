import { OrderedMapArray } from "./OrderedMapArray"
import { Schema } from "./Schema"

/**
 *
 */
export class OrderedTypeMapArray<T extends {type: string}  = any & {type: string}> extends OrderedMapArray<T, Schema<any>> {
    protected getMapKey(key: Schema<any, string, string, string>): string {
        return key.type
    }

    /**
     * @param schemata
     * @param items
     */
    push(schemata: Array<Schema<any>>, ...items: Array<T>) {
        if (!items.length)
            return
        const itemsByType: Record<string, Array<T>> = {}
        for(const item of items) {
            const itemsGroup = itemsByType[item.type]
            if(itemsGroup) {
                itemsGroup.push(item)
            } else {
                itemsByType[item.type] = [item]
            }
        }
        for(const [type, itemsGroup] of Object.entries(itemsByType)) {
            const schema = schemata.find(s => s.type == type)
            if(!schema) {
                throw new Error(`No matching schema for type ${type}`)
            }
            this.pushInternal(schema, itemsGroup)
        }
    }
}
