export type PersonAttributeKey = "name"
export type PersonSingleRelationKey = "bestFriend"

/**
 *
 */
export class Person {
    id: string
    name: string
    bestFriend: Person | null
}