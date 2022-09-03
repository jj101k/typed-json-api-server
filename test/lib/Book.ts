import { AttributeSchema } from "../../src/AttributeSchema"
import { Schema } from "../../src/Schema"

export class Author {
    id: string
    name: string
}

export class Book {
    id: string
    name: string
    author: Author
    forewordAuthor: Author | null
}