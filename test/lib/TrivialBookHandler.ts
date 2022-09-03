import { TrivialFakeHandler } from "./TrivialFakeHandler"
import { Book } from "./Book"
import { BookSchema } from "./BookSchema"

export class TrivialBookHandler extends TrivialFakeHandler<string, Book> {
    protected schema = BookSchema
}
