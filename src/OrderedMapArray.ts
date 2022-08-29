/**
 * So complicated. This is here so that we can have a map of arrays that can
 * be shifted. This allows us to fill the buckets inside the loop, then take
 * the next bucket afterwards. It doesn't matter too much that it retains
 * order, except that it's wise to stay as far as possible from
 * self-referential loops.
 */
export class OrderedMapArray<T extends { type: string}  = any & { type: string} > {
    /**
     *
     */
    private typeItems = new Map<string, T[]>();
    /**
     *
     */
    private types: string[] = [];
    /**
     *
     * @returns
     */
    shift() {
        const type = this.types.shift()
        if (type === undefined)
            return undefined
        const items = this.typeItems.get(type)!
        this.typeItems.delete(type)
        return items
    }
    /**
     * @param items
     */
    push(...items: Array<T>) {
        if (!items.length)
            return
        const item0 = items[0]
        const storeItems = this.typeItems.get(item0.type)
        if (storeItems) {
            storeItems.push(...items)
        } else {
            this.types.push(item0.type)
            this.typeItems.set(item0.type, items)
        }
    }
}
