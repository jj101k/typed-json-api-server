import { Schema } from "../../../src/Schema"
import { AuthorSchema } from "./AuthorSchema"
import { BookAttributeKey, BookSingleRelationKey, BookSingleRelationRequiredKey } from "../TestEntity/Book"

/**
 *
 */
export const BookSchema: Schema<BookAttributeKey, BookSingleRelationKey, never, BookSingleRelationRequiredKey> = {
    attributeSchema: {notNullable: {name: "string"}, nullable: {}},
    get relationshipSchema() {
        return {singleRequired: {author: [AuthorSchema]}, single: {forewordAuthor: [AuthorSchema]}}
    },
    type: "book",
}