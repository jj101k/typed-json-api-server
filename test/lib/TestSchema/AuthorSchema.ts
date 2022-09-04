import { Schema } from "../../../src/Schema"
import { Author, AuthorAttributeKey, AuthorMultiRelationKey } from "../TestEntity/Author"
import { BookSchema } from "./BookSchema"

/**
 *
 */
export const AuthorSchema: Schema<Author, AuthorAttributeKey, never, AuthorMultiRelationKey> = {
    attributeSchema: {notNullable: {name: "string"}, nullable: {}},
    get relationshipSchema() {
        return {many: {books: [BookSchema]}}
    },
    type: "author"
}