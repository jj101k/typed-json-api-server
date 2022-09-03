import { AttributeSchema } from "../../src/AttributeSchema"
import { EntityTypeHandler } from "../../src/EntityTypeHandler"
import { Schema } from "../../src/Schema"
import { SchemaFactory } from "../../src/SchemaFactory"
import { TrivialFakeHandler } from "./TrivialFakeHandler"

class Person {
    id: string
    name: string
    bestFriend: Person | null
}

class PersonSchema extends Schema<Person, "name", "bestFriend", never> {
    public attributeSchema: AttributeSchema<"name"> = {notNullable: {name: "string"}, nullable: {}}
    public relationshipSchema = {single: {bestFriend: ["person"]}}
    public readonly type: string = "person"
}

class PersonSchemaFactory implements SchemaFactory {
    getSchema(type: string): Schema<any, any, any, any> {
        if(type == "person") {
            return new PersonSchema()
        } else {
            throw new Error(`Type ${type} not known`)
        }
    }
}

export class TrivialPersonHandler extends TrivialFakeHandler<string, Person> {
    protected schema = new PersonSchema()
    protected schemaFactory = new PersonSchemaFactory()
}