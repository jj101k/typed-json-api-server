import { AuthorSchema } from "../TestSchema/AuthorSchema"
import { Author } from "../TestEntity/Author"
import { TrivialFakeHandler } from "./TrivialFakeHandler"

/**
 *
 */
export class TrivialAuthorHandler extends TrivialFakeHandler<string, Author> {
    protected schema = AuthorSchema
}
