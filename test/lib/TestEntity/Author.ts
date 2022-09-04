import { Book } from "./Book"

export type AuthorAttributeKey = "name"
export type AuthorMultiRelationKey = "books"

/**
 *
 */
export class Author {
    id: string
    name: string
    books: Book[]
}
