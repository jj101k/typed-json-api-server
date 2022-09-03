import { AttributeSchema } from "../../src/AttributeSchema"
import { Schema } from "../../src/Schema"

export class Person {
    id: string
    name: string
    bestFriend: Person | null
}

export class PersonSchema extends Schema<Person, "name", "bestFriend", never> {
    public attributeSchema: AttributeSchema<"name"> = {notNullable: {name: "string"}, nullable: {}}
    public relationshipSchema = {single: {bestFriend: ["person"]}}
    public readonly type: string = "person"
}