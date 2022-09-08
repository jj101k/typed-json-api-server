import { TrivialFakeHandler } from "./TrivialFakeHandler"
import { Book, BookAttributeKey, BookSingleRelationKey, BookSingleRelationRequiredKey } from "../TestEntity/Book"
import { BookSchema } from "../TestSchema/BookSchema"

/**
 *
 */
export class TrivialBookHandler extends TrivialFakeHandler<string, Book, BookAttributeKey, BookSingleRelationKey, never, BookSingleRelationRequiredKey> {
    protected schema = BookSchema
}
