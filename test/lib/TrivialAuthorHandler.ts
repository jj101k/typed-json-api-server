import { AuthorSchema } from "./AuthorSchema"
import { Author } from "./Book"
import { TestSchemaFactory } from "./TestSchemaFactory"
import { TrivialFakeHandler } from "./TrivialFakeHandler"

export class TrivialAuthorHandler extends TrivialFakeHandler<string, Author> {
    protected schema = AuthorSchema
    protected schemaFactory = new TestSchemaFactory()
}
