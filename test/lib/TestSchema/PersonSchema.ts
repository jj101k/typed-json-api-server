import { Schema } from "../../../src/Schema"
import { PersonAttributeKey, PersonSingleRelationKey } from "../TestEntity/Person"

/**
 *
 */
export const PersonSchema: Schema<PersonAttributeKey, never, never, PersonSingleRelationKey> = {
    attributeSchema: {notNullable: {name: "string"}, nullable: {}},
    get relationshipSchema() {
        return {single: {bestFriend: [PersonSchema]}}
    },
    type: "person"
}