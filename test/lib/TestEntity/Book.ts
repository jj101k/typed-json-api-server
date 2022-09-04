import { Author } from "./Author"

export type BookAttributeKey = "name"
export type BookSingleRelationRequiredKey = "author"
export type BookSingleRelationKey = "forewordAuthor"

/**
 *
 */
export class Book {
    id: string
    name: string
    author: Author
    forewordAuthor: Author | null
}