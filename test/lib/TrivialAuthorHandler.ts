import { Author, AuthorSchema } from "./Book"
import { TestSchemaFactory } from "./TestSchemaFactory"
import { TrivialFakeHandler } from "./TrivialFakeHandler"

export class TrivialAuthorHandler extends TrivialFakeHandler<string, Author> {
    protected schema = new AuthorSchema()
    protected schemaFactory = new TestSchemaFactory()
}
