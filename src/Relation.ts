/**
 *
 */
export type RelationIdOnly = { id: string}
/**
 *
 */
export type RelationIdType = { id: string; type: string}
/**
 *
 */
export type RelationFullNoType = Record<string, any> & { id: string}
/**
 *
 */
export type RelationFull = RelationFullNoType & { type: string}
/**
 *
 */

export type Relation = number | RelationIdOnly | RelationIdType | RelationFullNoType | RelationFull
