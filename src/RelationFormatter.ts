/**
 *
 */
export abstract class RelationFormatter<T> {
    /**
     *
     */
    abstract readonly hasData: boolean

    /**
     *
     * @param types
     */
    constructor(public types: string[]) {

    }

    /**
     *
     * @param relation
     */
    abstract format(relation: T): {id: string, type: string}
}

/**
 *
 */
export abstract class RelationFormatterNoType<T> extends RelationFormatter<T> {
    /**
     *
     */
    protected readonly type: string

    /**
     *
     * @param types
     */
    constructor(types: string[]) {
        super(types)
        if(types.length != 1) {
            throw new Error(`Cannot use typeless formatter with types.size!=1: ${types}`)
        }
        this.type = types[0]
    }
}

/**
 *
 */
abstract class RelationFormatterAnyNoType<T extends {id: string}> extends RelationFormatterNoType<T> {
    format(relation: T): { id: string; type: string } {
        return {...relation, type: this.type}
    }
}

/**
 *
 */
export class RelationFormatterIdOnly extends RelationFormatterAnyNoType<{id: string}> {
    readonly hasData = false
}

/**
 *
 */
export class RelationFormatterFullNoType<T extends {id: string} = {id: string}> extends RelationFormatterAnyNoType<T> {
    readonly hasData = true
}

/**
 *
 */
abstract class RelationFormatterAnyWithType<T extends {id: string, type: string}> extends RelationFormatter<T> {
    format(relation: T): { id: string; type: string } {
        return relation
    }
}

/**
 *
 */
export class RelationFormatterIdType extends RelationFormatterAnyWithType<{id: string, type: string}> {
    readonly hasData = false
}

/**
 *
 */
export class RelationFormatterFullWithType<T extends {id: string, type: string} = {id: string, type: string}> extends RelationFormatterAnyWithType<T> {
    readonly hasData = true
}

/**
 *
 */
export class RelationFormatterRawId extends RelationFormatterNoType<string | number> {
    readonly hasData = false

    format(relation: string | number): { id: string; type: string } {
        return {id: "" + relation, type: this.type}
    }
}