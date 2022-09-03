import { Schema } from "../../src/Schema"

export class Person {
    id: string
    name: string
    bestFriend: Person | null
}

export const PersonSchema: Schema<Person, "name", "bestFriend", never> = {
    attributeSchema: {notNullable: {name: "string"}, nullable: {}},
    get relationshipSchema() {
        return {single: {bestFriend: [PersonSchema]}}
    },
    type: "person"
}