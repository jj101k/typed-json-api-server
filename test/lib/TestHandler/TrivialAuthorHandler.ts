import { AuthorSchema } from "../TestSchema/AuthorSchema"
import { TrivialFakeHandler } from "./TrivialFakeHandler"



/**
 *
 */
export class TrivialAuthorHandler extends TrivialFakeHandler<string, typeof AuthorSchema> {
    protected schema = AuthorSchema
}
