import { TrivialFakeHandler } from "./TrivialFakeHandler"
import { PersonSchema } from "../TestSchema/PersonSchema"

/**
 *
 */
export class TrivialPersonHandler extends TrivialFakeHandler<string, typeof PersonSchema> {
    protected schema = PersonSchema
}
