import { Schema } from "../../../src/Schema"
import { AuthorSchema } from "./AuthorSchema"
import { Book, BookAttributeKey, BookSingleRelationKey, BookSingleRelationRequiredKey } from "../TestEntity/Book"

/**
 *
 */
export const BookSchema: Schema<Book, BookAttributeKey, BookSingleRelationRequiredKey | BookSingleRelationKey, never> = {
    attributeSchema: {notNullable: {name: "string"}, nullable: {}},
    get relationshipSchema() {
        return {singleRequired: {author: [AuthorSchema]}, single: {forewordAuthor: [AuthorSchema]}}
    },
    type: "book",
}