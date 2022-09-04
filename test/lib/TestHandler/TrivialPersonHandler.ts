import { TrivialFakeHandler } from "./TrivialFakeHandler"
import { Person, PersonAttributeKey, PersonSingleRelationKey } from "../TestEntity/Person"
import { PersonSchema } from "../TestSchema/PersonSchema"

/**
 *
 */
export class TrivialPersonHandler extends TrivialFakeHandler<string, Person, PersonAttributeKey, PersonSingleRelationKey, never> {
    protected schema = PersonSchema
}
