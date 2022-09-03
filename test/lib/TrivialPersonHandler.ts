import { TrivialFakeHandler } from "./TrivialFakeHandler"
import { Person, PersonSchema } from "./Person"

export class TrivialPersonHandler extends TrivialFakeHandler<string, Person> {
    protected schema = PersonSchema
}
