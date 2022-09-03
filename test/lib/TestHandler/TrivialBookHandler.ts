import { TrivialFakeHandler } from "./TrivialFakeHandler"
import { Book } from "../TestEntity/Book"
import { BookSchema } from "../TestSchema/BookSchema"

/**
 *
 */
export class TrivialBookHandler extends TrivialFakeHandler<string, Book> {
    protected schema = BookSchema
}
