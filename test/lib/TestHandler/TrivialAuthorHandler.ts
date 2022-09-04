import { AuthorSchema } from "../TestSchema/AuthorSchema"
import { Author, AuthorAttributeKey, AuthorMultiRelationKey } from "../TestEntity/Author"
import { TrivialFakeHandler } from "./TrivialFakeHandler"



/**
 *
 */
export class TrivialAuthorHandler extends TrivialFakeHandler<string, Author, AuthorAttributeKey, never, AuthorMultiRelationKey> {
    protected schema = AuthorSchema
}
