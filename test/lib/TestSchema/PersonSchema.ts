import { Schema } from "../../../src/Schema"
import { Person } from "../TestEntity/Person"

/**
 *
 */
export const PersonSchema: Schema<Person, "name", "bestFriend", never> = {
    attributeSchema: {notNullable: {name: "string"}, nullable: {}},
    get relationshipSchema() {
        return {single: {bestFriend: [PersonSchema]}}
    },
    type: "person"
}