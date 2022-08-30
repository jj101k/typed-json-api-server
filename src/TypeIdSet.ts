/**
 * This works like a set, but takes a hierarchy of values. Basically like a
 * compound key.
 *
 * You can technically do the same fairly reliably by building a structured
 * string, and that's probably easier for more general usage.
 *
 * This doesn't feature deleting.
 */
export class TypeIdSet {
    /**
     *
     */
    private readonly byType = new Map<string, Set<string>>();

    /**
     *
     * @param type
     * @param id
     */
    add(type: string, id: string) {
        const ids = this.byType.get(type)
        if (ids) {
            ids.add(id)
        } else {
            this.byType.set(type, new Set([id]))
        }
    }
    /**
     *
     * @param type
     * @param id
     * @returns True if it added anything
     */
    addOnce(type: string, id: string) {
        if(this.has(type, id)) {
            return false
        } else {
            this.add(type, id)
            return true
        }
    }
    /**
     *
     * @param type
     * @param id
     */
    has(type: string, id: string) {
        return this.byType.get(type)?.has(id)
    }
}
