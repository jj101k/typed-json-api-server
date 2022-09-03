import { Author } from "./Author"

/**
 *
 */
export class Book {
    id: string
    name: string
    author: Author
    forewordAuthor: Author | null
}