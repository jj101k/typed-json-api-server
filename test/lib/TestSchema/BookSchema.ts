import { Schema } from "../../../src/Schema"
import { AuthorSchema } from "./AuthorSchema"
import { Book } from "../TestEntity/Book"

/**
 *
 */
export const BookSchema: Schema<Book, "name", "author" | "forewordAuthor", never> = {
    attributeSchema: {notNullable: {name: "string"}, nullable: {}},
    get relationshipSchema() {
        return {singleRequired: {author: [AuthorSchema]}, single: {forewordAuthor: [AuthorSchema]}}
    },
    type: "book",
}