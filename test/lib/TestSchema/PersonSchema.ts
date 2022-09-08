import { Schema } from "../../../src/Schema"
import { Person, PersonAttributeKey, PersonSingleRelationKey } from "../TestEntity/Person"

/**
 *
 */
export const PersonSchema: Schema<Person, PersonAttributeKey, never, never, PersonSingleRelationKey> = {
    attributeSchema: {notNullable: {name: "string"}, nullable: {}},
    get relationshipSchema() {
        return {single: {bestFriend: [PersonSchema]}}
    },
    type: "person"
}