/**
 * So complicated. This is here so that we can have a map of arrays that can
 * be shifted. This allows us to fill the buckets inside the loop, then take
 * the next bucket afterwards. It doesn't matter too much that it retains
 * order, except that it's wise to stay as far as possible from
 * self-referential loops.
 */
export abstract class OrderedMapArray<T> {
    /**
     *
     */
    private keyItems = new Map<string, T[]>()

    /**
     *
     */
    private keys: string[] = []

    /**
     *
     * @param item
     */
    protected abstract getKey(item: T): string

    /**
     * This throws out all items which don't match the predicate
     *
     * @param predicate
     */
    keepOnly(predicate: (t: T) => boolean): void {
        for(const key of this.keys) {
            this.keyItems.set(key, this.keyItems.get(key)!.filter(predicate))
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
        const items = this.keyItems.get(key)!
        this.keyItems.delete(key)
        return items
    }
    /**
     * @param items
     */
    push(...items: Array<T>) {
        if (!items.length)
            return
        const item0 = items[0]
        const key = this.getKey(item0)
        const storeItems = this.keyItems.get(key)
        if (storeItems) {
            storeItems.push(...items)
        } else {
            this.keys.push(key)
            this.keyItems.set(key, items)
        }
    }
}