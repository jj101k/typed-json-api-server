import { TrivialFakeHandler } from "./TrivialFakeHandler"
import { Person } from "../TestEntity/Person"
import { PersonSchema } from "../TestSchema/PersonSchema"

/**
 *
 */
export class TrivialPersonHandler extends TrivialFakeHandler<string, Person> {
    protected schema = PersonSchema
}
