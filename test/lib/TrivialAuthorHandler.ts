import { Author, AuthorSchema, BookSchemaFactory } from "./Book"
import { TrivialFakeHandler } from "./TrivialFakeHandler"

export class TrivialAuthorHandler extends TrivialFakeHandler<string, Author> {
    protected schema = new AuthorSchema()
    protected schemaFactory = new BookSchemaFactory()
}
