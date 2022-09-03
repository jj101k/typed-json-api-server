import { Schema } from "../../../src/Schema"
import { Author } from "../TestEntity/Author"
import { BookSchema } from "./BookSchema"

/**
 *
 */
export const AuthorSchema: Schema<Author, "name", never, never> = {
    attributeSchema: {notNullable: {name: "string"}, nullable: {}},
    get relationshipSchema() {
        return {many: {books: [BookSchema]}}
    },
    type: "author"
}