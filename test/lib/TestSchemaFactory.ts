import { Schema } from "../../src/Schema"
import { SchemaFactory } from "../../src/SchemaFactory"
import { AuthorSchema } from "./TestSchema/AuthorSchema"
import { BookSchema } from "./TestSchema/BookSchema"
import { PersonSchema } from "./TestSchema/PersonSchema"

/**
 *
 */
export class TestSchemaFactory implements SchemaFactory {
    getSchema(type: string): Schema<any, any, any, any> {
        if (type == "book") {
            return BookSchema
        } else if (type == "author") {
            return AuthorSchema
        } else if(type == "person") {
            return PersonSchema
         } else {
            throw new Error(`Type ${type} not known`)
        }
    }
}
