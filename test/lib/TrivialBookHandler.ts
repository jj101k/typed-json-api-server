import { TrivialFakeHandler } from "./TrivialFakeHandler"
import { Book, BookSchema, BookSchemaFactory } from "./Book"

export class TrivialBookHandler extends TrivialFakeHandler<string, Book> {
    protected schema = new BookSchema();
    protected schemaFactory = new BookSchemaFactory();
}
