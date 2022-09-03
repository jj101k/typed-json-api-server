/**
 * So complicated. This is here so that we can have a map of arrays that can
 * be shifted. This allows us to fill the buckets inside the loop, then take
 * the next bucket afterwards. It doesn't matter too much that it retains
 * order, except that it's wise to stay as far as possible from
 * self-referential loops.
 */
export abstract class OrderedMapArray<T, K> {
    /**
     *
     */
    private keyItems = new Map<string, T[]>()

    /**
     *
     */
    private keys: K[] = []

    /**
     *
     * @param key
     */
    protected abstract getMapKey(key: K): string

    /**
     * This throws out all items which don't match the predicate
     *
     * @param predicate
     */
    keepOnly(predicate: (t: T) => boolean): void {
        for(const key of this.keys) {
            const mapKey = this.getMapKey(key)
            this.keyItems.set(mapKey, this.keyItems.get(mapKey)!.filter(predicate))
        }
    }

    /**
     *
     * @returns
     */
    shift() {
        const key = this.keys.shift()
        if (key === undefined)
            return undefined
        const mapKey = this.getMapKey(key)
        const items = this.keyItems.get(mapKey)!
        this.keyItems.delete(mapKey)
        return items
    }

    /**
     * @param key
     * @param items
     */
    protected pushInternal(key: K, items: Array<T>) {
        if (!items.length)
            return
        const mapKey = this.getMapKey(key)
        const storeItems = this.keyItems.get(mapKey)
        if (storeItems) {
            storeItems.push(...items)
        } else {
            this.keys.push(key)
            this.keyItems.set(mapKey, items)
        }
    }
}