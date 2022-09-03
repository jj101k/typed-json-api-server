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

export class BookSchema extends Schema<Book, "name", "author" | "forewordAuthor", never> {
    public attributeSchema: AttributeSchema<"name"> = {notNullable: {name: "string"}, nullable: {}}
    public relationshipSchema = {singleRequired: {author: ["author"]}, single: {forewordAuthor: ["author"]}}
    public readonly type: string = "book"
}

export class AuthorSchema extends Schema<Author, "name", never, never> {
    public attributeSchema: AttributeSchema<"name"> = {notNullable: {name: "string"}, nullable: {}}
    public relationshipSchema = {many: {books: ["book"]}}
    public readonly type: string = "author"
}