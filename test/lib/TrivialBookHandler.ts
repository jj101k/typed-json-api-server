import { TrivialFakeHandler } from "./TrivialFakeHandler"
import { Book, BookSchema } from "./Book"
import { TestSchemaFactory } from "./TestSchemaFactory"

export class TrivialBookHandler extends TrivialFakeHandler<string, Book> {
    protected schema = new BookSchema()
    protected schemaFactory = new TestSchemaFactory()
}
