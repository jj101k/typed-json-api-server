import { TestSchemaFactory } from "./TestSchemaFactory"
import { TrivialFakeHandler } from "./TrivialFakeHandler"
import { Person, PersonSchema } from "./TrivialPersonHandler"

export class TrivialPersonHandler extends TrivialFakeHandler<string, Person> {
    protected schema = new PersonSchema()
    protected schemaFactory = new TestSchemaFactory()
}
