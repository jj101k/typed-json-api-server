import { Schema } from "../../src/Schema"
import { SchemaFactory } from "../../src/SchemaFactory"
import { AuthorSchema } from "./AuthorSchema"
import { BookSchema } from "./BookSchema"
import { PersonSchema } from "./Person"


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
